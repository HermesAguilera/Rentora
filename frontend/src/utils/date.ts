export const MONTH_LABELS_ES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const;

export const MONTH_LABELS_ES_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

/** Renders a lease length such as `26` months as "2 años 2 meses". */
export function formatDurationMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
  }
  if (remainingMonths > 0 || parts.length === 0) {
    parts.push(`${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`);
  }
  return parts.join(' ');
}

/** Short relative date such as "2 mar" for list rows. */
export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getDate()} ${MONTH_LABELS_ES[date.getMonth()]}`;
}

/** Clock time such as "12:45 PM" for chat messages. */
export function formatMessageTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/** Lowercase short date such as "1 jul 2024" for booking rows. Reads UTC fields since date-only ISO strings (no time) parse to UTC midnight. */
export function formatBookingDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getUTCDate()} ${MONTH_LABELS_ES[date.getUTCMonth()].toLowerCase()} ${date.getUTCFullYear()}`;
}

/** Date such as "21 de julio" for notification rows. Reads UTC fields since date-only ISO strings (no time) parse to UTC midnight. */
export function formatNotificationDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getUTCDate()} de ${MONTH_LABELS_ES_LONG[date.getUTCMonth()]}`;
}

/** Full date such as "2 de agosto de 2026" for receipts and confirmations. Reads UTC fields since date-only ISO strings (no time) parse to UTC midnight. */
export function formatLongDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getUTCDate()} de ${MONTH_LABELS_ES_LONG[date.getUTCMonth()]} de ${date.getUTCFullYear()}`;
}

/** Month and year such as "febrero 2024" for "member since" labels. Reads UTC fields since date-only ISO strings (no time) parse to UTC midnight. */
export function formatMonthYear(isoDate: string): string {
  const date = new Date(isoDate);
  return `${MONTH_LABELS_ES_LONG[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
