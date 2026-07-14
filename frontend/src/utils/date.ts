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
