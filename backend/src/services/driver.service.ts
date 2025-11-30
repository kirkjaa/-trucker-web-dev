import { query, queryOne } from "../db";
import { createUserRecord, updateUserRecord } from "./user.service";

const DRIVER_SORT_MAP: Record<string, string> = {
  display_code: "d.display_code",
  name: "u.first_name",
  username: "u.username",
  phone: "u.phone",
  email: "u.email",
  created_at: "d.created_at",
};

type DriverTypeFilter = "internal" | "freelance";

interface DriverListParams {
  page?: number;
  limit?: number;
  organizationId?: string;
  status?: string;
  search?: string;
  sort?: string;
  order?: string;
}

interface DriverRow {
  driver_id: string;
  display_code: string;
  status: string;
  type: string;
  id_card_image_url: string | null;
  vehicle_registration_image_url: string | null;
  vehicle_license_image_url: string | null;
  trucker_id: string | null;
  user_id: string;
  user_display_code: string;
  username: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  dial_code: string | null;
  phone: string | null;
  user_image_url: string | null;
  user_status: string | null;
  org_id: string | null;
  org_display_code: string | null;
  org_name: string | null;
  org_phone: string | null;
  org_email: string | null;
  truck_id: string | null;
  truck_vin: string | null;
  truck_license_plate_value: string | null;
  truck_document_url: string | null;
  total_count?: string;
}

export interface DriverPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  organizationId: string;
  dialCode?: string;
  imagePath?: string | null;
}

function generateDriverDisplayCode() {
  return `DRV-${Date.now().toString(36).toUpperCase()}`;
}

function buildMeta(page: number, limit: number, total: number) {
  const totalPages = limit === 0 ? 0 : Math.ceil(total / limit);
  return { page, limit, totalPages, total };
}

function mapDriverRow(row: DriverRow) {
  return {
    id: row.driver_id,
    display_code: row.display_code,
    driver_status: row.status,
    type: row.type,
    image_id_card_url: row.id_card_image_url,
    image_truck_registration_url: row.vehicle_registration_image_url,
    image_driving_license_card_url: row.vehicle_license_image_url,
    user: {
      id: row.user_id,
      display_code: row.user_display_code,
      username: row.username,
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      dial_code: row.dial_code,
      phone: row.phone,
      image_url: row.user_image_url,
      status: row.user_status,
      organization: row.org_id
        ? {
            id: row.org_id,
            display_code: row.org_display_code,
            name: row.org_name,
            phone: row.org_phone,
            email: row.org_email,
          }
        : null,
    },
    truck: row.truck_id
      ? {
          id: row.truck_id,
          vin: row.truck_vin,
          license_plate_value: row.truck_license_plate_value,
          image_truck_document_url: row.truck_document_url,
        }
      : null,
  };
}

function buildDriverWhereClauses(
  type: DriverTypeFilter,
  params: DriverListParams
) {
  const where: string[] = ["d.deleted = false", "u.deleted = false"];
  const values: any[] = [];
  let valueIndex = 1;

  where.push(`d.type = $${valueIndex++}`);
  values.push(type);

  if (params.organizationId) {
    where.push(`u.organization_id = $${valueIndex++}`);
    values.push(params.organizationId);
  }

  if (params.status) {
    where.push(`d.status = $${valueIndex++}`);
    values.push(params.status);
  }

  if (params.search) {
    where.push(
      `(d.display_code ILIKE $${valueIndex} OR u.first_name ILIKE $${valueIndex} OR u.last_name ILIKE $${valueIndex} OR u.username ILIKE $${valueIndex})`
    );
    values.push(`%${params.search}%`);
    valueIndex += 1;
  }

  return { where, values, valueIndex };
}

async function queryDrivers(
  type: DriverTypeFilter,
  params: DriverListParams
) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
  const offset = (page - 1) * limit;
  const order = params.order?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const sortColumn =
    DRIVER_SORT_MAP[params.sort ?? "created_at"] ?? DRIVER_SORT_MAP.created_at;

  const { where, values, valueIndex } = buildDriverWhereClauses(type, params);

  const sql = `
    SELECT
      d.id AS driver_id,
      d.display_code,
      d.status,
      d.type,
      d.id_card_image_url,
      d.vehicle_registration_image_url,
      d.vehicle_license_image_url,
      d.trucker_id,
      u.id AS user_id,
      u.display_code AS user_display_code,
      u.username,
      u.email,
      u.first_name,
      u.last_name,
      u.dial_code,
      u.phone,
      u.image_url AS user_image_url,
      u.status AS user_status,
      o.id AS org_id,
      o.display_code AS org_display_code,
      o.name AS org_name,
      o.phone AS org_phone,
      o.email AS org_email,
      t.id AS truck_id,
      t.vin AS truck_vin,
      t.license_plate_value AS truck_license_plate_value,
      t.document_urls[1] AS truck_document_url,
      COUNT(*) OVER() AS total_count
    FROM drivers d
    JOIN users u ON d.user_id = u.id
    LEFT JOIN organizations o ON u.organization_id = o.id
    LEFT JOIN LATERAL (
      SELECT *
      FROM trucks t2
      WHERE t2.driver_id = d.id AND t2.deleted = false
      ORDER BY t2.created_at DESC
      LIMIT 1
    ) t ON true
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${sortColumn} ${order}
    LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
  `;

  values.push(limit, offset);

  const rows = await query<DriverRow>(sql, values);
  const total = rows.length ? Number(rows[0].total_count ?? 0) : 0;
  const data = rows.map(mapDriverRow);

  return { data, meta: buildMeta(page, limit, total) };
}

export async function listInternalDrivers(params: DriverListParams) {
  const result = await queryDrivers("internal", params);
  return {
    ...result,
    message: {
      en: "Fetched internal drivers successfully",
      th: "ดึงข้อมูลพนักงานขับรถภายในสำเร็จ",
    },
  };
}

export async function getDriverDetail(id: string) {
  const row = await queryOne<DriverRow>(
    `
      SELECT
        d.id AS driver_id,
        d.display_code,
        d.status,
        d.type,
        d.id_card_image_url,
        d.vehicle_registration_image_url,
        d.vehicle_license_image_url,
        d.trucker_id,
        u.id AS user_id,
        u.display_code AS user_display_code,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.dial_code,
        u.phone,
        u.image_url AS user_image_url,
        u.status AS user_status,
        o.id AS org_id,
        o.display_code AS org_display_code,
        o.name AS org_name,
        o.phone AS org_phone,
        o.email AS org_email,
        t.id AS truck_id,
        t.vin AS truck_vin,
        t.license_plate_value AS truck_license_plate_value,
        t.document_urls[1] AS truck_document_url
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN organizations o ON u.organization_id = o.id
      LEFT JOIN LATERAL (
        SELECT *
        FROM trucks t2
        WHERE t2.driver_id = d.id AND t2.deleted = false
        ORDER BY t2.created_at DESC
        LIMIT 1
      ) t ON true
      WHERE d.id = $1 AND d.deleted = false
    `,
    [id]
  );

  if (!row) {
    return null;
  }

  return mapDriverRow(row);
}

export async function createInternalDriver(payload: DriverPayload) {
  await query("BEGIN");
  try {
    const userId = await createUserRecord(payload, { role: "DRIVER" });
    if (!userId) {
      throw new Error("Failed to create driver user");
    }

    const inserted = await queryOne<{ id: string }>(
      `
        INSERT INTO drivers (
          display_code,
          user_id,
          type,
          company_id,
          status
        ) VALUES ($1,$2,'internal',$3,'APPROVED')
        RETURNING id
      `,
      [generateDriverDisplayCode(), userId, payload.organizationId]
    );

    await query("COMMIT");
    return inserted?.id ?? null;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

export async function updateInternalDriver(id: string, payload: DriverPayload) {
  const driver = await queryOne<{ id: string; user_id: string }>(
    `SELECT id, user_id FROM drivers WHERE id = $1 AND deleted = false AND type = 'internal'`,
    [id]
  );

  if (!driver) {
    return null;
  }

  await query("BEGIN");
  try {
    await updateUserRecord(driver.user_id, payload);
    await query(
      `
        UPDATE drivers
        SET company_id = $1,
            updated_at = NOW()
        WHERE id = $2
      `,
      [payload.organizationId, id]
    );

    await query("COMMIT");
    return id;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

export async function deleteDriver(id: string) {
  const driver = await queryOne<{ user_id: string }>(
    `SELECT user_id FROM drivers WHERE id = $1 AND deleted = false`,
    [id]
  );

  if (!driver) {
    return false;
  }

  await query("BEGIN");
  try {
    await query(
      `UPDATE drivers SET deleted = true, updated_at = NOW() WHERE id = $1`,
      [id]
    );
    await query(
      `UPDATE users SET deleted = true, updated_at = NOW() WHERE id = $1`,
      [driver.user_id]
    );
    await query("COMMIT");
    return true;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

