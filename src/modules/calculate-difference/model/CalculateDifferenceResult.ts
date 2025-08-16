/**
 * Result interface for date difference calculations.
 */
export interface CalculateDifferenceResult {
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
