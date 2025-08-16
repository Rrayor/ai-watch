/**
 * Base result interface with common properties.
 */
export interface BaseCommandResult {
  /** Information message if applicable */
  info?: string[];
  /** ISO string representation of the result */
  iso?: string;
  /** UTC formatted string */
  utc?: string;
  /** Local timezone formatted string */
  local: string;
  /** Local timezone identifier */
  localTimezone: string;
  /** Formatted string in specified timezone */
  formattedResult: string;
  /** Target timezone identifier */
  resultTimezone: string;
}
