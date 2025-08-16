export type BusinessDayOperation = 'isBusinessDay' | 'addBusinessDays' | 'subtractBusinessDays';

/**
 * Options for business day operations.
 */
export interface BusinessDayOptions {
  /** Type of business day operation to perform */
  operation: BusinessDayOperation;
  /** Base date in ISO format */
  date: string;
  /** Number of business days to add/subtract (required for add/subtract operations) */
  days?: number;
  /** Custom business day configuration (optional) */
  businessDays?: string[];
  /** Set of excluded dates in YYYY-MM-DD format (optional) */
  excludedDates?: string[];
}
