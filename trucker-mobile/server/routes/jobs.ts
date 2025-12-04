import { Router, Response } from "express";
import { db, jobs, jobStops, customers, vehicles, users } from "../db";
import { eq, desc, and, or, sql } from "drizzle-orm";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

router.use(authMiddleware);

const createJobSchema = z.object({
  customerId: z.string().uuid(),
  vehicleId: z.string().uuid().optional(),
  driverId: z.string().uuid().optional(),
  origin: z.string().min(1),
  destination: z.string().min(1),
  cargo: z.string().optional(),
  cargoWeight: z.number().optional(),
  temperature: z.string().optional(),
  price: z.number().optional(),
  distance: z.number().optional(),
  pickupDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  notes: z.string().optional(),
});

// Get all jobs
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let allJobs;
    if (status) {
      allJobs = await db
        .select()
        .from(jobs)
        .where(eq(jobs.status, status as any))
        .orderBy(desc(jobs.createdAt))
        .limit(Number(limit))
        .offset(Number(offset));
    } else {
      allJobs = await db
        .select()
        .from(jobs)
        .orderBy(desc(jobs.createdAt))
        .limit(Number(limit))
        .offset(Number(offset));
    }

    const jobsWithRelations = await Promise.all(
      allJobs.map(async (job) => {
        const [customer] = job.customerId
          ? await db
              .select()
              .from(customers)
              .where(eq(customers.id, job.customerId))
              .limit(1)
          : [null];
        const [vehicle] = job.vehicleId
          ? await db
              .select()
              .from(vehicles)
              .where(eq(vehicles.id, job.vehicleId))
              .limit(1)
          : [null];
        const [driver] = job.driverId
          ? await db
              .select()
              .from(users)
              .where(eq(users.id, job.driverId))
              .limit(1)
          : [null];
        const stops = await db
          .select()
          .from(jobStops)
          .where(eq(jobStops.jobId, job.id))
          .orderBy(jobStops.sequence);

        return {
          ...job,
          customer: customer ? { id: customer.id, name: customer.name } : null,
          vehicle: vehicle
            ? { id: vehicle.id, registrationNumber: vehicle.registrationNumber }
            : null,
          driver: driver
            ? { id: driver.id, displayName: driver.displayName }
            : null,
          stops,
        };
      })
    );

    res.json(jobsWithRelations);
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get jobs for current driver
router.get("/my-jobs", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, limit = 50, offset = 0 } = req.query;

    let allJobs;
    if (status) {
      allJobs = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.driverId, userId), eq(jobs.status, status as any)))
        .orderBy(desc(jobs.createdAt))
        .limit(Number(limit))
        .offset(Number(offset));
    } else {
      allJobs = await db
        .select()
        .from(jobs)
        .where(eq(jobs.driverId, userId))
        .orderBy(desc(jobs.createdAt))
        .limit(Number(limit))
        .offset(Number(offset));
    }

    const jobsWithRelations = await Promise.all(
      allJobs.map(async (job) => {
        const [customer] = job.customerId
          ? await db
              .select()
              .from(customers)
              .where(eq(customers.id, job.customerId))
              .limit(1)
          : [null];
        const [vehicle] = job.vehicleId
          ? await db
              .select()
              .from(vehicles)
              .where(eq(vehicles.id, job.vehicleId))
              .limit(1)
          : [null];
        const stops = await db
          .select()
          .from(jobStops)
          .where(eq(jobStops.jobId, job.id))
          .orderBy(jobStops.sequence);

        return {
          ...job,
          customer: customer ? { id: customer.id, name: customer.name } : null,
          vehicle: vehicle
            ? { id: vehicle.id, registrationNumber: vehicle.registrationNumber }
            : null,
          stops,
        };
      })
    );

    res.json(jobsWithRelations);
  } catch (error) {
    console.error("Get my jobs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get job by ID
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const [customer] = job.customerId
      ? await db
          .select()
          .from(customers)
          .where(eq(customers.id, job.customerId))
          .limit(1)
      : [null];
    const [vehicle] = job.vehicleId
      ? await db
          .select()
          .from(vehicles)
          .where(eq(vehicles.id, job.vehicleId))
          .limit(1)
      : [null];
    const [driver] = job.driverId
      ? await db.select().from(users).where(eq(users.id, job.driverId)).limit(1)
      : [null];
    const stops = await db
      .select()
      .from(jobStops)
      .where(eq(jobStops.jobId, job.id))
      .orderBy(jobStops.sequence);

    res.json({
      ...job,
      customer,
      vehicle,
      driver,
      stops,
    });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create job
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const data = createJobSchema.parse(req.body);

    const jobNumber = `JOB-${Date.now().toString(36).toUpperCase()}`;

    const [newJob] = await db
      .insert(jobs)
      .values({
        jobNumber,
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        origin: data.origin,
        destination: data.destination,
        cargo: data.cargo,
        cargoWeight: data.cargoWeight?.toString(),
        temperature: data.temperature,
        price: data.price?.toString(),
        distance: data.distance?.toString(),
        pickupDate: data.pickupDate ? new Date(data.pickupDate) : undefined,
        deliveryDate: data.deliveryDate
          ? new Date(data.deliveryDate)
          : undefined,
        notes: data.notes,
      })
      .returning();

    res.status(201).json(newJob);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    console.error("Create job error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update job
router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(jobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update job status
router.patch("/:id/status", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, progress } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (status === "completed") updateData.completedAt = new Date();

    const [updated] = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update job status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete job
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await db.delete(jobStops).where(eq(jobStops.jobId, id));
    const [deleted] = await db.delete(jobs).where(eq(jobs.id, id)).returning();

    if (!deleted) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add stop to job
router.post("/:id/stops", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, contact, phone, cargo, notes } = req.body;

    const existingStops = await db
      .select()
      .from(jobStops)
      .where(eq(jobStops.jobId, id));
    const sequence = existingStops.length + 1;

    const [newStop] = await db
      .insert(jobStops)
      .values({
        jobId: id,
        sequence,
        name,
        address,
        contact,
        phone,
        cargo,
        notes,
      })
      .returning();

    res.status(201).json(newStop);
  } catch (error) {
    console.error("Create stop error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update stop
router.patch("/:jobId/stops/:stopId", async (req: AuthRequest, res: Response) => {
  try {
    const { stopId } = req.params;
    const updates = req.body;

    // Handle check-in
    if (updates.checkedIn === true && !updates.checkedInAt) {
      updates.checkedInAt = new Date();
    }

    const [updated] = await db
      .update(jobStops)
      .set(updates)
      .where(eq(jobStops.id, stopId))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Stop not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update stop error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Check-in to stop
router.post("/:jobId/stops/:stopId/checkin", async (req: AuthRequest, res: Response) => {
  try {
    const { stopId } = req.params;

    const [updated] = await db
      .update(jobStops)
      .set({
        checkedIn: true,
        checkedInAt: new Date(),
        status: "ready",
      })
      .where(eq(jobStops.id, stopId))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Stop not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
