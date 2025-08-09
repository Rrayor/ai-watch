/**
 * Duration formatting utility functions for AI Watch extension.
 */

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
  verbosity: string = 'standard',
  maxUnits: number = 3,
): string {
  // Convert everything to seconds first
  let totalSeconds: number;

  switch (unit) {
    case 'milliseconds':
      totalSeconds = value / 1000;
      break;
    case 'minutes':
      totalSeconds = value * 60;
      break;
    case 'hours':
      totalSeconds = value * 3600;
      break;
    case 'days':
      totalSeconds = value * 86400;
      break;
    case 'seconds':
    default:
      totalSeconds = value;
      break;
  }

  const absSeconds = Math.abs(totalSeconds);

  if (absSeconds === 0) {
    return '0 seconds';
  }

  const years = Math.floor(absSeconds / (365 * 24 * 3600));
  const days = Math.floor((absSeconds % (365 * 24 * 3600)) / (24 * 3600));
  const hours = Math.floor((absSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = Math.floor(absSeconds % 60);

  const parts = [];

  if (verbosity === 'compact') {
    if (years > 0) {
      parts.push(`${years}y`);
    }
    if (days > 0) {
      parts.push(`${days}d`);
    }
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    if (seconds > 0) {
      parts.push(`${seconds}s`);
    }
  } else if (verbosity === 'verbose') {
    if (years > 0) {
      parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    }
    if (days > 0) {
      parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    }
    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }
    if (seconds > 0) {
      parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
    }
  } else {
    // standard
    if (years > 0) {
      parts.push(`${years} years`);
    }
    if (days > 0) {
      parts.push(`${days} days`);
    }
    if (hours > 0) {
      parts.push(`${hours} hours`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} minutes`);
    }
    if (seconds > 0) {
      parts.push(`${seconds} seconds`);
    }
  }

  // Limit to maxUnits
  const limitedParts = parts.slice(0, maxUnits);

  if (limitedParts.length === 0) {
    return verbosity === 'compact' ? '0s' : '0 seconds';
  }

  const result =
    verbosity === 'verbose' && limitedParts.length > 1
      ? limitedParts.slice(0, -1).join(', ') + ' and ' + limitedParts[limitedParts.length - 1]
      : limitedParts.join(verbosity === 'compact' ? ' ' : ', ');

  return result;
}
