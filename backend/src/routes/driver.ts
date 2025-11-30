import { Router } from "express";

import { authMiddleware } from "../middleware/auth";
import {
  createInternalDriver,
  deleteDriver,
  getDriverDetail,
  listInternalDrivers,
  updateInternalDriver,
} from "../services/driver.service";
import { upload } from "../utils/upload";
import { extractUserPayload } from "./utils/userPayload";

const router = Router();
const uploadSingle = upload.single("image");

router.get("/internal", authMiddleware, async (req, res) => {
  try {
    const { page, limit, organization_id, status, search, sort, order } =
      req.query;
    const result = await listInternalDrivers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      organizationId: organization_id ? String(organization_id) : undefined,
      status: status ? String(status) : undefined,
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
    console.error("List internal drivers error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load drivers",
        th: "ไม่สามารถดึงข้อมูลพนักงานขับรถได้",
      },
    });
  }
});

router.post("/internal", authMiddleware, uploadSingle, async (req, res) => {
  try {
    const payload = extractUserPayload(req);
    const driverId = await createInternalDriver(payload);

    res.status(201).json({
      statusCode: 201,
      message: {
        en: "Driver created successfully",
        th: "สร้างพนักงานขับรถภายในสำเร็จ",
      },
      data: { id: driverId },
    });
  } catch (error) {
    console.error("Create internal driver error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to create driver",
        th: "สร้างพนักงานขับรถไม่สำเร็จ",
      },
    });
  }
});

router.patch("/internal", authMiddleware, uploadSingle, async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "Driver id is required",
          th: "กรุณาระบุรหัสพนักงานขับรถ",
        },
      });
    }

    const payload = extractUserPayload(req);
    const updatedId = await updateInternalDriver(id, payload);

    if (!updatedId) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Driver not found",
          th: "ไม่พบพนักงานขับรถ",
        },
      });
    }

    const detail = await getDriverDetail(updatedId);

    res.json({
      statusCode: 200,
      message: {
        en: "Driver updated successfully",
        th: "แก้ไขข้อมูลพนักงานขับรถสำเร็จ",
      },
      data: detail ?? null,
    });
  } catch (error) {
    console.error("Update internal driver error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to update driver",
        th: "แก้ไขข้อมูลพนักงานขับรถไม่สำเร็จ",
      },
    });
  }
});

router.delete("/internal", authMiddleware, async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "Driver id is required",
          th: "กรุณาระบุรหัสพนักงานขับรถ",
        },
      });
    }

    const success = await deleteDriver(id);
    if (!success) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Driver not found",
          th: "ไม่พบพนักงานขับรถ",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: {
        en: "Driver deleted successfully",
        th: "ลบพนักงานขับรถสำเร็จ",
      },
    });
  } catch (error) {
    console.error("Delete internal driver error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to delete driver",
        th: "ลบพนักงานขับรถไม่สำเร็จ",
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
          en: "Driver id is required",
          th: "กรุณาระบุรหัสพนักงานขับรถ",
        },
      });
    }

    const driver = await getDriverDetail(id);
    if (!driver) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Driver not found",
          th: "ไม่พบพนักงานขับรถ",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: {
        en: "Fetched driver successfully",
        th: "ดึงข้อมูลพนักงานขับรถสำเร็จ",
      },
      data: driver,
    });
  } catch (error) {
    console.error("Get driver detail error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load driver detail",
        th: "ไม่สามารถดึงรายละเอียดพนักงานขับรถได้",
      },
    });
  }
});

export default router;

