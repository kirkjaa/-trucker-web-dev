import { QueryResultRow } from "pg";

import { query, queryOne } from "../db";

type OrganizationType = "FACTORY" | "COMPANY";

interface OrganizationListParams {
  page?: number;
  limit?: number;
  typeId?: number;
  search?: string;
  sort?: string;
  order?: string;
}

export interface OrganizationPayload {
  name: string;
  dialCode: string;
  phone: string;
  email: string;
  typeId: number;
  businessTypeId?: number;
  addressLine1: string;
  provinceId: number;
  districtId: number;
  subDistrictId: number;
  zipCode?: string;
  latitude?: string;
  longitude?: string;
  coverPath?: string | null;
  logoPath?: string | null;
  documentPaths?: string[];
  documentDeleteIds?: string[];
}

interface OrganizationBaseRow extends QueryResultRow {
  id: string;
  display_code: string;
  name: string;
  dial_code: string;
  phone: string;
  email: string;
  image_url: string | null;
  logo_image_url: string | null;
  type: OrganizationType;
  business_type_id: number | null;
  business_type_code: string | null;
  business_type_name_th: string | null;
  business_type_name_en: string | null;
  trucker_id: string | null;
  total_count?: string;
}

const SORT_COLUMN_MAP: Record<string, string> = {
  display_code: "o.display_code",
  name: "o.name",
  phone: "o.phone",
  email: "o.email",
  created_at: "o.created_at",
};

const DEFAULT_MESSAGE = {
  SUCCESS_FETCH: {
    en: "Fetched organization data successfully",
    th: "ดึงข้อมูลองค์กรสำเร็จ",
  },
  SUCCESS_CREATE: {
    en: "Organization created successfully",
    th: "สร้างองค์กรสำเร็จ",
  },
  SUCCESS_UPDATE: {
    en: "Organization updated successfully",
    th: "แก้ไของค์กรสำเร็จ",
  },
  SUCCESS_DELETE: {
    en: "Organization deleted successfully",
    th: "ลบองค์กรสำเร็จ",
  },
};

function mapTypeIdToEnum(typeId?: number): OrganizationType | null {
  if (typeId === 1) return "FACTORY";
  if (typeId === 2) return "COMPANY";
  return null;
}

function mapTypeToReadable(type: OrganizationType) {
  const isFactory = type === "FACTORY";
  return {
    id: isFactory ? 1 : 2,
    type_code: type,
    name_th: isFactory ? "โรงงาน" : "บริษัท",
    name_en: isFactory ? "Factory" : "Company",
  };
}

function buildBusinessType(row: OrganizationBaseRow) {
  if (!row.business_type_id) {
    return null;
  }

  return {
    id: row.business_type_id,
    code: row.business_type_code,
    name_th: row.business_type_name_th,
    name_en: row.business_type_name_en,
  };
}

function buildMeta(page: number, limit: number, total: number) {
  const totalPages = limit === 0 ? 0 : Math.ceil(total / limit);
  return { page, limit, totalPages, total };
}

function generateDisplayCode(type: OrganizationType) {
  const prefix = type === "FACTORY" ? "FAC" : "COM";
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

function generateTruckerId(type: OrganizationType) {
  const prefix = type === "FACTORY" ? "factory" : "company";
  return `${prefix}-${Date.now().toString(36)}`;
}

export async function listOrganizations(params: OrganizationListParams) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
  const offset = (page - 1) * limit;
  const typeFilter = mapTypeIdToEnum(
    params.typeId ? Number(params.typeId) : undefined
  );
  const searchTerm = params.search ? String(params.search).trim() : "";
  const order = params.order?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const sortColumn =
    SORT_COLUMN_MAP[params.sort ?? "created_at"] ?? SORT_COLUMN_MAP.created_at;

  const where: string[] = ["o.deleted = false"];
  const values: any[] = [];
  let valueIndex = 1;

  if (typeFilter) {
    where.push(`o.type = $${valueIndex++}`);
    values.push(typeFilter);
  }

  if (searchTerm) {
    where.push(
      `(o.name ILIKE $${valueIndex} OR o.display_code ILIKE $${valueIndex})`
    );
    values.push(`%${searchTerm}%`);
    valueIndex += 1;
  }

  const sql = `
    SELECT
      o.id,
      o.display_code,
      o.name,
      o.dial_code,
      o.phone,
      o.email,
      o.image_url,
      o.logo_image_url,
      o.type,
      o.trucker_id,
      o.business_type_id,
      bt.code AS business_type_code,
      bt.name_th AS business_type_name_th,
      bt.name_en AS business_type_name_en,
      COUNT(*) OVER() AS total_count
    FROM organizations o
    LEFT JOIN business_types bt ON o.business_type_id = bt.id
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${sortColumn} ${order}
    LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
  `;

  values.push(limit, offset);

  const rows = await query<OrganizationBaseRow>(sql, values);
  const total = rows.length ? Number(rows[0].total_count) : 0;

  const organizations = await Promise.all(
    rows.map((row) => buildOrganizationResponse(row))
  );

  return {
    data: organizations,
    meta: buildMeta(page, limit, total),
    message: DEFAULT_MESSAGE.SUCCESS_FETCH,
  };
}

export async function getOrganizationDetail(id: string) {
  const row = await queryOne<OrganizationBaseRow>(
    `
      SELECT
        o.id,
        o.display_code,
        o.name,
        o.dial_code,
        o.phone,
        o.email,
        o.image_url,
        o.logo_image_url,
        o.type,
        o.trucker_id,
        o.business_type_id,
        bt.code AS business_type_code,
        bt.name_th AS business_type_name_th,
        bt.name_en AS business_type_name_en
      FROM organizations o
      LEFT JOIN business_types bt ON o.business_type_id = bt.id
      WHERE o.id = $1 AND o.deleted = false
    `,
    [id]
  );

  if (!row) {
    return null;
  }

  const data = await buildOrganizationResponse(row);

  return {
    data,
    message: DEFAULT_MESSAGE.SUCCESS_FETCH,
  };
}

export async function createOrganization(payload: OrganizationPayload) {
  const typeEnum = mapTypeIdToEnum(payload.typeId) ?? "FACTORY";
  await query("BEGIN");
  try {
    const inserted = await queryOne<{ id: string }>(
      `
        INSERT INTO organizations (
          display_code,
          name,
          dial_code,
          phone,
          email,
          type,
          business_type_id,
          image_url,
          logo_image_url,
          trucker_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `,
      [
        generateDisplayCode(typeEnum),
        payload.name,
        payload.dialCode,
        payload.phone,
        payload.email,
        typeEnum,
        payload.businessTypeId ?? null,
        payload.coverPath ?? null,
        payload.logoPath ?? null,
        generateTruckerId(typeEnum),
      ]
    );

    const organizationId = inserted?.id;

    if (!organizationId) {
      throw new Error("Failed to create organization");
    }

    await upsertAddress({
      organizationId,
      addressLine1: payload.addressLine1,
      provinceId: payload.provinceId,
      districtId: payload.districtId,
      subDistrictId: payload.subDistrictId,
      postalCode: payload.zipCode,
      latitude: payload.latitude,
      longitude: payload.longitude,
    });

    if (payload.documentPaths?.length) {
      await insertDocuments(organizationId, payload.documentPaths);
    }

    await query("COMMIT");
    return organizationId;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

export async function updateOrganization(
  id: string,
  payload: OrganizationPayload
) {
  const existing = await queryOne<{ id: string }>(
    `SELECT id FROM organizations WHERE id = $1 AND deleted = false`,
    [id]
  );

  if (!existing) {
    return null;
  }

  const typeEnum = mapTypeIdToEnum(payload.typeId) ?? "FACTORY";

  await query("BEGIN");
  try {
    const updateFields = [
      payload.name,
      payload.dialCode,
      payload.phone,
      payload.email,
      typeEnum,
      payload.businessTypeId ?? null,
      payload.coverPath ?? null,
      payload.logoPath ?? null,
      id,
    ];

    await query(
      `
        UPDATE organizations
        SET
          name = $1,
          dial_code = $2,
          phone = $3,
          email = $4,
          type = $5,
          business_type_id = $6,
          image_url = COALESCE($7, image_url),
          logo_image_url = COALESCE($8, logo_image_url),
          updated_at = NOW()
        WHERE id = $9
      `,
      updateFields
    );

    await upsertAddress({
      organizationId: id,
      addressLine1: payload.addressLine1,
      provinceId: payload.provinceId,
      districtId: payload.districtId,
      subDistrictId: payload.subDistrictId,
      postalCode: payload.zipCode,
      latitude: payload.latitude,
      longitude: payload.longitude,
    });

    if (payload.documentDeleteIds?.length) {
      await query(
        `DELETE FROM organization_documents WHERE organization_id = $1 AND id = ANY($2::uuid[])`,
        [id, payload.documentDeleteIds]
      );
    }

    if (payload.documentPaths?.length) {
      await insertDocuments(id, payload.documentPaths);
    }

    await query("COMMIT");
    return id;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

export async function deleteOrganizations(ids: string[]) {
  if (!ids.length) {
    return 0;
  }

  await query(
    `UPDATE organizations SET deleted = true, updated_at = NOW() WHERE id = ANY($1::uuid[])`,
    [ids]
  );

  return ids.length;
}

export async function getOrganizationAdmins(organizationId: string) {
  const rows = await query(
    `
      SELECT
        u.id,
        u.display_code,
        u.username,
        u.first_name,
        u.last_name,
        u.dial_code,
        u.phone,
        u.email,
        u.image_url,
        u.status
      FROM users u
      WHERE u.organization_id = $1
      ORDER BY u.created_at ASC
    `,
    [organizationId]
  );

  return rows.map((row) => ({
    id: row.id,
    displayCode: row.display_code,
    username: row.username,
    firstName: row.first_name,
    lastName: row.last_name,
    dialCode: row.dial_code,
    phone: row.phone,
    email: row.email,
    imageUrl: row.image_url,
    userStatus: row.status,
  }));
}

async function buildOrganizationResponse(row: OrganizationBaseRow) {
  const addresses = await fetchAddresses(row.id);
  const documents = await fetchDocuments(row.id);
  const signature = await fetchSignature(row.id, row.type);
  const ownerUser = await fetchOwnerUser(row.id);

  return {
    id: row.id,
    display_code: row.display_code,
    name: row.name,
    dial_code: row.dial_code,
    phone: row.phone,
    email: row.email,
    image_url: row.image_url,
    image_logo_url: row.logo_image_url,
    owner_user: ownerUser,
    type: mapTypeToReadable(row.type),
    business_type: buildBusinessType(row),
    package: null,
    documents,
    addresses,
    signature,
    trucker_id: row.trucker_id,
  };
}

async function fetchAddresses(organizationId: string) {
  const rows = await query(
    `
      SELECT
        oa.id,
        oa.address_line1,
        oa.postal_code,
        oa.latitude,
        oa.longitude,
        p.id AS province_id,
        p.name_th AS province_name_th,
        p.name_en AS province_name_en,
        d.id AS district_id,
        d.name_th AS district_name_th,
        d.name_en AS district_name_en,
        s.id AS subdistrict_id,
        s.name_th AS subdistrict_name_th,
        s.name_en AS subdistrict_name_en,
        s.postal_code AS subdistrict_zip
      FROM organization_addresses oa
      LEFT JOIN provinces p ON oa.province_id = p.id
      LEFT JOIN districts d ON oa.district_id = d.id
      LEFT JOIN subdistricts s ON oa.subdistrict_id = s.id
      WHERE oa.organization_id = $1
      ORDER BY oa.created_at ASC
    `,
    [organizationId]
  );

  return rows.map((addr) => ({
    id: addr.id,
    address: addr.address_line1,
    zip_code: addr.postal_code ?? addr.subdistrict_zip,
    latitude: addr.latitude ? addr.latitude.toString() : null,
    longitude: addr.longitude ? addr.longitude.toString() : null,
    province: {
      id: addr.province_id,
      name_th: addr.province_name_th,
      name_en: addr.province_name_en,
    },
    district: {
      id: addr.district_id,
      name_th: addr.district_name_th,
      name_en: addr.district_name_en,
    },
    subdistrict: {
      id: addr.subdistrict_id,
      name_th: addr.subdistrict_name_th,
      name_en: addr.subdistrict_name_en,
      zip_code: addr.subdistrict_zip,
    },
  }));
}

async function fetchDocuments(organizationId: string) {
  const rows = await query(
    `
      SELECT id, document_type, file_url
      FROM organization_documents
      WHERE organization_id = $1
      ORDER BY created_at ASC
    `,
    [organizationId]
  );

  return rows.map((doc) => ({
    id: doc.id,
    document_type: doc.document_type,
    file_url: doc.file_url,
  }));
}

async function fetchSignature(organizationId: string, type: OrganizationType) {
  const row = await queryOne(
    `
      SELECT id, type, sign
      FROM organization_signatures
      WHERE organization_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [organizationId]
  );

  if (!row) return null;

  return {
    id: row.id,
    type: row.type,
    text: row.type === "text" ? row.sign : undefined,
    imageUrl: row.type === "image" ? row.sign : undefined,
    factoryId: type === "FACTORY" ? organizationId : undefined,
    companyId: type === "COMPANY" ? organizationId : undefined,
    isMain: true,
    isDeleted: false,
  };
}

async function fetchOwnerUser(organizationId: string) {
  const user = await queryOne(
    `
      SELECT
        id,
        display_code,
        first_name,
        last_name,
        username,
        email,
        dial_code,
        phone,
        image_url,
        status
      FROM users
      WHERE organization_id = $1
      ORDER BY created_at ASC
      LIMIT 1
    `,
    [organizationId]
  );

  if (!user) return null;

  return {
    id: user.id,
    display_code: user.display_code,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    email: user.email,
    dial_code: user.dial_code,
    phone: user.phone,
    image_url: user.image_url,
    status: user.status,
  };
}

async function upsertAddress({
  organizationId,
  addressLine1,
  provinceId,
  districtId,
  subDistrictId,
  postalCode,
  latitude,
  longitude,
}: {
  organizationId: string;
  addressLine1: string;
  provinceId: number;
  districtId: number;
  subDistrictId: number;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
}) {
  const existing = await queryOne<{ id: string }>(
    `SELECT id FROM organization_addresses WHERE organization_id = $1 ORDER BY created_at ASC LIMIT 1`,
    [organizationId]
  );

  if (existing) {
    await query(
      `
        UPDATE organization_addresses
        SET
          address_line1 = $1,
          province_id = $2,
          district_id = $3,
          subdistrict_id = $4,
          postal_code = $5,
          latitude = $6,
          longitude = $7,
          updated_at = NOW()
        WHERE id = $8
      `,
      [
        addressLine1,
        provinceId || null,
        districtId || null,
        subDistrictId || null,
        postalCode ?? null,
        latitude ? Number(latitude) : null,
        longitude ? Number(longitude) : null,
        existing.id,
      ]
    );
  } else {
    await query(
      `
        INSERT INTO organization_addresses (
          organization_id,
          address_line1,
          province_id,
          district_id,
          subdistrict_id,
          postal_code,
          latitude,
          longitude,
          is_primary
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)
      `,
      [
        organizationId,
        addressLine1,
        provinceId || null,
        districtId || null,
        subDistrictId || null,
        postalCode ?? null,
        latitude ? Number(latitude) : null,
        longitude ? Number(longitude) : null,
      ]
    );
  }
}

async function insertDocuments(organizationId: string, paths: string[]) {
  const values: any[] = [];
  const rowsSql: string[] = [];

  paths.forEach((filePath, index) => {
    const baseIndex = index * 3;
    rowsSql.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`);
    values.push(organizationId, "UPLOAD", filePath);
  });

  await query(
    `
      INSERT INTO organization_documents (organization_id, document_type, file_url)
      VALUES ${rowsSql.join(",")}
    `,
    values
  );
}

export const organizationMessages = DEFAULT_MESSAGE;
