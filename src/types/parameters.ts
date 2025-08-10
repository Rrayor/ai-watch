/**
 * Language Model Tool parameter interfaces for AI Watch extension.
 * These interfaces define the input parameters for AI Language Model Tools.
 */

import { VerbosityLevel } from '../utils/durationUtils';

/**
 * Language Model Tool parameters for getting current date/time.
 */
export interface IGetCurrentDateParameters {
  timezone?: string;
  format?: string;
}

/**
 * Language Model Tool parameters for calculating time differences.
 */
export interface ICalculateDifferenceParameters {
  /** Starting date/time in ISO 8601 format */
  from: string;
  /** Ending date/time in ISO 8601 format */
  to: string;
}

/**
 * Language Model Tool parameters for timezone conversion.
 */
export interface IConvertTimezoneParameters {
  /** Date/time in ISO 8601 format to convert */
  date: string;
  /** Source timezone (defaults to UTC if not specified) */
  fromTimezone?: string;
  /** Target IANA timezone identifier */
  toTimezone: string;
}

/**
 * Language Model Tool parameters for adding time durations.
 */
export interface IAddTimeParameters {
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
 * Language Model Tool parameters for subtracting time durations.
 */
export interface ISubtractTimeParameters {
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
 * Language Model Tool parameters for duration formatting.
 */
export interface IFormatDurationParameters {
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
 * Language Model Tool parameters for business day operations.
 */
export interface IBusinessDayParameters {
  /** Type of business day operation to perform */
  operation: 'isBusinessDay' | 'addBusinessDays' | 'subtractBusinessDays';
  /** Base date in ISO format */
  date: string;
  /** Number of business days to add/subtract (required for add/subtract operations) */
  days?: number;
}

/**
 * Language Model Tool parameters for date queries.
 */
export interface IDateQueryParameters {
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
