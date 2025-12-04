import { Router, Response } from 'express';
import { db, bids, customers } from '../db';
import { eq, desc, sql } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const bidSchema = z.object({
  customerId: z.string().uuid().optional(),
  origin: z.string().min(1),
  destination: z.string().min(1),
  cargo: z.string().optional(),
  cargoWeight: z.number().optional(),
  requestedPrice: z.number().optional(),
  pickupDate: z.string().optional(),
  expiresAt: z.string().optional(),
  notes: z.string().optional(),
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = db.select().from(bids).orderBy(desc(bids.createdAt));
    
    if (status) {
      query = query.where(eq(bids.status, status as any));
    }

    const allBids = await query.limit(Number(limit)).offset(Number(offset));
    
    const bidsWithCustomers = await Promise.all(
      allBids.map(async (bid) => {
        const [customer] = bid.customerId
          ? await db.select().from(customers).where(eq(customers.id, bid.customerId)).limit(1)
          : [null];
        return {
          ...bid,
          customer: customer ? { id: customer.id, name: customer.name } : null,
        };
      })
    );

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(bids);

    res.json({ data: bidsWithCustomers, total: Number(count) });
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const [bid] = await db.select().from(bids).where(eq(bids.id, id)).limit(1);
    
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    const [customer] = bid.customerId
      ? await db.select().from(customers).where(eq(customers.id, bid.customerId)).limit(1)
      : [null];

    res.json({ ...bid, customer });
  } catch (error) {
    console.error('Get bid error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = bidSchema.parse(req.body);
    
    const bidNumber = `BID-${Date.now().toString(36).toUpperCase()}`;

    const [newBid] = await db
      .insert(bids)
      .values({
        bidNumber,
        customerId: data.customerId,
        origin: data.origin,
        destination: data.destination,
        cargo: data.cargo,
        cargoWeight: data.cargoWeight?.toString(),
        requestedPrice: data.requestedPrice?.toString(),
        pickupDate: data.pickupDate ? new Date(data.pickupDate) : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        notes: data.notes,
      })
      .returning();

    res.status(201).json(newBid);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create bid error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/submit', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const [updated] = await db
      .update(bids)
      .set({
        submittedPrice: price.toString(),
        status: 'submitted',
        updatedAt: new Date(),
      })
      .where(eq(bids.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Submit bid error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.requestedPrice) {
      updates.requestedPrice = updates.requestedPrice.toString();
    }
    if (updates.submittedPrice) {
      updates.submittedPrice = updates.submittedPrice.toString();
    }
    if (updates.cargoWeight) {
      updates.cargoWeight = updates.cargoWeight.toString();
    }

    const [updated] = await db
      .update(bids)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bids.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update bid error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [deleted] = await db.delete(bids).where(eq(bids.id, id)).returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    res.json({ message: 'Bid deleted successfully' });
  } catch (error) {
    console.error('Delete bid error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
