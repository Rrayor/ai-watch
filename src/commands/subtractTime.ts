/**
 * Command implementation for subtracting time durations from dates.
 */

import { SubtractTimeOptions, SubtractTimeResult } from '../types';
import { parseISOString, formatUTC, formatInTimezone, getUserTimezone } from '../utils';

// Constant for time calculations
const DAYS_PER_WEEK = 7;

/**
 * Subtracts time units from a date
 * @param date - Date object to modify (modified in place)
 * @param options - Configuration with time durations to subtract
 */
function subtractTimeUnits(date: Date, options: SubtractTimeOptions): void {
  if (options.years) {
    date.setFullYear(date.getFullYear() - options.years);
  }
  if (options.months) {
    date.setMonth(date.getMonth() - options.months);
  }
  if (options.weeks) {
    date.setDate(date.getDate() - options.weeks * DAYS_PER_WEEK);
  }
  if (options.days) {
    date.setDate(date.getDate() - options.days);
  }
  if (options.hours) {
    date.setHours(date.getHours() - options.hours);
  }
  if (options.minutes) {
    date.setMinutes(date.getMinutes() - options.minutes);
  }
  if (options.seconds) {
    date.setSeconds(date.getSeconds() - options.seconds);
  }
}

/**
 * Command function for subtracting time durations from dates.
 *
 * @param options - Configuration with time durations to subtract
 * @returns Object with the calculated past date
 */
export function subtractTimeCommand(options: SubtractTimeOptions): SubtractTimeResult {
  try {
    // Use provided base time or current time
    const baseDate = options.baseTime ? parseISOString(options.baseTime) : new Date();

    // Calculate the new date by subtracting the specified time units
    const newDate = new Date(baseDate);
    subtractTimeUnits(newDate, options);

    const result: SubtractTimeResult = {
      iso: newDate.toISOString(),
      utc: formatUTC(newDate),
      baseTime: baseDate.toISOString(),
    };

    // Include local timezone info
    const userTimezone = getUserTimezone();
    result.local = formatInTimezone(newDate, userTimezone);
    result.localTimezone = userTimezone;

    // If specific timezone requested, include that too
    if (options.timezone) {
      try {
        result.formatted = formatInTimezone(newDate, options.timezone);
        result.timezone = options.timezone;
      } catch {
        result.error = `Invalid timezone: ${options.timezone}`;
      }
    }

    return result;
  } catch {
    return {
      error: `Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.`,
    };
  }
}
