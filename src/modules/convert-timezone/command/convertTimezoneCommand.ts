/**
 * Command implementation for converting times between timezones.
 */
import { ConvertTimezoneResult } from '../model/ConvertTimezoneResult';
import { formatInTimezone, getUserTimezone, parseISOString, OperationContext } from '../../shared';
import { ConvertTimezoneOptions } from '../model/ConvertTimezoneOptions';

/**
 * Command function for converting times between timezones.
 *
 * @param options - Configuration with date and target timezone
 * @returns Object with timezone conversion results
 * @throws {InvalidDateError} if the date format is invalid
 * @throws {InvalidTimeZoneError} if the timezone is invalid
 */
export function convertTimezoneCommand(options: ConvertTimezoneOptions): ConvertTimezoneResult {
  const date = parseISOString(options.date);
  // Default fromTimezone to UTC if not specified
  const operationContext = new OperationContext();
  let fromTz = options.fromTimezone;
  if (!fromTz) {
    operationContext.addInfo('No fromTimezone specified, defaulting to UTC');
    fromTz = 'UTC';
  }
  const formattedResult = formatInTimezone(date, options.toTimezone, operationContext);

  return {
    iso: date.toISOString(),
    formattedResult,
    fromTimezone: fromTz,
    info: operationContext.info,
    local: formatInTimezone(date, getUserTimezone(operationContext), operationContext),
    localTimezone: getUserTimezone(operationContext),
    resultTimezone: options.toTimezone,
  };
}
