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
