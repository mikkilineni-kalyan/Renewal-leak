export function formatCents(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function normalizeDeclineCode(code: string | null | undefined) {
  const trimmed = code?.trim();
  return trimmed ? trimmed : "unknown";
}

export function thirtyDaysAgo(now = new Date()) {
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
}
