import { Router } from "express";
import { db } from "../db";
import { bids, factoryRoutes, masterRoutes, organizations } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

const router = Router();

// Get all bids
router.get("/", async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const allBids = await db
      .select({
        id: bids.id,
        displayCode: bids.displayCode,
        bidStatus: bids.bidStatus,
        bidReason: bids.bidReason,
        companyId: bids.companyId,
        rfqId: bids.rfqId,
        createdAt: bids.createdAt,
      })
      .from(bids)
      .where(eq(bids.deleted, false))
      .orderBy(desc(bids.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    // Enrich with company info
    const enrichedBids = await Promise.all(
      allBids.map(async (bid) => {
        let customer = null;
        if (bid.companyId) {
          const [org] = await db
            .select({
              id: organizations.id,
              name: organizations.name,
            })
            .from(organizations)
            .where(eq(organizations.id, bid.companyId))
            .limit(1);
          if (org) {
            customer = { id: org.id, name: org.name };
          }
        }

        return {
          id: bid.id,
          bidNumber: bid.displayCode,
          status: bid.bidStatus === "Draft" || bid.bidStatus === "Submitted" ? "open" : "history",
          bidStatus: bid.bidStatus,
          customer,
          notes: bid.bidReason,
          createdAt: bid.createdAt,
          // Default values for UI compatibility
          origin: "Thailand",
          destination: "Thailand",
          requestedPrice: null,
          minimumBid: null,
          cargo: "Shipment",
          pickupDate: bid.createdAt,
        };
      })
    );

    return res.json({
      data: enrichedBids,
      total: enrichedBids.length,
    });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return res.status(500).json({ error: "Failed to fetch bids" });
  }
});

// Get open bids (available routes for bidding)
router.get("/open", async (req, res) => {
  try {
    // Find routes that are pending (available for bidding)
    const openRoutes = await db
      .select({
        id: factoryRoutes.id,
        routeCode: factoryRoutes.routeFactoryCode,
        displayCode: factoryRoutes.displayCode,
        status: factoryRoutes.status,
        type: factoryRoutes.type,
        offerPrice: factoryRoutes.offerPrice,
        masterRouteId: factoryRoutes.masterRouteId,
        factoryId: factoryRoutes.factoryId,
        createdAt: factoryRoutes.createdAt,
      })
      .from(factoryRoutes)
      .where(and(eq(factoryRoutes.status, "pending"), eq(factoryRoutes.deleted, false)))
      .orderBy(desc(factoryRoutes.createdAt))
      .limit(20);

    // Enrich with route and customer info
    const enrichedBids = await Promise.all(
      openRoutes.map(async (route) => {
        let origin = "Thailand";
        let destination = "Thailand";
        let customer = null;

        // Get master route
        if (route.masterRouteId) {
          const [masterRoute] = await db
            .select({
              originProvince: masterRoutes.originProvince,
              destinationProvince: masterRoutes.destinationProvince,
            })
            .from(masterRoutes)
            .where(eq(masterRoutes.id, route.masterRouteId))
            .limit(1);
          if (masterRoute) {
            origin = masterRoute.originProvince || "Thailand";
            destination = masterRoute.destinationProvince || "Thailand";
          }
        }

        // Get customer
        if (route.factoryId) {
          const [org] = await db
            .select({
              id: organizations.id,
              name: organizations.name,
            })
            .from(organizations)
            .where(eq(organizations.id, route.factoryId))
            .limit(1);
          if (org) {
            customer = { id: org.id, name: org.name };
          }
        }

        return {
          id: route.id,
          bidNumber: route.displayCode || route.routeCode,
          status: "open",
          origin,
          destination,
          requestedPrice: route.offerPrice,
          minimumBid: route.offerPrice ? Number(route.offerPrice) * 0.8 : null,
          customer,
          cargo: route.type === "abroad" ? "International shipment" : "Domestic shipment",
          pickupDate: route.createdAt,
          createdAt: route.createdAt,
        };
      })
    );

    return res.json({
      data: enrichedBids,
      total: enrichedBids.length,
    });
  } catch (error) {
    console.error("Error fetching open bids:", error);
    return res.status(500).json({ error: "Failed to fetch open bids" });
  }
});

// Submit a bid (placeholder - would need proper bid_details table implementation)
router.post("/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!price) {
      return res.status(400).json({ error: "Price is required" });
    }

    // For now, just return success - proper implementation would create bid_details
    return res.status(201).json({
      id: id,
      bidPrice: price,
      status: "Submitted",
      message: "Bid submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting bid:", error);
    return res.status(500).json({ error: "Failed to submit bid" });
  }
});

export default router;
