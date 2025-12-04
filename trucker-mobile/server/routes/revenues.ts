import { Router, Response } from 'express';
import { db, revenues, jobs, customers } from '../db';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const revenueSchema = z.object({
  jobId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  invoiceNumber: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']).optional(),
  dueDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status, customerId, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    let conditions = [];
    
    if (status) {
      conditions.push(eq(revenues.status, status as string));
    }
    
    if (customerId) {
      conditions.push(eq(revenues.customerId, customerId as string));
    }
    
    if (startDate) {
      conditions.push(gte(revenues.createdAt, new Date(startDate as string)));
    }
    
    if (endDate) {
      conditions.push(lte(revenues.createdAt, new Date(endDate as string)));
    }

    let query = db.select().from(revenues).orderBy(desc(revenues.createdAt));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const allRevenues = await query.limit(Number(limit)).offset(Number(offset));
    
    const revenuesWithRelations = await Promise.all(
      allRevenues.map(async (revenue) => {
        const [customer] = revenue.customerId
          ? await db.select().from(customers).where(eq(customers.id, revenue.customerId)).limit(1)
          : [null];
        const [job] = revenue.jobId
          ? await db.select().from(jobs).where(eq(jobs.id, revenue.jobId)).limit(1)
          : [null];
        return {
          ...revenue,
          customer: customer ? { id: customer.id, name: customer.name } : null,
          job: job ? { id: job.id, jobNumber: job.jobNumber } : null,
        };
      })
    );

    const [{ total }] = await db
      .select({ total: sql<number>`COALESCE(SUM(${revenues.amount}), 0)` })
      .from(revenues)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json({ data: revenuesWithRelations, total: Number(total) });
  } catch (error) {
    console.error('Get revenues error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/summary', async (req: AuthRequest, res: Response) => {
  try {
    const { year } = req.query;
    const currentYear = year ? Number(year) : new Date().getFullYear();
    
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const monthlySummary = await db
      .select({
        month: sql<number>`EXTRACT(MONTH FROM ${revenues.createdAt})`,
        total: sql<number>`SUM(${revenues.amount})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(revenues)
      .where(and(
        gte(revenues.createdAt, startDate),
        lte(revenues.createdAt, endDate)
      ))
      .groupBy(sql`EXTRACT(MONTH FROM ${revenues.createdAt})`);

    const [{ totalRevenue }] = await db
      .select({ totalRevenue: sql<number>`COALESCE(SUM(${revenues.amount}), 0)` })
      .from(revenues)
      .where(and(
        gte(revenues.createdAt, startDate),
        lte(revenues.createdAt, endDate)
      ));

    const [{ paidRevenue }] = await db
      .select({ paidRevenue: sql<number>`COALESCE(SUM(${revenues.amount}), 0)` })
      .from(revenues)
      .where(and(
        eq(revenues.status, 'paid'),
        gte(revenues.createdAt, startDate),
        lte(revenues.createdAt, endDate)
      ));

    res.json({
      year: currentYear,
      totalRevenue: Number(totalRevenue),
      paidRevenue: Number(paidRevenue),
      pendingRevenue: Number(totalRevenue) - Number(paidRevenue),
      monthly: monthlySummary,
    });
  } catch (error) {
    console.error('Get revenue summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const [revenue] = await db.select().from(revenues).where(eq(revenues.id, id)).limit(1);
    
    if (!revenue) {
      return res.status(404).json({ error: 'Revenue not found' });
    }

    res.json(revenue);
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = revenueSchema.parse(req.body);
    
    const invoiceNumber = data.invoiceNumber || `INV-${Date.now().toString(36).toUpperCase()}`;

    const [newRevenue] = await db
      .insert(revenues)
      .values({
        ...data,
        invoiceNumber,
        amount: data.amount.toString(),
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      })
      .returning();

    res.status(201).json(newRevenue);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create revenue error:', error);
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
    
    if (updates.status === 'paid' && !updates.paidAt) {
      updates.paidAt = new Date();
    }

    const [updated] = await db
      .update(revenues)
      .set(updates)
      .where(eq(revenues.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Revenue not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update revenue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [deleted] = await db.delete(revenues).where(eq(revenues.id, id)).returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Revenue not found' });
    }

    res.json({ message: 'Revenue deleted successfully' });
  } catch (error) {
    console.error('Delete revenue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
