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
 * @param baseDate - Original base date
 * @param results - Array of previous query results
 * @param index - Current query index
 * @returns Base date to use for the query
 * @throws Error if base date is invalid
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
 * @param query - Query object containing weekday to find
 * @param baseDate - Original base date
 * @param results - Array of previous query results
 * @param index - Current query index
 * @returns Date of next occurrence of the specified weekday
 * @throws Error if weekday is missing
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
 * @param query - Query object containing weekday to find
 * @param baseDate - Original base date
 * @param results - Array of previous query results
 * @param index - Current query index
 * @returns Date of previous occurrence of the specified weekday
 * @throws Error if weekday is missing
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
 * @param query - Query object containing period information
 * @param baseDate - Base date for the query
 * @returns Date representing the start of the specified period
 * @throws Error if period is missing
 */
function processStartOfPeriodQuery(query: DateQueryOptions['queries'][0], baseDate: Date): Date {
  if (!query.period) {
    throw new Error('Period required for startOfPeriod query');
  }
  return getStartOfPeriod(baseDate, query.period, query.weekStart);
}

/**
 * Processes an endOfPeriod query
 * @param query - Query object containing period information
 * @param baseDate - Base date for the query
 * @returns Date representing the end of the specified period
 * @throws Error if period is missing
 */
function processEndOfPeriodQuery(query: DateQueryOptions['queries'][0], baseDate: Date): Date {
  if (!query.period) {
    throw new Error('Period required for endOfPeriod query');
  }
  return getEndOfPeriod(baseDate, query.period, query.weekStart);
}

/**
 * Processes a single query operation
 * @param query - Query object containing operation type and parameters
 * @param baseDate - Original base date
 * @param results - Array of previous query results
 * @param index - Current query index
 * @returns Date result of the query operation
 * @throws Error if query type is unsupported
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
