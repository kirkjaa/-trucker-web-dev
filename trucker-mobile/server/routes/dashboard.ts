import { Router, Response } from 'express';
import { db, jobs, customers, vehicles, revenues, expenses, bids, users } from '../db';
import { eq, sql, and, gte, lte, desc } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [{ totalJobs }] = await db
      .select({ totalJobs: sql<number>`COUNT(*)` })
      .from(jobs);

    const [{ activeJobs }] = await db
      .select({ activeJobs: sql<number>`COUNT(*)` })
      .from(jobs)
      .where(eq(jobs.status, 'in_progress'));

    const [{ completedJobs }] = await db
      .select({ completedJobs: sql<number>`COUNT(*)` })
      .from(jobs)
      .where(eq(jobs.status, 'completed'));

    const [{ totalCustomers }] = await db
      .select({ totalCustomers: sql<number>`COUNT(*)` })
      .from(customers);

    const [{ totalVehicles }] = await db
      .select({ totalVehicles: sql<number>`COUNT(*)` })
      .from(vehicles);

    const [{ availableVehicles }] = await db
      .select({ availableVehicles: sql<number>`COUNT(*)` })
      .from(vehicles)
      .where(eq(vehicles.status, 'available'));

    const [{ totalRevenue }] = await db
      .select({ totalRevenue: sql<number>`COALESCE(SUM(${revenues.amount}), 0)` })
      .from(revenues);

    const [{ monthlyRevenue }] = await db
      .select({ monthlyRevenue: sql<number>`COALESCE(SUM(${revenues.amount}), 0)` })
      .from(revenues)
      .where(gte(revenues.createdAt, startOfMonth));

    const [{ totalExpenses }] = await db
      .select({ totalExpenses: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
      .from(expenses);

    const [{ monthlyExpenses }] = await db
      .select({ monthlyExpenses: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
      .from(expenses)
      .where(gte(expenses.date, startOfMonth));

    const [{ openBids }] = await db
      .select({ openBids: sql<number>`COUNT(*)` })
      .from(bids)
      .where(eq(bids.status, 'open'));

    const [{ totalDrivers }] = await db
      .select({ totalDrivers: sql<number>`COUNT(*)` })
      .from(users)
      .where(eq(users.role, 'shipping'));

    res.json({
      jobs: {
        total: Number(totalJobs),
        active: Number(activeJobs),
        completed: Number(completedJobs),
      },
      customers: {
        total: Number(totalCustomers),
      },
      vehicles: {
        total: Number(totalVehicles),
        available: Number(availableVehicles),
      },
      finance: {
        totalRevenue: Number(totalRevenue),
        monthlyRevenue: Number(monthlyRevenue),
        totalExpenses: Number(totalExpenses),
        monthlyExpenses: Number(monthlyExpenses),
        profit: Number(totalRevenue) - Number(totalExpenses),
        monthlyProfit: Number(monthlyRevenue) - Number(monthlyExpenses),
      },
      bids: {
        open: Number(openBids),
      },
      drivers: {
        total: Number(totalDrivers),
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/recent-jobs', async (req: AuthRequest, res: Response) => {
  try {
    const recentJobs = await db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.createdAt))
      .limit(10);

    const jobsWithDetails = await Promise.all(
      recentJobs.map(async (job) => {
        const [customer] = job.customerId
          ? await db.select().from(customers).where(eq(customers.id, job.customerId)).limit(1)
          : [null];
        return {
          ...job,
          customerName: customer?.name || 'Unknown',
        };
      })
    );

    res.json(jobsWithDetails);
  } catch (error) {
    console.error('Get recent jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/revenue-chart', async (req: AuthRequest, res: Response) => {
  try {
    const { months = 12 } = req.query;
    const now = new Date();
    
    const chartData = [];
    
    for (let i = Number(months) - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const [{ revenue }] = await db
        .select({ revenue: sql<number>`COALESCE(SUM(${revenues.amount}), 0)` })
        .from(revenues)
        .where(and(
          gte(revenues.createdAt, monthStart),
          lte(revenues.createdAt, monthEnd)
        ));

      const [{ expense }] = await db
        .select({ expense: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
        .from(expenses)
        .where(and(
          gte(expenses.date, monthStart),
          lte(expenses.date, monthEnd)
        ));

      chartData.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: Number(revenue),
        expenses: Number(expense),
        profit: Number(revenue) - Number(expense),
      });
    }

    res.json(chartData);
  } catch (error) {
    console.error('Get revenue chart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
