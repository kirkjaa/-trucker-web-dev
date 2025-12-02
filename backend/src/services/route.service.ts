import { query, queryOne } from "../db";

type FreightType = "DOMESTIC" | "INTERNATIONAL";
export type RouteStatus = "PENDING" | "APPROVED" | "REJECTED";

const ROUTE_SORT_MAP: Record<string, string> = {
  display_code: "mr.display_code",
  organization_route_code: "fr.route_factory_code",
  organization: "org.name",
  distance_value: "fr.distance_value",
  status: "fr.status",
  created_at: "fr.created_at",
};

const STATUS_DB_TO_API: Record<string, RouteStatus> = {
  pending: "PENDING",
  confirmed: "APPROVED",
  rejected: "REJECTED",
};

const STATUS_API_TO_DB: Record<RouteStatus, string> = {
  PENDING: "pending",
  APPROVED: "confirmed",
  REJECTED: "rejected",
};

const FREIGHT_TYPE_CONFIG: Record<
  FreightType,
  { shippingType: string; routeType: string }
> = {
  DOMESTIC: { shippingType: "landFreight", routeType: "oneWay" },
  INTERNATIONAL: { shippingType: "seaFreight", routeType: "abroad" },
};

export const routeMessages = {
  SUCCESS_LIST: {
    en: "Fetched routes successfully",
    th: "ดึงข้อมูลเส้นทางสำเร็จ",
  },
  SUCCESS_CREATE: {
    en: "Route created successfully",
    th: "สร้างเส้นทางสำเร็จ",
  },
  SUCCESS_UPDATE: {
    en: "Route status updated successfully",
    th: "อัปเดตสถานะเส้นทางสำเร็จ",
  },
};

interface RouteListParams {
  page?: number;
  limit?: number;
  freightType?: FreightType;
  status?: RouteStatus;
  search?: string;
  sort?: string;
  order?: string;
}

export interface CreateRoutePayload {
  freightType: FreightType;
  routeCode: string;
  distance: number;
  originProvinceId: number;
  originDistrictId: number;
  originLatitude: number;
  originLongitude: number;
  destinationProvinceId: number;
  destinationDistrictId: number;
  destinationLatitude: number;
  destinationLongitude: number;
  returnPointProvinceId?: number | null;
  returnPointDistrictId?: number | null;
  returnPointLatitude?: number | null;
  returnPointLongitude?: number | null;
}

interface RouteRow {
  id: string;
  route_factory_code: string;
  display_code: string | null;
  distance_value: number | null;
  distance_unit: string | null;
  status: string;
  shipping_type: string | null;
  type: string | null;
  reject_reason: string | null;
  org_id: string;
  org_display_code: string;
  org_name: string;
  org_dial_code: string | null;
  org_phone: string | null;
  org_email: string | null;
  master_route_id: string;
  master_route_code: string;
  origin_province: string | null;
  origin_district: string | null;
  origin_latitude: string | null;
  origin_longitude: string | null;
  destination_province: string | null;
  destination_district: string | null;
  destination_latitude: string | null;
  destination_longitude: string | null;
  return_point_province: string | null;
  return_point_district: string | null;
  return_point_latitude: string | null;
  return_point_longitude: string | null;
  total_count?: string;
}

interface ProvinceRow {
  id: number;
  name_th: string;
  name_en: string | null;
}

interface DistrictRow {
  id: number;
  name_th: string;
  name_en: string | null;
}

function buildMeta(page: number, limit: number, total: number) {
  const totalPages = limit === 0 ? 0 : Math.ceil(total / limit);
  return { page, limit, totalPages, total };
}

function mapRouteStatusFromDb(status: string) {
  return STATUS_DB_TO_API[status] ?? "PENDING";
}

function mapFreightTypeFromRow(row: RouteRow): FreightType {
  if (row.type === "abroad" || row.shipping_type === "seaFreight") {
    return "INTERNATIONAL";
  }
  return "DOMESTIC";
}

function mapRouteRow(row: RouteRow) {
  return {
    id: row.id,
    freight_type: mapFreightTypeFromRow(row),
    organization_route_code: row.route_factory_code,
    distance_value: row.distance_value?.toString() ?? "0",
    distance_unit: row.distance_unit?.toUpperCase() ?? "KM",
    status: mapRouteStatusFromDb(row.status),
    reject_reason: row.reject_reason,
    organization: {
      id: row.org_id,
      display_code: row.org_display_code,
      name: row.org_name,
      dial_code: row.org_dial_code,
      phone: row.org_phone,
      email: row.org_email,
    },
    master_route: {
      id: row.master_route_id,
      code: row.master_route_code,
      origin_province: {
        id: null,
        name_th: row.origin_province,
        name_en: row.origin_province,
      },
      origin_district: {
        id: null,
        name_th: row.origin_district,
        name_en: row.origin_district,
      },
      origin_latitude: row.origin_latitude,
      origin_longitude: row.origin_longitude,
      destination_province: {
        id: null,
        name_th: row.destination_province,
        name_en: row.destination_province,
      },
      destination_district: {
        id: null,
        name_th: row.destination_district,
        name_en: row.destination_district,
      },
      destination_latitude: row.destination_latitude,
      destination_longitude: row.destination_longitude,
      return_point_province: row.return_point_province
        ? {
            id: null,
            name_th: row.return_point_province,
            name_en: row.return_point_province,
          }
        : null,
      return_point_district: row.return_point_district
        ? {
            id: null,
            name_th: row.return_point_district,
            name_en: row.return_point_district,
          }
        : null,
      return_point_latitude: row.return_point_latitude,
      return_point_longitude: row.return_point_longitude,
    },
  };
}

function buildOrderClause(sort?: string, order?: string) {
  const direction = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const column =
    ROUTE_SORT_MAP[sort ?? "created_at"] ?? ROUTE_SORT_MAP.created_at;
  return `${column} ${direction}`;
}

function buildFreightFilter(freightType?: FreightType) {
  if (!freightType) {
    return "";
  }
  if (freightType === "INTERNATIONAL") {
    return "(fr.type = 'abroad')";
  }
  return "(fr.type <> 'abroad')";
}

export async function listRoutes(params: RouteListParams) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
  const offset = (page - 1) * limit;
  const where: string[] = ["fr.deleted = false"];
  const values: any[] = [];
  let valueIndex = 1;

  const freightFilter = buildFreightFilter(params.freightType);
  if (freightFilter) {
    where.push(freightFilter);
  }

  if (params.search) {
    where.push(
      `(fr.route_factory_code ILIKE $${valueIndex} OR org.name ILIKE $${valueIndex} OR mr.origin_province ILIKE $${valueIndex} OR mr.destination_province ILIKE $${valueIndex})`
    );
    values.push(`%${params.search.trim()}%`);
    valueIndex += 1;
  }

  const sql = `
    SELECT
      fr.id,
      fr.route_factory_code,
      fr.display_code,
      fr.distance_value,
      fr.distance_unit,
      fr.status,
      fr.shipping_type,
      fr.type,
      NULL::text AS reject_reason,
      org.id AS org_id,
      org.display_code AS org_display_code,
      org.name AS org_name,
      org.dial_code AS org_dial_code,
      org.phone AS org_phone,
      org.email AS org_email,
      mr.id AS master_route_id,
      mr.display_code AS master_route_code,
      mr.origin_province,
      mr.origin_district,
      mr.origin_latitude::text,
      mr.origin_longitude::text,
      mr.destination_province,
      mr.destination_district,
      mr.destination_latitude::text,
      mr.destination_longitude::text,
      mr.return_point_province,
      mr.return_point_district,
      mr.return_point_latitude::text,
      mr.return_point_longitude::text,
      COUNT(*) OVER() AS total_count
    FROM factory_routes fr
    JOIN organizations org ON fr.factory_id = org.id
    JOIN master_routes mr ON fr.master_route_id = mr.id
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${buildOrderClause(params.sort, params.order)}
    LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
  `;

  values.push(limit, offset);

  const rows = await query<RouteRow>(sql, values);
  const total = rows.length ? Number(rows[0].total_count ?? 0) : 0;

  return {
    data: rows.map(mapRouteRow),
    meta: buildMeta(page, limit, total),
    message: routeMessages.SUCCESS_LIST,
  };
}

export async function listRoutesByStatus(params: RouteListParams) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
  const offset = (page - 1) * limit;
  const where: string[] = ["fr.deleted = false"];
  const values: any[] = [];
  let valueIndex = 1;

  const freightFilter = buildFreightFilter(params.freightType);
  if (freightFilter) {
    where.push(freightFilter);
  }

  if (params.status) {
    where.push(`fr.status = $${valueIndex++}`);
    values.push(STATUS_API_TO_DB[params.status] ?? "pending");
  }

  if (params.search) {
    where.push(
      `(fr.route_factory_code ILIKE $${valueIndex} OR org.name ILIKE $${valueIndex} OR mr.origin_province ILIKE $${valueIndex} OR mr.destination_province ILIKE $${valueIndex})`
    );
    values.push(`%${params.search.trim()}%`);
    valueIndex += 1;
  }

  const sql = `
    SELECT
      fr.id,
      fr.route_factory_code,
      fr.display_code,
      fr.distance_value,
      fr.distance_unit,
      fr.status,
      fr.shipping_type,
      fr.type,
      NULL::text AS reject_reason,
      org.id AS org_id,
      org.display_code AS org_display_code,
      org.name AS org_name,
      org.dial_code AS org_dial_code,
      org.phone AS org_phone,
      org.email AS org_email,
      mr.id AS master_route_id,
      mr.display_code AS master_route_code,
      mr.origin_province,
      mr.origin_district,
      mr.origin_latitude::text,
      mr.origin_longitude::text,
      mr.destination_province,
      mr.destination_district,
      mr.destination_latitude::text,
      mr.destination_longitude::text,
      mr.return_point_province,
      mr.return_point_district,
      mr.return_point_latitude::text,
      mr.return_point_longitude::text,
      COUNT(*) OVER() AS total_count
    FROM factory_routes fr
    JOIN organizations org ON fr.factory_id = org.id
    JOIN master_routes mr ON fr.master_route_id = mr.id
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${buildOrderClause(params.sort, params.order)}
    LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
  `;

  values.push(limit, offset);

  const rows = await query<RouteRow>(sql, values);
  const total = rows.length ? Number(rows[0].total_count ?? 0) : 0;

  return {
    data: rows.map(mapRouteRow),
    meta: buildMeta(page, limit, total),
    message: routeMessages.SUCCESS_LIST,
  };
}

export async function createRoute(
  organizationId: string,
  payload: CreateRoutePayload
) {
  const organization = await queryOne<{ id: string }>(
    `
      SELECT id
      FROM organizations
      WHERE id = $1 AND deleted = false
    `,
    [organizationId]
  );

  if (!organization) {
    throw new Error("Organization not found");
  }

  const config = FREIGHT_TYPE_CONFIG[payload.freightType];
  if (!config) {
    throw new Error("Invalid freight type");
  }

  const originProvince = await getProvince(payload.originProvinceId);
  const originDistrict = await getDistrict(payload.originDistrictId);
  const destinationProvince = await getProvince(payload.destinationProvinceId);
  const destinationDistrict = await getDistrict(payload.destinationDistrictId);
  const returnProvince = payload.returnPointProvinceId
    ? await getProvince(payload.returnPointProvinceId)
    : null;
  const returnDistrict = payload.returnPointDistrictId
    ? await getDistrict(payload.returnPointDistrictId)
    : null;

  await query("BEGIN");
  try {
    const masterRoute = await queryOne<{ id: string }>(
      `
        INSERT INTO master_routes (
          display_code,
          origin_province,
          origin_district,
          origin_latitude,
          origin_longitude,
          destination_province,
          destination_district,
          destination_latitude,
          destination_longitude,
          return_point_province,
          return_point_district,
          return_point_latitude,
          return_point_longitude,
          distance_value
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        RETURNING id
      `,
      [
        generateMasterRouteCode(),
        originProvince.name_th,
        originDistrict.name_th,
        payload.originLatitude,
        payload.originLongitude,
        destinationProvince.name_th,
        destinationDistrict.name_th,
        payload.destinationLatitude,
        payload.destinationLongitude,
        returnProvince?.name_th ?? null,
        returnDistrict?.name_th ?? null,
        payload.returnPointLatitude ?? null,
        payload.returnPointLongitude ?? null,
        payload.distance,
      ]
    );

    const factoryRoute = await queryOne<{ id: string }>(
      `
        INSERT INTO factory_routes (
          factory_id,
          master_route_id,
          route_factory_code,
          shipping_type,
          type,
          distance_value,
          distance_unit,
          status,
          unit,
          display_code
        ) VALUES ($1,$2,$3,$4,$5,$6,'km','pending','trip',$7)
        RETURNING id
      `,
      [
        organizationId,
        masterRoute?.id,
        payload.routeCode,
        config.shippingType,
        config.routeType,
        payload.distance,
        generateFactoryRouteCode(),
      ]
    );

    await query("COMMIT");
    return factoryRoute?.id ?? null;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

export async function updateRouteStatus(id: string, status: RouteStatus) {
  const dbStatus = STATUS_API_TO_DB[status];
  if (!dbStatus) {
    throw new Error("Invalid status");
  }

  const result = await queryOne<{ id: string }>(
    `
      UPDATE factory_routes
      SET status = $1,
          updated_at = NOW()
      WHERE id = $2 AND deleted = false
      RETURNING id
    `,
    [dbStatus, id]
  );

  return result?.id ?? null;
}

async function getProvince(id: number) {
  const province = await queryOne<ProvinceRow>(
    "SELECT id, name_th, name_en FROM provinces WHERE id = $1",
    [id]
  );

  if (!province) {
    throw new Error("Province not found");
  }

  return province;
}

async function getDistrict(id: number) {
  const district = await queryOne<DistrictRow>(
    "SELECT id, name_th, name_en FROM districts WHERE id = $1",
    [id]
  );

  if (!district) {
    throw new Error("District not found");
  }

  return district;
}

function generateMasterRouteCode() {
  return `MR-${Date.now().toString(36).toUpperCase()}`;
}

function generateFactoryRouteCode() {
  return `FR-${Date.now().toString(36).toUpperCase()}`;
}
