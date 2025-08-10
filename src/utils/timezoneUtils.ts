/**
 * Timezone utility functions for AI Watch extension.
 */

/**
 * Formats a date in a specific timezone.
 *
 * @param date - Date object to format
 * @param timezone - Target timezone (optional)
 * @param customFormat - Custom format string using tokens: YYYY/YY (year), MM/M (month), DD/D (day), HH/H (hour), mm/m (minute), ss/s (second)
 * @returns Formatted date string
 */
export function formatInTimezone(date: Date, timezone?: string, customFormat?: string): string {
  // If custom format is provided (including empty string), we need to handle it
  if (customFormat !== undefined) {
    if (timezone) {
      try {
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
      } catch {
        throw new Error(`Invalid timezone: ${timezone}`);
      }
    } else {
      // No timezone, use local date
      return applyCustomFormat(date, customFormat);
    }
  }

  // Use standard formatting
  if (timezone) {
    try {
      // Use Intl.DateTimeFormat for timezone conversion
      const formatted = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
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
    } catch {
      throw new Error(`Invalid timezone: ${timezone}`);
    }
  } else {
    // Default to user's timezone when no timezone specified
    const userTimezone = getUserTimezone();
    try {
      const formatted = new Intl.DateTimeFormat('en-CA', {
        timeZone: userTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(date);

      return formatted.replace(', ', ' ');
    } catch {
      // Fallback to ISO format if user timezone fails
      return date.toISOString().slice(0, ISO_TIMESTAMP_LENGTH).replace('T', ' ');
    }
  }
}

// Constants for string operations
const ISO_TIMESTAMP_LENGTH = 19;
const YEAR_SLICE_LENGTH = -2;

/**
 * Creates a map of date parts from formatToParts result
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
 */
function createMinuteSecondTokens(partMap: { [key: string]: string }): { [key: string]: string } {
  return {
    mm: partMap['minute'] ?? '',
    m: partMap['minute'] ? Number(partMap['minute']).toString() : '',
    ss: partMap['second'] ?? '',
    s: partMap['second'] ? Number(partMap['second']).toString() : '',
  };
}

/**
 * Creates format tokens from part map
 */
function createFormatTokens(partMap: { [key: string]: string }): { [key: string]: string } {
  return {
    ...createYearMonthTokens(partMap),
    ...createDayHourTokens(partMap),
    ...createMinuteSecondTokens(partMap),
  };
}

/**
 * Cache for regex sources to enable safe, performant token replacement
 */
const tokenRegexSourceCache = new Map<string, string>();

/**
 * Escapes special regex characters in a string
 */
function escapeRegexToken(token: string): string {
  return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Gets or creates a regex source pattern for token replacement.
 * Uses a simple, secure pattern that avoids ReDoS vulnerabilities.
 */
function getTokenRegexSource(token: string): string {
  let regexSource = tokenRegexSourceCache.get(token);
  if (!regexSource) {
    // Escape the token to prevent injection
    const escapedToken = escapeRegexToken(token);
    // Use a simple pattern that matches the token as a whole word
    // This avoids complex alternation patterns that could cause ReDoS
    regexSource = `\\b${escapedToken}\\b`;
    tokenRegexSourceCache.set(token, regexSource);
  }
  return regexSource;
}

/**
 * Efficiently replaces format tokens in a string using cached regex sources.
 * Creates fresh regex instances for each replacement to ensure thread safety
 * while still benefiting from cached pattern compilation.
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
 * Replaces format tokens in the format string
 */
function replaceFormatTokens(format: string, tokens: { [key: string]: string }): string {
  return replaceTokensInString(format, tokens);
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
function applyCustomFormat(date: Date, format: string): string {
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
 * Gets the user's current timezone.
 *
 * @returns User's timezone string, defaults to UTC if detection fails
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC'; // Fallback to UTC if detection fails
  }
}
