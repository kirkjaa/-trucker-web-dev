import { Router } from "express";
import { db } from "../db";
import { orders, organizations, factoryRoutes } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

const router = Router();

// Get all revenues (from completed orders)
router.get("/", async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    // Get completed orders as revenue entries
    const completedOrders = await db
      .select({
        id: orders.id,
        displayCode: orders.displayCode,
        totalPrice: orders.totalPrice,
        paymentStatus: orders.paymentStatus,
        factoryRouteId: orders.factoryRouteId,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(and(eq(orders.status, "Completed"), eq(orders.deleted, false)))
      .orderBy(desc(orders.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    // Enrich with customer info
    const enrichedRevenues = await Promise.all(
      completedOrders.map(async (order) => {
        let customerName = "Unknown Customer";

        if (order.factoryRouteId) {
          const [route] = await db
            .select({ factoryId: factoryRoutes.factoryId })
            .from(factoryRoutes)
            .where(eq(factoryRoutes.id, order.factoryRouteId))
            .limit(1);

          if (route?.factoryId) {
            const [org] = await db
              .select({ businessName: organizations.businessName })
              .from(organizations)
              .where(eq(organizations.id, route.factoryId))
              .limit(1);
            if (org) {
              customerName = org.businessName;
            }
          }
        }

        const createdDate = order.createdAt ? new Date(order.createdAt) : new Date();

        return {
          id: order.id,
          companyName: customerName,
          amount: Number(order.totalPrice) || 0,
          status: order.paymentStatus === "Paid" ? "paid" : "pending",
          month: createdDate.toLocaleString("en-US", { month: "long" }),
          date: order.createdAt,
        };
      })
    );

    return res.json({
      data: enrichedRevenues,
      total: enrichedRevenues.length,
    });
  } catch (error) {
    console.error("Error fetching revenues:", error);
    return res.status(500).json({ error: "Failed to fetch revenues" });
  }
});

// Get revenue summary
router.get("/summary", async (req, res) => {
  try {
    const [summary] = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(${orders.totalPrice}), 0)`,
        paidRevenue: sql<number>`COALESCE(SUM(${orders.totalPrice}) FILTER (WHERE ${orders.paymentStatus} = 'Paid'), 0)`,
        pendingRevenue: sql<number>`COALESCE(SUM(${orders.totalPrice}) FILTER (WHERE ${orders.paymentStatus} = 'Unpaid'), 0)`,
        orderCount: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .where(and(eq(orders.status, "Completed"), eq(orders.deleted, false)));

    return res.json({
      totalRevenue: Number(summary?.totalRevenue) || 0,
      paidRevenue: Number(summary?.paidRevenue) || 0,
      pendingRevenue: Number(summary?.pendingRevenue) || 0,
      orderCount: Number(summary?.orderCount) || 0,
    });
  } catch (error) {
    console.error("Error fetching revenue summary:", error);
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;
