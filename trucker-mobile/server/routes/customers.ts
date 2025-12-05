import { Router } from "express";
import { db } from "../db";
import { organizations } from "../db/schema";
import { eq, and, desc, sql, ilike } from "drizzle-orm";

const router = Router();

// Get all customers (organizations)
router.get("/", async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;

    let query = db
      .select({
        id: organizations.id,
        name: organizations.businessName,
        displayCode: organizations.displayCode,
        type: organizations.type,
        taxId: organizations.taxId,
        phone: organizations.phone,
        email: organizations.email,
        address: organizations.address,
        imageUrl: organizations.imageUrl,
        createdAt: organizations.createdAt,
      })
      .from(organizations)
      .where(eq(organizations.deleted, false))
      .orderBy(desc(organizations.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    const customers = await query;

    return res.json({
      data: customers,
      total: customers.length,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// Get single customer
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [customer] = await db
      .select({
        id: organizations.id,
        name: organizations.businessName,
        displayCode: organizations.displayCode,
        type: organizations.type,
        taxId: organizations.taxId,
        phone: organizations.phone,
        email: organizations.email,
        address: organizations.address,
        latitude: organizations.latitude,
        longitude: organizations.longitude,
        imageUrl: organizations.imageUrl,
        createdAt: organizations.createdAt,
      })
      .from(organizations)
      .where(and(eq(organizations.id, id), eq(organizations.deleted, false)))
      .limit(1);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return res.status(500).json({ error: "Failed to fetch customer" });
  }
});

export default router;
