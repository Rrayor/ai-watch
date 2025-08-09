/**
 * AI Watch Extension
 *
 * Provides comprehensive date and time manipulation tools for AI assistants and VS Code.
 * Enables AI-assisted development workflows with accurate timezone handling, business day
 * calculations, duration formatting, and advanced date queries.
 *
 * @author Benjamin Simon
 * @version 1.0.0
 */

import * as vscode from 'vscode';

/**
 * Registers all Language Model Tools with VS Code for AI assistant integration.
 * These tools enable AI assistants to perform sophisticated date/time operations.
 *
 * @param context - VS Code extension context for managing subscriptions
 */
export function registerChatTools(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.lm.registerTool('ai-watch_getCurrentDate', new GetCurrentDateTool()),
  );
  context.subscriptions.push(
    vscode.lm.registerTool('ai-watch_calculateDifference', new CalculateDifferenceTool()),
  );
  context.subscriptions.push(
    vscode.lm.registerTool('ai-watch_convertTimezone', new ConvertTimezoneTool()),
  );
  context.subscriptions.push(vscode.lm.registerTool('ai-watch_addTime', new AddTimeTool()));
  context.subscriptions.push(
    vscode.lm.registerTool('ai-watch_subtractTime', new SubtractTimeTool()),
  );
  context.subscriptions.push(
    vscode.lm.registerTool('ai-watch_formatDuration', new FormatDurationTool()),
  );
  context.subscriptions.push(vscode.lm.registerTool('ai-watch_businessDay', new BusinessDayTool()));
  context.subscriptions.push(vscode.lm.registerTool('ai-watch_dateQuery', new DateQueryTool()));
}

/**
 * Registers all VS Code commands for programmatic access by other extensions.
 * Commands provide the same functionality as Language Model Tools but with direct API access.
 *
 * @param context - VS Code extension context for managing command subscriptions
 */
export function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ai-watch.getCurrentDate',
      (options?: GetCurrentDateOptions) => {
        return getCurrentDateCommand(options);
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ai-watch.calculateDifference',
      (options: CalculateDifferenceOptions) => {
        return calculateDifferenceCommand(options);
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ai-watch.convertTimezone',
      (options: ConvertTimezoneOptions) => {
        return convertTimezoneCommand(options);
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ai-watch.addTime', (options: AddTimeOptions) => {
      return addTimeCommand(options);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ai-watch.subtractTime', (options: SubtractTimeOptions) => {
      return subtractTimeCommand(options);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ai-watch.formatDuration', (options: FormatDurationOptions) => {
      return formatDurationCommand(options);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ai-watch.businessDay', (options: BusinessDayOptions) => {
      return businessDayCommand(options);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ai-watch.dateQuery', (options: DateQueryOptions) => {
      return dateQueryCommand(options);
    }),
  );
}

interface IGetCurrentDateParameters {
  timezone?: string;
  format?: string;
}

/**
 * Options for getting current date and time with optional timezone and formatting.
 */
interface GetCurrentDateOptions {
  /** IANA timezone identifier (e.g., 'America/New_York', 'Europe/Berlin') */
  timezone?: string;
  /** Date format pattern, defaults to 'YYYY-MM-DD HH:mm:ss' */
  format?: string;
}

/**
 * Options for calculating time differences between two dates.
 */
interface CalculateDifferenceOptions {
  /** Starting date/time in ISO 8601 format */
  from: string;
  /** Ending date/time in ISO 8601 format */
  to: string;
}

/**
 * Language Model Tool parameters for calculating time differences.
 */
interface ICalculateDifferenceParameters {
  /** Starting date/time in ISO 8601 format */
  from: string;
  /** Ending date/time in ISO 8601 format */
  to: string;
}

/**
 * Options for converting dates between timezones.
 */
interface ConvertTimezoneOptions {
  /** Date/time in ISO 8601 format to convert */
  date: string;
  /** Source timezone (defaults to UTC if not specified) */
  fromTimezone?: string;
  /** Target IANA timezone identifier */
  toTimezone: string;
}

/**
 * Language Model Tool parameters for timezone conversion.
 */
interface IConvertTimezoneParameters {
  /** Date/time in ISO 8601 format to convert */
  date: string;
  /** Source timezone (defaults to UTC if not specified) */
  fromTimezone?: string;
  /** Target IANA timezone identifier */
  toTimezone: string;
}

/**
 * Options for adding time durations to a base date.
 */
interface AddTimeOptions {
  /** Base time in ISO format (defaults to current time) */
  baseTime?: string;
  /** Number of years to add */
  years?: number;
  /** Number of months to add */
  months?: number;
  /** Number of weeks to add */
  weeks?: number;
  /** Number of days to add */
  days?: number;
  /** Number of hours to add */
  hours?: number;
  /** Number of minutes to add */
  minutes?: number;
  /** Number of seconds to add */
  seconds?: number;
  /** Display result in specific timezone */
  timezone?: string;
}

/**
 * Language Model Tool parameters for adding time durations.
 */
interface IAddTimeParameters {
  /** Base time in ISO format (defaults to current time) */
  baseTime?: string;
  /** Number of years to add */
  years?: number;
  /** Number of months to add */
  months?: number;
  /** Number of weeks to add */
  weeks?: number;
  /** Number of days to add */
  days?: number;
  /** Number of hours to add */
  hours?: number;
  /** Number of minutes to add */
  minutes?: number;
  /** Number of seconds to add */
  seconds?: number;
  /** Display result in specific timezone */
  timezone?: string;
}

/**
 * Options for subtracting time durations from a base date.
 */
interface SubtractTimeOptions {
  /** Base time in ISO format (defaults to current time) */
  baseTime?: string;
  /** Number of years to subtract */
  years?: number;
  /** Number of months to subtract */
  months?: number;
  /** Number of weeks to subtract */
  weeks?: number;
  /** Number of days to subtract */
  days?: number;
  /** Number of hours to subtract */
  hours?: number;
  /** Number of minutes to subtract */
  minutes?: number;
  /** Number of seconds to subtract */
  seconds?: number;
  /** Display result in specific timezone */
  timezone?: string;
}

/**
 * Language Model Tool parameters for subtracting time durations.
 */
interface ISubtractTimeParameters {
  /** Base time in ISO format (defaults to current time) */
  baseTime?: string;
  /** Number of years to subtract */
  years?: number;
  /** Number of months to subtract */
  months?: number;
  /** Number of weeks to subtract */
  weeks?: number;
  /** Number of days to subtract */
  days?: number;
  /** Number of hours to subtract */
  hours?: number;
  /** Number of minutes to subtract */
  minutes?: number;
  /** Number of seconds to subtract */
  seconds?: number;
  /** Display result in specific timezone */
  timezone?: string;
}

/**
 * Options for formatting time durations into human-readable text.
 */
interface FormatDurationOptions {
  /** Starting date/time in ISO format */
  from: string;
  /** Ending date/time in ISO format */
  to: string;
  /** Format verbosity: 'compact', 'standard', or 'verbose' */
  verbosity?: 'compact' | 'standard' | 'verbose';
  /** Maximum number of time units to display */
  maxUnits?: number;
}

/**
 * Language Model Tool parameters for duration formatting.
 */
interface IFormatDurationParameters {
  /** Starting date/time in ISO format */
  from: string;
  /** Ending date/time in ISO format */
  to: string;
  /** Format verbosity: 'compact', 'standard', or 'verbose' */
  verbosity?: 'compact' | 'standard' | 'verbose';
  /** Maximum number of time units to display */
  maxUnits?: number;
}

/**
 * Options for advanced date queries and navigation.
 */
interface DateQueryOptions {
  /** Base date for calculations in ISO format */
  baseDate: string;
  /** Array of query operations to perform in sequence */
  queries: Array<{
    /** Type of date query operation */
    type: 'nextWeekday' | 'previousWeekday' | 'startOfPeriod' | 'endOfPeriod';
    /** Target weekday for weekday queries */
    weekday?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    /** Period type for period queries */
    period?: 'week' | 'month' | 'quarter' | 'year';
    /** Week start day (defaults to monday) */
    weekStart?: 'monday' | 'sunday';
  }>;
}

/**
 * Language Model Tool parameters for date queries.
 */
interface IDateQueryParameters {
  /** Base date for calculations in ISO format */
  baseDate: string;
  /** Array of query operations to perform in sequence */
  queries: Array<{
    /** Type of date query operation */
    type: 'nextWeekday' | 'previousWeekday' | 'startOfPeriod' | 'endOfPeriod';
    /** Target weekday for weekday queries */
    weekday?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    /** Period type for period queries */
    period?: 'week' | 'month' | 'quarter' | 'year';
    /** Week start day (defaults to monday) */
    weekStart?: 'monday' | 'sunday';
  }>;
}

/**
 * Options for business day operations.
 */
interface BusinessDayOptions {
  /** Type of business day operation to perform */
  operation: 'isBusinessDay' | 'addBusinessDays' | 'subtractBusinessDays';
  /** Base date in ISO format */
  date: string;
  /** Number of business days to add/subtract (required for add/subtract operations) */
  days?: number;
}

/**
 * Language Model Tool parameters for business day operations.
 */
interface IBusinessDayParameters {
  /** Type of business day operation to perform */
  operation: 'isBusinessDay' | 'addBusinessDays' | 'subtractBusinessDays';
  /** Base date in ISO format */
  date: string;
  /** Number of business days to add/subtract (required for add/subtract operations) */
  days?: number;
}

/**
 * Formats a Date object into UTC string format.
 *
 * @param date - Date object to format
 * @returns Formatted UTC string in 'YYYY-MM-DD HH:mm:ss' format
 */
function formatUTC(date: Date): string {
  return date
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '');
}

/**
 * Converts a weekday string to its corresponding numeric value.
 *
 * @param weekday - String representation of weekday
 * @returns Numeric day of week (0=Sunday, 1=Monday, etc.)
 */
function weekdayToNumber(weekday: string): number {
  const weekdays = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return weekdays[weekday as keyof typeof weekdays];
}

/**
 * Formats a date in a specific timezone.
 *
 * @param date - Date object to format
 * @param timezone - Target timezone (optional)
 * @param customFormat - Custom format string (optional)
 * @returns Formatted date string
 */
function formatInTimezone(date: Date, timezone?: string, customFormat?: string): string {
  try {
    if (timezone) {
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
    } else {
      // Default to standard ISO format without timezone info
      return date.toISOString().slice(0, 19).replace('T', ' ');
    }
  } catch (error) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
}

/**
 * Gets the user's current timezone.
 *
 * @returns User's timezone string, defaults to UTC if detection fails
 */
function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    return 'UTC'; // Fallback to UTC if detection fails
  }
}

/**
 * Parses an ISO date string and returns a Date object.
 *
 * @param dateString - ISO date string to parse
 * @returns Parsed Date object
 * @throws Error if date format is invalid
 */
function parseISOString(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
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
function calculateDateDifference(from: Date, to: Date) {
  const diffMs = to.getTime() - from.getTime();
  return {
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diffMs / (1000 * 60 * 60)),
    minutes: Math.floor(diffMs / (1000 * 60)),
    seconds: Math.floor(diffMs / 1000),
  };
}

// Duration formatting functions
/**
 * Formats a duration value into a human-readable string.
 *
 * @param value - Duration value
 * @param unit - Unit of the duration value (milliseconds, seconds, minutes, hours, days)
 * @param verbosity - Format verbosity (compact, standard, verbose)
 * @param maxUnits - Maximum number of units to display
 * @returns Formatted duration string
 */
function formatDuration(
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

  const isNegative = totalSeconds < 0;
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

  return isNegative ? `${result} ago` : result;
}

// Business day functions
/**
 * Parses a business days string and returns an array of day numbers.
 *
 * @param businessDaysString - String describing business days (e.g., "Mon-Fri", "Mon,Wed,Fri")
 * @returns Array of day numbers (0=Sunday, 1=Monday, etc.)
 */
function parseBusinessDays(businessDaysString: string): number[] {
  const dayMap = {
    Mon: 1,
    Monday: 1,
    Tue: 2,
    Tuesday: 2,
    Wed: 3,
    Wednesday: 3,
    Thu: 4,
    Thursday: 4,
    Fri: 5,
    Friday: 5,
    Sat: 6,
    Saturday: 6,
    Sun: 0,
    Sunday: 0,
  };

  // Handle range format like "Mon-Fri"
  if (businessDaysString.includes('-')) {
    const [start, end] = businessDaysString.split('-');
    const startDay = dayMap[start.trim() as keyof typeof dayMap];
    const endDay = dayMap[end.trim() as keyof typeof dayMap];

    const days = [];
    for (let i = startDay; i <= endDay; i++) {
      days.push(i);
    }
    return days;
  }

  // Handle comma-separated format like "Mon,Wed,Fri"
  return businessDaysString
    .split(',')
    .map((day) => dayMap[day.trim() as keyof typeof dayMap])
    .filter((day) => day !== undefined);
}

/**
 * Checks if a date is a business day and not in excluded dates.
 *
 * @param date - Date to check
 * @param businessDays - Array of business day numbers
 * @param excludedDates - Set of excluded date strings
 * @returns True if the date is a business day and not excluded
 */
function isBusinessDay(date: Date, businessDays: number[], excludedDates: Set<string>): boolean {
  const dayOfWeek = date.getDay();
  const dateString = date.toISOString().split('T')[0];

  return businessDays.includes(dayOfWeek) && !excludedDates.has(dateString);
}

/**
 * Adds a specified number of business days to a start date.
 *
 * @param startDate - Starting date
 * @param days - Number of business days to add (can be negative)
 * @param businessDays - Array of business day numbers
 * @param excludedDates - Set of excluded date strings
 * @returns New date with business days added
 */
function addBusinessDays(
  startDate: Date,
  days: number,
  businessDays: number[],
  excludedDates: Set<string>,
): Date {
  const result = new Date(startDate);
  let daysToAdd = Math.abs(days);
  const direction = days >= 0 ? 1 : -1;

  while (daysToAdd > 0) {
    result.setDate(result.getDate() + direction);
    if (isBusinessDay(result, businessDays, excludedDates)) {
      daysToAdd--;
    }
  }

  return result;
}

// Date query functions
/**
 * Gets the next occurrence of a specific weekday from a start date.
 *
 * @param startDate - Starting date
 * @param targetWeekday - Target weekday name
 * @returns Date of the next occurrence of the target weekday
 */
function getNextWeekday(startDate: Date, targetWeekday: string): Date {
  const weekdayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay = weekdayMap[targetWeekday as keyof typeof weekdayMap];
  if (targetDay === undefined) {
    throw new Error(`Invalid weekday: ${targetWeekday}`);
  }

  const currentDay = startDate.getDay();

  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }

  const result = new Date(startDate);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

function getPreviousWeekday(startDate: Date, targetWeekday: string): Date {
  const weekdayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay = weekdayMap[targetWeekday as keyof typeof weekdayMap];
  if (targetDay === undefined) {
    throw new Error(`Invalid weekday: ${targetWeekday}`);
  }

  const currentDay = startDate.getDay();

  let daysToSubtract = currentDay - targetDay;
  if (daysToSubtract <= 0) {
    daysToSubtract += 7;
  }

  const result = new Date(startDate);
  result.setDate(result.getDate() - daysToSubtract);
  return result;
}

function getStartOfPeriod(date: Date, period: string, weekStart: string = 'Monday'): Date {
  const result = new Date(date);

  switch (period) {
    case 'day':
      result.setHours(0, 0, 0, 0);
      break;
    case 'week':
      const startDay = weekStart === 'Sunday' ? 0 : 1;
      const currentDay = result.getDay();
      let daysToSubtract = (currentDay - startDay + 7) % 7;
      result.setDate(result.getDate() - daysToSubtract);
      result.setHours(0, 0, 0, 0);
      break;
    case 'month':
      result.setDate(1);
      result.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      const quarterStartMonth = Math.floor(result.getMonth() / 3) * 3;
      result.setMonth(quarterStartMonth, 1);
      result.setHours(0, 0, 0, 0);
      break;
    case 'year':
      result.setMonth(0, 1);
      result.setHours(0, 0, 0, 0);
      break;
  }

  return result;
}

function getEndOfPeriod(date: Date, period: string, weekStart: string = 'Monday'): Date {
  const result = new Date(date);

  switch (period) {
    case 'day':
      result.setHours(23, 59, 59, 999);
      break;
    case 'week':
      const startOfWeek = getStartOfPeriod(date, 'week', weekStart);
      result.setTime(startOfWeek.getTime());
      result.setDate(result.getDate() + 6);
      result.setHours(23, 59, 59, 999);
      break;
    case 'month':
      result.setMonth(result.getMonth() + 1, 0);
      result.setHours(23, 59, 59, 999);
      break;
    case 'quarter':
      const quarterStartMonth = Math.floor(result.getMonth() / 3) * 3;
      result.setMonth(quarterStartMonth + 3, 0);
      result.setHours(23, 59, 59, 999);
      break;
    case 'year':
      result.setMonth(11, 31);
      result.setHours(23, 59, 59, 999);
      break;
  }

  return result;
}

// Command implementations
function formatDurationCommand(options: FormatDurationOptions) {
  try {
    const fromDate = new Date(options.from);
    const toDate = new Date(options.to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return {
        error: 'Invalid date format. Please use ISO 8601 format (e.g., 2025-08-01T00:00:00Z)',
      };
    }

    const diffMs = Math.abs(toDate.getTime() - fromDate.getTime());
    const formatted = formatDuration(
      diffMs,
      'milliseconds',
      options.verbosity || 'standard',
      options.maxUnits || 3,
    );

    return { formatted };
  } catch (error) {
    return { error: String(error) };
  }
}

function businessDayCommand(options: BusinessDayOptions) {
  try {
    const date = parseISOString(options.date);

    switch (options.operation) {
      case 'isBusinessDay': {
        const isBusinessDay = date.getDay() >= 1 && date.getDay() <= 5;
        return {
          date: options.date,
          isBusinessDay,
          weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
            date.getDay()
          ],
        };
      }

      case 'addBusinessDays': {
        if (!options.days) {
          return { error: 'Days parameter required for addBusinessDays operation' };
        }
        const result = addBusinessDays(date, options.days, [1, 2, 3, 4, 5], new Set());
        return {
          date: options.date,
          operation: options.operation,
          days: options.days,
          result: result.toISOString(),
        };
      }

      case 'subtractBusinessDays': {
        if (!options.days) {
          return { error: 'Days parameter required for subtractBusinessDays operation' };
        }
        const result = addBusinessDays(date, -options.days, [1, 2, 3, 4, 5], new Set());
        return {
          date: options.date,
          operation: options.operation,
          days: options.days,
          result: result.toISOString(),
        };
      }

      default:
        return {
          error: 'Invalid operation. Use isBusinessDay, addBusinessDays, or subtractBusinessDays',
        };
    }
  } catch (error) {
    return { error: String(error) };
  }
}

function dateQueryCommand(options: DateQueryOptions) {
  try {
    const baseDate = parseISOString(options.baseDate);
    const results: Date[] = [];

    for (let i = 0; i < options.queries.length; i++) {
      const query = options.queries[i];
      let result: Date;

      switch (query.type) {
        case 'nextWeekday':
          if (!query.weekday) {
            throw new Error('Weekday required for nextWeekday query');
          }
          result = getNextWeekday(i === 0 ? baseDate : results[i - 1], query.weekday);
          break;
        case 'previousWeekday':
          if (!query.weekday) {
            throw new Error('Weekday required for previousWeekday query');
          }
          result = getPreviousWeekday(i === 0 ? baseDate : results[i - 1], query.weekday);
          break;
        case 'startOfPeriod':
          if (!query.period) {
            throw new Error('Period required for startOfPeriod query');
          }
          result = getStartOfPeriod(baseDate, query.period, query.weekStart);
          break;
        case 'endOfPeriod':
          if (!query.period) {
            throw new Error('Period required for endOfPeriod query');
          }
          result = getEndOfPeriod(baseDate, query.period, query.weekStart);
          break;
        default:
          throw new Error(`Unsupported query type: ${(query as any).type}`);
      }

      results.push(result);
    }

    if (results.length === 1) {
      return { date: results[0].toISOString() };
    } else {
      return { dates: results.map((d) => d.toISOString()) };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Invalid date query parameters' };
  }
}

// Command implementations
/**
 * Command function for getting the current date and time.
 *
 * @param options - Optional configuration for timezone and format
 * @returns Object with current date/time information
 */
function getCurrentDateCommand(options?: GetCurrentDateOptions) {
  const now = new Date();
  const result: any = {
    iso: now.toISOString(),
    utc: formatUTC(now),
  };

  // If no options provided, also include local timezone
  if (!options || (!options.timezone && !options.format)) {
    const userTimezone = getUserTimezone();
    result.local = formatInTimezone(now, userTimezone);
    result.localTimezone = userTimezone;
  }

  if (options?.timezone) {
    try {
      result.formatted = formatInTimezone(now, options.timezone, options.format);
      result.timezone = options.timezone;
    } catch (error) {
      result.error = `Invalid timezone: ${options.timezone}`;
    }
  } else if (options?.format) {
    try {
      result.formatted = formatInTimezone(now, undefined, options.format);
    } catch (error) {
      result.error = `Invalid format: ${options.format}`;
    }
  }

  return result;
}

/**
 * Command function for calculating differences between dates.
 *
 * @param options - Configuration with from/to dates and unit
 * @returns Object with calculated date difference
 */
function calculateDifferenceCommand(options: CalculateDifferenceOptions) {
  try {
    const fromDate = parseISOString(options.from);
    const toDate = parseISOString(options.to);

    return calculateDateDifference(fromDate, toDate);
  } catch (error) {
    return {
      error: `Invalid date format. Please use ISO format (e.g., 2025-08-09T13:37:01Z)`,
    };
  }
}

/**
 * Command function for converting times between timezones.
 *
 * @param options - Configuration with date and target timezone
 * @returns Object with timezone conversion results
 */
function convertTimezoneCommand(options: ConvertTimezoneOptions) {
  try {
    const date = parseISOString(options.date);
    // Default fromTimezone to UTC if not specified
    const fromTz = options.fromTimezone || 'UTC';
    const formatted = formatInTimezone(date, options.toTimezone);

    return {
      formatted,
      fromTimezone: fromTz,
      toTimezone: options.toTimezone,
      iso: date.toISOString(),
    };
  } catch (error) {
    return {
      error: `Invalid date format or timezone. Please use ISO format for date and valid IANA timezone.`,
    };
  }
}

function addTimeCommand(options: AddTimeOptions) {
  try {
    // Use provided base time or current time
    const baseDate = options.baseTime ? parseISOString(options.baseTime) : new Date();

    // Calculate the new date by adding the specified time units
    const newDate = new Date(baseDate);

    if (options.years) {
      newDate.setFullYear(newDate.getFullYear() + options.years);
    }
    if (options.months) {
      newDate.setMonth(newDate.getMonth() + options.months);
    }
    if (options.weeks) {
      newDate.setDate(newDate.getDate() + options.weeks * 7);
    }
    if (options.days) {
      newDate.setDate(newDate.getDate() + options.days);
    }
    if (options.hours) {
      newDate.setHours(newDate.getHours() + options.hours);
    }
    if (options.minutes) {
      newDate.setMinutes(newDate.getMinutes() + options.minutes);
    }
    if (options.seconds) {
      newDate.setSeconds(newDate.getSeconds() + options.seconds);
    }

    const result: any = {
      iso: newDate.toISOString(),
      utc: formatUTC(newDate),
      baseTime: baseDate.toISOString(),
    };

    // Include local timezone info
    const userTimezone = getUserTimezone();
    result.local = formatInTimezone(newDate, userTimezone);
    result.localTimezone = userTimezone;

    // If specific timezone requested, include that too
    if (options.timezone) {
      try {
        result.formatted = formatInTimezone(newDate, options.timezone);
        result.timezone = options.timezone;
      } catch (error) {
        result.error = `Invalid timezone: ${options.timezone}`;
      }
    }

    return result;
  } catch (error) {
    return {
      error: `Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.`,
    };
  }
}

function subtractTimeCommand(options: SubtractTimeOptions) {
  try {
    // Use provided base time or current time
    const baseDate = options.baseTime ? parseISOString(options.baseTime) : new Date();

    // Calculate the new date by subtracting the specified time units
    const newDate = new Date(baseDate);

    if (options.years) {
      newDate.setFullYear(newDate.getFullYear() - options.years);
    }
    if (options.months) {
      newDate.setMonth(newDate.getMonth() - options.months);
    }
    if (options.weeks) {
      newDate.setDate(newDate.getDate() - options.weeks * 7);
    }
    if (options.days) {
      newDate.setDate(newDate.getDate() - options.days);
    }
    if (options.hours) {
      newDate.setHours(newDate.getHours() - options.hours);
    }
    if (options.minutes) {
      newDate.setMinutes(newDate.getMinutes() - options.minutes);
    }
    if (options.seconds) {
      newDate.setSeconds(newDate.getSeconds() - options.seconds);
    }

    const result: any = {
      iso: newDate.toISOString(),
      utc: formatUTC(newDate),
      baseTime: baseDate.toISOString(),
    };

    // Include local timezone info
    const userTimezone = getUserTimezone();
    result.local = formatInTimezone(newDate, userTimezone);
    result.localTimezone = userTimezone;

    // If specific timezone requested, include that too
    if (options.timezone) {
      try {
        result.formatted = formatInTimezone(newDate, options.timezone);
        result.timezone = options.timezone;
      } catch (error) {
        result.error = `Invalid timezone: ${options.timezone}`;
      }
    }

    return result;
  } catch (error) {
    return {
      error: `Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.`,
    };
  }
}

/**
 * Language Model Tool for getting the current date and time with timezone support.
 * Provides current date/time in various formats and timezones.
 */
export class GetCurrentDateTool implements vscode.LanguageModelTool<IGetCurrentDateParameters> {
  /**
   * Invokes the get current date tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with current date/time information
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IGetCurrentDateParameters>,
    _token: vscode.CancellationToken,
  ) {
    const now = new Date();
    const params = options.input;

    const result: any = {
      iso: now.toISOString(),
      utc: formatUTC(now),
    };

    // Always include local timezone info for better context
    const userTimezone = getUserTimezone();
    result.local = formatInTimezone(now, userTimezone);
    result.localTimezone = userTimezone;

    if (params?.timezone) {
      try {
        result.formatted = formatInTimezone(now, params.timezone, params.format);
        result.timezone = params.timezone;
      } catch (error) {
        result.error = `Invalid timezone: ${params.timezone}`;
      }
    } else if (params?.format) {
      try {
        result.formatted = formatInTimezone(now, undefined, params.format);
      } catch (error) {
        result.error = `Invalid format: ${params.format}`;
      }
    }

    let message = `Current date and time:\n- ISO format: ${result.iso}\n- UTC format: ${result.utc}\n- Local time: ${result.local} (${result.localTimezone})`;
    if (result.formatted && params?.timezone) {
      message += `\n- ${params.timezone}: ${result.formatted}`;
    } else if (result.formatted) {
      message += `\n- Formatted: ${result.formatted}`;
    }
    if (result.error) {
      message += `\n- Error: ${result.error}`;
    }

    return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IGetCurrentDateParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;
    let title = 'Get current date and time';
    let message = 'Get the current date and time';

    if (params?.timezone || params?.format) {
      if (params.timezone) {
        title += ` in ${params.timezone}`;
        message += ` in timezone ${params.timezone}`;
      }
      if (params.format) {
        message += ` with format "${params.format}"`;
      }
    } else {
      message += ' in ISO and UTC formats';
    }

    const confirmationMessages = {
      title,
      message: new vscode.MarkdownString(message + '?'),
    };

    return {
      invocationMessage: title,
      confirmationMessages,
    };
  }
}

/**
 * Language Model Tool for calculating differences between two dates.
 * Computes time differences in various units (days, hours, minutes, etc.).
 */
export class CalculateDifferenceTool
  implements vscode.LanguageModelTool<ICalculateDifferenceParameters>
{
  /**
   * Invokes the calculate difference tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with date difference information
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<ICalculateDifferenceParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;

    try {
      const fromDate = parseISOString(params.from);
      const toDate = parseISOString(params.to);

      const result = calculateDateDifference(fromDate, toDate);

      const message =
        `Time difference between ${params.from} and ${params.to}:\n` +
        `- Days: ${result.days}\n` +
        `- Hours: ${result.hours}\n` +
        `- Minutes: ${result.minutes}\n` +
        `- Seconds: ${result.seconds}`;

      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
    } catch (error) {
      const errorMessage = `Error calculating difference: Invalid date format. Please use ISO format (e.g., 2025-08-09T13:37:01Z)`;
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(errorMessage)]);
    }
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<ICalculateDifferenceParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;
    const confirmationMessages = {
      title: 'Calculate time difference',
      message: new vscode.MarkdownString(
        `Calculate the time difference between ${params.from} and ${params.to}?`,
      ),
    };

    return {
      invocationMessage: 'Calculating time difference',
      confirmationMessages,
    };
  }
}

/**
 * Language Model Tool for converting times between timezones.
 * Converts dates and times from one timezone to another with proper formatting.
 */
export class ConvertTimezoneTool implements vscode.LanguageModelTool<IConvertTimezoneParameters> {
  /**
   * Invokes the convert timezone tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with timezone conversion information
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IConvertTimezoneParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;

    try {
      const date = parseISOString(params.date);
      // Default fromTimezone to UTC if not specified
      const fromTz = params.fromTimezone || 'UTC';
      const formatted = formatInTimezone(date, params.toTimezone);

      const message =
        `Converted ${params.date} from ${fromTz} to ${params.toTimezone}:\n` +
        `- Formatted: ${formatted}\n` +
        `- From timezone: ${fromTz}\n` +
        `- To timezone: ${params.toTimezone}\n` +
        `- Original ISO: ${date.toISOString()}`;

      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
    } catch (error) {
      const errorMessage = `Error converting timezone: Invalid date format or timezone. Please use ISO format for date and valid IANA timezone.`;
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(errorMessage)]);
    }
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IConvertTimezoneParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;
    const confirmationMessages = {
      title: 'Convert timezone',
      message: new vscode.MarkdownString(
        `Convert ${params.date} to timezone ${params.toTimezone}?`,
      ),
    };

    return {
      invocationMessage: 'Converting timezone',
      confirmationMessages,
    };
  }
}

/**
 * Language Model Tool for adding time to dates.
 * Adds specified amounts of time (years, months, weeks, days, hours, minutes, seconds) to a base date.
 */
export class AddTimeTool implements vscode.LanguageModelTool<IAddTimeParameters> {
  /**
   * Invokes the add time tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with the calculated future date
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IAddTimeParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;

    try {
      // Use provided base time or current time
      const baseDate = params.baseTime ? parseISOString(params.baseTime) : new Date();

      // Calculate the new date by adding the specified time units
      const newDate = new Date(baseDate);

      if (params.years) {
        newDate.setFullYear(newDate.getFullYear() + params.years);
      }
      if (params.months) {
        newDate.setMonth(newDate.getMonth() + params.months);
      }
      if (params.weeks) {
        newDate.setDate(newDate.getDate() + params.weeks * 7);
      }
      if (params.days) {
        newDate.setDate(newDate.getDate() + params.days);
      }
      if (params.hours) {
        newDate.setHours(newDate.getHours() + params.hours);
      }
      if (params.minutes) {
        newDate.setMinutes(newDate.getMinutes() + params.minutes);
      }
      if (params.seconds) {
        newDate.setSeconds(newDate.getSeconds() + params.seconds);
      }

      // Include local timezone info
      const userTimezone = getUserTimezone();
      const localFormatted = formatInTimezone(newDate, userTimezone);

      // Build duration description
      const durationParts = [];
      if (params.years) {
        durationParts.push(`${params.years} year${params.years !== 1 ? 's' : ''}`);
      }
      if (params.months) {
        durationParts.push(`${params.months} month${params.months !== 1 ? 's' : ''}`);
      }
      if (params.weeks) {
        durationParts.push(`${params.weeks} week${params.weeks !== 1 ? 's' : ''}`);
      }
      if (params.days) {
        durationParts.push(`${params.days} day${params.days !== 1 ? 's' : ''}`);
      }
      if (params.hours) {
        durationParts.push(`${params.hours} hour${params.hours !== 1 ? 's' : ''}`);
      }
      if (params.minutes) {
        durationParts.push(`${params.minutes} minute${params.minutes !== 1 ? 's' : ''}`);
      }
      if (params.seconds) {
        durationParts.push(`${params.seconds} second${params.seconds !== 1 ? 's' : ''}`);
      }

      const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
      const baseText = params.baseTime ? params.baseTime : 'now';

      let message =
        `Adding ${durationText} to ${baseText}:\n` +
        `- Result: ${localFormatted} (${userTimezone})\n` +
        `- ISO format: ${newDate.toISOString()}\n` +
        `- UTC format: ${formatUTC(newDate)}`;

      // If specific timezone requested, include that too
      if (params.timezone) {
        try {
          const tzFormatted = formatInTimezone(newDate, params.timezone);
          message += `\n- ${params.timezone}: ${tzFormatted}`;
        } catch (error) {
          message += `\n- Error: Invalid timezone: ${params.timezone}`;
        }
      }

      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
    } catch (error) {
      const errorMessage = `Error adding time: Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.`;
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(errorMessage)]);
    }
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IAddTimeParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;

    // Build duration description for confirmation
    const durationParts = [];
    if (params.years) {
      durationParts.push(`${params.years} year${params.years !== 1 ? 's' : ''}`);
    }
    if (params.months) {
      durationParts.push(`${params.months} month${params.months !== 1 ? 's' : ''}`);
    }
    if (params.weeks) {
      durationParts.push(`${params.weeks} week${params.weeks !== 1 ? 's' : ''}`);
    }
    if (params.days) {
      durationParts.push(`${params.days} day${params.days !== 1 ? 's' : ''}`);
    }
    if (params.hours) {
      durationParts.push(`${params.hours} hour${params.hours !== 1 ? 's' : ''}`);
    }
    if (params.minutes) {
      durationParts.push(`${params.minutes} minute${params.minutes !== 1 ? 's' : ''}`);
    }
    if (params.seconds) {
      durationParts.push(`${params.seconds} second${params.seconds !== 1 ? 's' : ''}`);
    }

    const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
    const baseText = params.baseTime ? params.baseTime : 'current time';

    const confirmationMessages = {
      title: 'Add time duration',
      message: new vscode.MarkdownString(`Add ${durationText} to ${baseText}?`),
    };

    return {
      invocationMessage: `Adding ${durationText}`,
      confirmationMessages,
    };
  }
}

/**
 * Language Model Tool for subtracting time from dates.
 * Subtracts specified amounts of time (years, months, weeks, days, hours, minutes, seconds) from a base date.
 */
export class SubtractTimeTool implements vscode.LanguageModelTool<ISubtractTimeParameters> {
  /**
   * Invokes the subtract time tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with the calculated past date
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<ISubtractTimeParameters>,
    _token: vscode.CancellationToken,
  ): Promise<vscode.LanguageModelToolResult> {
    try {
      const result = subtractTimeCommand(options.input);
      if (result.error) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error: ${result.error}`),
        ]);
      }

      let message = `Time calculation result:\n- Base time: ${result.baseTime}\n- Result: ${result.iso}\n- UTC format: ${result.utc}\n- Local time: ${result.local} (${result.localTimezone})`;
      if (result.formatted && result.timezone) {
        message += `\n- ${result.timezone}: ${result.formatted}`;
      }

      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
    } catch (error) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart('Error: Failed to subtract time'),
      ]);
    }
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<ISubtractTimeParameters>,
    _token: vscode.CancellationToken,
  ): Promise<vscode.PreparedToolInvocation> {
    const params = options.input;

    // Build duration description for confirmation
    const durationParts = [];
    if (params.years) {
      durationParts.push(`${params.years} year${params.years !== 1 ? 's' : ''}`);
    }
    if (params.months) {
      durationParts.push(`${params.months} month${params.months !== 1 ? 's' : ''}`);
    }
    if (params.weeks) {
      durationParts.push(`${params.weeks} week${params.weeks !== 1 ? 's' : ''}`);
    }
    if (params.days) {
      durationParts.push(`${params.days} day${params.days !== 1 ? 's' : ''}`);
    }
    if (params.hours) {
      durationParts.push(`${params.hours} hour${params.hours !== 1 ? 's' : ''}`);
    }
    if (params.minutes) {
      durationParts.push(`${params.minutes} minute${params.minutes !== 1 ? 's' : ''}`);
    }
    if (params.seconds) {
      durationParts.push(`${params.seconds} second${params.seconds !== 1 ? 's' : ''}`);
    }

    const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
    const baseText = params.baseTime ? params.baseTime : 'current time';

    const confirmationMessages = {
      title: 'Subtract time duration',
      message: new vscode.MarkdownString(`Subtract ${durationText} from ${baseText}?`),
    };

    return {
      invocationMessage: `Subtracting ${durationText}`,
      confirmationMessages,
    };
  }
}

/**
 * Language Model Tool for formatting duration values.
 * Converts duration values into human-readable strings with various verbosity levels.
 */
export class FormatDurationTool implements vscode.LanguageModelTool<IFormatDurationParameters> {
  /**
   * Invokes the format duration tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with formatted duration string
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IFormatDurationParameters>,
    _token: vscode.CancellationToken,
  ) {
    try {
      const params = options.input;
      const result = formatDurationCommand(params);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(JSON.stringify(result)),
      ]);
    } catch (error) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(`Error: ${error}`),
      ]);
    }
  }
}

/**
 * Language Model Tool for business day operations.
 * Performs business day calculations including checking if a date is a business day,
 * adding/subtracting business days, and handling custom business day definitions.
 */
export class BusinessDayTool implements vscode.LanguageModelTool<IBusinessDayParameters> {
  /**
   * Invokes the business day tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with business day operation results
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IBusinessDayParameters>,
    _token: vscode.CancellationToken,
  ) {
    try {
      const params = options.input;
      const result = businessDayCommand(params);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(JSON.stringify(result)),
      ]);
    } catch (error) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(`Error: ${error}`),
      ]);
    }
  }
}

/**
 * Language Model Tool for advanced date queries and navigation.
 * Performs complex date operations like finding next/previous weekdays,
 * calculating start/end of periods, and chaining multiple date operations.
 */
export class DateQueryTool implements vscode.LanguageModelTool<IDateQueryParameters> {
  /**
   * Invokes the date query tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with date query operation results
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IDateQueryParameters>,
    _token: vscode.CancellationToken,
  ) {
    try {
      const params = options.input;
      const result = dateQueryCommand(params);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(JSON.stringify(result)),
      ]);
    } catch (error) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(`Error: ${error}`),
      ]);
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  registerChatTools(context);
  registerCommands(context);
}

export function deactivate() {}
