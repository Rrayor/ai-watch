/**
 * Command implementation for date query operations.
 */
import {
  addDays,
  subDays,
  getDay,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfQuarter,
  endOfYear,
} from 'date-fns';
import { InvalidDateError, parseISOString, weekdayToNumber } from '../../shared';
import { InvalidQueryError } from '../error/InvalidQueryError';
import { InvalidWeekDayQueryError } from '../error/InvalidWeekDayQueryError';
import { DateQueryOptions } from '../model/DateQueryOptions';
import { DateQueryResult } from '../model/DateQueryResult';
import { MissingPeriodQueryError } from '../error/MissingPeriodQueryError';
import { InvalidPeriodQueryError } from '../error/InvalidPeriodQueryError';
import { workspace } from 'vscode';

// Calendar constants
const DAYS_IN_WEEK = 7;

/**
 * Command function for date query operations.
 *
 * @param options - Configuration with date query parameters
 * @returns Object with date query results
 * @throws {InvalidQueryError} If any query operation is invalid
 * @throws {InvalidWeekDayQueryError} If a weekday is invalid
 * @throws {InvalidDateError} If the base date is invalid
 * @throws {MissingPeriodQueryError} If a period is missing
 * @throws {InvalidPeriodQueryError} If a period is invalid
 */
export function dateQueryCommand(options: DateQueryOptions): DateQueryResult {
  const baseDate = parseISOString(options.baseDate);
  const results: Date[] = [];

  const weekStartsOnConfig = workspace
    .getConfiguration('aiWatch')
    .get<string | number>('weekStart');

  for (let i = 0; i < options.queries.length; i++) {
    const query = options.queries[i];
    if (!query) {
      throw new InvalidQueryError(`Invalid query at index ${i}`);
    }

    if (!query.weekStart && weekStartsOnConfig) {
      query.weekStart = weekStartsOnConfig;
    }

    const result = processQuery(query, baseDate, results, i);
    results.push(result);
  }

  return {
    dates: results.map((d) => d.toISOString()),
  };
}

/**
 * Gets the base date for a query (either original base date or previous result)
 * @param baseDate - Original base date
 * @param results - Array of previous query results
 * @param index - Current query index
 * @returns Base date to use for the query
 * @throws {InvalidDateError} if base date is invalid
 */
function getQueryBaseDate(baseDate: Date, results: Date[], index: number): Date {
  const result = index === 0 ? baseDate : results[index - 1];
  if (!result) {
    throw new InvalidDateError('Invalid base date');
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
 * @throws {InvalidWeekDayQueryError} if weekday is missing
 * @throws {InvalidDateError} if base date is invalid
 */
function processNextWeekdayQuery(
  query: DateQueryOptions['queries'][0],
  baseDate: Date,
  results: Date[],
  index: number,
): Date {
  if (!query.weekday) {
    throw new InvalidWeekDayQueryError('Weekday required for nextWeekday query');
  }
  const queryBase = getQueryBaseDate(baseDate, results, index);
  return getNextOccurenceOfWeekday(queryBase, query.weekday, query.weekStart);
}

/**
 * Processes a previousWeekday query
 * @param query - Query object containing weekday to find
 * @param baseDate - Original base date
 * @param results - Array of previous query results
 * @param index - Current query index
 * @returns Date of previous occurrence of the specified weekday
 * @throws {InvalidWeekDayQueryError} if weekday is missing
 * @throws {InvalidDateError} if base date is invalid
 */
function processPreviousWeekdayQuery(
  query: DateQueryOptions['queries'][0],
  baseDate: Date,
  results: Date[],
  index: number,
): Date {
  if (!query.weekday) {
    throw new InvalidWeekDayQueryError('Weekday required for previousWeekday query');
  }
  const queryBase = getQueryBaseDate(baseDate, results, index);
  return getPreviousWeekday(queryBase, query.weekday, query.weekStart);
}

/**
 * Processes a startOfPeriod query
 * @param query - Query object containing period information
 * @param baseDate - Base date for the query
 * @returns Date representing the start of the specified period
 * @throws {MissingPeriodQueryError} if period is missing
 * @throws {InvalidPeriodQueryError} if period is invalid
 */
function processStartOfPeriodQuery(query: DateQueryOptions['queries'][0], baseDate: Date): Date {
  if (!query.period) {
    throw new MissingPeriodQueryError('Period required for startOfPeriod query');
  }
  return getStartOfPeriod(baseDate, query.period, query.weekStart);
}

/**
 * Processes an endOfPeriod query
 * @param query - Query object containing period information
 * @param baseDate - Base date for the query
 * @returns Date representing the end of the specified period
 * @throws {MissingPeriodQueryError} if period is missing
 * @throws {InvalidPeriodQueryError} if period is invalid
 */
function processEndOfPeriodQuery(query: DateQueryOptions['queries'][0], baseDate: Date): Date {
  if (!query.period) {
    throw new MissingPeriodQueryError('Period required for endOfPeriod query');
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
 * @throws {InvalidQueryError} if query type is unsupported
 * @throws {InvalidWeekDayQueryError} if weekday is invalid
 * @throws {InvalidDateError} if base date is invalid
 * @throws {MissingPeriodQueryError} if period is missing
 * @throws {InvalidPeriodQueryError} if period is invalid
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
      throw new InvalidQueryError(`Unsupported query type: ${(query as { type: string }).type}`);
  }
}

/**
 * Gets the next occurrence of a specific weekday from a start date.
 *
 * @param startDate - Starting date
 * @param targetWeekday - Target weekday name
 * @returns Date of the next occurrence of the target weekday
 * @throws {InvalidWeekDayError} if the weekday is invalid
 */
function getNextOccurenceOfWeekday(
  startDate: Date,
  targetWeekday: string,
  startOfWeek: string | number | undefined,
): Date {
  const targetDay = weekdayToNumber(targetWeekday, startOfWeek);
  const currentDay = getDay(startDate);
  const daysToAdd = (targetDay - currentDay + DAYS_IN_WEEK) % DAYS_IN_WEEK || DAYS_IN_WEEK;
  return addDays(startDate, daysToAdd);
}

/**
 * Gets the previous occurrence of a specific weekday from a start date.
 *
 * @param startDate - Starting date
 * @param targetWeekday - Target weekday name
 * @returns Date of the previous occurrence of the target weekday
 * @throws {InvalidWeekDayError} if the weekday is invalid
 */

export function getPreviousWeekday(
  startDate: Date,
  targetWeekday: string,
  startOfWeek: string | number | undefined,
): Date {
  const targetDay = weekdayToNumber(targetWeekday, startOfWeek);
  const currentDay = getDay(startDate);
  const daysToSubtract = (currentDay - targetDay + DAYS_IN_WEEK) % DAYS_IN_WEEK || DAYS_IN_WEEK;
  return subDays(startDate, daysToSubtract);
}

/**
 * Gets the start of a specific period for the given date.
 *
 * @param date - Base date
 * @param period - Period type (day, week, month, quarter, year)
 * @param weekStart - Week start day (Monday or Sunday)
 * @returns Date representing the start of the period
 */
export function getStartOfPeriod(
  date: Date,
  period: string,
  weekStart: string | number = 'Monday',
): Date {
  switch (period) {
    case 'day':
      return startOfDay(date);
    case 'week':
      return startOfWeek(date, { weekStartsOn: resolveWeekStartsOn(weekStart) });
    case 'month':
      return startOfMonth(date);
    case 'quarter':
      return startOfQuarter(date);
    case 'year':
      return startOfYear(date);
    default:
      throw new InvalidPeriodQueryError(`getStartOfPeriod: Unsupported period: ${period}`);
  }
}

/**
 * Gets the end of a specific period for the given date.
 *
 * @param date - Base date
 * @param period - Period type (day, week, month, quarter, year)
 * @param weekStart - Week start day (Monday or Sunday)
 * @returns Date representing the end of the period
 * @throws {InvalidPeriodQueryError} if the period is invalid
 */
export function getEndOfPeriod(
  date: Date,
  period: string,
  weekStart: string | number = 'Monday',
): Date {
  switch (period) {
    case 'day':
      return endOfDay(date);
    case 'week':
      return endOfWeek(date, { weekStartsOn: resolveWeekStartsOn(weekStart) });
    case 'month':
      return endOfMonth(date);
    case 'quarter':
      return endOfQuarter(date);
    case 'year':
      return endOfYear(date);
    default:
      throw new InvalidPeriodQueryError(`Unsupported period: ${period}`);
  }
}

/**
 * Resolves the week start day to a numeric value.
 * @param weekStart - The week start day (string or number)
 * @returns The numeric day of the week (0=Sunday, 1=Monday, ...)
 */
function resolveWeekStartsOn(weekStart: string | number): import('date-fns').Day {
  if (typeof weekStart === 'number') {
    return weekStart as import('date-fns').Day;
  }
  return weekdayToNumber(weekStart) as import('date-fns').Day;
}
