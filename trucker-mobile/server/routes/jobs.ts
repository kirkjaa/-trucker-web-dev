import { Router } from "express";
import { db } from "../db";
import { factoryRoutes, masterRoutes, organizations, orders, drivers, trucks } from "../db/schema";
import { eq, and, desc, sql, or } from "drizzle-orm";

const router = Router();

// Get all jobs (factory routes) - for browsing available jobs
router.get("/", async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = db
      .select({
        id: factoryRoutes.id,
        jobNumber: factoryRoutes.routeFactoryCode,
        displayCode: factoryRoutes.displayCode,
        status: factoryRoutes.status,
        type: factoryRoutes.type,
        shippingType: factoryRoutes.shippingType,
        distance: factoryRoutes.distanceValue,
        distanceUnit: factoryRoutes.distanceUnit,
        price: factoryRoutes.offerPrice,
        unit: factoryRoutes.unit,
        createdAt: factoryRoutes.createdAt,
        // Join with master route for origin/destination
        masterRouteId: factoryRoutes.masterRouteId,
        factoryId: factoryRoutes.factoryId,
      })
      .from(factoryRoutes)
      .where(eq(factoryRoutes.deleted, false))
      .orderBy(desc(factoryRoutes.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    const jobs = await query;

    // Enrich with master route and factory info
    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        // Get master route info
        let origin = "Thailand";
        let destination = "Thailand";
        if (job.masterRouteId) {
          const [masterRoute] = await db
            .select()
            .from(masterRoutes)
            .where(eq(masterRoutes.id, job.masterRouteId))
            .limit(1);
          if (masterRoute) {
            origin = masterRoute.originProvince || masterRoute.originCountry || "Thailand";
            destination = masterRoute.destinationProvince || masterRoute.destinationCountry || "Thailand";
          }
        }

        // Get factory/customer info
        let customer = null;
        if (job.factoryId) {
          const [org] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, job.factoryId))
            .limit(1);
          if (org) {
            customer = { id: org.id, name: org.businessName };
          }
        }

        return {
          id: job.id,
          jobNumber: job.displayCode || job.jobNumber,
          status: job.status,
          type: job.type,
          shippingType: job.shippingType,
          origin,
          destination,
          distance: job.distance ? `${job.distance} ${job.distanceUnit || "km"}` : null,
          price: job.price,
          customer,
          cargo: job.type === "abroad" ? "International shipment" : "Domestic shipment",
          createdAt: job.createdAt,
          // For UI compatibility
          pickupDate: job.createdAt,
          deliveryDate: null,
          stops: [],
        };
      })
    );

    return res.json(enrichedJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Get jobs assigned to current user (driver)
router.get("/my-jobs", async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { status, limit = 50 } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Find driver record for this user
    const [driver] = await db
      .select()
      .from(drivers)
      .where(eq(drivers.userId, userId))
      .limit(1);

    if (!driver) {
      // User is not a driver, return empty
      return res.json([]);
    }

    // Find orders assigned to this driver
    const driverOrders = await db
      .select({
        orderId: orders.id,
        orderCode: orders.displayCode,
        orderStatus: orders.status,
        totalPrice: orders.totalPrice,
        factoryRouteId: orders.factoryRouteId,
        truckId: orders.truckId,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(and(eq(orders.driverId, driver.id), eq(orders.deleted, false)))
      .orderBy(desc(orders.createdAt))
      .limit(Number(limit));

    // Enrich with route details
    const enrichedOrders = await Promise.all(
      driverOrders.map(async (order) => {
        let route = null;
        let origin = "Thailand";
        let destination = "Thailand";
        let customer = null;

        if (order.factoryRouteId) {
          const [factoryRoute] = await db
            .select()
            .from(factoryRoutes)
            .where(eq(factoryRoutes.id, order.factoryRouteId))
            .limit(1);

          if (factoryRoute) {
            route = factoryRoute;

            // Get master route
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

        // Get truck info
        let vehicle = null;
        if (order.truckId) {
          const [truck] = await db
            .select()
            .from(trucks)
            .where(eq(trucks.id, order.truckId))
            .limit(1);
          if (truck) {
            vehicle = { id: truck.id, registrationNumber: truck.licensePlate };
          }
        }

        return {
          id: order.orderId,
          jobNumber: order.orderCode,
          status: mapOrderStatusToJobStatus(order.orderStatus),
          origin,
          destination,
          distance: route?.distanceValue ? `${route.distanceValue} ${route.distanceUnit || "km"}` : null,
          price: order.totalPrice || route?.offerPrice,
          customer,
          vehicle,
          cargo: route?.type === "abroad" ? "International shipment" : "Domestic shipment",
          createdAt: order.createdAt,
          pickupDate: order.createdAt,
          stops: [],
        };
      })
    );

    return res.json(enrichedOrders);
  } catch (error) {
    console.error("Error fetching my jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Get single job by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [job] = await db
      .select()
      .from(factoryRoutes)
      .where(and(eq(factoryRoutes.id, id), eq(factoryRoutes.deleted, false)))
      .limit(1);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Get master route info
    let origin = "Thailand";
    let destination = "Thailand";
    if (job.masterRouteId) {
      const [masterRoute] = await db
        .select()
        .from(masterRoutes)
        .where(eq(masterRoutes.id, job.masterRouteId))
        .limit(1);
      if (masterRoute) {
        origin = masterRoute.originProvince || masterRoute.originCountry || "Thailand";
        destination = masterRoute.destinationProvince || masterRoute.destinationCountry || "Thailand";
      }
    }

    // Get customer info
    let customer = null;
    if (job.factoryId) {
      const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, job.factoryId))
        .limit(1);
      if (org) {
        customer = { id: org.id, name: org.businessName };
      }
    }

    return res.json({
      id: job.id,
      jobNumber: job.displayCode || job.routeFactoryCode,
      status: job.status,
      type: job.type,
      origin,
      destination,
      distance: job.distanceValue ? `${job.distanceValue} ${job.distanceUnit || "km"}` : null,
      price: job.offerPrice,
      customer,
      cargo: job.type === "abroad" ? "International shipment" : "Domestic shipment",
      createdAt: job.createdAt,
      pickupDate: job.createdAt,
      stops: [],
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ error: "Failed to fetch job" });
  }
});

// Helper function to map order status to job status
function mapOrderStatusToJobStatus(orderStatus: string | null): string {
  switch (orderStatus) {
    case "Published":
      return "pending";
    case "Matched":
      return "pending";
    case "StartShipping":
      return "in_progress";
    case "Shipped":
      return "in_progress";
    case "Completed":
      return "completed";
    default:
      return "pending";
  }
}

export default router;
