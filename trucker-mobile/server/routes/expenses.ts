import { Router, Response } from 'express';
import { db, expenses, jobs, jobStops } from '../db';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const expenseSchema = z.object({
  jobId: z.string().uuid().optional(),
  stopId: z.string().uuid().optional(),
  title: z.string().min(1),
  category: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().optional(),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
  date: z.string().optional(),
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { jobId, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    let conditions = [];
    
    if (jobId) {
      conditions.push(eq(expenses.jobId, jobId as string));
    }
    
    if (startDate) {
      conditions.push(gte(expenses.date, new Date(startDate as string)));
    }
    
    if (endDate) {
      conditions.push(lte(expenses.date, new Date(endDate as string)));
    }

    let query = db.select().from(expenses).orderBy(desc(expenses.date));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const allExpenses = await query.limit(Number(limit)).offset(Number(offset));
    
    const [{ total }] = await db
      .select({ total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
      .from(expenses)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json({ data: allExpenses, total: Number(total) });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/summary', async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let conditions = [];
    
    if (startDate) {
      conditions.push(gte(expenses.date, new Date(startDate as string)));
    }
    
    if (endDate) {
      conditions.push(lte(expenses.date, new Date(endDate as string)));
    }

    const summary = await db
      .select({
        category: expenses.category,
        total: sql<number>`SUM(${expenses.amount})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(expenses)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(expenses.category);

    res.json(summary);
  } catch (error) {
    console.error('Get expense summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id)).limit(1);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = expenseSchema.parse(req.body);

    const [newExpense] = await db
      .insert(expenses)
      .values({
        ...data,
        userId: req.user!.id,
        amount: data.amount.toString(),
        date: data.date ? new Date(data.date) : new Date(),
      })
      .returning();

    res.status(201).json(newExpense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.amount) {
      updates.amount = updates.amount.toString();
    }

    const [updated] = await db
      .update(expenses)
      .set(updates)
      .where(eq(expenses.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [deleted] = await db.delete(expenses).where(eq(expenses.id, id)).returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
