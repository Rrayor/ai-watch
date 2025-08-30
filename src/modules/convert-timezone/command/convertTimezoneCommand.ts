/**
 * Command implementation for converting times between timezones.
 */
import { ConvertTimezoneResult } from '../model/ConvertTimezoneResult';
import {
  formatInTimezone,
  getUserTimezone,
  parseISOString,
  OperationContext,
  AmbiguousDateError,
} from '../../shared';
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
  // Validate input contract: if date is naive (no offset) and the caller
  // didn't provide fromTimezone, refuse with an AmbiguousDateError to avoid
  // silent assumptions by language models.
  const naiveIsoWithoutOffset = !/([zZ]|[+-]\d{2}:?\d{2})$/.test(options.date);
  if (naiveIsoWithoutOffset && !options.fromTimezone && !options.interpretAsLocal) {
    throw new AmbiguousDateError(options.date);
  }

  const date = parseISOString(options.date, options.fromTimezone);

  // Default fromTimezone to UTC if not specified (after validation)
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
