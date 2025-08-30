/**
 * Command implementation for business day operations.
 */
import { workspace } from 'vscode';
import { parseISOString, weekdayToNumber } from '../../shared';
import { InvalidWeekDayError } from '../../shared';
import { MissingDaysError } from '../error/MissingDaysError';
import { UnsupportedBusinessDayOperation } from '../error/UnsupportedBusinessDayOperation';
import { BusinessDayOptions } from '../model/BusinessDayOptions';
import { BusinessDayResult } from '../model/BusinessDayResult';
import { InvalidDateError } from '../../shared';

// Constants for business day calculations
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const STANDARD_BUSINESS_DAYS = [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY];
const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Command function for business day operations.
 *
 * @param options - Configuration with business day operation details
 * @returns Object with business day operation results
 * @throws {InvalidDateError} if the date is invalid
 * @throws {InvalidTimezoneError} if the timezone is invalid
 * @throws {InvalidWeekDayError} If the weekday is invalid
 * @throws {MissingDaysError} If the days parameter is missing
 * @throws {UnsupportedBusinessDayOperation} If the operation is not supported
 */
export function businessDayCommand(options: BusinessDayOptions): BusinessDayResult {
  const date = parseISOString(options.date);
  const businessDaysToOperateOn = resolveBusinessDaysConfig(options.businessDays);

  const excludeDatesConfiguration = workspace
    .getConfiguration('aiWatch')
    .get<string[]>('excludedDates');

  if (!options.excludedDates && excludeDatesConfiguration) {
    options.excludedDates = excludeDatesConfiguration;
  }

  switch (options.operation) {
    case 'isBusinessDay':
      return handleIsBusinessDay(date);
    case 'addBusinessDays':
      return handleAddBusinessDays(options, date, businessDaysToOperateOn);
    case 'subtractBusinessDays':
      return handleSubtractBusinessDays(options, date, businessDaysToOperateOn);
    default:
      throw new UnsupportedBusinessDayOperation(options.operation);
  }
}

/**
 * Determines if a given date is a business day and returns the weekday name.
 *
 * @param date - The date to check
 * @returns An object with isBusinessDay and weekday name
 * @throws {InvalidWeekDayError} If the weekday is invalid
 */
function handleIsBusinessDay(date: Date): BusinessDayResult {
  const isBusinessDay = date.getDay() >= MONDAY && date.getDay() <= FRIDAY;
  const weekday = WEEKDAY_NAMES[date.getDay()];
  if (!weekday) {
    throw new InvalidWeekDayError(weekday);
  }
  return {
    isBusinessDay,
    weekday,
  };
}

/**
 * Handles the addBusinessDays operation, adding business days to a date.
 *
 * @param options - The business day command options
 * @param date - The base date
 * @param businessDaysToOperateOn - Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @returns An object with the result ISO string, days, and businessDays label
 * @throws {MissingDaysError} If the days parameter is missing
 */
function handleAddBusinessDays(
  options: BusinessDayOptions,
  date: Date,
  businessDaysToOperateOn: number[],
): BusinessDayResult {
  if (!options.days) {
    throw new MissingDaysError('addBusinessDays');
  }
  const result = addBusinessDays(
    date,
    options.days,
    businessDaysToOperateOn,
    options.excludedDates ?? [],
  );
  return {
    result: result.toISOString(),
    days: options.days,
    businessDays: options.businessDays ? options.businessDays.join(', ') : 'Monday to Friday',
  };
}

/**
 * Handles the subtractBusinessDays operation, subtracting business days from a date.
 *
 * @param options - The business day command options
 * @param date - The base date
 * @param businessDaysToOperateOn - Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @returns An object with the result ISO string, days, and businessDays label
 * @throws {MissingDaysError} If the days parameter is missing
 */
function handleSubtractBusinessDays(
  options: BusinessDayOptions,
  date: Date,
  businessDaysToOperateOn: number[],
): BusinessDayResult {
  if (!options.days) {
    throw new MissingDaysError('subtractBusinessDays');
  }
  const result = subtractBusinessDays(
    date,
    options.days,
    businessDaysToOperateOn,
    options.excludedDates ?? [],
  );
  return {
    result: result.toISOString(),
    days: options.days,
    businessDays: 'Monday to Friday',
  };
}

/**
 * Parses a custom business day configuration.
 * @param businessDays - Array of business day names (e.g., ["Monday", "Tuesday"])
 * @returns Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @throws {InvalidWeekDayError} if a weekday is invalid
 */
function parseCustomBusinessDayConfiguration(businessDays: string[]): number[] {
  return businessDays.map((day) => weekdayToNumber(day)).filter((day) => day !== undefined);
}

/**
 * Adds a specified number of business days to a start date.
 *
 * @param startDate - The starting date
 * @param businessDaysToAdd - Number of business days to add
 * @param businessDays - Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @param excludedDates - Set of excluded date strings in YYYY-MM-DD format
 * @returns The resulting date after adding business days
 * @throws {InvalidDateError} if the date is invalid
 */
function addBusinessDays(
  startDate: Date,
  businessDaysToAdd: number,
  businessDays: number[],
  excludedDates: string[],
): Date {
  // Handle negative days by treating them as subtraction
  if (businessDaysToAdd < 0) {
    return adjustBusinessDays(startDate, businessDaysToAdd, businessDays, excludedDates || []);
  }

  return adjustBusinessDays(startDate, businessDaysToAdd, businessDays, excludedDates || []);
}

/**
 * Subtracts a specified number of business days from a start date.
 *
 * @param startDate - The starting date
 * @param businessDaysToSubtract - Number of business days to subtract
 * @param businessDays - Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @param excludedDates - Set of excluded date strings in YYYY-MM-DD format
 * @returns The resulting date after subtracting business days
 * @throws {InvalidDateError} if the date is invalid
 */
export function subtractBusinessDays(
  startDate: Date,
  businessDaysToSubtract: number,
  businessDays: number[],
  excludedDates: string[],
): Date {
  return adjustBusinessDays(startDate, -businessDaysToSubtract, businessDays, excludedDates ?? []);
}

/**
 * Resolves the business days configuration from per-request, global, or default settings.
 * @param perRequestBusinessDays - Array of business day names (e.g., ["Monday", "Tuesday"])
 * @returns Array of business day numbers (0=Sunday, 1=Monday, etc.)
 */
function resolveBusinessDaysConfig(perRequestBusinessDays?: string[]): number[] {
  if (perRequestBusinessDays) {
    return parseCustomBusinessDayConfiguration(perRequestBusinessDays);
  }

  const businessDayConfiguration = workspace
    .getConfiguration('aiWatch')
    .get<string[] | undefined>('businessDays');

  if (businessDayConfiguration) {
    return parseCustomBusinessDayConfiguration(businessDayConfiguration);
  }

  return STANDARD_BUSINESS_DAYS;
}

/**
 * Internal helper function to add or subtract business days.
 *
 * @param startDate - The starting date
 * @param businessDaysToAdd - Number of business days to add (positive) or subtract (negative)
 * @param businessDays - Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @param excludedDates - Set of excluded date strings in YYYY-MM-DD format
 * @returns The resulting date after adding/subtracting business days
 * @throws {InvalidDateError} If the date is invalid
 */
function adjustBusinessDays(
  startDate: Date,
  businessDaysToAdd: number,
  businessDays: number[],
  excludedDates: string[],
): Date {
  const resultDate = new Date(startDate);
  const isAdding = businessDaysToAdd > 0;
  const daysToProcess = Math.abs(businessDaysToAdd);
  let processedDays = 0;

  while (processedDays < daysToProcess) {
    if (isAdding) {
      resultDate.setUTCDate(resultDate.getUTCDate() + 1);
    } else {
      resultDate.setUTCDate(resultDate.getUTCDate() - 1);
    }

    if (isBusinessDay(resultDate, businessDays, excludedDates)) {
      processedDays++;
    }
  }

  return resultDate;
}

/**
 * Checks if a given date is a business day.
 *
 * @param date - The date to check
 * @param businessDays - Array of business day numbers (0=Sunday, 1=Monday, etc.)
 * @param excludedDates - Set of excluded date strings in YYYY-MM-DD format
 * @returns True if the date is a business day and not excluded
 * @throws {InvalidDateError} If the date is invalid
 */
function isBusinessDay(date: Date, businessDays: number[], excludedDates: string[]): boolean {
  const dayOfWeek = date.getUTCDay();
  const [dateString] = date.toISOString().split('T');

  if (!dateString) {
    throw new InvalidDateError("Can't determine if date is business day: Invalid date");
  }

  return businessDays.includes(dayOfWeek) && !excludedDates.includes(dateString);
}
