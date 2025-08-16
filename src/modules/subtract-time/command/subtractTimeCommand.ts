/**
 * Command implementation for subtracting time durations from dates.
 */
import { subDays, subHours, subMinutes, subMonths, subSeconds, subWeeks, subYears } from 'date-fns';
import { SubtractTimeOptions } from '../model/SubtractTimeOptions';
import { SubtractTimeResult } from '../model/SubtractTimeResult';
import {
  formatInTimezone,
  formatUTC,
  getUserTimezone,
  parseISOString,
  OperationContext,
} from '../../shared';

/**
 * Command function for subtracting time durations from dates.
 *
 * @param options - Configuration with time durations to subtract
 * @returns Object with the calculated past date
 * @throws {InvalidDateError} if a date is invalid
 * @throws {InvalidTimeZoneError} if a timezone is invalid
 */
export function subtractTimeCommand(options: SubtractTimeOptions): SubtractTimeResult {
  // Use provided base time or current time
  const baseDate = options.baseTime ? parseISOString(options.baseTime) : new Date();

  // Calculate the new date by subtracting the specified time units
  const newDate = subtractTimeUnits(new Date(baseDate), options);

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
    formattedResult,
    resultTimezone,
  };
}

/**
 * Subtracts time units from a date using date-fns (returns a new Date object)
 * @param date - Date object to subtract from
 * @param params - Parameters containing time durations to subtract
 * @returns New Date object with time subtracted
 */
function subtractTimeUnits(date: Date, params: SubtractTimeOptions): Date {
  let result = new Date(date.getTime());
  if (params.years) result = subYears(result, params.years);
  if (params.months) result = subMonths(result, params.months);
  if (params.weeks) result = subWeeks(result, params.weeks);
  if (params.days) result = subDays(result, params.days);
  if (params.hours) result = subHours(result, params.hours);
  if (params.minutes) result = subMinutes(result, params.minutes);
  if (params.seconds) result = subSeconds(result, params.seconds);
  return result;
}
