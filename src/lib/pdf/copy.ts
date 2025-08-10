export function formatCurrency(amount?: string | number): string {
  const n = typeof amount === "string" ? Number.parseFloat(amount) : amount ?? 0;
  if (!Number.isFinite(n)) return "$0.00";
  return n.toLocaleString(undefined, { style: "currency", currency: "CAD", minimumFractionDigits: 2 });
}

export function formatDateISO(date?: string): string {
  if (!date) return "";
  // Expecting YYYY-MM-DD or similar – return as ISO style for consistency
  try {
    const d = new Date(date);
    if (!Number.isFinite(d.getTime())) return String(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  } catch {
    return String(date);
  }
}

export function formatDueDay(day?: string | number): string {
  const n = typeof day === "string" ? Number.parseInt(day, 10) : (day ?? 0);
  if (!Number.isFinite(n) || n <= 0) return "N/A";
  const suffix = getOrdinalSuffix(n);
  return `${n}${suffix}`;
}

function getOrdinalSuffix(n: number): string {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export const Copy = {
  complianceTag: "If any term conflicts with the applicable residential tenancies law, the Act prevails.",
};


