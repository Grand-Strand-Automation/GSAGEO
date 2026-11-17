/** Calendar-month helpers for subscription billing periods (UTC-based). */

export function addBillingMonths(from: Date, months = 1): Date {
  const d = new Date(from.getTime());
  const day = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + months);
  // Clamp overflow (e.g. Jan 31 + 1 month → Mar 3 in JS) back to month end.
  if (d.getUTCDate() < day) {
    d.setUTCDate(0);
  }
  return d;
}

export function nextBillingAtIso(from: Date = new Date(), months = 1): string {
  return addBillingMonths(from, months).toISOString();
}

export function isBillingPeriodDue(
  nextBillingAt: string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!nextBillingAt) return false;
  return new Date(nextBillingAt).getTime() <= now.getTime();
}
