import { query, queryOne } from "../db";

interface PluginListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
}

interface PluginRow {
  id: number;
  plugin_code: string;
  name: string;
  company_name: string;
  company_location: string | null;
  plugin_type: string | null;
  description: string | null;
  available_credit: string | null;
  status: string;
  created_at: Date;
  creator_id: string | null;
  creator_first_name: string | null;
  creator_last_name: string | null;
  total_count?: string;
}

interface PluginFeatureRow {
  id: number;
  plugin_id: number;
  feature_name: string;
  description: string | null;
  limited_price: string | null;
  monthly_price: string | null;
  yearly_price: string | null;
}

const PLUGIN_SORT_MAP: Record<string, string> = {
  created_at: "p.created_at",
  name: "p.name",
  company_name: "p.company_name",
  status: "p.status",
};

function buildMeta(page: number, limit: number, total: number) {
  const totalPages = limit === 0 ? 0 : Math.ceil(total / limit);
  return { page, limit, totalPages, total };
}

function mapPluginRow(row: PluginRow, features: PluginFeatureRow[]) {
  return {
    id: row.id,
    code: row.plugin_code,
    name: row.name,
    description: row.description,
    company_name: row.company_name,
    company_location: row.company_location,
    plugin_type: row.plugin_type,
    available_credit: Number(row.available_credit ?? 0),
    status: row.status.toUpperCase(),
    created_at: row.created_at,
    created_by: row.creator_id
      ? {
          id: row.creator_id,
          first_name: row.creator_first_name ?? "",
          last_name: row.creator_last_name ?? "",
        }
      : null,
    features: features
      .filter((feature) => feature.plugin_id === row.id)
      .map((feature) => ({
        id: feature.id,
        feature_name: feature.feature_name,
        description: feature.description,
        limited_price: feature.limited_price
          ? Number(feature.limited_price)
          : null,
        monthly_price: feature.monthly_price
          ? Number(feature.monthly_price)
          : null,
        yearly_price: feature.yearly_price
          ? Number(feature.yearly_price)
          : null,
      })),
  };
}

export async function listPlugins(params: PluginListParams) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
  const offset = (page - 1) * limit;
  const order = params.order?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const sortColumn =
    PLUGIN_SORT_MAP[params.sort ?? "created_at"] ?? "p.created_at";

  const conditions: string[] = [];
  const values: any[] = [];

  if (params.search) {
    values.push(`%${params.search}%`);
    conditions.push(
      `(p.name ILIKE $${values.length} OR p.company_name ILIKE $${values.length} OR p.plugin_code ILIKE $${values.length})`
    );
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const rows = await query<PluginRow>(
    `
      SELECT
        p.id,
        p.plugin_code,
        p.name,
        p.company_name,
        p.company_location,
        p.plugin_type,
        p.description,
        p.available_credit,
        p.status,
        p.created_at,
        u.id AS creator_id,
        u.first_name AS creator_first_name,
        u.last_name AS creator_last_name,
        COUNT(*) OVER() AS total_count
      FROM plugins p
      LEFT JOIN users u ON p.created_by = u.id
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `,
    [...values, limit, offset]
  );

  const total = rows.length ? Number(rows[0].total_count ?? 0) : 0;
  const pluginIds = rows.map((row) => row.id);

  let featureRows: PluginFeatureRow[] = [];
  if (pluginIds.length) {
    featureRows = await query<PluginFeatureRow>(
      `
        SELECT
          id,
          plugin_id,
          feature_name,
          description,
          limited_price,
          monthly_price,
          yearly_price
        FROM plugin_features
        WHERE plugin_id = ANY($1::int[])
        ORDER BY created_at ASC
      `,
      [pluginIds]
    );
  }

  return {
    data: rows.map((row) => mapPluginRow(row, featureRows)),
    meta: buildMeta(page, limit, total),
  };
}

export async function getPluginById(id: number) {
  const row = await queryOne<PluginRow>(
    `
      SELECT
        p.id,
        p.plugin_code,
        p.name,
        p.company_name,
        p.company_location,
        p.plugin_type,
        p.description,
        p.available_credit,
        p.status,
        p.created_at,
        u.id AS creator_id,
        u.first_name AS creator_first_name,
        u.last_name AS creator_last_name
      FROM plugins p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = $1
    `,
    [id]
  );

  if (!row) {
    return null;
  }

  const features = await query<PluginFeatureRow>(
    `
      SELECT
        id,
        plugin_id,
        feature_name,
        description,
        limited_price,
        monthly_price,
        yearly_price
      FROM plugin_features
      WHERE plugin_id = $1
      ORDER BY created_at ASC
    `,
    [row.id]
  );

  return mapPluginRow(row, features);
}

export interface PluginFeatureInput {
  featureName: string;
  description?: string;
  limitedPrice?: number | null;
  monthlyPrice?: number | null;
  yearlyPrice?: number | null;
}

export interface PluginPayload {
  name: string;
  companyName: string;
  companyLocation?: string;
  pluginType?: string;
  description?: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactPhone?: string;
  contactEmail?: string;
  accountUsername?: string;
  accountPassword?: string;
  limitedOrderQuota?: number | null;
  limitedPrice?: number | null;
  monthlyDurationDays?: number | null;
  monthlyPrice?: number | null;
  yearlyDurationDays?: number | null;
  yearlyPrice?: number | null;
  availableCredit?: number | null;
  status?: "draft" | "active" | "inactive";
  features?: PluginFeatureInput[];
}

function generatePluginCode(name: string) {
  const prefix = name
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 3)
    .toUpperCase();
  const randomDigits = Math.floor(Math.random() * 900 + 100);
  return `PLG-${prefix}${randomDigits}`;
}

export async function createPlugin(creatorId: string, payload: PluginPayload) {
  if (!payload.name) {
    throw new Error("Plugin name is required");
  }
  if (!payload.companyName) {
    throw new Error("Company name is required");
  }

  const pluginCode = generatePluginCode(payload.name);

  await query("BEGIN");
  try {
    const plugin = await queryOne<{ id: number }>(
      `
        INSERT INTO plugins (
          plugin_code,
          name,
          company_name,
          company_location,
          plugin_type,
          description,
          contact_first_name,
          contact_last_name,
          contact_phone,
          contact_email,
          account_username,
          account_password,
          limited_order_quota,
          limited_price,
          monthly_duration_days,
          monthly_price,
          yearly_duration_days,
          yearly_price,
          available_credit,
          status,
          created_by
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
        )
        RETURNING id
      `,
      [
        pluginCode,
        payload.name,
        payload.companyName,
        payload.companyLocation ?? null,
        payload.pluginType ?? null,
        payload.description ?? null,
        payload.contactFirstName ?? null,
        payload.contactLastName ?? null,
        payload.contactPhone ?? null,
        payload.contactEmail ?? null,
        payload.accountUsername ?? null,
        payload.accountPassword ?? null,
        payload.limitedOrderQuota ?? null,
        payload.limitedPrice ?? null,
        payload.monthlyDurationDays ?? null,
        payload.monthlyPrice ?? null,
        payload.yearlyDurationDays ?? null,
        payload.yearlyPrice ?? null,
        payload.availableCredit ?? 0,
        payload.status ?? "draft",
        creatorId,
      ]
    );

    if (payload.features?.length) {
      for (const feature of payload.features) {
        await query(
          `
            INSERT INTO plugin_features (
              plugin_id,
              feature_name,
              description,
              limited_price,
              monthly_price,
              yearly_price
            ) VALUES ($1,$2,$3,$4,$5,$6)
          `,
          [
            plugin?.id,
            feature.featureName,
            feature.description ?? null,
            feature.limitedPrice ?? null,
            feature.monthlyPrice ?? null,
            feature.yearlyPrice ?? null,
          ]
        );
      }
    }

    await query("COMMIT");
    return plugin?.id ?? null;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

export async function updatePlugin(id: number, payload: PluginPayload) {
  const existing = await queryOne<{ id: number }>(
    "SELECT id FROM plugins WHERE id = $1",
    [id]
  );

  if (!existing) {
    throw new Error("Plugin not found");
  }

  await query("BEGIN");
  try {
    await query(
      `
        UPDATE plugins
        SET name = COALESCE($1, name),
            company_name = COALESCE($2, company_name),
            company_location = COALESCE($3, company_location),
            plugin_type = COALESCE($4, plugin_type),
            description = COALESCE($5, description),
            contact_first_name = COALESCE($6, contact_first_name),
            contact_last_name = COALESCE($7, contact_last_name),
            contact_phone = COALESCE($8, contact_phone),
            contact_email = COALESCE($9, contact_email),
            account_username = COALESCE($10, account_username),
            account_password = COALESCE($11, account_password),
            limited_order_quota = COALESCE($12, limited_order_quota),
            limited_price = COALESCE($13, limited_price),
            monthly_duration_days = COALESCE($14, monthly_duration_days),
            monthly_price = COALESCE($15, monthly_price),
            yearly_duration_days = COALESCE($16, yearly_duration_days),
            yearly_price = COALESCE($17, yearly_price),
            available_credit = COALESCE($18, available_credit),
            status = COALESCE($19, status),
            updated_at = NOW()
        WHERE id = $20
      `,
      [
        payload.name ?? null,
        payload.companyName ?? null,
        payload.companyLocation ?? null,
        payload.pluginType ?? null,
        payload.description ?? null,
        payload.contactFirstName ?? null,
        payload.contactLastName ?? null,
        payload.contactPhone ?? null,
        payload.contactEmail ?? null,
        payload.accountUsername ?? null,
        payload.accountPassword ?? null,
        payload.limitedOrderQuota ?? null,
        payload.limitedPrice ?? null,
        payload.monthlyDurationDays ?? null,
        payload.monthlyPrice ?? null,
        payload.yearlyDurationDays ?? null,
        payload.yearlyPrice ?? null,
        payload.availableCredit ?? null,
        payload.status ?? null,
        id,
      ]
    );

    if (payload.features) {
      await query("DELETE FROM plugin_features WHERE plugin_id = $1", [id]);

      for (const feature of payload.features) {
        await query(
          `
            INSERT INTO plugin_features (
              plugin_id,
              feature_name,
              description,
              limited_price,
              monthly_price,
              yearly_price
            ) VALUES ($1,$2,$3,$4,$5,$6)
          `,
          [
            id,
            feature.featureName,
            feature.description ?? null,
            feature.limitedPrice ?? null,
            feature.monthlyPrice ?? null,
            feature.yearlyPrice ?? null,
          ]
        );
      }
    }

    await query("COMMIT");
    return id;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

export async function deletePlugins(ids: number[]) {
  if (!ids.length) {
    return 0;
  }

  const deleted = await query<{ id: number }>(
    "DELETE FROM plugins WHERE id = ANY($1::int[]) RETURNING id",
    [ids]
  );

  return deleted.length;
}
