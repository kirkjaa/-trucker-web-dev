import { Router } from "express";
import { db } from "../db";
import { trucks, drivers } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// Get all vehicles (trucks)
router.get("/", async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const vehicles = await db
      .select({
        id: trucks.id,
        displayCode: trucks.displayCode,
        licensePlate: trucks.licensePlate,
        province: trucks.province,
        brandModel: trucks.brandModel,
        organizationId: trucks.organizationId,
        driverId: trucks.driverId,
        createdAt: trucks.createdAt,
      })
      .from(trucks)
      .where(eq(trucks.deleted, false))
      .orderBy(desc(trucks.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    // Enrich with driver info
    const enrichedVehicles = await Promise.all(
      vehicles.map(async (vehicle) => {
        let driver = null;
        if (vehicle.driverId) {
          const [driverRecord] = await db
            .select({
              id: drivers.id,
              name: drivers.firstName,
              lastName: drivers.lastName,
              phone: drivers.phone,
            })
            .from(drivers)
            .where(eq(drivers.id, vehicle.driverId))
            .limit(1);
          if (driverRecord) {
            driver = {
              id: driverRecord.id,
              name: `${driverRecord.name || ""} ${driverRecord.lastName || ""}`.trim(),
              phone: driverRecord.phone,
            };
          }
        }

        return {
          id: vehicle.id,
          registrationNumber: vehicle.licensePlate,
          displayCode: vehicle.displayCode,
          province: vehicle.province,
          brandModel: vehicle.brandModel,
          status: "available", // Could be derived from orders
          driver,
          createdAt: vehicle.createdAt,
        };
      })
    );

    return res.json({
      data: enrichedVehicles,
      total: enrichedVehicles.length,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

// Get single vehicle
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [vehicle] = await db
      .select()
      .from(trucks)
      .where(and(eq(trucks.id, id), eq(trucks.deleted, false)))
      .limit(1);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    return res.json({
      id: vehicle.id,
      registrationNumber: vehicle.licensePlate,
      displayCode: vehicle.displayCode,
      province: vehicle.province,
      brandModel: vehicle.brandModel,
      status: "available",
      createdAt: vehicle.createdAt,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return res.status(500).json({ error: "Failed to fetch vehicle" });
  }
});

export default router;
