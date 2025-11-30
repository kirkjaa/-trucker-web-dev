import { Router } from "express";

import { authMiddleware } from "../middleware/auth";
import { listTemplateFields } from "../services/master.service";

const router = Router();

router.get("/template-fields", authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    const fields = await listTemplateFields(
      type ? String(type) : undefined
    );
    res.json({
      statusCode: 200,
      message: {
        en: "Fetched template fields",
        th: "ดึงข้อมูลฟิลด์เทมเพลตสำเร็จ",
      },
      data: fields,
    });
  } catch (error) {
    console.error("List template fields error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to fetch template fields",
        th: "ไม่สามารถดึงข้อมูลฟิลด์เทมเพลตได้",
      },
    });
  }
});

export default router;

