import { query } from "../db";

interface TemplateFieldDefinitionRow {
  id: number;
  type: string;
  field_name: string;
  description: string | null;
}

export async function listTemplateFields(type?: string) {
  const conditions: string[] = ["is_active = true"];
  const values: any[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

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

