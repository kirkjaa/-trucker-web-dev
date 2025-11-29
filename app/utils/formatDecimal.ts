export default function formatDecimal(
  value: number | string | null | undefined
): string {
  if (value == null || isNaN(Number(value))) {
    return "-";
  }
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
