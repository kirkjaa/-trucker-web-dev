import { Router } from "express";

import { authMiddleware } from "../middleware/auth";
import {
  createRoute,
  CreateRoutePayload,
  listRoutes,
  listRoutesByStatus,
  routeMessages,
  RouteStatus,
  updateRouteStatus,
} from "../services/route.service";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page, limit, freight_type, search, sort, order } = req.query;
    const result = await listRoutes({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      freightType: freight_type
        ? String(freight_type).toUpperCase() === "INTERNATIONAL"
          ? "INTERNATIONAL"
          : "DOMESTIC"
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
    console.error("List routes error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load routes",
        th: "ไม่สามารถดึงข้อมูลเส้นทางได้",
      },
    });
  }
});

router.get("/byStatus", authMiddleware, async (req, res) => {
  try {
    const { page, limit, freight_type, status, search, sort, order } =
      req.query;
    const result = await listRoutesByStatus({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      freightType: freight_type
        ? String(freight_type).toUpperCase() === "INTERNATIONAL"
          ? "INTERNATIONAL"
          : "DOMESTIC"
        : undefined,
      status: normalizeStatus(status ? String(status) : undefined),
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
    console.error("List routes by status error:", error);
    res.status(500).json({
      statusCode: 500,
      message: {
        en: "Failed to load routes",
        th: "ไม่สามารถดึงข้อมูลเส้นทางได้",
      },
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const organizationId = req.query.organization_id as string;
    if (!organizationId) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "Organization id is required",
          th: "กรุณาเลือกโรงงาน",
        },
      });
    }

    const payload = extractCreateRoutePayload(req.body);
    const routeId = await createRoute(organizationId, payload);

    res.status(201).json({
      statusCode: 201,
      message: routeMessages.SUCCESS_CREATE,
      data: { id: routeId },
    });
  } catch (error) {
    console.error("Create route error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to create route",
        th: "สร้างเส้นทางไม่สำเร็จ",
      },
    });
  }
});

router.patch("/status", authMiddleware, async (req, res) => {
  try {
    const id = req.query.id as string;
    const status = normalizeStatus(req.body?.status);

    if (!id || !status) {
      return res.status(400).json({
        statusCode: 400,
        message: {
          en: "Route id and status are required",
          th: "กรุณาระบุรหัสเส้นทางและสถานะ",
        },
      });
    }

    const updatedId = await updateRouteStatus(id, status);
    if (!updatedId) {
      return res.status(404).json({
        statusCode: 404,
        message: {
          en: "Route not found",
          th: "ไม่พบเส้นทาง",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: routeMessages.SUCCESS_UPDATE,
    });
  } catch (error) {
    console.error("Update route status error:", error);
    res.status(400).json({
      statusCode: 400,
      message: {
        en: (error as Error).message || "Failed to update route status",
        th: "อัปเดตสถานะเส้นทางไม่สำเร็จ",
      },
    });
  }
});

function extractCreateRoutePayload(body: any): CreateRoutePayload {
  const freightType =
    String(body.freight_type || "DOMESTIC").toUpperCase() === "INTERNATIONAL"
      ? "INTERNATIONAL"
      : "DOMESTIC";

  const distance = Number(body.distance);
  if (Number.isNaN(distance)) {
    throw new Error("Distance is invalid");
  }

  const payload: CreateRoutePayload = {
    freightType,
    routeCode: requireString(body.route_code, "route_code"),
    distance,
    originProvinceId: requireNumericId(
      body.origin_province_id,
      "origin_province_id"
    ),
    originDistrictId: requireNumericId(
      body.origin_district_id,
      "origin_district_id"
    ),
    originLatitude: requireNumber(body.origin_latitude, "origin_latitude"),
    originLongitude: requireNumber(body.origin_longitude, "origin_longitude"),
    destinationProvinceId: requireNumericId(
      body.destination_province_id,
      "destination_province_id"
    ),
    destinationDistrictId: requireNumericId(
      body.destination_district_id,
      "destination_district_id"
    ),
    destinationLatitude: requireNumber(
      body.destination_latitude,
      "destination_latitude"
    ),
    destinationLongitude: requireNumber(
      body.destination_longitude,
      "destination_longitude"
    ),
  };

  if (body.return_point_province_id) {
    payload.returnPointProvinceId = requireNumericId(
      body.return_point_province_id,
      "return_point_province_id"
    );
  }
  if (body.return_point_district_id) {
    payload.returnPointDistrictId = requireNumericId(
      body.return_point_district_id,
      "return_point_district_id"
    );
  }
  if (body.return_point_latitude) {
    payload.returnPointLatitude = requireNumber(
      body.return_point_latitude,
      "return_point_latitude"
    );
  }
  if (body.return_point_longitude) {
    payload.returnPointLongitude = requireNumber(
      body.return_point_longitude,
      "return_point_longitude"
    );
  }

  return payload;
}

function requireString(value: any, field: string) {
  if (!value || typeof value !== "string") {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

function requireNumber(value: any, field: string) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${field} is invalid`);
  }
  return parsed;
}

function requireNumericId(value: any, field: string) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${field} is invalid`);
  }
  return parsed;
}

function normalizeStatus(value?: string | null): RouteStatus | undefined {
  if (!value) {
    return undefined;
  }
  const upper = value.toUpperCase();
  if (upper === "PENDING" || upper === "APPROVED" || upper === "REJECTED") {
    return upper as RouteStatus;
  }
  return undefined;
}

export default router;
