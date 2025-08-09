/**
 * Business day utility functions for AI Watch extension.
 */

import { weekdayToNumber } from './dateUtils';

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
    const startDay = weekdayToNumber(start.trim());
    const endDay = weekdayToNumber(end.trim());

    const days = [];
    if (startDay <= endDay) {
      // Normal range (e.g., Mon-Fri: 1-5)
      for (let i = startDay; i <= endDay; i++) {
        days.push(i);
      }
    } else {
      // Wrap-around range (e.g., Fri-Mon: 5-1 wraps to [5,6,0,1])
      for (let i = startDay; i <= 6; i++) {
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
      } catch (error) {
        console.warn(`Invalid weekday string "${day.trim()}":`, error);
        return undefined;
      }
    })
    .filter((day): day is number => typeof day === 'number');
}

/**
 * Checks if a date is a business day and not in excluded dates.
 *
 * @param date - Date to check
 * @param businessDays - Array of business day numbers
 * @param excludedDates - Set of excluded date strings
 * @returns True if the date is a business day and not excluded
 */
export function isBusinessDay(
  date: Date,
  businessDays: number[],
  excludedDates: Set<string>,
): boolean {
  const dayOfWeek = date.getDay();
  const dateString = date.toISOString().split('T')[0];

  return businessDays.includes(dayOfWeek) && !excludedDates.has(dateString);
}

/**
 * Adds a specified number of business days to a start date.
 *
 * @param startDate - Starting date
 * @param days - Number of business days to add (can be negative)
 * @param businessDays - Array of business day numbers
 * @param excludedDates - Set of excluded date strings
 * @returns New date with business days added
 */
export function addBusinessDays(
  startDate: Date,
  days: number,
  businessDays: number[],
  excludedDates: Set<string>,
): Date {
  const result = new Date(startDate);
  let daysToAdd = Math.abs(days);
  const direction = days >= 0 ? 1 : -1;

  while (daysToAdd > 0) {
    result.setDate(result.getDate() + direction);
    if (isBusinessDay(result, businessDays, excludedDates)) {
      daysToAdd--;
    }
  }

  return result;
}
