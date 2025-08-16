/**
 * Result interface for business day operations.
 */
export interface BusinessDayResult {
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
