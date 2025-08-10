/**
 * Command option interfaces for AI Watch extension.
 * These interfaces define the input parameters for VS Code commands.
 */

import { VerbosityLevel } from '../utils/durationUtils';

/**
 * Options for getting current date/time.
 */
export interface GetCurrentDateOptions {
  /** IANA timezone identifier (e.g., 'America/New_York', 'Europe/Berlin') */
  timezone?: string;
  /** Date format pattern, defaults to 'YYYY-MM-DD HH:mm:ss' */
  format?: string;
}

/**
 * Options for calculating time differences between two dates.
 */
export interface CalculateDifferenceOptions {
  /** Starting date/time in ISO 8601 format */
  from: string;
  /** Ending date/time in ISO 8601 format */
  to: string;
}

/**
 * Options for converting dates between timezones.
 */
export interface ConvertTimezoneOptions {
  /** Date/time in ISO 8601 format to convert */
  date: string;
  /** Source timezone (defaults to UTC if not specified) */
  fromTimezone?: string;
  /** Target IANA timezone identifier */
  toTimezone: string;
}

/**
 * Options for adding time durations to a base date.
 */
export interface AddTimeOptions {
  /** Base time in ISO format (defaults to current time) */
  baseTime?: string;
  /** Number of years to add */
  years?: number;
  /** Number of months to add */
  months?: number;
  /** Number of weeks to add */
  weeks?: number;
  /** Number of days to add */
  days?: number;
  /** Number of hours to add */
  hours?: number;
  /** Number of minutes to add */
  minutes?: number;
  /** Number of seconds to add */
  seconds?: number;
  /** Display result in specific timezone */
  timezone?: string;
}

/**
 * Options for subtracting time durations from a base date.
 */
export interface SubtractTimeOptions {
  /** Base time in ISO format (defaults to current time) */
  baseTime?: string;
  /** Number of years to subtract */
  years?: number;
  /** Number of months to subtract */
  months?: number;
  /** Number of weeks to subtract */
  weeks?: number;
  /** Number of days to subtract */
  days?: number;
  /** Number of hours to subtract */
  hours?: number;
  /** Number of minutes to subtract */
  minutes?: number;
  /** Number of seconds to subtract */
  seconds?: number;
  /** Display result in specific timezone */
  timezone?: string;
}

/**
 * Options for formatting time durations into human-readable text.
 */
export interface FormatDurationOptions {
  /** Starting date/time in ISO format */
  from: string;
  /** Ending date/time in ISO format */
  to: string;
  /** Format verbosity: 'compact', 'standard', or 'verbose' */
  verbosity?: VerbosityLevel;
  /** Maximum number of time units to display */
  maxUnits?: number;
}

/**
 * Options for business day operations.
 */
export interface BusinessDayOptions {
  /** Type of business day operation to perform */
  operation: 'isBusinessDay' | 'addBusinessDays' | 'subtractBusinessDays';
  /** Base date in ISO format */
  date: string;
  /** Number of business days to add/subtract (required for add/subtract operations) */
  days?: number;
}

/**
 * Options for advanced date queries and navigation.
 */
export interface DateQueryOptions {
  /** Base date for calculations in ISO format */
  baseDate: string;
  /** Array of query operations to perform in sequence */
  queries: Array<{
    /** Type of date query operation */
    type: 'nextWeekday' | 'previousWeekday' | 'startOfPeriod' | 'endOfPeriod';
    /** Target weekday for weekday queries */
    weekday?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    /** Period type for period queries */
    period?: 'week' | 'month' | 'quarter' | 'year';
    /** Week start day (defaults to monday) */
    weekStart?: 'monday' | 'sunday';
  }>;
}
