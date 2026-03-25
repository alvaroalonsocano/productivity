import {
  format, isToday, isTomorrow, isYesterday,
  parseISO, differenceInCalendarDays, startOfDay,
  addDays, subDays, isSameDay,
} from 'date-fns';
import { es } from 'date-fns/locale';

export const toDateString = (date: Date): string => format(date, 'yyyy-MM-dd');

export const todayString = (): string => toDateString(new Date());

export const formatDate = (dateStr: string): string => {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Hoy';
  if (isTomorrow(date)) return 'Mañana';
  if (isYesterday(date)) return 'Ayer';
  return format(date, 'd MMM', { locale: es });
};

export const formatFullDate = (dateStr: string): string =>
  format(parseISO(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es });

export const formatMonthYear = (dateStr: string): string =>
  format(parseISO(dateStr), "MMMM yyyy", { locale: es });

export const isOverdue = (dueDateStr: string): boolean => {
  const due = parseISO(dueDateStr);
  const today = startOfDay(new Date());
  return differenceInCalendarDays(due, today) < 0;
};

export const isDueToday = (dueDateStr: string): boolean =>
  isToday(parseISO(dueDateStr));

export const getDaysAgo = (days: number): string =>
  toDateString(subDays(new Date(), days));

export const getWeekDates = (referenceDate?: string): string[] => {
  const base = referenceDate ? parseISO(referenceDate) : new Date();
  return Array.from({ length: 7 }, (_, i) => toDateString(subDays(base, 6 - i)));
};

export const isSameDateStr = (a: string, b: string): boolean =>
  isSameDay(parseISO(a), parseISO(b));

export const parseDate = parseISO;
export { format, isToday, addDays, subDays, differenceInCalendarDays };
