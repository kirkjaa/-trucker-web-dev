import { Router } from "express";

import { authMiddleware } from "../middleware/auth";
import {
  deleteUsers,
  getUserDetail,
  listUsers,
  updateUserRecord,
  createUserRecord,
  buildUserResponse,
  findUserById,
} from "../services/user.service";
import { upload } from "../utils/upload";
import { extractUserPayload } from "./utils/userPayload";

const router = Router();
const uploadSingle = upload.single("image");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page, limit, organization_type_id, search, sort, order } =
      req.query;
    const result = await listUsers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      organizationTypeId: organization_type_id
        ? Number(organization_type_id)
        : undefined,
      search: search ? String(search) : undefined,
      sort: sort ? String(sort) : undefined,
      order: order ? String(order) : undefined,
    });

    res.json({
      statusCode: 200,
      message: result.message,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load users",
        th: "ไม่สามารถดึงข้อมูลผู้ใช้ได้",
      },
    });
  }
});

router.get("/byId", authMiddleware, async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "User id is required",
          th: "กรุณาระบุรหัสผู้ใช้",
        },
      });
    }

    const result = await getUserDetail(id);
    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "User not found",
          th: "ไม่พบผู้ใช้",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load user detail",
        th: "ไม่สามารถดึงรายละเอียดผู้ใช้ได้",
      },
    });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ statusCode: 401, message: "Unauthorized" });
    }

    const row = await findUserById(req.user.id);
    if (!row) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });
    }

    const data = await buildUserResponse(row);
    res.json({
      statusCode: 200,
      message: {
        en: "Fetched profile successfully",
        th: "ดึงข้อมูลผู้ใช้สำเร็จ",
      },
      data,
    });
  } catch (error) {
    console.error("Fetch current user error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load user profile",
        th: "ไม่สามารถดึงโปรไฟล์ผู้ใช้ได้",
      },
    });
  }
});

router.post("/", authMiddleware, uploadSingle, async (req, res) => {
  try {
    const payload = extractUserPayload(req);
    const userId = await createUserRecord(payload);

    res.status(201).json({
      statusCode: 201,
      message: {
        en: "User created successfully",
        th: "สร้างผู้ใช้สำเร็จ",
      },
      data: { id: userId },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to create user",
        th: "สร้างผู้ใช้ไม่สำเร็จ",
      },
    });
  }
});

router.patch("/", authMiddleware, uploadSingle, async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "User id is required",
          th: "กรุณาระบุรหัสผู้ใช้",
        },
      });
    }

    const payload = extractUserPayload(req);
    const updatedId = await updateUserRecord(id, payload);

    if (!updatedId) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "User not found",
          th: "ไม่พบผู้ใช้",
        },
      });
    }

    const detail = await getUserDetail(updatedId);

    res.json({
      statusCode: 200,
      message: {
        en: "User updated successfully",
        th: "แก้ไขผู้ใช้สำเร็จ",
      },
      data: detail?.data ?? null,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to update user",
        th: "แก้ไขผู้ใช้ไม่สำเร็จ",
      },
    });
  }
});

router.delete("/", authMiddleware, async (req, res) => {
  try {
    const idsParam = req.query.id;
    const ids = Array.isArray(idsParam)
      ? idsParam.map((value) => String(value))
      : idsParam
        ? [String(idsParam)]
        : [];

    if (!ids.length) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "User ids are required",
          th: "กรุณาเลือกรายการที่ต้องการลบ",
        },
      });
    }

    await deleteUsers(ids);

    res.json({
      statusCode: 200,
      message: {
        en: "User deleted successfully",
        th: "ลบผู้ใช้สำเร็จ",
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to delete user",
        th: "ลบผู้ใช้ไม่สำเร็จ",
      },
    });
  }
});

export default router;

