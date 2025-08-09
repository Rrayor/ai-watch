/**
 * Date query utility functions for AI Watch extension.
 */

import { weekdayToNumber } from './dateUtils';

/**
 * Gets the next occurrence of a specific weekday from a start date.
 *
 * @param startDate - Starting date
 * @param targetWeekday - Target weekday name
 * @returns Date of the next occurrence of the target weekday
 */
export function getNextWeekday(startDate: Date, targetWeekday: string): Date {
  const targetDay = weekdayToNumber(targetWeekday);
  const currentDay = startDate.getDay();

  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }

  const result = new Date(startDate);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

/**
 * Gets the previous occurrence of a specific weekday from a start date.
 *
 * @param startDate - Starting date
 * @param targetWeekday - Target weekday name
 * @returns Date of the previous occurrence of the target weekday
 */
export function getPreviousWeekday(startDate: Date, targetWeekday: string): Date {
  const targetDay = weekdayToNumber(targetWeekday);
  const currentDay = startDate.getDay();

  let daysToSubtract = currentDay - targetDay;
  if (daysToSubtract <= 0) {
    daysToSubtract += 7;
  }

  const result = new Date(startDate);
  result.setDate(result.getDate() - daysToSubtract);
  return result;
}

/**
 * Gets the start of a specific period for the given date.
 *
 * @param date - Base date
 * @param period - Period type (day, week, month, quarter, year)
 * @param weekStart - Week start day (Monday or Sunday)
 * @returns Date representing the start of the period
 */
export function getStartOfPeriod(date: Date, period: string, weekStart: string = 'Monday'): Date {
  const result = new Date(date);

  switch (period) {
    case 'day':
      result.setHours(0, 0, 0, 0);
      break;
    case 'week':
      const startDay = weekStart === 'Sunday' ? 0 : 1;
      const currentDay = result.getDay();
      let daysToSubtract = (currentDay - startDay + 7) % 7;
      result.setDate(result.getDate() - daysToSubtract);
      result.setHours(0, 0, 0, 0);
      break;
    case 'month':
      result.setDate(1);
      result.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      const quarterStartMonth = Math.floor(result.getMonth() / 3) * 3;
      result.setMonth(quarterStartMonth, 1);
      result.setHours(0, 0, 0, 0);
      break;
    case 'year':
      result.setMonth(0, 1);
      result.setHours(0, 0, 0, 0);
      break;
  }

  return result;
}

/**
 * Gets the end of a specific period for the given date.
 *
 * @param date - Base date
 * @param period - Period type (day, week, month, quarter, year)
 * @param weekStart - Week start day (Monday or Sunday)
 * @returns Date representing the end of the period
 */
export function getEndOfPeriod(date: Date, period: string, weekStart: string = 'Monday'): Date {
  const result = new Date(date);

  switch (period) {
    case 'day':
      result.setHours(23, 59, 59, 999);
      break;
    case 'week':
      const startOfWeek = getStartOfPeriod(date, 'week', weekStart);
      result.setTime(startOfWeek.getTime());
      result.setDate(result.getDate() + 6);
      result.setHours(23, 59, 59, 999);
      break;
    case 'month':
      result.setMonth(result.getMonth() + 1, 0);
      result.setHours(23, 59, 59, 999);
      break;
    case 'quarter':
      const quarterStartMonth = Math.floor(result.getMonth() / 3) * 3;
      result.setMonth(quarterStartMonth + 3, 0);
      result.setHours(23, 59, 59, 999);
      break;
    case 'year':
      result.setMonth(11, 31);
      result.setHours(23, 59, 59, 999);
      break;
  }

  return result;
}
