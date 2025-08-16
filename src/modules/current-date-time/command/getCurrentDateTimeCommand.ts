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
  const result = getDateTimeResult(options?.timezone, context, options?.format);
  return {
    ...result,
    info: context.info,
  };
}

/**
 * Gets the date and time information.
 * @param timezone - Target timezone (optional)
 * @param context - Operation context
 * @param format - Optional custom format string
 * @returns Object with date/time information
 * @throws {InvalidTimeZoneError} If the timezone is invalid
 */
function getDateTimeResult(
  timezone: string | undefined,
  context: OperationContext,
  format?: string,
): GetCurrentDateTimeResult {
  const now = new Date();
  const localTimezone = getUserTimezone(context);
  const local = formatInTimezone(now, localTimezone, context);
  const resultTimezone = timezone ?? localTimezone;
  const formattedResult = resultTimezone
    ? formatInTimezone(now, resultTimezone, context, format)
    : local;

  return {
    iso: now.toISOString(),
    utc: formatUTC(now),
    localTimezone,
    local,
    resultTimezone,
    formattedResult,
  };
}
