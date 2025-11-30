import { Router } from "express";

import { authMiddleware } from "../middleware/auth";
import {
  createTemplate,
  deleteTemplates,
  getTemplateById,
  getTemplateByOrganization,
  listTemplates,
  TemplatePayload,
  updateTemplate,
} from "../services/template.service";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page, limit, search, sort, order } = req.query;
    const result = await listTemplates({
      page: Number(page),
      limit: Number(limit),
      search: search ? String(search) : undefined,
      sort: sort ? String(sort) : undefined,
      order: order ? String(order) : undefined,
    });

    res.json({
      statusCode: 200,
      message: { en: "Fetched templates", th: "ดึงเทมเพลตสำเร็จ" },
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("List templates error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to fetch templates",
        th: "ไม่สามารถดึงข้อมูลเทมเพลตได้",
      },
    });
  }
});

router.get("/byId", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.query.id);
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: { en: "Template ID is required", th: "กรุณาระบุรหัสเทมเพลต" },
      });
    }

    const template = await getTemplateById(id);
    if (!template) {
      return res.status(404).json({
        statusCode: 404,
        message: { en: "Template not found", th: "ไม่พบเทมเพลต" },
      });
    }

    res.json({
      statusCode: 200,
      message: { en: "Fetched template", th: "ดึงรายละเอียดเทมเพลตสำเร็จ" },
      data: template,
    });
  } catch (error) {
    console.error("Get template error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to fetch template",
        th: "ไม่สามารถดึงรายละเอียดเทมเพลตได้",
      },
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const payload = req.body as TemplatePayload;
    const creatorId = req.user!.id;

    const templateId = await createTemplate(creatorId, payload);

    res.status(201).json({
      statusCode: 201,
      message: { en: "Template created", th: "สร้างเทมเพลตสำเร็จ" },
      data: { id: templateId },
    });
  } catch (error) {
    console.error("Create template error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message ?? "Failed to create template",
        th: "ไม่สามารถสร้างเทมเพลตได้",
      },
    });
  }
});

router.get("/byOrganization", authMiddleware, async (req, res) => {
  try {
    const { type, organization_id } = req.query;
    if (!type) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "Template type is required",
          th: "กรุณาระบุประเภทเทมเพลต",
        },
      });
    }

    const template = await getTemplateByOrganization(
      String(type),
      organization_id ? String(organization_id) : undefined
    );

    if (!template) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Template not found",
          th: "ไม่พบเทมเพลตของประเภทหรือองค์กรนี้",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: {
        en: "Fetched template",
        th: "ดึงเทมเพลตตามองค์กรสำเร็จ",
      },
      data: template,
    });
  } catch (error) {
    console.error("Get template by organization error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to fetch template",
        th: "ไม่สามารถดึงเทมเพลตได้",
      },
    });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.query.id);
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: { en: "Template ID is required", th: "กรุณาระบุรหัสเทมเพลต" },
      });
    }

    const payload = req.body as TemplatePayload;
    await updateTemplate(id, payload);

    res.json({
      statusCode: 200,
      message: { en: "Template updated", th: "อัปเดตเทมเพลตสำเร็จ" },
      data: { id },
    });
  } catch (error) {
    console.error("Update template error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message ?? "Failed to update template",
        th: "ไม่สามารถอัปเดตเทมเพลตได้",
      },
    });
  }
});

router.delete("/", authMiddleware, async (req, res) => {
  try {
    const rawIds = req.query.id;
    if (!rawIds) {
      return res.status(400).json({
        statusCode: 400,
        message: { en: "Template ID is required", th: "กรุณาระบุรหัสเทมเพลต" },
      });
    }

    const ids = Array.isArray(rawIds)
      ? rawIds.map((value) => Number(value))
      : [Number(rawIds)];

    const filteredIds = ids.filter((value) => !Number.isNaN(value));
    if (!filteredIds.length) {
      return res.status(400).json({
        statusCode: 400,
        message: { en: "Invalid template IDs", th: "รหัสเทมเพลตไม่ถูกต้อง" },
      });
    }

    await deleteTemplates(filteredIds);

    res.json({
      statusCode: 200,
      message: { en: "Template deleted", th: "ลบเทมเพลตสำเร็จ" },
    });
  } catch (error) {
    console.error("Delete template error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message ?? "Failed to delete template",
        th: "ไม่สามารถลบเทมเพลตได้",
      },
    });
  }
});

export default router;

