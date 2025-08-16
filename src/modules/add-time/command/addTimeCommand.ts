/**
 * Command implementation for adding time durations to dates.
 */

import { OperationContext, parseISOString } from '../../shared';
import { formatUTC, getUserTimezone, formatInTimezone } from '../../shared';
import { AddTimeOptions } from '../model/AddTimeOptions';
import { AddTimeResult } from '../model/AddTimeResult';
import { addYears, addMonths, addWeeks, addDays, addHours, addMinutes, addSeconds } from 'date-fns';

/**
 * Command function for adding time durations to dates.
 *
 * @param options - Configuration with time durations to add
 * @returns Object with the calculated future date
 * @throws {InvalidTimeZoneError} If a timezone is invalid
 * @throws {InvalidDateError} If time format is invalid
 */
export function addTimeCommand(options: AddTimeOptions): AddTimeResult {
  const baseDate = options.baseTime ? parseISOString(options.baseTime) : new Date();
  const newDate = addTimeUnits(baseDate, options);
  const operationContext = new OperationContext();
  const userTimezone = getUserTimezone(operationContext);
  const resultTimezone = options.timezone ?? userTimezone;
  const formattedResult = formatInTimezone(newDate, resultTimezone, operationContext);
  return {
    iso: newDate.toISOString(),
    utc: formatUTC(newDate),
    baseTime: baseDate.toISOString(),
    local: formatInTimezone(newDate, userTimezone, operationContext),
    localTimezone: userTimezone,
    resultTimezone,
    formattedResult,
  };
}

/**
 * Adds time units to a date using date-fns (returns a new Date object)
 * @param date - Date object to add to
 * @param params - Parameters containing time durations to add
 * @returns New Date object with time added
 */
function addTimeUnits(date: Date, params: AddTimeOptions): Date {
  let result = date;
  if (params.years) result = addYears(result, params.years);
  if (params.months) result = addMonths(result, params.months);
  if (params.weeks) result = addWeeks(result, params.weeks);
  if (params.days) result = addDays(result, params.days);
  if (params.hours) result = addHours(result, params.hours);
  if (params.minutes) result = addMinutes(result, params.minutes);
  if (params.seconds) result = addSeconds(result, params.seconds);
  return result;
}
