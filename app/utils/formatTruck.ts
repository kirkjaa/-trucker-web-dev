export function formatDimension(
  width: number,
  length: number,
  height: number,
  unit?: string
) {
  return `${width} x ${length} x ${height} ${unit}`;
}

export function formatLicensePlate(value?: string, province?: string) {
  return `${value} ${province}`;
}

export function formatWeight(value: number, unit: string) {
  return `${value} ${unit}`;
}
