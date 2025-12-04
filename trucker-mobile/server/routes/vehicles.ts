import { Router, Response } from 'express';
import { db, vehicles, users } from '../db';
import { eq, desc, sql } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const vehicleSchema = z.object({
  registrationNumber: z.string().min(1),
  registrationProvince: z.string().optional(),
  vin: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  bodyType: z.string().optional(),
  plateType: z.string().optional(),
  payload: z.number().optional(),
  serviceYears: z.number().optional(),
  status: z.enum(['available', 'in_use', 'maintenance', 'unavailable']).optional(),
  driverId: z.string().uuid().optional(),
  hasTrailer: z.boolean().optional(),
  trailerRegistration: z.string().optional(),
  insuranceValue: z.number().optional(),
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
    
    if (status) {
      query = query.where(eq(vehicles.status, status as any));
    }

    const allVehicles = await query.limit(Number(limit)).offset(Number(offset));
    
    const vehiclesWithDrivers = await Promise.all(
      allVehicles.map(async (vehicle) => {
        const [driver] = vehicle.driverId
          ? await db.select().from(users).where(eq(users.id, vehicle.driverId)).limit(1)
          : [null];
        return {
          ...vehicle,
          driver: driver ? { id: driver.id, displayName: driver.displayName } : null,
        };
      })
    );

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(vehicles);

    res.json({ data: vehiclesWithDrivers, total: Number(count) });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const [driver] = vehicle.driverId
      ? await db.select().from(users).where(eq(users.id, vehicle.driverId)).limit(1)
      : [null];

    res.json({ ...vehicle, driver });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = vehicleSchema.parse(req.body);

    const [newVehicle] = await db
      .insert(vehicles)
      .values({
        ...data,
        payload: data.payload?.toString(),
        insuranceValue: data.insuranceValue?.toString(),
      })
      .returning();

    res.status(201).json(newVehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(vehicles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [deleted] = await db.delete(vehicles).where(eq(vehicles.id, id)).returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
