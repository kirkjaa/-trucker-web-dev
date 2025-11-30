import { Router } from "express";

import { authMiddleware } from "../middleware/auth";
import {
  createOrganization,
  deleteOrganizations,
  getOrganizationDetail,
  listOrganizations,
  organizationMessages,
  updateOrganization,
} from "../services/organization.service";
import { upload } from "../utils/upload";
import { extractOrganizationPayload } from "./utils/organizationPayload";

const router = Router();

const uploadFields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "documents", maxCount: 20 },
]);

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page, limit, typeId, search, sort, order } = req.query;
    const result = await listOrganizations({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      typeId: typeId ? Number(typeId) : undefined,
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
    console.error("List organizations error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load organizations",
        th: "ไม่สามารถดึงข้อมูลองค์กรได้",
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
          en: "Organization id is required",
          th: "กรุณาระบุรหัสองค์กร",
        },
      });
    }

    const result = await getOrganizationDetail(id);
    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Organization not found",
          th: "ไม่พบบริษัทหรือโรงงาน",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Get organization error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load organization detail",
        th: "ไม่สามารถดึงรายละเอียดองค์กรได้",
      },
    });
  }
});

router.post("/", authMiddleware, uploadFields, async (req, res) => {
  try {
    const payload = extractOrganizationPayload(req);
    const organizationId = await createOrganization(payload);
    res.status(201).json({
      statusCode: 201,
      message: organizationMessages.SUCCESS_CREATE,
      data: {
        id: organizationId,
      },
    });
  } catch (error) {
    console.error("Create organization error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to create organization",
        th: "สร้างองค์กรไม่สำเร็จ",
      },
    });
  }
});

router.patch("/", authMiddleware, uploadFields, async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "Organization id is required",
          th: "กรุณาระบุรหัสองค์กร",
        },
      });
    }

    const payload = extractOrganizationPayload(req);
    const updatedId = await updateOrganization(id, payload);

    if (!updatedId) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Organization not found",
          th: "ไม่พบบริษัทหรือโรงงาน",
        },
      });
    }

    const detail = await getOrganizationDetail(updatedId);

    res.json({
      statusCode: 200,
      message: organizationMessages.SUCCESS_UPDATE,
      data: detail?.data ?? null,
    });
  } catch (error) {
    console.error("Update organization error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to update organization",
        th: "แก้ไของค์กรไม่สำเร็จ",
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
          en: "Organization ids are required",
          th: "กรุณาเลือกรายการที่ต้องการลบ",
        },
      });
    }

    await deleteOrganizations(ids);

    res.json({
      statusCode: 200,
      message: organizationMessages.SUCCESS_DELETE,
    });
  } catch (error) {
    console.error("Delete organization error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to delete organization",
        th: "ลบองค์กรไม่สำเร็จ",
      },
    });
  }
});

export default router;

