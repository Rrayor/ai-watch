/**
 * Result type definitions for AI Watch extension commands.
 */

/**
 * Base result interface with common properties.
 */
export interface BaseCommandResult {
  /** Error message if operation failed */
  error?: string;
  /** ISO string representation of the result */
  iso?: string;
  /** UTC formatted string */
  utc?: string;
  /** Local timezone formatted string */
  local?: string;
  /** Local timezone identifier */
  localTimezone?: string;
  /** Formatted string in specified timezone */
  formatted?: string;
  /** Target timezone identifier */
  timezone?: string;
}

/**
 * Result interface for time addition operations.
 */
export interface AddTimeResult extends BaseCommandResult {
  /** Base time used for calculation */
  baseTime?: string;
}

/**
 * Result interface for time subtraction operations.
 */
export interface SubtractTimeResult extends BaseCommandResult {
  /** Base time used for calculation */
  baseTime?: string;
}

/**
 * Result interface for timezone conversion operations.
 */
export interface ConvertTimezoneResult {
  /** Error message if operation failed */
  error?: string;
  /** ISO string representation of the result */
  iso?: string;
  /** Formatted string in target timezone */
  formatted?: string;
  /** Target timezone identifier */
  toTimezone?: string;
  /** Source timezone identifier */
  fromTimezone?: string;
}

/**
 * Result interface for date difference calculations.
 */
export interface CalculateDifferenceResult {
  /** Error message if operation failed */
  error?: string;
  /** Total difference in milliseconds */
  milliseconds?: number;
  /** Total difference in seconds */
  seconds?: number;
  /** Total difference in minutes */
  minutes?: number;
  /** Total difference in hours */
  hours?: number;
  /** Total difference in days */
  days?: number;
  /** Formatted duration string */
  formatted?: string;
}

/**
 * Result interface for business day operations.
 */
export interface BusinessDayResult {
  /** Error message if operation failed */
  error?: string;
  /** Input date used for the operation */
  date?: string;
  /** Operation that was performed */
  operation?: string;
  /** Whether the date is a business day (for isBusinessDay operation) */
  isBusinessDay?: boolean;
  /** Day name (e.g., "Monday") */
  weekday?: string;
  /** Result date for add/subtract operations */
  result?: string;
  /** Number of business days added/subtracted */
  days?: number;
  /** Business day configuration used */
  businessDays?: string;
  /** Excluded dates that were considered */
  excludedDates?: string[];
}

/**
 * Result interface for current date operations.
 */
export interface GetCurrentDateResult extends BaseCommandResult {
  /** Human-readable local time */
  localTime?: string;
}

/**
 * Result interface for date query operations.
 */
export interface DateQueryResult {
  /** Error message if operation failed */
  error?: string;
  /** Single result date */
  date?: string;
  /** Multiple result dates */
  dates?: string[];
  /** Query that was executed */
  query?: string;
}

/**
 * Result interface for duration formatting operations.
 */
export interface FormatDurationResult {
  /** Error message if operation failed */
  error?: string;
  /** Formatted duration string */
  formatted?: string;
  /** Total duration in milliseconds */
  totalMilliseconds?: number;
}
