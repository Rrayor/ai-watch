/**
 * Command implementation for converting times between timezones.
 */

import { ConvertTimezoneOptions, ConvertTimezoneResult } from '../types';
import { parseISOString, formatInTimezone } from '../utils';

/**
 * Command function for converting times between timezones.
 *
 * @param options - Configuration with date and target timezone
 * @returns Object with timezone conversion results
 */
export function convertTimezoneCommand(options: ConvertTimezoneOptions): ConvertTimezoneResult {
  try {
    const date = parseISOString(options.date);
    // Default fromTimezone to UTC if not specified
    const fromTz = options.fromTimezone ?? 'UTC';
    const formatted = formatInTimezone(date, options.toTimezone);

    return {
      iso: date.toISOString(),
      formatted,
      toTimezone: options.toTimezone,
      fromTimezone: fromTz,
    };
  } catch {
    return {
      error:
        'Invalid date format or timezone. Please use ISO format for date and valid IANA timezone.',
    };
  }
}
