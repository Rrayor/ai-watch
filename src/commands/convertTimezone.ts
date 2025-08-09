/**
 * Command implementation for converting times between timezones.
 */

import { ConvertTimezoneOptions } from '../types';
import { parseISOString, formatInTimezone } from '../utils';

/**
 * Command function for converting times between timezones.
 *
 * @param options - Configuration with date and target timezone
 * @returns Object with timezone conversion results
 */
export function convertTimezoneCommand(options: ConvertTimezoneOptions) {
  try {
    const date = parseISOString(options.date);
    // Default fromTimezone to UTC if not specified
    const fromTz = options.fromTimezone || 'UTC';
    const formatted = formatInTimezone(date, options.toTimezone);

    return {
      formatted,
      fromTimezone: fromTz,
      toTimezone: options.toTimezone,
      iso: date.toISOString(),
    };
  } catch (error) {
    return {
      error: `Invalid date format or timezone. Please use ISO format for date and valid IANA timezone.`,
    };
  }
}
