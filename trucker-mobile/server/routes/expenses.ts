import { Router } from "express";

const router = Router();

// Note: Desktop database doesn't have an expenses table yet
// These endpoints return placeholder data until expenses feature is added to desktop

// Get all expenses
router.get("/", async (req, res) => {
  try {
    // Return empty data - expenses table not in desktop schema
    return res.json({
      data: [],
      total: 0,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// Get my expenses
router.get("/my-expenses", async (req, res) => {
  try {
    return res.json({
      data: [],
      total: 0,
    });
  } catch (error) {
    console.error("Error fetching my expenses:", error);
    return res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// Get expense summary
router.get("/summary", async (req, res) => {
  try {
    return res.json({
      byCategory: [],
      grandTotal: 0,
    });
  } catch (error) {
    console.error("Error fetching expense summary:", error);
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// Get single expense
router.get("/:id", async (req, res) => {
  return res.status(404).json({ error: "Expense not found" });
});

// Create expense (placeholder)
router.post("/", async (req, res) => {
  return res.status(501).json({ error: "Expenses feature not yet available" });
});

export default router;
