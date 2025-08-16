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
