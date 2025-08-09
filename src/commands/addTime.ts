/**
 * Command implementation for adding time durations to dates.
 */

import { AddTimeOptions } from '../types';
import { parseISOString, formatUTC, formatInTimezone, getUserTimezone } from '../utils';

/**
 * Command function for adding time durations to dates.
 *
 * @param options - Configuration with time durations to add
 * @returns Object with the calculated future date
 */
export function addTimeCommand(options: AddTimeOptions) {
  try {
    // Use provided base time or current time
    const baseDate = options.baseTime ? parseISOString(options.baseTime) : new Date();

    // Calculate the new date by adding the specified time units
    const newDate = new Date(baseDate);

    if (options.years) {
      newDate.setFullYear(newDate.getFullYear() + options.years);
    }
    if (options.months) {
      newDate.setMonth(newDate.getMonth() + options.months);
    }
    if (options.weeks) {
      newDate.setDate(newDate.getDate() + options.weeks * 7);
    }
    if (options.days) {
      newDate.setDate(newDate.getDate() + options.days);
    }
    if (options.hours) {
      newDate.setHours(newDate.getHours() + options.hours);
    }
    if (options.minutes) {
      newDate.setMinutes(newDate.getMinutes() + options.minutes);
    }
    if (options.seconds) {
      newDate.setSeconds(newDate.getSeconds() + options.seconds);
    }

    const result: any = {
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
      } catch (error) {
        result.error = `Invalid timezone: ${options.timezone}`;
      }
    }

    return result;
  } catch (error) {
    return {
      error: `Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.`,
    };
  }
}
