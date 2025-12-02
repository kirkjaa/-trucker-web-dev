import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import {
  deleteUsers,
  getUserDetail,
  updateUserRecord,
} from "../../services/user.service";
import { upload } from "../../utils/upload";
import { extractUserPayload } from "../utils/userPayload";

const router = Router();
const uploadSingle = upload.single("image");

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
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
    console.error("Admin get user error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load user detail",
        th: "ไม่สามารถดึงรายละเอียดผู้ใช้ได้",
      },
    });
  }
});

router.put("/:id", authMiddleware, uploadSingle, async (req, res) => {
  try {
    const { id } = req.params;
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
    console.error("Admin update user error:", error);
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
    console.error("Admin delete user error:", error);
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








