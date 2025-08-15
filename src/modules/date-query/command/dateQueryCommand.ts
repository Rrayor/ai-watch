/**
 * Command implementation for date query operations.
 */
import { addDays } from 'date-fns';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
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
const ISO_SUN = 7;
const TWO_DIGIT_PAD = 2;
const THREE_DIGIT_PAD = 3;
const ONE_MS = 1;
const MONTHS_IN_YEAR = 12;
const MONTHS_PER_QUARTER = 3;

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
  const tz = getEffectiveTimezone(options.timezone);

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

    const result = processQuery(query, baseDate, results, i, tz);
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
  timezone: string,
): Date {
  if (!query.weekday) {
    throw new InvalidWeekDayQueryError('Weekday required for nextWeekday query');
  }
  const queryBase = getQueryBaseDate(baseDate, results, index);
  return getNextOccurenceOfWeekday(queryBase, query.weekday, query.weekStart, timezone);
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
  timezone: string,
): Date {
  if (!query.weekday) {
    throw new InvalidWeekDayQueryError('Weekday required for previousWeekday query');
  }
  const queryBase = getQueryBaseDate(baseDate, results, index);
  return getPreviousWeekday(queryBase, query.weekday, query.weekStart, timezone);
}

/**
 * Processes a startOfPeriod query
 * @param query - Query object containing period information
 * @param baseDate - Base date for the query
 * @returns Date representing the start of the specified period
 * @throws {MissingPeriodQueryError} if period is missing
 * @throws {InvalidPeriodQueryError} if period is invalid
 */
function processStartOfPeriodQuery(
  query: DateQueryOptions['queries'][0],
  baseDate: Date,
  timezone: string,
): Date {
  if (!query.period) {
    throw new MissingPeriodQueryError('Period required for startOfPeriod query');
  }
  return getStartOfPeriod(baseDate, query.period, timezone, query.weekStart);
}

/**
 * Processes an endOfPeriod query
 * @param query - Query object containing period information
 * @param baseDate - Base date for the query
 * @returns Date representing the end of the specified period
 * @throws {MissingPeriodQueryError} if period is missing
 * @throws {InvalidPeriodQueryError} if period is invalid
 */
function processEndOfPeriodQuery(
  query: DateQueryOptions['queries'][0],
  baseDate: Date,
  timezone: string,
): Date {
  if (!query.period) {
    throw new MissingPeriodQueryError('Period required for endOfPeriod query');
  }
  return getEndOfPeriod(baseDate, query.period, timezone, query.weekStart);
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
  timezone: string,
): Date {
  switch (query.type) {
    case 'nextWeekday':
      return processNextWeekdayQuery(query, baseDate, results, index, timezone);
    case 'previousWeekday':
      return processPreviousWeekdayQuery(query, baseDate, results, index, timezone);
    case 'startOfPeriod':
      return processStartOfPeriodQuery(query, baseDate, timezone);
    case 'endOfPeriod':
      return processEndOfPeriodQuery(query, baseDate, timezone);
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
  timezone: string,
): Date {
  const targetDay = weekdayToNumber(targetWeekday, startOfWeek);
  const currentNormalized = getWeekdayIndexInTz(startDate, timezone, startOfWeek);
  const daysToAdd = (targetDay - currentNormalized + DAYS_IN_WEEK) % DAYS_IN_WEEK || DAYS_IN_WEEK;
  const { year, month, day, hour, minute, second, ms } = getLocalDateTimeParts(startDate, timezone);
  const newYmd = addDaysToCalendar({ year, month, day }, daysToAdd);
  return zonedTimeToUtc(
    buildLocalDateTimeISO(newYmd.year, newYmd.month, newYmd.day, hour, minute, second, ms),
    timezone,
  );
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
  timezone: string,
): Date {
  const targetDay = weekdayToNumber(targetWeekday, startOfWeek);
  const currentNormalized = getWeekdayIndexInTz(startDate, timezone, startOfWeek);
  const daysToSubtract =
    (currentNormalized - targetDay + DAYS_IN_WEEK) % DAYS_IN_WEEK || DAYS_IN_WEEK;
  const { year, month, day, hour, minute, second, ms } = getLocalDateTimeParts(startDate, timezone);
  const newYmd = addDaysToCalendar({ year, month, day }, -daysToSubtract);
  return zonedTimeToUtc(
    buildLocalDateTimeISO(newYmd.year, newYmd.month, newYmd.day, hour, minute, second, ms),
    timezone,
  );
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
  timezone: string,
  weekStart: string | number = 'Monday',
): Date {
  switch (period) {
    case 'day': {
      return startOfDayInTz(date, timezone);
    }
    case 'week': {
      return startOfWeekInTz(date, timezone, resolveWeekStartsOn(weekStart));
    }
    case 'month': {
      return startOfMonthInTz(date, timezone);
    }
    case 'quarter': {
      return startOfQuarterInTz(date, timezone);
    }
    case 'year': {
      return startOfYearInTz(date, timezone);
    }
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
  timezone: string,
  weekStart: string | number = 'Monday',
): Date {
  switch (period) {
    case 'day': {
      return endOfDayInTz(date, timezone);
    }
    case 'week': {
      return endOfWeekInTz(date, timezone, resolveWeekStartsOn(weekStart));
    }
    case 'month': {
      return endOfMonthInTz(date, timezone);
    }
    case 'quarter': {
      return endOfQuarterInTz(date, timezone);
    }
    case 'year': {
      return endOfYearInTz(date, timezone);
    }
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

/**
 * Timezone helpers and period boundary calculators (timezone-aware)
 */
function getEffectiveTimezone(tz?: string): string {
  if (tz?.trim()) return tz;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

/**
 * Resolve the effective timezone to use for operations.
 * If the caller provides a non-empty timezone string that is returned as-is.
 * Otherwise this attempts to detect the runtime's IANA timezone via
 * Intl.DateTimeFormat; if detection fails the function falls back to 'UTC'.
 *
 * @param tz - Optional timezone string provided by the caller
 * @returns IANA timezone string to use
 */

function getWeekdayIndexInTz(
  date: Date,
  timezone: string,
  startOfWeek: string | number | undefined,
): number {
  const isoDay = Number(formatInTimeZone(date, timezone, 'i')); // 1=Mon..7=Sun
  const jsDay = isoDay % ISO_SUN; // 0=Sun..6=Sat
  const weekStartIndex = resolveWeekStartsOn(startOfWeek ?? 'Monday');
  return (jsDay - weekStartIndex + DAYS_IN_WEEK) % DAYS_IN_WEEK;
}

/**
 * Returns the weekday index (0=Sunday..6=Saturday) for the given date expressed
 * in the provided timezone, normalized against the configured week start.
 *
 * @param date - Date object to evaluate
 * @param timezone - IANA timezone to use when computing the weekday
 * @param startOfWeek - Optional week start (name or number) used to normalize the index
 * @returns Normalized weekday index (0..6)
 */

function getLocalDateTimeParts(
  date: Date,
  timezone: string,
): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  ms: number;
} {
  const year = Number(formatInTimeZone(date, timezone, 'yyyy'));
  const month = Number(formatInTimeZone(date, timezone, 'MM'));
  const day = Number(formatInTimeZone(date, timezone, 'dd'));
  const hour = Number(formatInTimeZone(date, timezone, 'HH'));
  const minute = Number(formatInTimeZone(date, timezone, 'mm'));
  const second = Number(formatInTimeZone(date, timezone, 'ss'));
  const ms = Number(formatInTimeZone(date, timezone, 'SSS'));
  return { year, month, day, hour, minute, second, ms };
}

/**
 * Extracts the local date/time components for a Date in a given IANA timezone.
 * Uses date-fns-tz's formatting helpers to return numeric parts suitable for
 * constructing local midnight instants or other timezone-specific calculations.
 *
 * @param date - Source Date
 * @param timezone - IANA timezone string
 * @returns Object with numeric year, month, day, hour, minute, second, ms
 */

function addDaysToCalendar(
  ymd: { year: number; month: number; day: number },
  deltaDays: number,
): { year: number; month: number; day: number } {
  const tmp = new Date(Date.UTC(ymd.year, ymd.month - 1, ymd.day, 0, 0, 0, 0));
  const res = addDays(tmp, deltaDays);
  return { year: res.getUTCFullYear(), month: res.getUTCMonth() + 1, day: res.getUTCDate() };
}

/**
 * Adds (or subtracts when deltaDays is negative) whole calendar days to a
 * year/month/day tuple and returns the resulting Y/M/D tuple. This uses UTC
 * arithmetic via Date to avoid local DST anomalies when shifting calendar days.
 *
 * @param ymd - Object with year, month (1-12), day (1-31)
 * @param deltaDays - Number of days to add (can be negative)
 * @returns New year/month/day tuple after adding deltaDays
 */

function buildLocalDateTimeISO(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  ms: number,
): string {
  const mm = String(month).padStart(TWO_DIGIT_PAD, '0');
  const dd = String(day).padStart(TWO_DIGIT_PAD, '0');
  const hh = String(hour).padStart(TWO_DIGIT_PAD, '0');
  const mi = String(minute).padStart(TWO_DIGIT_PAD, '0');
  const ss = String(second).padStart(TWO_DIGIT_PAD, '0');
  const mss = String(ms).padStart(THREE_DIGIT_PAD, '0');
  return `${year}-${mm}-${dd}T${hh}:${mi}:${ss}.${mss}`;
}

/**
 * Builds a local (no timezone suffix) ISO-like datetime string from numeric
 * parts. The resulting string is intended to be interpreted with a timezone
 * by date-fns-tz's `zonedTimeToUtc` helper.
 *
 * @param year - Full year
 * @param month - Month (1-12)
 * @param day - Day of month (1-31)
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @param second - Second (0-59)
 * @param ms - Milliseconds (0-999)
 * @returns ISO-like local datetime string without timezone suffix
 */

function startOfDayInTz(date: Date, timezone: string): Date {
  const { year, month, day } = getLocalDateTimeParts(date, timezone);
  return zonedTimeToUtc(buildLocalDateTimeISO(year, month, day, 0, 0, 0, 0), timezone);
}

/**
 * Returns the UTC instant corresponding to the local midnight at the given
 * date in the specified timezone.
 *
 * @param date - Reference date
 * @param timezone - IANA timezone
 * @returns Date representing the instant of local midnight in UTC
 */

function endOfDayInTz(date: Date, timezone: string): Date {
  const { year, month, day } = getLocalDateTimeParts(date, timezone);
  const next = addDaysToCalendar({ year, month, day }, 1);
  return new Date(
    zonedTimeToUtc(
      buildLocalDateTimeISO(next.year, next.month, next.day, 0, 0, 0, 0),
      timezone,
    ).getTime() - ONE_MS,
  );
}

/**
 * Returns the last instant (1 ms before local midnight) of the given day in
 * the specified timezone, expressed as a UTC Date.
 *
 * @param date - Reference date
 * @param timezone - IANA timezone
 * @returns Date representing the last millisecond of the local day in UTC
 */

function startOfWeekInTz(date: Date, timezone: string, weekStartsOn: number): Date {
  const { year, month, day } = getLocalDateTimeParts(date, timezone);
  const isoDay = Number(formatInTimeZone(date, timezone, 'i')) % ISO_SUN; // js day 0..6
  const diff = (isoDay - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const start = addDaysToCalendar({ year, month, day }, -diff);
  return zonedTimeToUtc(
    buildLocalDateTimeISO(start.year, start.month, start.day, 0, 0, 0, 0),
    timezone,
  );
}

/**
 * Returns the UTC instant for the start of the week (local midnight of the
 * first day of the week) for the provided date in the given timezone.
 *
 * @param date - Reference date
 * @param timezone - IANA timezone
 * @param weekStartsOn - Numeric week start (0=Sunday..6=Saturday)
 * @returns Date for local midnight of the week's start, expressed in UTC
 */

function endOfWeekInTz(date: Date, timezone: string, weekStartsOn: number): Date {
  const start = startOfWeekInTz(date, timezone, weekStartsOn);
  // start is UTC instant of local midnight; add 7 local days by computing next local midnight and subtract 1 ms
  const startParts = getLocalDateTimeParts(start, timezone);
  const next = addDaysToCalendar(
    { year: startParts.year, month: startParts.month, day: startParts.day },
    DAYS_IN_WEEK,
  );
  return new Date(
    zonedTimeToUtc(
      buildLocalDateTimeISO(next.year, next.month, next.day, 0, 0, 0, 0),
      timezone,
    ).getTime() - ONE_MS,
  );
}

/**
 * Returns the last instant (1 ms before local midnight of the day after the
 * week's last day) for the week containing the provided date.
 *
 * @param date - Reference date
 * @param timezone - IANA timezone
 * @param weekStartsOn - Numeric week start (0=Sunday..6=Saturday)
 * @returns Date representing the end of the week in UTC
 */

function startOfMonthInTz(date: Date, timezone: string): Date {
  const year = Number(formatInTimeZone(date, timezone, 'yyyy'));
  const month = Number(formatInTimeZone(date, timezone, 'MM'));
  return zonedTimeToUtc(buildLocalDateTimeISO(year, month, 1, 0, 0, 0, 0), timezone);
}

/**
 * Returns the UTC instant corresponding to local midnight on the first day of
 * the month for the given date/timezone.
 *
 * @param date - Reference date
 * @param timezone - IANA timezone
 * @returns Date for local midnight of month start in UTC
 */

function endOfMonthInTz(date: Date, timezone: string): Date {
  const year = Number(formatInTimeZone(date, timezone, 'yyyy'));
  const month = Number(formatInTimeZone(date, timezone, 'MM'));
  const nextMonth = month === MONTHS_IN_YEAR ? 1 : month + 1;
  const nextYear = month === MONTHS_IN_YEAR ? year + 1 : year;
  return new Date(
    zonedTimeToUtc(buildLocalDateTimeISO(nextYear, nextMonth, 1, 0, 0, 0, 0), timezone).getTime() -
      ONE_MS,
  );
}

/**
 * Returns the last instant of the month (1 ms before local midnight on the
 * first day of the next month) for the given date/timezone.
 *
 * @param date - Reference date
 * @param timezone - IANA timezone
 * @returns Date representing the end of the month in UTC
 */

function startOfQuarterInTz(date: Date, timezone: string): Date {
  const year = Number(formatInTimeZone(date, timezone, 'yyyy'));
  const month = Number(formatInTimeZone(date, timezone, 'MM'));
  const qStartMonth = Math.floor((month - 1) / MONTHS_PER_QUARTER) * MONTHS_PER_QUARTER + 1;
  return zonedTimeToUtc(buildLocalDateTimeISO(year, qStartMonth, 1, 0, 0, 0, 0), timezone);
}

/**
 * Returns the UTC instant corresponding to local midnight on the first day of
 * the quarter containing the provided date.
 *
 * @param date - Reference date
 * @param timezone - IANA timezone
 * @returns Date for the start of the quarter in UTC
 */

function endOfQuarterInTz(date: Date, timezone: string): Date {
  const year = Number(formatInTimeZone(date, timezone, 'yyyy'));
  const month = Number(formatInTimeZone(date, timezone, 'MM'));
  const qStartMonth = Math.floor((month - 1) / MONTHS_PER_QUARTER) * MONTHS_PER_QUARTER + 1;
  const nextQuarterMonth =
    qStartMonth + MONTHS_PER_QUARTER > MONTHS_IN_YEAR
      ? qStartMonth + MONTHS_PER_QUARTER - MONTHS_IN_YEAR
      : qStartMonth + MONTHS_PER_QUARTER;
  const nextQuarterYear = qStartMonth + MONTHS_PER_QUARTER > MONTHS_IN_YEAR ? year + 1 : year;
  return new Date(
    zonedTimeToUtc(
      buildLocalDateTimeISO(nextQuarterYear, nextQuarterMonth, 1, 0, 0, 0, 0),
      timezone,
    ).getTime() - ONE_MS,
  );
}

/**
 * Returns the last instant of the quarter containing the provided date/timezone.
 * The calculation advances to the first day of the next quarter at local
 * midnight and subtracts 1 ms to yield the end instant.
 *
 * @param date - Reference date
 * @param timezone - IANA timezone
 * @returns Date representing the end of the quarter in UTC
 */

function startOfYearInTz(date: Date, timezone: string): Date {
  const year = Number(formatInTimeZone(date, timezone, 'yyyy'));
  return zonedTimeToUtc(buildLocalDateTimeISO(year, 1, 1, 0, 0, 0, 0), timezone);
}

/**
 * Returns the UTC instant corresponding to local midnight on January 1 of the
 * year for the given date/timezone.
 *
 * @param date - Reference date
 * @param timezone - IANA timezone
 * @returns Date for the start of the year in UTC
 */

function endOfYearInTz(date: Date, timezone: string): Date {
  const year = Number(formatInTimeZone(date, timezone, 'yyyy'));
  const nextYearStart = zonedTimeToUtc(
    buildLocalDateTimeISO(year + 1, 1, 1, 0, 0, 0, 0),
    timezone,
  ).getTime();
  return new Date(nextYearStart - ONE_MS);
}

/**
 * Returns the last instant of the year (1 ms before local midnight on Jan 1
 * of the following year) for the given date/timezone.
 *
 * @param date - Reference date
 * @param timezone - IANA timezone
 * @returns Date representing the end of the year in UTC
 */
