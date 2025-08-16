export type VerbosityLevel = 'compact' | 'standard' | 'verbose';
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
