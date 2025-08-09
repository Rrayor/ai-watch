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
      } catch (tzError) {
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
    } catch (tzError) {
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
    } catch (tzError) {
      // Fallback to ISO format if user timezone fails
      return date.toISOString().slice(0, 19).replace('T', ' ');
    }
  }
}

/**
 * Applies custom formatting to date parts from Intl.DateTimeFormat.
 *
 * Supported format tokens:
 * - YYYY: 4-digit year (e.g., 2025)
 * - YY: 2-digit year (e.g., 25)
 * - MM: 2-digit month (e.g., 08)
 * - M: 1-digit month (e.g., 8)
 * - DD: 2-digit day (e.g., 09)
 * - D: 1-digit day (e.g., 9)
 * - HH: 2-digit hour (e.g., 14)
 * - H: 1-digit hour (e.g., 14)
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
  const partMap: { [key: string]: string } = {};
  parts.forEach((part) => {
    partMap[part.type] = part.value;
  });

  const tokens: { [key: string]: string } = {
    YYYY: partMap.year || '',
    YY: partMap.year ? partMap.year.slice(-2) : '',
    MM: partMap.month || '',
    M: partMap.month ? Number(partMap.month).toString() : '',
    DD: partMap.day || '',
    D: partMap.day ? Number(partMap.day).toString() : '',
    HH: partMap.hour || '',
    H: partMap.hour ? Number(partMap.hour).toString() : '',
    mm: partMap.minute || '',
    m: partMap.minute ? Number(partMap.minute).toString() : '',
    ss: partMap.second || '',
    s: partMap.second ? Number(partMap.second).toString() : '',
  };

  let result = format;
  // Replace tokens in order of length (longest first) to avoid partial replacements
  // Use word boundaries to avoid replacing tokens within words
  Object.keys(tokens)
    .sort((a, b) => b.length - a.length)
    .forEach((token) => {
      result = result.replace(new RegExp(`\\b${token}\\b`, 'g'), tokens[token]);
    });

  return result;
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
    YY: date.getFullYear().toString().slice(-2),
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

  let result = format;
  // Replace tokens in order of length (longest first) to avoid partial replacements
  // Use word boundaries to avoid replacing tokens within words
  Object.keys(tokens)
    .sort((a, b) => b.length - a.length)
    .forEach((token) => {
      result = result.replace(new RegExp(`\\b${token}\\b`, 'g'), tokens[token]);
    });

  return result;
}

/**
 * Gets the user's current timezone.
 *
 * @returns User's timezone string, defaults to UTC if detection fails
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    return 'UTC'; // Fallback to UTC if detection fails
  }
}
