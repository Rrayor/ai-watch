/**
 * Date query utility functions for AI Watch extension.
 */

import { weekdayToNumber } from './dateUtils';

// Calendar constants
const DAYS_IN_WEEK = 7;
const MONTHS_PER_QUARTER = 3;
const DAYS_IN_WEEK_MINUS_ONE = 6; // For week end calculation
const DECEMBER_MONTH_INDEX = 11; // Zero-based month index for December
const LAST_DAY_OF_DECEMBER = 31;

// End of day time constants
const END_OF_DAY_HOUR = 23;
const END_OF_DAY_MINUTE = 59;
const END_OF_DAY_SECOND = 59;
const END_OF_DAY_MILLISECOND = 999;

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
    daysToAdd += DAYS_IN_WEEK;
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
    daysToSubtract += DAYS_IN_WEEK;
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
export function getStartOfPeriod(date: Date, period: string, weekStart = 'Monday'): Date {
  const result = new Date(date);

  switch (period) {
    case 'day':
      result.setHours(0, 0, 0, 0);
      break;
    case 'week': {
      const startDay = weekStart === 'Sunday' ? 0 : 1;
      const currentDay = result.getDay();
      const daysToSubtract = (currentDay - startDay + DAYS_IN_WEEK) % DAYS_IN_WEEK;
      result.setDate(result.getDate() - daysToSubtract);
      result.setHours(0, 0, 0, 0);
      break;
    }
    case 'month':
      result.setDate(1);
      result.setHours(0, 0, 0, 0);
      break;
    case 'quarter': {
      const quarterStartMonth =
        Math.floor(result.getMonth() / MONTHS_PER_QUARTER) * MONTHS_PER_QUARTER;
      result.setMonth(quarterStartMonth, 1);
      result.setHours(0, 0, 0, 0);
      break;
    }
    case 'year':
      result.setMonth(0, 1);
      result.setHours(0, 0, 0, 0);
      break;
    default:
      throw new Error(`getEndOfPeriod: Unsupported period: ${period}`);
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
export function getEndOfPeriod(date: Date, period: string, weekStart = 'Monday'): Date {
  const result = new Date(date);

  switch (period) {
    case 'day':
      result.setHours(
        END_OF_DAY_HOUR,
        END_OF_DAY_MINUTE,
        END_OF_DAY_SECOND,
        END_OF_DAY_MILLISECOND,
      );
      break;
    case 'week': {
      const startOfWeek = getStartOfPeriod(date, 'week', weekStart);
      result.setTime(startOfWeek.getTime());
      result.setDate(result.getDate() + DAYS_IN_WEEK_MINUS_ONE);
      result.setHours(
        END_OF_DAY_HOUR,
        END_OF_DAY_MINUTE,
        END_OF_DAY_SECOND,
        END_OF_DAY_MILLISECOND,
      );
      break;
    }
    case 'month':
      result.setMonth(result.getMonth() + 1, 0);
      result.setHours(
        END_OF_DAY_HOUR,
        END_OF_DAY_MINUTE,
        END_OF_DAY_SECOND,
        END_OF_DAY_MILLISECOND,
      );
      break;
    case 'quarter': {
      const quarterStartMonth =
        Math.floor(result.getMonth() / MONTHS_PER_QUARTER) * MONTHS_PER_QUARTER;
      result.setMonth(quarterStartMonth + MONTHS_PER_QUARTER, 0);
      result.setHours(
        END_OF_DAY_HOUR,
        END_OF_DAY_MINUTE,
        END_OF_DAY_SECOND,
        END_OF_DAY_MILLISECOND,
      );
      break;
    }
    case 'year':
      result.setMonth(DECEMBER_MONTH_INDEX, LAST_DAY_OF_DECEMBER);
      result.setHours(
        END_OF_DAY_HOUR,
        END_OF_DAY_MINUTE,
        END_OF_DAY_SECOND,
        END_OF_DAY_MILLISECOND,
      );
      break;
    default:
      throw new Error(`Unsupported period: ${period}`);
  }

  return result;
}
