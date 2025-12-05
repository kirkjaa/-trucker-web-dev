import { Router } from "express";
import { db } from "../db";
import { bids, factoryRoutes, masterRoutes, organizations, drivers } from "../db/schema";
import { eq, and, desc, sql, or } from "drizzle-orm";

const router = Router();

// Get all bids
router.get("/", async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const allBids = await db
      .select({
        id: bids.id,
        bidPrice: bids.bidPrice,
        status: bids.status,
        notes: bids.notes,
        factoryRouteId: bids.factoryRouteId,
        driverId: bids.driverId,
        createdAt: bids.createdAt,
      })
      .from(bids)
      .where(eq(bids.deleted, false))
      .orderBy(desc(bids.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    // Enrich with route and customer info
    const enrichedBids = await Promise.all(
      allBids.map(async (bid) => {
        let route = null;
        let customer = null;
        let origin = "Thailand";
        let destination = "Thailand";

        if (bid.factoryRouteId) {
          const [factoryRoute] = await db
            .select()
            .from(factoryRoutes)
            .where(eq(factoryRoutes.id, bid.factoryRouteId))
            .limit(1);

          if (factoryRoute) {
            route = factoryRoute;

            // Get master route for origin/destination
            if (factoryRoute.masterRouteId) {
              const [masterRoute] = await db
                .select()
                .from(masterRoutes)
                .where(eq(masterRoutes.id, factoryRoute.masterRouteId))
                .limit(1);
              if (masterRoute) {
                origin = masterRoute.originProvince || masterRoute.originCountry || "Thailand";
                destination = masterRoute.destinationProvince || masterRoute.destinationCountry || "Thailand";
              }
            }

            // Get customer
            if (factoryRoute.factoryId) {
              const [org] = await db
                .select()
                .from(organizations)
                .where(eq(organizations.id, factoryRoute.factoryId))
                .limit(1);
              if (org) {
                customer = { id: org.id, name: org.businessName };
              }
            }
          }
        }

        return {
          id: bid.id,
          bidNumber: `BID-${bid.id.substring(0, 8).toUpperCase()}`,
          bidPrice: bid.bidPrice,
          status: bid.status,
          origin,
          destination,
          requestedPrice: route?.offerPrice,
          minimumBid: route?.offerPrice ? Number(route.offerPrice) * 0.8 : null,
          customer,
          cargo: route?.type === "abroad" ? "International shipment" : "Domestic shipment",
          pickupDate: bid.createdAt,
          notes: bid.notes,
          createdAt: bid.createdAt,
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

// Get open bids (available for bidding)
router.get("/open", async (req, res) => {
  try {
    // Find routes that are pending and don't have accepted bids
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
            .select()
            .from(masterRoutes)
            .where(eq(masterRoutes.id, route.masterRouteId))
            .limit(1);
          if (masterRoute) {
            origin = masterRoute.originProvince || masterRoute.originCountry || "Thailand";
            destination = masterRoute.destinationProvince || masterRoute.destinationCountry || "Thailand";
          }
        }

        // Get customer
        if (route.factoryId) {
          const [org] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, route.factoryId))
            .limit(1);
          if (org) {
            customer = { id: org.id, name: org.businessName };
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

// Submit a bid
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

    // Find driver for this user
    const [driver] = await db
      .select()
      .from(drivers)
      .where(eq(drivers.userId, userId))
      .limit(1);

    if (!driver) {
      return res.status(403).json({ error: "Only drivers can submit bids" });
    }

    // Create bid
    const [newBid] = await db
      .insert(bids)
      .values({
        factoryRouteId: id,
        driverId: driver.id,
        bidPrice: price.toString(),
        status: "Submitted",
      })
      .returning();

    return res.status(201).json({
      id: newBid.id,
      bidPrice: newBid.bidPrice,
      status: newBid.status,
      message: "Bid submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting bid:", error);
    return res.status(500).json({ error: "Failed to submit bid" });
  }
});

export default router;
