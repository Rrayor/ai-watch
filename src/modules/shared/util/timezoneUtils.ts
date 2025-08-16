import { workspace } from 'vscode';
import { InvalidTimezoneError } from '../error/InvalidTimezoneError';
import { OperationContext } from '../model/OperationContext';

// Constants for string operations
const ISO_TIMESTAMP_LENGTH = 19;
const YEAR_SLICE_LENGTH = -2;

/**
 * Cache for regex sources to enable safe, performant token replacement
 */
const tokenRegexSourceCache = new Map<string, string>();

/**
 * Formats a Date object into UTC string format.
 *
 * @param date - Date object to format
 * @returns Formatted UTC string in 'YYYY-MM-DD HH:mm:ss UTC' format
 */
export function formatUTC(date: Date): string {
  return `${date
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '')} UTC`;
}

/**
 * Formats a date in a specific timezone.
 *
 * @param date - Date object to format
 * @param timezone - Target timezone (optional)
 * @param customFormat - Custom format string using tokens: YYYY/YY (year), MM/M (month), DD/D (day), HH/H (hour), mm/m (minute), ss/s (second)
 * @returns Formatted date string
 * @throws {InvalidTimezoneError} If the timezone is invalid
 */
export function formatInTimezone(
  date: Date,
  timezone: string,
  context: OperationContext,
  customFormat?: string,
): string {
  try {
    // Resolve timezone to use (explicit or detected)
    const tzToUse = timezone || getUserTimezone(context);

    // Prefer explicit custom format; otherwise use configured default format if present
    const defaultFormat = workspace
      .getConfiguration('aiWatch')
      .get<string | undefined>('defaultDateFormat');

    const effectiveFormat = customFormat ?? defaultFormat;

    if (effectiveFormat) {
      return formatWithCustomFormat(date, tzToUse, context, effectiveFormat);
    }

    // Fall back to standard formatting when no format strings are provided
    return formatStandard(date, context, tzToUse);
  } catch {
    if (timezone) {
      // Explicit timezone likely invalid
      throw new InvalidTimezoneError(timezone);
    }

    // When timezone resolution fails, try using configured default format
    const defaultDateFormatConfiguration = workspace
      .getConfiguration('aiWatch')
      .get<string>('defaultDateFormat');

    if (defaultDateFormatConfiguration) {
      context.addInfo(`Using default date format from settings: ${defaultDateFormatConfiguration}`);
      return formatWithCustomFormat(date, undefined, context, defaultDateFormatConfiguration);
    }

    context.addInfo(
      'Timezone resolution failed and no default date format is set; falling back to ISO-like UTC.',
    );
    // Fallback to ISO format if user timezone fails
    return date.toISOString().slice(0, ISO_TIMESTAMP_LENGTH).replace('T', ' ');
  }
}

/**
 * Formats a date using a custom format string, optionally in a specific timezone.
 *
 * @param date - Date object to format
 * @param timezone - Target timezone (optional)
 * @param customFormat - Custom format string using tokens (e.g., YYYY, MM, DD, etc.)
 * @returns Formatted date string
 */
function formatWithCustomFormat(
  date: Date,
  timezone: string | undefined,
  context: OperationContext,
  customFormat = '',
): string {
  if (timezone) {
    // Get date parts in the target timezone using Intl.DateTimeFormat
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    return applyCustomFormatFromParts(parts, customFormat);
  } else {
    // No explicit timezone provided; format using system local time
    context.addInfo('No timezone provided; formatting using local system time.');
    return applyCustomFormat(date, customFormat);
  }
}

/**
 * Formats a date in a standard format (YYYY-MM-DD HH:MM:SS) in the specified or user's timezone.
 *
 * @param date - Date object to format
 * @param timezone - Target timezone (optional)
 * @returns Formatted date string
 */
export function formatStandard(date: Date, context: OperationContext, timezone?: string): string {
  let tz = timezone;
  if (!tz) {
    context.addInfo('No timezone was provided, attempting to detect user timezone.');
    tz = getUserTimezone(context);
  }
  const formatted = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
  // Convert from "YYYY-MM-DD, HH:MM:SS" to "YYYY-MM-DD HH:MM:SS"
  return formatted.replace(', ', ' ');
}

/**
 * Gets the user's current timezone.
 *
 * @returns User's timezone string, defaults to UTC if detection fails
 */
export function getUserTimezone(context: OperationContext): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    context.addInfo("The user's local timezone could not be detected, using UTC by default.");
    return 'UTC';
  }
}

/**
 * Applies custom formatting to date parts.
 * Supports tokens:
 * - YYYY: 4-digit year (e.g., 2023)
 * - YY: 2-digit year (e.g., 23)
 * - MM: 2-digit month (e.g., 07)
 * - M: 1-digit month (e.g., 7)
 * - DD: 2-digit day (e.g., 09)
 * - D: 1-digit day (e.g., 9)
 * - HH: 2-digit hour (e.g., 05)
 * - H: 1-digit hour (e.g., 5)
 * - mm: 2-digit minute (e.g., 37)
 * - m: 1-digit minute (e.g., 37)
 * - ss: 2-digit second (e.g., 01)
 * - s: 1-digit second (e.g., 1)
 *
 * @param parts - Date parts from Intl.DateTimeFormat.formatToParts()
 * @param format - Format string with tokens like YYYY, MM, DD, HH, mm, ss
 * @returns Formatted date string
 */
function applyCustomFormatFromParts(parts: Intl.DateTimeFormatPart[], format: string): string {
  const partMap = createPartMap(parts);
  const tokens = createFormatTokens(partMap);
  return replaceFormatTokens(format, tokens);
}

/**
 * Applies custom formatting to a date.
 *
 * @param date - Date to format
 * @param format - Format string with tokens like YYYY, MM, DD, HH, mm, ss
 * @returns Formatted date string
 */
export function applyCustomFormat(date: Date, format: string): string {
  const tokens: { [key: string]: string } = {
    YYYY: date.getFullYear().toString(),
    YY: date.getFullYear().toString().slice(YEAR_SLICE_LENGTH),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    M: String(date.getMonth() + 1),
    DD: String(date.getDate()).padStart(2, '0'),
    D: String(date.getDate()),
    HH: String(date.getHours()).padStart(2, '0'),
    H: String(date.getHours()),
    mm: String(date.getMinutes()).padStart(2, '0'),
    m: String(date.getMinutes()),
    ss: String(date.getSeconds()).padStart(2, '0'),
    s: String(date.getSeconds()),
  };

  return replaceTokensInString(format, tokens);
}

/**
 * Replaces format tokens in the format string
 * @param format - Format string containing tokens to replace
 * @param tokens - Object mapping token names to replacement values
 * @returns String with tokens replaced by their values
 */
function replaceFormatTokens(format: string, tokens: { [key: string]: string }): string {
  return replaceTokensInString(format, tokens);
}

/**
 * Efficiently replaces format tokens in a string using cached regex sources.
 * Creates fresh regex instances for each replacement to ensure thread safety
 * while still benefiting from cached pattern compilation.
 * @param format - Format string containing tokens to replace
 * @param tokens - Object mapping token names to replacement values
 * @returns String with tokens replaced by their values
 */
function replaceTokensInString(format: string, tokens: { [key: string]: string }): string {
  let result = format;

  // Replace tokens in order of length (longest first) to avoid partial replacements
  Object.keys(tokens)
    .sort((a, b) => b.length - a.length)
    .forEach((token) => {
      const replacement = tokens[token];
      if (replacement !== undefined) {
        // Get the cached regex source and create a fresh instance for thread safety
        const regexSource = getTokenRegexSource(token);
        const regex = new RegExp(regexSource, 'g');

        // Replace all occurrences of the token
        result = result.replace(regex, replacement);
      }
    });

  return result;
}

/**
 * Gets or creates a regex source pattern for token replacement.
 * Uses a simple, secure pattern that avoids ReDoS vulnerabilities.
 * @param token - Token to create regex pattern for
 * @returns Regex source pattern string
 */
function getTokenRegexSource(token: string): string {
  let regexSource = tokenRegexSourceCache.get(token);
  if (!regexSource) {
    // Escape the token to prevent injection
    const escapedToken = escapeRegexToken(token);
    // Use negative lookbehind and lookahead to ensure exact token matching
    // This prevents partial matches while avoiding word boundary issues with date tokens
    regexSource = `(?<!\\w)${escapedToken}(?!\\w)`;
    tokenRegexSourceCache.set(token, regexSource);
  }
  return regexSource;
}

/**
 * Escapes special regex characters in a string
 * @param token - String to escape for regex pattern
 * @returns Escaped string safe for regex use
 */
function escapeRegexToken(token: string): string {
  return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates format tokens from part map
 * @param partMap - Object mapping part types to values
 * @returns Combined object containing all format tokens
 */
function createFormatTokens(partMap: { [key: string]: string }): { [key: string]: string } {
  return {
    ...createYearMonthTokens(partMap),
    ...createDayHourTokens(partMap),
    ...createMinuteSecondTokens(partMap),
  };
}

/**
 * Creates a map of date parts from formatToParts result
 * @param parts - Array of date time format parts from Intl.DateTimeFormat.formatToParts()
 * @returns Object mapping part type to value
 */
function createPartMap(parts: Intl.DateTimeFormatPart[]): { [key: string]: string } {
  const partMap: { [key: string]: string } = {};
  parts.forEach((part) => {
    partMap[part.type] = part.value;
  });
  return partMap;
}

/**
 * Creates year and month format tokens
 * @param partMap - Object mapping part types to values
 * @returns Object containing YYYY, YY, MM, M tokens
 */
function createYearMonthTokens(partMap: { [key: string]: string }): { [key: string]: string } {
  return {
    YYYY: partMap['year'] ?? '',
    YY: partMap['year'] ? partMap['year'].slice(YEAR_SLICE_LENGTH) : '',
    MM: partMap['month'] ?? '',
    M: partMap['month'] ? Number(partMap['month']).toString() : '',
  };
}

/**
 * Creates day and hour format tokens
 * @param partMap - Object mapping part types to values
 * @returns Object containing DD, D, HH, H tokens
 */
function createDayHourTokens(partMap: { [key: string]: string }): { [key: string]: string } {
  return {
    DD: partMap['day'] ?? '',
    D: partMap['day'] ? Number(partMap['day']).toString() : '',
    HH: partMap['hour'] ?? '',
    H: partMap['hour'] ? Number(partMap['hour']).toString() : '',
  };
}

/**
 * Creates minute and second format tokens
 * @param partMap - Object mapping part types to values
 * @returns Object containing mm, m, ss, s tokens
 */
function createMinuteSecondTokens(partMap: { [key: string]: string }): { [key: string]: string } {
  return {
    mm: partMap['minute'] ?? '',
    m: partMap['minute'] ? Number(partMap['minute']).toString() : '',
    ss: partMap['second'] ?? '',
    s: partMap['second'] ? Number(partMap['second']).toString() : '',
  };
}
