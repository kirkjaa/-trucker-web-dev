import { query } from "../db";

interface TemplateFieldDefinitionRow {
  id: number;
  type: string;
  field_name: string;
  description: string | null;
}

interface ProvinceJoinRow {
  province_id: number;
  province_name_th: string;
  province_name_en: string | null;
  district_id: number | null;
  district_name_th: string | null;
  district_name_en: string | null;
  subdistrict_id: number | null;
  subdistrict_name_th: string | null;
  subdistrict_name_en: string | null;
  postal_code: string | null;
}

interface BusinessTypeRow {
  id: number;
  code: string;
  name_th: string;
  name_en: string | null;
}

export async function listTemplateFields(type?: string) {
  const conditions: string[] = ["is_active = true"];
  const values: any[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const rows = await query<TemplateFieldDefinitionRow>(
    `
      SELECT id, type, field_name, description
      FROM template_field_definitions
      ${whereClause}
      ORDER BY type ASC, field_name ASC
    `,
    values
  );

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    field_name: row.field_name,
    description: row.description,
  }));
}

function buildProvincePayload(rows: ProvinceJoinRow[]) {
  const provinceMap = new Map<
    number,
    {
      id: number;
      name_th: string;
      name_en: string | null;
      geography_id: number;
      districts: Array<{
        id: number;
        name_th: string;
        name_en: string | null;
        subdistricts: Array<{
          id: number;
          name_th: string;
          name_en: string | null;
          zip_code: string;
        }>;
      }>;
    }
  >();

  rows.forEach((row) => {
    if (!provinceMap.has(row.province_id)) {
      provinceMap.set(row.province_id, {
        id: row.province_id,
        name_th: row.province_name_th,
        name_en: row.province_name_en,
        geography_id: 0,
        districts: [],
      });
    }

    if (!row.district_id) {
      return;
    }

    const province = provinceMap.get(row.province_id)!;
    let district = province.districts.find((d) => d.id === row.district_id);

    if (!district) {
      district = {
        id: row.district_id,
        name_th: row.district_name_th ?? "",
        name_en: row.district_name_en,
        subdistricts: [],
      };
      province.districts.push(district);
    }

    if (!row.subdistrict_id) {
      return;
    }

    const exists = district.subdistricts.find(
      (s) => s.id === row.subdistrict_id
    );
    if (exists) {
      return;
    }

    district.subdistricts.push({
      id: row.subdistrict_id,
      name_th: row.subdistrict_name_th ?? "",
      name_en: row.subdistrict_name_en,
      zip_code: row.postal_code ?? "",
    });
  });

  return Array.from(provinceMap.values());
}

export async function listProvincesHierarchy() {
  const rows = await query<ProvinceJoinRow>(`
    SELECT
      p.id AS province_id,
      p.name_th AS province_name_th,
      p.name_en AS province_name_en,
      d.id AS district_id,
      d.name_th AS district_name_th,
      d.name_en AS district_name_en,
      sd.id AS subdistrict_id,
      sd.name_th AS subdistrict_name_th,
      sd.name_en AS subdistrict_name_en,
      sd.postal_code
    FROM provinces p
    LEFT JOIN districts d ON d.province_id = p.id
    LEFT JOIN subdistricts sd ON sd.district_id = d.id
    ORDER BY p.name_th ASC, d.name_th ASC, sd.name_th ASC
  `);

  return buildProvincePayload(rows);
}

export async function listBusinessTypes() {
  const rows = await query<BusinessTypeRow>(`
    SELECT id, code, name_th, name_en
    FROM business_types
    WHERE is_active = true
    ORDER BY name_th ASC
  `);

  return rows.map((row) => ({
    id: row.id,
    name_th: row.name_th,
    name_en: row.name_en,
    code: row.code,
  }));
}
