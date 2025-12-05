import { Router } from "express";
import { db } from "../db";
import { factoryRoutes, masterRoutes, organizations, orders, drivers, trucks } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

const router = Router();

// Get all jobs (factory routes) - for browsing available jobs
router.get("/", async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const jobs = await db
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
        masterRouteId: factoryRoutes.masterRouteId,
        factoryId: factoryRoutes.factoryId,
      })
      .from(factoryRoutes)
      .where(eq(factoryRoutes.deleted, false))
      .orderBy(desc(factoryRoutes.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    // Enrich with master route and factory info
    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        // Get master route info for origin/destination
        let origin = "Thailand";
        let destination = "Thailand";
        if (job.masterRouteId) {
          const [masterRoute] = await db
            .select({
              originProvince: masterRoutes.originProvince,
              destinationProvince: masterRoutes.destinationProvince,
            })
            .from(masterRoutes)
            .where(eq(masterRoutes.id, job.masterRouteId))
            .limit(1);
          if (masterRoute) {
            origin = masterRoute.originProvince || "Thailand";
            destination = masterRoute.destinationProvince || "Thailand";
          }
        }

        // Get factory/customer info
        let customer = null;
        if (job.factoryId) {
          const [org] = await db
            .select({
              id: organizations.id,
              name: organizations.name,
            })
            .from(organizations)
            .where(eq(organizations.id, job.factoryId))
            .limit(1);
          if (org) {
            customer = { id: org.id, name: org.name };
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

    // Note: The desktop orders table doesn't have driverId, so we return empty for now
    // In the future, this would need a driver_orders mapping table
    // For now, return factory routes assigned to the driver's organization
    const driverOrders: Array<{
      orderId: string;
      orderCode: string;
      orderStatus: string | null;
      totalPrice: string | null;
      factoryRouteId: string | null;
      truckId: string | null;
      createdAt: Date | null;
    }> = [];

    // Enrich with route details
    const enrichedOrders = await Promise.all(
      driverOrders.map(async (order) => {
        let origin = "Thailand";
        let destination = "Thailand";
        let customer = null;
        let routePrice = null;

        if (order.factoryRouteId) {
          const [factoryRoute] = await db
            .select()
            .from(factoryRoutes)
            .where(eq(factoryRoutes.id, order.factoryRouteId))
            .limit(1);

          if (factoryRoute) {
            routePrice = factoryRoute.offerPrice;

            // Get master route
            if (factoryRoute.masterRouteId) {
              const [masterRoute] = await db
                .select({
                  originProvince: masterRoutes.originProvince,
                  destinationProvince: masterRoutes.destinationProvince,
                })
                .from(masterRoutes)
                .where(eq(masterRoutes.id, factoryRoute.masterRouteId))
                .limit(1);
              if (masterRoute) {
                origin = masterRoute.originProvince || "Thailand";
                destination = masterRoute.destinationProvince || "Thailand";
              }
            }

            // Get customer
            if (factoryRoute.factoryId) {
              const [org] = await db
                .select({
                  id: organizations.id,
                  name: organizations.name,
                })
                .from(organizations)
                .where(eq(organizations.id, factoryRoute.factoryId))
                .limit(1);
              if (org) {
                customer = { id: org.id, name: org.name };
              }
            }
          }
        }

        // Get truck info (using correct column names)
        let vehicle = null;
        if (order.truckId) {
          const [truck] = await db
            .select({
              id: trucks.id,
              licensePlateValue: trucks.licensePlateValue,
              truckCode: trucks.truckCode,
            })
            .from(trucks)
            .where(eq(trucks.id, order.truckId))
            .limit(1);
          if (truck) {
            vehicle = { id: truck.id, registrationNumber: truck.licensePlateValue, truckCode: truck.truckCode };
          }
        }

        return {
          id: order.orderId,
          jobNumber: order.orderCode,
          status: mapOrderStatusToJobStatus(order.orderStatus),
          origin,
          destination,
          price: order.totalPrice || routePrice,
          customer,
          vehicle,
          cargo: "Domestic shipment",
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
        .select({
          originProvince: masterRoutes.originProvince,
          destinationProvince: masterRoutes.destinationProvince,
        })
        .from(masterRoutes)
        .where(eq(masterRoutes.id, job.masterRouteId))
        .limit(1);
      if (masterRoute) {
        origin = masterRoute.originProvince || "Thailand";
        destination = masterRoute.destinationProvince || "Thailand";
      }
    }

    // Get customer info
    let customer = null;
    if (job.factoryId) {
      const [org] = await db
        .select({
          id: organizations.id,
          name: organizations.name,
        })
        .from(organizations)
        .where(eq(organizations.id, job.factoryId))
        .limit(1);
      if (org) {
        customer = { id: org.id, name: org.name };
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
    case "Matched":
      return "pending";
    case "StartShipping":
    case "Shipped":
      return "in_progress";
    case "Completed":
      return "completed";
    default:
      return "pending";
  }
}

export default router;
