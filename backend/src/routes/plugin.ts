import { Router } from "express";

import { authMiddleware } from "../middleware/auth";
import {
  createPlugin,
  deletePlugins,
  getPluginById,
  listPlugins,
  PluginPayload,
  updatePlugin,
} from "../services/plugin.service";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page, limit, search, sort, order } = req.query;
    const result = await listPlugins({
      page: Number(page),
      limit: Number(limit),
      search: search ? String(search) : undefined,
      sort: sort ? String(sort) : undefined,
      order: order ? String(order) : undefined,
    });

    res.json({
      statusCode: 200,
      message: { en: "Fetched plugins", th: "ดึงข้อมูลปลั๊กอินสำเร็จ" },
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("List plugins error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to fetch plugins",
        th: "ไม่สามารถดึงข้อมูลปลั๊กอินได้",
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
        message: { en: "Plugin ID is required", th: "กรุณาระบุรหัสปลั๊กอิน" },
      });
    }

    const plugin = await getPluginById(id);
    if (!plugin) {
      return res.status(404).json({
        statusCode: 404,
        message: { en: "Plugin not found", th: "ไม่พบข้อมูลปลั๊กอิน" },
      });
    }

    res.json({
      statusCode: 200,
      message: {
        en: "Fetched plugin detail",
        th: "ดึงรายละเอียดปลั๊กอินสำเร็จ",
      },
      data: plugin,
    });
  } catch (error) {
    console.error("Get plugin error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to fetch plugin",
        th: "ไม่สามารถดึงรายละเอียดปลั๊กอินได้",
      },
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const payload = req.body as PluginPayload;
    const creatorId = req.user!.id;

    const pluginId = await createPlugin(creatorId, payload);

    res.status(201).json({
      statusCode: 201,
      message: { en: "Plugin created", th: "สร้างปลั๊กอินสำเร็จ" },
      data: { id: pluginId },
    });
  } catch (error) {
    console.error("Create plugin error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message ?? "Failed to create plugin",
        th: "ไม่สามารถสร้างปลั๊กอินได้",
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
        message: { en: "Plugin ID is required", th: "กรุณาระบุรหัสปลั๊กอิน" },
      });
    }

    const payload = req.body as PluginPayload;
    await updatePlugin(id, payload);

    res.json({
      statusCode: 200,
      message: { en: "Plugin updated", th: "อัปเดตปลั๊กอินสำเร็จ" },
      data: { id },
    });
  } catch (error) {
    console.error("Update plugin error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message ?? "Failed to update plugin",
        th: "ไม่สามารถอัปเดตปลั๊กอินได้",
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
        message: { en: "Plugin ID is required", th: "กรุณาระบุรหัสปลั๊กอิน" },
      });
    }

    const ids = Array.isArray(rawIds)
      ? rawIds.map((value) => Number(value))
      : [Number(rawIds)];

    const filteredIds = ids.filter((value) => !Number.isNaN(value));
    if (!filteredIds.length) {
      return res.status(400).json({
        statusCode: 400,
        message: { en: "Invalid plugin IDs", th: "รหัสปลั๊กอินไม่ถูกต้อง" },
      });
    }

    await deletePlugins(filteredIds);

    res.json({
      statusCode: 200,
      message: { en: "Plugin deleted", th: "ลบปลั๊กอินสำเร็จ" },
    });
  } catch (error) {
    console.error("Delete plugin error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message ?? "Failed to delete plugin",
        th: "ไม่สามารถลบปลั๊กอินได้",
      },
    });
  }
});

export default router;

