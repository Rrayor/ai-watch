/**
 * Core date and time utility functions for AI Watch extension.
 */

/**
 * Formats a Date object into UTC string format.
 *
 * @param date - Date object to format
 * @returns Formatted UTC string in 'YYYY-MM-DD HH:mm:ss' format
 */
export function formatUTC(date: Date): string {
  return date
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '');
}

/**
 * Parses an ISO date string and returns a Date object.
 *
 * @param dateString - ISO date string to parse
 * @returns Parsed Date object
 * @throws Error if date format is invalid
 */
export function parseISOString(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  // Check if the parsed date matches the input (detect auto-correction)
  // This catches cases like Feb 29 in non-leap years where JS auto-corrects to March 1
  if (date.toISOString() !== dateString && !dateString.endsWith('.000Z')) {
    // If input doesn't have milliseconds but result does, check without milliseconds
    const expectedWithMs = dateString.replace('Z', '.000Z');
    if (date.toISOString() !== expectedWithMs) {
      throw new Error(`Invalid date format: ${dateString}`);
    }
  }

  return date;
}

/**
 * Calculates the difference between two dates in various units.
 *
 * @param from - Start date
 * @param to - End date
 * @returns Object containing the difference in days, hours, minutes, and seconds
 */
export function calculateDateDifference(from: Date, to: Date) {
  const diffMs = to.getTime() - from.getTime();
  const absDiffMs = Math.abs(diffMs);

  // Calculate cumulative totals (each represents the entire difference in that unit)
  const cumulativeDays = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
  const cumulativeHours = Math.floor(absDiffMs / (1000 * 60 * 60));
  const cumulativeMinutes = Math.floor(absDiffMs / (1000 * 60));
  const cumulativeSeconds = Math.floor(absDiffMs / 1000);

  // Apply sign to all components
  const sign = diffMs < 0 ? -1 : 1;

  return {
    days: sign * cumulativeDays,
    hours: sign * cumulativeHours,
    minutes: sign * cumulativeMinutes,
    seconds: sign * cumulativeSeconds,
  };
}

/**
 * Converts a weekday string to its corresponding numeric value.
 * Supports full names, abbreviations, and both lower/upper case.
 *
 * @param weekday - String representation of weekday in various formats
 * @returns Numeric day of week (0=Sunday, 1=Monday, etc.)
 * @throws Error if weekday is invalid
 */
export function weekdayToNumber(weekday: string): number {
  const dayMap = {
    // Full names (lowercase)
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    // Abbreviations (3-letter)
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };

  const normalizedWeekday = weekday.toLowerCase().trim();
  const dayNumber = dayMap[normalizedWeekday as keyof typeof dayMap];

  if (dayNumber === undefined) {
    throw new Error(`Invalid weekday: ${weekday}`);
  }

  return dayNumber;
}
