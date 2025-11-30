import bcrypt from "bcryptjs";

import { query, queryOne } from "../db";

type UserRow = {
  id: string;
  display_code: string;
  username: string;
  email: string | null;
  password_hash: string | null;
  first_name: string | null;
  last_name: string | null;
  dial_code: string | null;
  phone: string | null;
  role: string;
  position_id: number | null;
  organization_id: string | null;
  status: string | null;
  trucker_id: string | null;
  created_at: string;
  updated_at: string;
  position_code: string | null;
  position_name_th: string | null;
  position_name_en: string | null;
  position_is_active: boolean | null;
  position_is_dashboard: boolean | null;
  position_is_user: boolean | null;
  position_is_chat: boolean | null;
  position_is_quotation: boolean | null;
  position_is_order: boolean | null;
  position_is_truck: boolean | null;
  position_is_package: boolean | null;
  position_is_profile: boolean | null;
  org_display_code: string | null;
  org_name: string | null;
  org_type: string | null;
  org_dial_code: string | null;
  org_phone: string | null;
  org_email: string | null;
  org_image_url: string | null;
  org_logo_image_url: string | null;
};

export async function findUserByIdentifier(identifier: string) {
  const sql = `
    SELECT
      u.*,
      up.code AS position_code,
      up.name_th AS position_name_th,
      up.name_en AS position_name_en,
      up.is_active AS position_is_active,
      up.is_dashboard AS position_is_dashboard,
      up.is_user AS position_is_user,
      up.is_chat AS position_is_chat,
      up.is_quotation AS position_is_quotation,
      up.is_order AS position_is_order,
      up.is_truck AS position_is_truck,
      up.is_package AS position_is_package,
      up.is_profile AS position_is_profile,
      o.display_code AS org_display_code,
      o.name AS org_name,
      o.type AS org_type,
      o.dial_code AS org_dial_code,
      o.phone AS org_phone,
      o.email AS org_email,
      o.image_url AS org_image_url,
      o.logo_image_url AS org_logo_image_url
    FROM users u
    LEFT JOIN user_positions up ON u.position_id = up.id
    LEFT JOIN organizations o ON u.organization_id = o.id
    WHERE LOWER(u.username) = LOWER($1)
       OR LOWER(u.email) = LOWER($1)
    LIMIT 1
  `;

  return queryOne<UserRow>(sql, [identifier]);
}

export async function findUserById(id: string) {
  const sql = `
    SELECT
      u.*,
      up.code AS position_code,
      up.name_th AS position_name_th,
      up.name_en AS position_name_en,
      up.is_active AS position_is_active,
      up.is_dashboard AS position_is_dashboard,
      up.is_user AS position_is_user,
      up.is_chat AS position_is_chat,
      up.is_quotation AS position_is_quotation,
      up.is_order AS position_is_order,
      up.is_truck AS position_is_truck,
      up.is_package AS position_is_package,
      up.is_profile AS position_is_profile,
      o.display_code AS org_display_code,
      o.name AS org_name,
      o.type AS org_type,
      o.dial_code AS org_dial_code,
      o.phone AS org_phone,
      o.email AS org_email,
      o.image_url AS org_image_url,
      o.logo_image_url AS org_logo_image_url
    FROM users u
    LEFT JOIN user_positions up ON u.position_id = up.id
    LEFT JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = $1
    LIMIT 1
  `;

  return queryOne<UserRow>(sql, [id]);
}

export async function findOrganizationAddresses(organizationId: string) {
  const sql = `
    SELECT
      id,
      address_line1,
      province_id,
      district_id,
      subdistrict_id,
      postal_code,
      latitude,
      longitude,
      is_primary
    FROM organization_addresses
    WHERE organization_id = $1
    ORDER BY created_at ASC
  `;

  return query(sql, [organizationId]);
}

export function buildRoleResponse(row: UserRow) {
  return {
    id: row.position_id ?? 0,
    role_code: row.role,
    name_th: row.role,
    name_en: row.role,
  };
}

export function buildPositionResponse(row: UserRow) {
  if (!row.position_code) {
    return null;
  }

  return {
    id: row.position_id,
    code: row.position_code,
    name_th: row.position_name_th,
    name_en: row.position_name_en,
    is_active: row.position_is_active,
    is_dashboard: row.position_is_dashboard,
    is_user: row.position_is_user,
    is_chat: row.position_is_chat,
    is_quotation: row.position_is_quotation,
    is_order: row.position_is_order,
    is_truck: row.position_is_truck,
    is_package: row.position_is_package,
    is_profile: row.position_is_profile,
  };
}

export async function buildOrganizationResponse(row: UserRow) {
  if (!row.organization_id) {
    return null;
  }

  const addresses = await findOrganizationAddresses(row.organization_id);

  return {
    id: row.organization_id,
    display_code: row.org_display_code,
    name: row.org_name,
    dial_code: row.org_dial_code,
    phone: row.org_phone,
    email: row.org_email,
    image_url: row.org_image_url,
    image_logo_url: row.org_logo_image_url,
    type: row.org_type
      ? {
          type_code: row.org_type,
          type_name: row.org_type,
        }
      : null,
    signature: null,
    addresses,
  };
}

export async function buildUserResponse(row: UserRow) {
  const organization = await buildOrganizationResponse(row);

  return {
    id: row.id,
    display_code: row.display_code,
    username: row.username,
    email: row.email,
    first_name: row.first_name,
    last_name: row.last_name,
    dial_code: row.dial_code,
    phone: row.phone,
    role: buildRoleResponse(row),
    organization,
    position: buildPositionResponse(row),
    status: row.status,
  };
}

type OrganizationFilter = 1 | 2;

const USER_SORT_MAP: Record<string, string> = {
  display_code: "u.display_code",
  username: "u.username",
  fullName: "u.first_name",
  email: "u.email",
  created_at: "u.created_at",
};

function mapOrganizationTypeId(typeId?: number): OrganizationFilter | undefined {
  if (typeId === 1) return 1;
  if (typeId === 2) return 2;
  return undefined;
}

function mapTypeIdToEnum(typeId?: number) {
  if (typeId === 1) return "FACTORY";
  if (typeId === 2) return "COMPANY";
  return undefined;
}

function buildMeta(page: number, limit: number, total: number) {
  const totalPages = limit === 0 ? 0 : Math.ceil(total / limit);
  return { page, limit, totalPages, total };
}

function generateUserDisplayCode() {
  return `USR-${Date.now().toString(36).toUpperCase()}`;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  organizationTypeId?: number;
  search?: string;
  sort?: string;
  order?: string;
}

export interface UserPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  organizationId: string;
  dialCode?: string;
  imagePath?: string | null;
}

export async function listUsers(params: UserListParams) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
  const offset = (page - 1) * limit;
  const organizationType = mapOrganizationTypeId(params.organizationTypeId);
  const searchTerm = params.search ? String(params.search).trim() : "";
  const order = params.order?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const sortColumn =
    USER_SORT_MAP[params.sort ?? "created_at"] ?? USER_SORT_MAP.created_at;

  const where: string[] = ["u.deleted = false"];
  const values: any[] = [];
  let valueIndex = 1;

  if (organizationType) {
    const typeEnum = mapTypeIdToEnum(organizationType);
    where.push(`o.type = $${valueIndex++}`);
    values.push(typeEnum);
  }

  if (searchTerm) {
    where.push(
      `(u.display_code ILIKE $${valueIndex} OR u.username ILIKE $${valueIndex} OR u.first_name ILIKE $${valueIndex} OR u.last_name ILIKE $${valueIndex})`
    );
    values.push(`%${searchTerm}%`);
    valueIndex += 1;
  }

  const sql = `
    SELECT
      u.*,
      up.code AS position_code,
      up.name_th AS position_name_th,
      up.name_en AS position_name_en,
      up.is_active AS position_is_active,
      up.is_dashboard AS position_is_dashboard,
      up.is_user AS position_is_user,
      up.is_chat AS position_is_chat,
      up.is_quotation AS position_is_quotation,
      up.is_order AS position_is_order,
      up.is_truck AS position_is_truck,
      up.is_package AS position_is_package,
      up.is_profile AS position_is_profile,
      o.display_code AS org_display_code,
      o.name AS org_name,
      o.type AS org_type,
      o.dial_code AS org_dial_code,
      o.phone AS org_phone,
      o.email AS org_email,
      o.image_url AS org_image_url,
      o.logo_image_url AS org_logo_image_url,
      COUNT(*) OVER() AS total_count
    FROM users u
    LEFT JOIN user_positions up ON u.position_id = up.id
    LEFT JOIN organizations o ON u.organization_id = o.id
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${sortColumn} ${order}
    LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
  `;

  values.push(limit, offset);

  const rows = await query<UserRow>(sql, values);
  const total = rows.length ? Number(rows[0].total_count) : 0;

  const users = await Promise.all(rows.map((row) => buildUserResponse(row)));

  return {
    data: users,
    meta: buildMeta(page, limit, total),
    message: {
      en: "Fetched users successfully",
      th: "ดึงข้อมูลผู้ใช้สำเร็จ",
    },
  };
}

export async function getUserDetail(id: string) {
  const row = await findUserById(id);
  if (!row) {
    return null;
  }

  const data = await buildUserResponse(row);
  return {
    data,
    message: {
      en: "Fetched user successfully",
      th: "ดึงข้อมูลผู้ใช้สำเร็จ",
    },
  };
}

export async function createUserRecord(payload: UserPayload) {
  const passwordHash = await bcrypt.hash("Demo@123", 10);

  const inserted = await queryOne<{ id: string }>(
    `
      INSERT INTO users (
        display_code,
        username,
        email,
        password_hash,
        first_name,
        last_name,
        dial_code,
        phone,
        role,
        organization_id,
        status,
        image_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'ORGANIZATION',$9,'ACTIVE',$10)
      RETURNING id
    `,
    [
      generateUserDisplayCode(),
      payload.username,
      payload.email,
      passwordHash,
      payload.firstName,
      payload.lastName,
      payload.dialCode ?? "+66",
      payload.phone,
      payload.organizationId,
      payload.imagePath ?? null,
    ]
  );

  return inserted?.id ?? null;
}

export async function updateUserRecord(id: string, payload: UserPayload) {
  const existing = await queryOne<{ id: string }>(
    `SELECT id FROM users WHERE id = $1 AND deleted = false`,
    [id]
  );

  if (!existing) {
    return null;
  }

  await query(
    `
      UPDATE users
      SET
        first_name = $1,
        last_name = $2,
        username = $3,
        email = $4,
        phone = $5,
        dial_code = $6,
        organization_id = $7,
        image_url = COALESCE($8, image_url),
        updated_at = NOW()
      WHERE id = $9
    `,
    [
      payload.firstName,
      payload.lastName,
      payload.username,
      payload.email,
      payload.phone,
      payload.dialCode ?? "+66",
      payload.organizationId,
      payload.imagePath ?? null,
      id,
    ]
  );

  return id;
}

export async function deleteUsers(ids: string[]) {
  if (!ids.length) {
    return 0;
  }

  await query(`UPDATE users SET deleted = true WHERE id = ANY($1::uuid[])`, [
    ids,
  ]);

  return ids.length;
}

