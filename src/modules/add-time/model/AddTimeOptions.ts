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
