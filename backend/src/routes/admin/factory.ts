import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import {
  createOrganization,
  deleteOrganizations,
  getOrganizationDetail,
  listOrganizations,
  organizationMessages,
  updateOrganization,
} from "../../services/organization.service";
import { upload } from "../../utils/upload";
import { extractOrganizationPayload } from "../utils/organizationPayload";

const router = Router();

const uploadFields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "documents", maxCount: 20 },
]);

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page, limit, search, sort, order } = req.query;
    const result = await listOrganizations({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      sort: sort ? String(sort) : undefined,
      order: order ? String(order) : undefined,
      typeId: 1,
    });

    res.json({
      statusCode: 200,
      message: result.message,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("List factories error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load factories",
        th: "ไม่สามารถดึงข้อมูลโรงงานได้",
      },
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getOrganizationDetail(id);

    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Factory not found",
          th: "ไม่พบโรงงาน",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Get factory error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load factory detail",
        th: "ไม่สามารถดึงรายละเอียดโรงงานได้",
      },
    });
  }
});

router.post("/", authMiddleware, uploadFields, async (req, res) => {
  try {
    const payload = extractOrganizationPayload(req, 1);
    const organizationId = await createOrganization(payload);
    res.status(201).json({
      statusCode: 201,
      message: organizationMessages.SUCCESS_CREATE,
      data: {
        id: organizationId,
      },
    });
  } catch (error) {
    console.error("Create factory error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to create factory",
        th: "สร้างโรงงานไม่สำเร็จ",
      },
    });
  }
});

router.put("/:id", authMiddleware, uploadFields, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = extractOrganizationPayload(req, 1);
    const updatedId = await updateOrganization(id, payload);

    if (!updatedId) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Factory not found",
          th: "ไม่พบโรงงาน",
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
    console.error("Update factory error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to update factory",
        th: "แก้ไขข้อมูลโรงงานไม่สำเร็จ",
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
          en: "Factory ids are required",
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
    console.error("Delete factory error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to delete factory",
        th: "ลบโรงงานไม่สำเร็จ",
      },
    });
  }
});

export default router;
