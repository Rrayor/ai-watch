/**
 * Options for advanced date queries and navigation.
 */
export interface DateQueryOptions {
  /** Base date for calculations in ISO format */
  baseDate: string;
  /** Optional IANA timezone for calculations; defaults to local timezone when omitted */
  timezone?: string;
  /** Array of query operations to perform in sequence */
  queries: Array<{
    /** Type of date query operation */
    type: 'nextWeekday' | 'previousWeekday' | 'startOfPeriod' | 'endOfPeriod';
    /** Target weekday for weekday queries */
    weekday?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    /** Period type for period queries */
    period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
    /** Week start day (defaults to sunday) */
    weekStart?: string | number | undefined;
  }>;
  /** If false, each query is evaluated independently against `baseDate` instead of chaining results. Defaults to true (chained). */
  chain?: boolean;
}
