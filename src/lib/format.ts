export const MONTHS_UZ = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

/** "2026-11" yoki "2026-11-01" -> "Noyabr 2026" */
export function monthLabel(m: string | null | undefined): string {
  if (!m) return "—";
  const match = /^(\d{4})-(\d{2})/.exec(m);
  if (!match) return m;
  const idx = Number(match[2]) - 1;
  return `${MONTHS_UZ[idx] ?? match[2]} ${match[1]}`;
}

/** UTC bo'yicha: 24 Noyabr 2026 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return `${d.getUTCDate()} ${MONTHS_UZ[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatShort(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(
    d.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
}

export function formatMoney(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${new Intl.NumberFormat("ru-RU").format(n)} so'm`;
}

export function isPaid(status: string | null | undefined): boolean {
  return (status || "").toUpperCase() === "PAID";
}

export function cefrColor(cefr: string | null | undefined): string {
  switch ((cefr || "").toUpperCase()) {
    case "C2":
    case "C1":
      return "bg-emerald-100 text-emerald-700";
    case "B2":
    case "B1":
      return "bg-blue-100 text-blue-700";
    case "A2":
    case "A1":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
