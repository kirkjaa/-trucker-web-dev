import { query, queryOne } from "../db";

interface TemplateListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
}

interface TemplateRow {
  id: number;
  template_type: string;
  organization_id: string;
  org_name: string;
  org_display_code: string | null;
  org_email: string | null;
  org_dial_code: string | null;
  org_phone: string | null;
  total_count?: string;
}

interface TemplateFieldRow {
  id: number;
  template_id: number;
  field_id: number;
  field_type: string;
  field_name: string;
  match_field: string;
}

export interface TemplateFieldInput {
  fieldId: number;
  matchField: string;
}

export interface TemplatePayload {
  organizationId: string;
  templateType: string;
  fields: TemplateFieldInput[];
}

const TEMPLATE_SORT_MAP: Record<string, string> = {
  created_at: "t.created_at",
  template_type: "t.template_type",
  organization: "org.name",
  display_code: "org.display_code",
};

function buildMeta(page: number, limit: number, total: number) {
  const totalPages = limit === 0 ? 0 : Math.ceil(total / limit);
  return { page, limit, totalPages, total };
}

function mapTemplateRow(row: TemplateRow, fields: TemplateFieldRow[]) {
  return {
    id: row.id,
    template_type: row.template_type,
    organization: {
      id: row.organization_id,
      display_code: row.org_display_code,
      name: row.org_name,
      dial_code: row.org_dial_code,
      phone: row.org_phone,
      email: row.org_email,
    },
    fields: fields
      .filter((field) => field.template_id === row.id)
      .map((field) => ({
        id: field.id,
        match_field: field.match_field,
        field: {
          id: field.field_id,
          type: field.field_type,
          field_name: field.field_name,
        },
      })),
  };
}

export async function listTemplates(params: TemplateListParams) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
  const offset = (page - 1) * limit;
  const order = params.order?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const sortColumn =
    TEMPLATE_SORT_MAP[params.sort ?? "created_at"] ?? "t.created_at";

  const conditions: string[] = ["org.deleted = false"];
  const values: any[] = [];

  if (params.search) {
    values.push(`%${params.search}%`);
    conditions.push(
      `(org.name ILIKE $${values.length} OR org.display_code ILIKE $${
        values.length
      } OR t.template_type ILIKE $${values.length})`
    );
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = await query<TemplateRow>(
    `
      SELECT
        t.id,
        t.template_type,
        t.organization_id,
        org.name AS org_name,
        org.display_code AS org_display_code,
        org.email AS org_email,
        org.dial_code AS org_dial_code,
        org.phone AS org_phone,
        COUNT(*) OVER() AS total_count
      FROM templates t
      JOIN organizations org ON t.organization_id = org.id
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `,
    [...values, limit, offset]
  );

  const total = rows.length ? Number(rows[0].total_count ?? 0) : 0;
  const templateIds = rows.map((row) => row.id);

  let fieldRows: TemplateFieldRow[] = [];
  if (templateIds.length) {
    fieldRows = await query<TemplateFieldRow>(
      `
        SELECT
          tfm.id,
          tfm.template_id,
          tfm.match_field,
          tfd.id AS field_id,
          tfd.type AS field_type,
          tfd.field_name
        FROM template_field_mappings tfm
        JOIN template_field_definitions tfd ON tfm.field_id = tfd.id
        WHERE tfm.template_id = ANY($1::int[])
        ORDER BY tfm.created_at ASC
      `,
      [templateIds]
    );
  }

  return {
    data: rows.map((row) => mapTemplateRow(row, fieldRows)),
    meta: buildMeta(page, limit, total),
  };
}

export async function getTemplateById(id: number) {
  const row = await queryOne<TemplateRow>(
    `
      SELECT
        t.id,
        t.template_type,
        t.organization_id,
        org.name AS org_name,
        org.display_code AS org_display_code,
        org.email AS org_email,
        org.dial_code AS org_dial_code,
        org.phone AS org_phone
      FROM templates t
      JOIN organizations org ON t.organization_id = org.id
      WHERE t.id = $1
    `,
    [id]
  );

  if (!row) {
    return null;
  }

  const fields = await query<TemplateFieldRow>(
    `
      SELECT
        tfm.id,
        tfm.template_id,
        tfm.match_field,
        tfd.id AS field_id,
        tfd.type AS field_type,
        tfd.field_name
      FROM template_field_mappings tfm
      JOIN template_field_definitions tfd ON tfm.field_id = tfd.id
      WHERE tfm.template_id = $1
      ORDER BY tfm.created_at ASC
    `,
    [row.id]
  );

  return mapTemplateRow(row, fields);
}

export async function getTemplateByOrganization(
  templateType: string,
  organizationId?: string
) {
  if (!templateType) {
    throw new Error("Template type is required");
  }

  const conditions = ["t.template_type = $1"];
  const values: any[] = [templateType];

  if (organizationId) {
    values.push(organizationId);
    conditions.push(`t.organization_id = $${values.length}`);
  }

  const row = await queryOne<TemplateRow>(
    `
      SELECT
        t.id,
        t.template_type,
        t.organization_id,
        org.name AS org_name,
        org.display_code AS org_display_code,
        org.email AS org_email,
        org.dial_code AS org_dial_code,
        org.phone AS org_phone
      FROM templates t
      JOIN organizations org ON t.organization_id = org.id
      WHERE ${conditions.join(" AND ")}
      ORDER BY t.updated_at DESC
      LIMIT 1
    `,
    values
  );

  if (!row) {
    return null;
  }

  const fields = await query<TemplateFieldRow>(
    `
      SELECT
        tfm.id,
        tfm.template_id,
        tfm.match_field,
        tfd.id AS field_id,
        tfd.type AS field_type,
        tfd.field_name
      FROM template_field_mappings tfm
      JOIN template_field_definitions tfd ON tfm.field_id = tfd.id
      WHERE tfm.template_id = $1
      ORDER BY tfm.created_at ASC
    `,
    [row.id]
  );

  return mapTemplateRow(row, fields);
}

function validateTemplatePayload(payload: TemplatePayload) {
  if (!payload.organizationId) {
    throw new Error("Organization ID is required");
  }
  if (!payload.templateType) {
    throw new Error("Template type is required");
  }
  if (!Array.isArray(payload.fields) || payload.fields.length === 0) {
    throw new Error("At least one field mapping is required");
  }
}

export async function createTemplate(
  creatorId: string,
  payload: TemplatePayload
) {
  validateTemplatePayload(payload);

  const organization = await queryOne<{ id: string }>(
    `
      SELECT id
      FROM organizations
      WHERE id = $1 AND deleted = false
    `,
    [payload.organizationId]
  );

  if (!organization) {
    throw new Error("Organization not found");
  }

  await query("BEGIN");
  try {
    const template = await queryOne<{ id: number }>(
      `
        INSERT INTO templates (organization_id, template_type, created_by)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      [payload.organizationId, payload.templateType, creatorId]
    );

    for (const field of payload.fields) {
      await query(
        `
          INSERT INTO template_field_mappings (template_id, field_id, match_field)
          VALUES ($1, $2, $3)
        `,
        [template?.id, field.fieldId, field.matchField]
      );
    }

    await query("COMMIT");
    return template?.id ?? null;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

export async function updateTemplate(
  id: number,
  payload: TemplatePayload
) {
  validateTemplatePayload(payload);

  const existing = await queryOne<{ id: number }>(
    `SELECT id FROM templates WHERE id = $1`,
    [id]
  );

  if (!existing) {
    throw new Error("Template not found");
  }

  await query("BEGIN");
  try {
    await query(
      `
        UPDATE templates
        SET organization_id = $1,
            template_type = $2,
            updated_at = NOW()
        WHERE id = $3
      `,
      [payload.organizationId, payload.templateType, id]
    );

    await query(
      `DELETE FROM template_field_mappings WHERE template_id = $1`,
      [id]
    );

    for (const field of payload.fields) {
      await query(
        `
          INSERT INTO template_field_mappings (template_id, field_id, match_field)
          VALUES ($1, $2, $3)
        `,
        [id, field.fieldId, field.matchField]
      );
    }

    await query("COMMIT");
    return id;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

export async function deleteTemplates(ids: number[]) {
  if (!ids.length) {
    return 0;
  }

  const deleted = await query<{ id: number }>(
    `DELETE FROM templates WHERE id = ANY($1::int[]) RETURNING id`,
    [ids]
  );

  return deleted.length;
}

