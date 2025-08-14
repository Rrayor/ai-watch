/**
 * Command implementation for getting the current date and time.
 */

import { formatUTC, formatInTimezone, getUserTimezone, OperationContext } from '../../shared';
import { GetCurrentDateTimeResult as GetCurrentDateTimeResult } from '../model/GetCurrentDateTimeResult';
import { GetCurrentDateTimeOptions } from '../model/GetCurrentDateTimeOptions';

/**
 * Command function for getting the current date and time.
 *
 * @param options - Optional configuration for timezone and format
 * @returns Object with current date/time information
 * @throws {InvalidTimeZoneError} If the timezone is invalid
 */

export function getCurrentDateTimeCommand(
  options?: GetCurrentDateTimeOptions,
): GetCurrentDateTimeResult {
  const context = new OperationContext();
  const result = options?.timezone
    ? getFormattedDateTimeResult(options.timezone, context, options?.format)
    : getLocalDateTimeResult(context);
  return {
    ...result,
    info: context.info,
  };
}

/**
 * Gets the local date and time information.
 * @returns Object with local date/time information
 * @throws {InvalidTimeZoneError} If the timezone is invalid (though this should not happen)
 */
function getLocalDateTimeResult(context: OperationContext): GetCurrentDateTimeResult {
  const now = new Date();
  const userTimezone = getUserTimezone(context);
  const localTime = formatInTimezone(now, userTimezone, context);

  return {
    iso: now.toISOString(),
    utc: formatUTC(now),
    local: localTime,
    localTimezone: userTimezone,
    formattedResult: localTime,
    resultTimezone: userTimezone,
  };
}

/**
 * Gets the formatted date and time information.
 * @param timezone - Target timezone
 * @param format - Optional custom format string
 * @returns Object with formatted date/time information
 * @throws {InvalidTimeZoneError} If the timezone is invalid
 */
function getFormattedDateTimeResult(
  timezone: string,
  context: OperationContext,
  format?: string,
): GetCurrentDateTimeResult {
  const now = new Date();
  const formattedTime = formatInTimezone(now, timezone, context, format);

  return {
    resultTimezone: timezone,
    formattedResult: formattedTime,
    local: formattedTime,
    localTimezone: timezone,
  };
}
