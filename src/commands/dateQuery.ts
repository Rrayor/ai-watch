/**
 * Command implementation for date query operations.
 */

import { DateQueryOptions, DateQueryResult } from '../types';
import {
  parseISOString,
  getNextWeekday,
  getPreviousWeekday,
  getStartOfPeriod,
  getEndOfPeriod,
} from '../utils';

/**
 * Gets the base date for a query (either original base date or previous result)
 */
function getQueryBaseDate(baseDate: Date, results: Date[], index: number): Date {
  const result = index === 0 ? baseDate : results[index - 1];
  if (!result) {
    throw new Error('Invalid base date');
  }
  return result;
}

/**
 * Processes a nextWeekday query
 */
function processNextWeekdayQuery(
  query: DateQueryOptions['queries'][0],
  baseDate: Date,
  results: Date[],
  index: number,
): Date {
  if (!query.weekday) {
    throw new Error('Weekday required for nextWeekday query');
  }
  const queryBase = getQueryBaseDate(baseDate, results, index);
  return getNextWeekday(queryBase, query.weekday);
}

/**
 * Processes a previousWeekday query
 */
function processPreviousWeekdayQuery(
  query: DateQueryOptions['queries'][0],
  baseDate: Date,
  results: Date[],
  index: number,
): Date {
  if (!query.weekday) {
    throw new Error('Weekday required for previousWeekday query');
  }
  const queryBase = getQueryBaseDate(baseDate, results, index);
  return getPreviousWeekday(queryBase, query.weekday);
}

/**
 * Processes a startOfPeriod query
 */
function processStartOfPeriodQuery(query: DateQueryOptions['queries'][0], baseDate: Date): Date {
  if (!query.period) {
    throw new Error('Period required for startOfPeriod query');
  }
  return getStartOfPeriod(baseDate, query.period, query.weekStart);
}

/**
 * Processes an endOfPeriod query
 */
function processEndOfPeriodQuery(query: DateQueryOptions['queries'][0], baseDate: Date): Date {
  if (!query.period) {
    throw new Error('Period required for endOfPeriod query');
  }
  return getEndOfPeriod(baseDate, query.period, query.weekStart);
}

/**
 * Processes a single query operation
 */
function processQuery(
  query: DateQueryOptions['queries'][0],
  baseDate: Date,
  results: Date[],
  index: number,
): Date {
  switch (query.type) {
    case 'nextWeekday':
      return processNextWeekdayQuery(query, baseDate, results, index);
    case 'previousWeekday':
      return processPreviousWeekdayQuery(query, baseDate, results, index);
    case 'startOfPeriod':
      return processStartOfPeriodQuery(query, baseDate);
    case 'endOfPeriod':
      return processEndOfPeriodQuery(query, baseDate);
    default:
      throw new Error(`Unsupported query type: ${(query as { type: string }).type}`);
  }
}

/**
 * Command function for date query operations.
 *
 * @param options - Configuration with date query parameters
 * @returns Object with date query results
 */
export function dateQueryCommand(options: DateQueryOptions): DateQueryResult {
  try {
    const baseDate = parseISOString(options.baseDate);
    const results: Date[] = [];

    for (let i = 0; i < options.queries.length; i++) {
      const query = options.queries[i];
      if (!query) {
        throw new Error(`Invalid query at index ${i}`);
      }

      const result = processQuery(query, baseDate, results, i);
      results.push(result);
    }

    if (results.length === 1) {
      const [firstResult] = results;
      if (!firstResult) {
        throw new Error('No valid results found');
      }
      return {
        date: firstResult.toISOString(),
        query: JSON.stringify(options.queries),
      };
    }

    return {
      dates: results.map((d) => d.toISOString()),
      query: JSON.stringify(options.queries),
    };
  } catch (_error) {
    return { error: _error instanceof Error ? _error.message : 'Invalid date query parameters' };
  }
}
