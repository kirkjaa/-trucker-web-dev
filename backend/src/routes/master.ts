import { Router } from "express";

import { authMiddleware } from "../middleware/auth";
import {
  listBusinessTypes,
  listProvincesHierarchy,
  listTemplateFields,
} from "../services/master.service";

const router = Router();

router.get("/template-fields", authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    const fields = await listTemplateFields(type ? String(type) : undefined);
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

router.get("/provinces", authMiddleware, async (_req, res) => {
  try {
    const provinces = await listProvincesHierarchy();
    res.json({
      statusCode: 200,
      message: {
        en: "Fetched provinces",
        th: "ดึงข้อมูลจังหวัดสำเร็จ",
      },
      data: provinces,
    });
  } catch (error) {
    console.error("List provinces error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to fetch provinces",
        th: "ไม่สามารถดึงข้อมูลจังหวัดได้",
      },
    });
  }
});

router.get("/business-types", authMiddleware, async (_req, res) => {
  try {
    const types = await listBusinessTypes();
    res.json({
      statusCode: 200,
      message: {
        en: "Fetched business types",
        th: "ดึงประเภทธุรกิจสำเร็จ",
      },
      data: types,
    });
  } catch (error) {
    console.error("List business types error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to fetch business types",
        th: "ไม่สามารถดึงข้อมูลประเภทธุรกิจได้",
      },
    });
  }
});

export default router;
