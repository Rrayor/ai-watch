/**
 * Command implementation for date query operations.
 */

import { DateQueryOptions } from '../types';
import {
  parseISOString,
  getNextWeekday,
  getPreviousWeekday,
  getStartOfPeriod,
  getEndOfPeriod,
} from '../utils';

/**
 * Command function for date query operations.
 *
 * @param options - Configuration with date query parameters
 * @returns Object with date query results
 */
export function dateQueryCommand(options: DateQueryOptions) {
  try {
    const baseDate = parseISOString(options.baseDate);
    const results: Date[] = [];

    for (let i = 0; i < options.queries.length; i++) {
      const query = options.queries[i];
      let result: Date;

      switch (query.type) {
        case 'nextWeekday':
          if (!query.weekday) {
            throw new Error('Weekday required for nextWeekday query');
          }
          result = getNextWeekday(i === 0 ? baseDate : results[i - 1], query.weekday);
          break;
        case 'previousWeekday':
          if (!query.weekday) {
            throw new Error('Weekday required for previousWeekday query');
          }
          result = getPreviousWeekday(i === 0 ? baseDate : results[i - 1], query.weekday);
          break;
        case 'startOfPeriod':
          if (!query.period) {
            throw new Error('Period required for startOfPeriod query');
          }
          result = getStartOfPeriod(baseDate, query.period, query.weekStart);
          break;
        case 'endOfPeriod':
          if (!query.period) {
            throw new Error('Period required for endOfPeriod query');
          }
          result = getEndOfPeriod(baseDate, query.period, query.weekStart);
          break;
        default:
          throw new Error(`Unsupported query type: ${(query as any).type}`);
      }

      results.push(result);
    }

    if (results.length === 1) {
      return { date: results[0].toISOString() };
    } else {
      return { dates: results.map((d) => d.toISOString()) };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Invalid date query parameters' };
  }
}
