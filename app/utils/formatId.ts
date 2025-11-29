export function formatId(id?: string, optional?: string) {
  return `${!id ? "-" : `${optional || "#"}${id}`}`;
}
