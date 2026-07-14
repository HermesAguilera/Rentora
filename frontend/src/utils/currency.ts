/**
 * Formats an amount as Honduran Lempiras, e.g. `formatLempiras(14200)` -> "L 14,200".
 * Uses manual grouping instead of Intl currency formatting so the "L " prefix
 * stays stable across browsers/ICU data.
 */
export function formatLempiras(amount: number, fractionDigits = 0): string {
  const grouped = amount.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `L ${grouped}`;
}
