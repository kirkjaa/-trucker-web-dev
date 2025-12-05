import { Router } from "express";
import { db } from "../db";
import { trucks, drivers, users } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// Get all vehicles (trucks)
router.get("/", async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const vehicles = await db
      .select({
        id: trucks.id,
        truckCode: trucks.truckCode,
        licensePlateValue: trucks.licensePlateValue,
        licensePlateProvince: trucks.licensePlateProvince,
        brand: trucks.brand,
        year: trucks.year,
        color: trucks.color,
        type: trucks.type,
        size: trucks.size,
        departmentType: trucks.departmentType,
        factoryId: trucks.factoryId,
        companyId: trucks.companyId,
        driverId: trucks.driverId,
        isActive: trucks.isActive,
        createdAt: trucks.createdAt,
      })
      .from(trucks)
      .where(eq(trucks.deleted, false))
      .orderBy(desc(trucks.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    // Enrich with driver info (driver -> user for personal details)
    const enrichedVehicles = await Promise.all(
      vehicles.map(async (vehicle) => {
        let driver = null;
        if (vehicle.driverId) {
          // Get driver record
          const [driverRecord] = await db
            .select({
              id: drivers.id,
              userId: drivers.userId,
            })
            .from(drivers)
            .where(eq(drivers.id, vehicle.driverId))
            .limit(1);

          if (driverRecord?.userId) {
            // Get user info for driver's personal details
            const [userRecord] = await db
              .select({
                firstName: users.firstName,
                lastName: users.lastName,
                phone: users.phone,
              })
              .from(users)
              .where(eq(users.id, driverRecord.userId))
              .limit(1);

            if (userRecord) {
              driver = {
                id: driverRecord.id,
                name: `${userRecord.firstName || ""} ${userRecord.lastName || ""}`.trim(),
                phone: userRecord.phone,
              };
            }
          }
        }

        return {
          id: vehicle.id,
          registrationNumber: vehicle.licensePlateValue,
          truckCode: vehicle.truckCode,
          province: vehicle.licensePlateProvince,
          brand: vehicle.brand,
          year: vehicle.year,
          color: vehicle.color,
          type: vehicle.type,
          size: vehicle.size,
          status: vehicle.isActive ? "available" : "inactive",
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
      registrationNumber: vehicle.licensePlateValue,
      truckCode: vehicle.truckCode,
      province: vehicle.licensePlateProvince,
      brand: vehicle.brand,
      year: vehicle.year,
      color: vehicle.color,
      type: vehicle.type,
      size: vehicle.size,
      status: vehicle.isActive ? "available" : "inactive",
      createdAt: vehicle.createdAt,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return res.status(500).json({ error: "Failed to fetch vehicle" });
  }
});

export default router;
