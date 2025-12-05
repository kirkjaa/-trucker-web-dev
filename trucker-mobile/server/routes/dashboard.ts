import { Router } from "express";
import { db } from "../db";
import { factoryRoutes, organizations, trucks, drivers, bids, orders } from "../db/schema";
import { eq, and, sql, count } from "drizzle-orm";

const router = Router();

// Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    // Count jobs (factory routes)
    const [jobStats] = await db
      .select({
        total: count(),
        pending: sql<number>`COUNT(*) FILTER (WHERE ${factoryRoutes.status} = 'pending')`,
        confirmed: sql<number>`COUNT(*) FILTER (WHERE ${factoryRoutes.status} = 'confirmed')`,
        rejected: sql<number>`COUNT(*) FILTER (WHERE ${factoryRoutes.status} = 'rejected')`,
      })
      .from(factoryRoutes)
      .where(eq(factoryRoutes.deleted, false));

    // Count organizations (customers)
    const [customerStats] = await db
      .select({ total: count() })
      .from(organizations)
      .where(eq(organizations.deleted, false));

    // Count trucks (vehicles)
    const [vehicleStats] = await db
      .select({ total: count() })
      .from(trucks)
      .where(eq(trucks.deleted, false));

    // Count drivers
    const [driverStats] = await db
      .select({ total: count() })
      .from(drivers)
      .where(eq(drivers.deleted, false));

    // Count bids (using bid_status column)
    const [bidStats] = await db
      .select({
        total: count(),
        open: sql<number>`COUNT(*) FILTER (WHERE ${bids.bidStatus} = 'Draft' OR ${bids.bidStatus} = 'Submitted')`,
      })
      .from(bids)
      .where(eq(bids.deleted, false));

    // Count orders (using order_status column)
    const [orderStats] = await db
      .select({
        total: count(),
        active: sql<number>`COUNT(*) FILTER (WHERE ${orders.orderStatus} IN ('Published', 'Matched', 'StartShipping', 'Shipped'))`,
        completed: sql<number>`COUNT(*) FILTER (WHERE ${orders.orderStatus} = 'Completed')`,
      })
      .from(orders)
      .where(eq(orders.deleted, false));

    return res.json({
      jobs: {
        total: Number(jobStats?.total) || 0,
        active: Number(jobStats?.confirmed) || 0,
        completed: Number(orderStats?.completed) || 0,
        pending: Number(jobStats?.pending) || 0,
      },
      customers: {
        total: Number(customerStats?.total) || 0,
      },
      vehicles: {
        total: Number(vehicleStats?.total) || 0,
        available: Number(vehicleStats?.total) || 0,
      },
      finance: {
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalExpenses: 0,
        monthlyExpenses: 0,
        profit: 0,
        monthlyProfit: 0,
      },
      bids: {
        open: Number(bidStats?.open) || 0,
      },
      drivers: {
        total: Number(driverStats?.total) || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Get stats for current user (driver)
router.get("/my-stats", async (req, res) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.json({
        jobs: { total: 0, active: 0, completed: 0 },
        earnings: { total: 0, monthly: 0 },
        expenses: { total: 0, monthly: 0 },
        profit: { total: 0, monthly: 0 },
      });
    }

    // Find driver record
    const [driver] = await db
      .select()
      .from(drivers)
      .where(eq(drivers.userId, userId))
      .limit(1);

    if (!driver) {
      return res.json({
        jobs: { total: 0, active: 0, completed: 0 },
        earnings: { total: 0, monthly: 0 },
        expenses: { total: 0, monthly: 0 },
        profit: { total: 0, monthly: 0 },
      });
    }

    // Count driver's orders (no driverId column in orders, using factory jobs instead)
    // For now, return 0 as the orders table doesn't have driver assignment
    const orderStats = {
      total: 0,
      active: 0,
      completed: 0,
      totalEarnings: 0,
    };

    return res.json({
      jobs: {
        total: Number(orderStats?.total) || 0,
        active: Number(orderStats?.active) || 0,
        completed: Number(orderStats?.completed) || 0,
      },
      earnings: {
        total: Number(orderStats?.totalEarnings) || 0,
        monthly: 0,
      },
      expenses: {
        total: 0,
        monthly: 0,
      },
      profit: {
        total: Number(orderStats?.totalEarnings) || 0,
        monthly: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching my stats:", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Get recent jobs
router.get("/recent-jobs", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const jobs = await db
      .select({
        id: factoryRoutes.id,
        jobNumber: factoryRoutes.displayCode,
        status: factoryRoutes.status,
        type: factoryRoutes.type,
        price: factoryRoutes.offerPrice,
        createdAt: factoryRoutes.createdAt,
      })
      .from(factoryRoutes)
      .where(eq(factoryRoutes.deleted, false))
      .orderBy(sql`${factoryRoutes.createdAt} DESC`)
      .limit(Number(limit));

    return res.json(jobs);
  } catch (error) {
    console.error("Error fetching recent jobs:", error);
    return res.status(500).json({ error: "Failed to fetch recent jobs" });
  }
});

export default router;
