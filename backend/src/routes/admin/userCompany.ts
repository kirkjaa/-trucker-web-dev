import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import { createUserRecord, listUsers } from "../../services/user.service";
import { upload } from "../../utils/upload";
import { extractUserPayload } from "../utils/userPayload";

const router = Router();
const uploadSingle = upload.single("image");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page, limit, search, sort, order } = req.query;
    const result = await listUsers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      sort: sort ? String(sort) : undefined,
      order: order ? String(order) : undefined,
      organizationTypeId: 2,
    });

    res.json({
      statusCode: 200,
      message: result.message,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("List company system users error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load system users",
        th: "ไม่สามารถดึงข้อมูลผู้ใช้ระบบได้",
      },
    });
  }
});

router.post("/", authMiddleware, uploadSingle, async (req, res) => {
  try {
    const payload = extractUserPayload(req);
    const id = await createUserRecord(payload);

    res.status(201).json({
      statusCode: 201,
      message: {
        en: "Company system user created successfully",
        th: "สร้างผู้ใช้ระบบของบริษัทสำเร็จ",
      },
      data: { id },
    });
  } catch (error) {
    console.error("Create company system user error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to create system user",
        th: "สร้างผู้ใช้ระบบไม่สำเร็จ",
      },
    });
  }
});

export default router;
