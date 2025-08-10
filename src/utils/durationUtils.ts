/**
 * Duration formatting utility functions for AI Watch extension.
 */

// Constants for time conversions
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const DAYS_PER_YEAR = 365;
const HOURS_PER_DAY = 24;
const SECONDS_PER_YEAR = DAYS_PER_YEAR * HOURS_PER_DAY * SECONDS_PER_HOUR;
const MILLISECONDS_PER_SECOND = 1000;
const DEFAULT_MAX_UNITS = 3;

/**
 * Converts duration value to seconds based on unit
 * @param value - Duration value to convert
 * @param unit - Unit of the duration (milliseconds, minutes, hours, days, seconds)
 * @returns Duration value converted to seconds
 */
function convertToSeconds(value: number, unit: string): number {
  switch (unit) {
    case 'milliseconds':
      return value / MILLISECONDS_PER_SECOND;
    case 'minutes':
      return value * SECONDS_PER_MINUTE;
    case 'hours':
      return value * SECONDS_PER_HOUR;
    case 'days':
      return value * SECONDS_PER_DAY;
    case 'seconds':
    default:
      return value;
  }
}

/**
 * Calculates time components from total seconds
 * @param absSeconds - Absolute number of seconds to break down
 * @returns Object containing years, days, hours, minutes, and seconds components
 */
function calculateTimeComponents(absSeconds: number): {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const years = Math.floor(absSeconds / SECONDS_PER_YEAR);
  const days = Math.floor((absSeconds % SECONDS_PER_YEAR) / SECONDS_PER_DAY);
  const hours = Math.floor((absSeconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR);
  const minutes = Math.floor((absSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = Math.floor(absSeconds % SECONDS_PER_MINUTE);

  return { years, days, hours, minutes, seconds };
}

/**
 * Formats time components for compact display
 * @param components - Object containing time components (years, days, hours, minutes, seconds)
 * @returns Array of formatted strings in compact format (e.g., ["2y", "3d", "4h"])
 */
function formatCompactComponents(components: {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}): string[] {
  const { years, days, hours, minutes, seconds } = components;
  const parts = [];

  if (years > 0) parts.push(`${years}y`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts;
}

/**
 * Formats time components for verbose display
 * @param components - Object containing time components (years, days, hours, minutes, seconds)
 * @returns Array of formatted strings in verbose format (e.g., ["2 years", "3 days", "4 hours"])
 */
function formatVerboseComponents(components: {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}): string[] {
  const { years, days, hours, minutes, seconds } = components;
  const parts = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);

  return parts.concat(formatVerboseTimeMinutes(minutes, seconds));
}

/**
 * Helper function for formatting minutes and seconds in verbose mode
 * @param minutes - Number of minutes
 * @param seconds - Number of seconds
 * @returns Array of formatted strings for minutes and seconds
 */
function formatVerboseTimeMinutes(minutes: number, seconds: number): string[] {
  const parts = [];

  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (seconds > 0) parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);

  return parts;
}

/**
 * Formats time components for standard display
 * @param components - Object containing time components (years, days, hours, minutes, seconds)
 * @returns Array of formatted strings in standard format (e.g., ["2 years", "3 days", "4 hours"])
 */
function formatStandardComponents(components: {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}): string[] {
  const { years, days, hours, minutes, seconds } = components;
  const parts = [];

  if (years > 0) parts.push(`${years} years`);
  if (days > 0) parts.push(`${days} days`);
  if (hours > 0) parts.push(`${hours} hours`);
  if (minutes > 0) parts.push(`${minutes} minutes`);
  if (seconds > 0) parts.push(`${seconds} seconds`);

  return parts;
}

/**
 * Formats time components based on verbosity
 * @param components - Object containing time components (years, days, hours, minutes, seconds)
 * @param verbosity - Format verbosity level (compact, standard, verbose)
 * @returns Array of formatted strings based on verbosity level
 */
function formatTimeComponents(
  components: { years: number; days: number; hours: number; minutes: number; seconds: number },
  verbosity: string,
): string[] {
  if (verbosity === 'compact') {
    return formatCompactComponents(components);
  } else if (verbosity === 'verbose') {
    return formatVerboseComponents(components);
  }
  return formatStandardComponents(components);
}

/**
 * Joins formatted parts based on verbosity
 * @param parts - Array of formatted time part strings
 * @param verbosity - Format verbosity level (compact, standard, verbose)
 * @returns Joined string formatted according to verbosity level
 */
function joinFormattedParts(parts: string[], verbosity: string): string {
  if (verbosity === 'verbose' && parts.length > 1) {
    return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
  }
  return parts.join(verbosity === 'compact' ? ' ' : ', ');
}

/**
 * Formats a duration value into a human-readable string.
 * Note: This function preserves the sign of the duration value.
 * If the input is negative, the result will indicate a negative duration (e.g., "-2 hours, 5 minutes").
 * If you need to ignore the sign, convert the value to absolute before calling this function.
 *
 * @param value - Duration value (negative values will be formatted with a minus sign)
 * @param unit - Unit of the duration value (milliseconds, seconds, minutes, hours, days)
 * @param verbosity - Format verbosity (compact, standard, verbose)
 * @param maxUnits - Maximum number of units to display
 * @returns Formatted duration string
 */
export function formatDuration(
  value: number,
  unit: string,
  verbosity = 'standard',
  maxUnits = DEFAULT_MAX_UNITS,
): string {
  const totalSeconds = convertToSeconds(value, unit);
  const absSeconds = Math.abs(totalSeconds);

  if (absSeconds === 0) {
    return verbosity === 'compact' ? '0s' : '0 seconds';
  }

  const components = calculateTimeComponents(absSeconds);
  const parts = formatTimeComponents(components, verbosity);
  const limitedParts = parts.slice(0, maxUnits);

  if (limitedParts.length === 0) {
    return verbosity === 'compact' ? '0s' : '0 seconds';
  }

  return joinFormattedParts(limitedParts, verbosity);
}
