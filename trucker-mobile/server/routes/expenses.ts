import { Router, Response } from "express";
import { db, expenses, jobs, jobStops } from "../db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

router.use(authMiddleware);

const createExpenseSchema = z.object({
  jobId: z.string().uuid().optional(),
  stopId: z.string().uuid().optional(),
  title: z.string().min(1),
  category: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().default("THB"),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
  date: z.string().optional(),
});

// Get all expenses
router.get("/", async (req: AuthRequest, res: Response) => {
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

    let allExpenses;
    if (conditions.length > 0) {
      allExpenses = await db
        .select()
        .from(expenses)
        .where(and(...conditions))
        .orderBy(desc(expenses.date))
        .limit(Number(limit))
        .offset(Number(offset));
    } else {
      allExpenses = await db
        .select()
        .from(expenses)
        .orderBy(desc(expenses.date))
        .limit(Number(limit))
        .offset(Number(offset));
    }

    const expensesWithRelations = await Promise.all(
      allExpenses.map(async (expense) => {
        const [job] = expense.jobId
          ? await db
              .select()
              .from(jobs)
              .where(eq(jobs.id, expense.jobId))
              .limit(1)
          : [null];

        return {
          ...expense,
          job: job ? { id: job.id, jobNumber: job.jobNumber } : null,
        };
      })
    );

    res.json({ data: expensesWithRelations, total: expensesWithRelations.length });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get my expenses
router.get("/my-expenses", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate, limit = 50, offset = 0 } = req.query;

    let conditions = [eq(expenses.userId, userId)];

    if (startDate) {
      conditions.push(gte(expenses.date, new Date(startDate as string)));
    }

    if (endDate) {
      conditions.push(lte(expenses.date, new Date(endDate as string)));
    }

    const myExpenses = await db
      .select()
      .from(expenses)
      .where(and(...conditions))
      .orderBy(desc(expenses.date))
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({ data: myExpenses, total: myExpenses.length });
  } catch (error) {
    console.error("Get my expenses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get expense summary
router.get("/summary", async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let conditions = [];
    if (startDate) {
      conditions.push(gte(expenses.date, new Date(startDate as string)));
    }
    if (endDate) {
      conditions.push(lte(expenses.date, new Date(endDate as string)));
    }

    // Get total by category
    const categoryTotals = await db
      .select({
        category: expenses.category,
        total: sql<number>`SUM(${expenses.amount})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(expenses)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(expenses.category);

    // Get grand total
    const [{ grandTotal }] = await db
      .select({
        grandTotal: sql<number>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json({
      byCategory: categoryTotals.map((cat) => ({
        category: cat.category,
        total: Number(cat.total),
        count: Number(cat.count),
      })),
      grandTotal: Number(grandTotal),
    });
  } catch (error) {
    console.error("Get expense summary error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get expense by ID
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [expense] = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id))
      .limit(1);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const [job] = expense.jobId
      ? await db.select().from(jobs).where(eq(jobs.id, expense.jobId)).limit(1)
      : [null];

    res.json({
      ...expense,
      job,
    });
  } catch (error) {
    console.error("Get expense error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create expense
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const data = createExpenseSchema.parse(req.body);
    const userId = req.user!.id;

    const [newExpense] = await db
      .insert(expenses)
      .values({
        jobId: data.jobId,
        stopId: data.stopId,
        userId: userId,
        title: data.title,
        category: data.category,
        amount: data.amount.toString(),
        currency: data.currency,
        description: data.description,
        receiptUrl: data.receiptUrl,
        date: data.date ? new Date(data.date) : new Date(),
      })
      .returning();

    res.status(201).json(newExpense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    console.error("Create expense error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update expense
router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(expenses)
      .set(updates)
      .where(eq(expenses.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete expense
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [deleted] = await db
      .delete(expenses)
      .where(eq(expenses.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
