import { Router } from "express";

const router = Router();

// Note: Desktop database doesn't have a products table
// These endpoints return placeholder data

// Get all products
router.get("/", async (req, res) => {
  try {
    // Return empty data - products table not in desktop schema
    return res.json({
      data: [],
      total: 0,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  return res.status(404).json({ error: "Product not found" });
});

export default router;
