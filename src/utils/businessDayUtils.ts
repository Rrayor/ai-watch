/**
 * Business day utility functions for AI Watch extension.
 */

import { weekdayToNumber } from './dateUtils';

const SATURDAY_DAY_NUMBER = 6;
const INVALID_DAY = -1;

/**
 * Parses a business days string and returns an array of day numbers.
 *
 * @param businessDaysString - String describing business days (e.g., "Mon-Fri", "Mon,Wed,Fri")
 * @returns Array of day numbers (0=Sunday, 1=Monday, etc.)
 */
export function parseBusinessDays(businessDaysString: string): number[] {
  // Handle range format like "Mon-Fri"
  if (businessDaysString.includes('-')) {
    const [start, end] = businessDaysString.split('-');
    if (!start || !end) {
      throw new Error(`Invalid business days range format: ${businessDaysString}`);
    }
    const startDay = weekdayToNumber(start.trim());
    const endDay = weekdayToNumber(end.trim());

    const days = [];
    if (startDay <= endDay) {
      // Normal range (e.g., Mon-Fri: 1-5)
      for (let i = startDay; i <= endDay; i++) {
        days.push(i);
      }
    } else {
      // Wrap around range (e.g., Fri-Mon: 5-1, includes Fri, Sat, Sun, Mon)
      for (let i = startDay; i <= SATURDAY_DAY_NUMBER; i++) {
        days.push(i);
      }
      for (let i = 0; i <= endDay; i++) {
        days.push(i);
      }
    }
    return days;
  }

  // Handle comma-separated format like "Mon,Wed,Fri"
  return businessDaysString
    .split(',')
    .map((day) => {
      try {
        return weekdayToNumber(day.trim());
      } catch (_error) {
        console.warn(`Invalid weekday string "${day.trim()}":`, _error);
        return INVALID_DAY; // Invalid day marker
      }
    })
    .filter((day) => day >= 0); // Remove invalid days
}

/**
 * Checks if a given date is a business day.
 *
 * @param date - The date to check
 * @param businessDays - Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @param excludedDates - Set of excluded date strings in YYYY-MM-DD format
 * @returns True if the date is a business day and not excluded
 */
export function isBusinessDay(
  date: Date,
  businessDays: number[],
  excludedDates: Set<string>,
): boolean {
  const dayOfWeek = date.getUTCDay();
  const [dateString] = date.toISOString().split('T');

  if (!dateString) {
    throw new Error('Failed to extract date string from ISO format');
  }

  return businessDays.includes(dayOfWeek) && !excludedDates.has(dateString);
}

/**
 * Internal helper function to add or subtract business days.
 *
 * @param startDate - The starting date
 * @param businessDaysToAdd - Number of business days to add (positive) or subtract (negative)
 * @param businessDays - Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @param excludedDates - Set of excluded date strings in YYYY-MM-DD format
 * @returns The resulting date after adding/subtracting business days
 */
function adjustBusinessDays(
  startDate: Date,
  businessDaysToAdd: number,
  businessDays: number[],
  excludedDates: Set<string>,
): Date {
  const resultDate = new Date(startDate);
  const isAdding = businessDaysToAdd > 0;
  const daysToProcess = Math.abs(businessDaysToAdd);
  let processedDays = 0;

  while (processedDays < daysToProcess) {
    if (isAdding) {
      resultDate.setUTCDate(resultDate.getUTCDate() + 1);
    } else {
      resultDate.setUTCDate(resultDate.getUTCDate() - 1);
    }

    if (isBusinessDay(resultDate, businessDays, excludedDates)) {
      processedDays++;
    }
  }

  return resultDate;
}

/**
 * Adds a specified number of business days to a start date.
 *
 * @param startDate - The starting date
 * @param businessDaysToAdd - Number of business days to add
 * @param businessDays - Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @param excludedDates - Set of excluded date strings in YYYY-MM-DD format
 * @returns The resulting date after adding business days
 */
export function addBusinessDays(
  startDate: Date,
  businessDaysToAdd: number,
  businessDays: number[],
  excludedDates: Set<string>,
): Date {
  // Handle negative days by treating them as subtraction
  if (businessDaysToAdd < 0) {
    return adjustBusinessDays(startDate, businessDaysToAdd, businessDays, excludedDates);
  }

  return adjustBusinessDays(startDate, businessDaysToAdd, businessDays, excludedDates);
}

/**
 * Subtracts a specified number of business days from a start date.
 *
 * @param startDate - The starting date
 * @param businessDaysToSubtract - Number of business days to subtract
 * @param businessDays - Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @param excludedDates - Set of excluded date strings in YYYY-MM-DD format
 * @returns The resulting date after subtracting business days
 */
export function subtractBusinessDays(
  startDate: Date,
  businessDaysToSubtract: number,
  businessDays: number[],
  excludedDates: Set<string>,
): Date {
  return adjustBusinessDays(startDate, -businessDaysToSubtract, businessDays, excludedDates);
}
