/**
 * Options for advanced date queries and navigation.
 */
export interface DateQueryOptions {
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
    weekStart?: string | number | undefined;
  }>;
}
