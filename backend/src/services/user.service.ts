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

