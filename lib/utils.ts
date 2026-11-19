/**
 * AyojanSetu – Utility Helpers
 */

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

export const MUHURTHAM_DAYS_BY_MONTH: Record<number, number[]> = {
  10: [19, 20, 22, 25, 28, 29],
  11: [3, 4, 6, 11, 13, 18, 20, 25],
  0: [15, 18, 22, 24, 29],
  1: [5, 7, 12, 14, 19, 21],
};

export function formatIsoDate(year: number, monthIndex: number, day: number): string {
  const mm = String(monthIndex + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function formatPanchangamDisplayDate(
  year: number,
  monthIndex: number,
  day: number,
  isMuhurtham: boolean
): string {
  const ddFormatted = String(day).padStart(2, '0');
  const suffix = isMuhurtham ? ' · Muhurtham' : '';
  return `${ddFormatted} ${SHORT_MONTHS[monthIndex]} ${year}${suffix}`;
}
