import { Router, Response } from "express";
import { db, bids, customers } from "../db";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

router.use(authMiddleware);

const createBidSchema = z.object({
  customerId: z.string().uuid().optional(),
  origin: z.string().min(1),
  destination: z.string().min(1),
  cargo: z.string().optional(),
  cargoWeight: z.number().optional(),
  requestedPrice: z.number().optional(),
  minimumBid: z.number().optional(),
  pickupDate: z.string().optional(),
  expiresAt: z.string().optional(),
  notes: z.string().optional(),
});

// Get all bids
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let allBids;
    if (status) {
      allBids = await db
        .select()
        .from(bids)
        .where(eq(bids.status, status as any))
        .orderBy(desc(bids.createdAt))
        .limit(Number(limit))
        .offset(Number(offset));
    } else {
      allBids = await db
        .select()
        .from(bids)
        .orderBy(desc(bids.createdAt))
        .limit(Number(limit))
        .offset(Number(offset));
    }

    const bidsWithRelations = await Promise.all(
      allBids.map(async (bid) => {
        const [customer] = bid.customerId
          ? await db
              .select()
              .from(customers)
              .where(eq(customers.id, bid.customerId))
              .limit(1)
          : [null];

        return {
          ...bid,
          customer: customer ? { id: customer.id, name: customer.name } : null,
        };
      })
    );

    res.json({ data: bidsWithRelations, total: bidsWithRelations.length });
  } catch (error) {
    console.error("Get bids error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get open bids (for drivers to bid on)
router.get("/open", async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const openBids = await db
      .select()
      .from(bids)
      .where(eq(bids.status, "open"))
      .orderBy(desc(bids.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    const bidsWithRelations = await Promise.all(
      openBids.map(async (bid) => {
        const [customer] = bid.customerId
          ? await db
              .select()
              .from(customers)
              .where(eq(customers.id, bid.customerId))
              .limit(1)
          : [null];

        return {
          ...bid,
          customer: customer ? { id: customer.id, name: customer.name } : null,
        };
      })
    );

    res.json({ data: bidsWithRelations, total: bidsWithRelations.length });
  } catch (error) {
    console.error("Get open bids error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get bid by ID
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [bid] = await db.select().from(bids).where(eq(bids.id, id)).limit(1);

    if (!bid) {
      return res.status(404).json({ error: "Bid not found" });
    }

    const [customer] = bid.customerId
      ? await db
          .select()
          .from(customers)
          .where(eq(customers.id, bid.customerId))
          .limit(1)
      : [null];

    res.json({
      ...bid,
      customer,
    });
  } catch (error) {
    console.error("Get bid error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create bid
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const data = createBidSchema.parse(req.body);

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
        minimumBid: data.minimumBid?.toString(),
        pickupDate: data.pickupDate ? new Date(data.pickupDate) : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        notes: data.notes,
      })
      .returning();

    res.status(201).json(newBid);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    console.error("Create bid error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Submit bid (driver submits their price)
router.post("/:id/submit", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (!price || typeof price !== "number") {
      return res.status(400).json({ error: "Price is required" });
    }

    const [bid] = await db.select().from(bids).where(eq(bids.id, id)).limit(1);

    if (!bid) {
      return res.status(404).json({ error: "Bid not found" });
    }

    if (bid.status !== "open") {
      return res.status(400).json({ error: "Bid is no longer open" });
    }

    // Check minimum bid
    if (bid.minimumBid && price < Number(bid.minimumBid)) {
      return res
        .status(400)
        .json({ error: `Price must be at least ${bid.minimumBid}` });
    }

    const [updated] = await db
      .update(bids)
      .set({
        submittedPrice: price.toString(),
        status: "submitted",
        updatedAt: new Date(),
      })
      .where(eq(bids.id, id))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error("Submit bid error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update bid
router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(bids)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bids.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Bid not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update bid error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete bid
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [deleted] = await db
      .delete(bids)
      .where(eq(bids.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: "Bid not found" });
    }

    res.json({ message: "Bid deleted successfully" });
  } catch (error) {
    console.error("Delete bid error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
