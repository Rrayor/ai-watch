/**
 * Command implementation for getting the current date and time.
 */

import { GetCurrentDateOptions, GetCurrentDateResult } from '../types';
import { formatUTC, formatInTimezone, getUserTimezone } from '../utils';

/**
 * Command function for getting the current date and time.
 *
 * @param options - Optional configuration for timezone and format
 * @returns Object with current date/time information
 */
export function getCurrentDateCommand(options?: GetCurrentDateOptions): GetCurrentDateResult {
  const now = new Date();
  const result: GetCurrentDateResult = {
    iso: now.toISOString(),
    utc: formatUTC(now),
  };

  // If no options provided, also include local timezone
  if (!options || (!options.timezone && !options.format)) {
    const userTimezone = getUserTimezone();
    result.local = formatInTimezone(now, userTimezone);
    result.localTimezone = userTimezone;
  }

  if (options?.timezone) {
    try {
      result.formatted = formatInTimezone(now, options.timezone, options.format);
      result.timezone = options.timezone;
    } catch {
      result.error = `Invalid timezone: ${options.timezone}`;
    }
  } else if (options?.format) {
    try {
      result.formatted = formatInTimezone(now, undefined, options.format);
    } catch {
      result.error = `Invalid format: ${options.format}`;
    }
  }

  return result;
}
