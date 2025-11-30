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
      typeId: 2,
    });

    res.json({
      statusCode: 200,
      message: result.message,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("List companies error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load companies",
        th: "ไม่สามารถดึงข้อมูลบริษัทได้",
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
          en: "Company not found",
          th: "ไม่พบบริษัท",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load company detail",
        th: "ไม่สามารถดึงรายละเอียดบริษัทได้",
      },
    });
  }
});

router.post("/", authMiddleware, uploadFields, async (req, res) => {
  try {
    const payload = extractOrganizationPayload(req, 2);
    const organizationId = await createOrganization(payload);
    res.status(201).json({
      statusCode: 201,
      message: organizationMessages.SUCCESS_CREATE,
      data: {
        id: organizationId,
      },
    });
  } catch (error) {
    console.error("Create company error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to create company",
        th: "สร้างบริษัทไม่สำเร็จ",
      },
    });
  }
});

router.put("/:id", authMiddleware, uploadFields, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = extractOrganizationPayload(req, 2);
    const updatedId = await updateOrganization(id, payload);

    if (!updatedId) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Company not found",
          th: "ไม่พบบริษัท",
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
    console.error("Update company error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to update company",
        th: "แก้ไขข้อมูลบริษัทไม่สำเร็จ",
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
          en: "Company ids are required",
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
    console.error("Delete company error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to delete company",
        th: "ลบบริษัทไม่สำเร็จ",
      },
    });
  }
});

export default router;

