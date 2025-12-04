import { Router, Response } from 'express';
import { db, products } from '../db';
import { eq, desc, ilike, sql } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const productSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  unit: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  requiresRefrigeration: z.boolean().optional(),
  isHazardous: z.boolean().optional(),
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { search, category, limit = 50, offset = 0 } = req.query;
    
    let query = db.select().from(products).orderBy(desc(products.createdAt));
    
    if (search) {
      query = query.where(ilike(products.name, `%${search}%`));
    }
    
    if (category) {
      query = query.where(eq(products.category, category as string));
    }

    const allProducts = await query.limit(Number(limit)).offset(Number(offset));
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(products);

    res.json({ data: allProducts, total: Number(count) });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = productSchema.parse(req.body);

    const [newProduct] = await db
      .insert(products)
      .values({
        ...data,
        weight: data.weight?.toString(),
      })
      .returning();

    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
