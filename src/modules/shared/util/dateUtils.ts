/**
 * Core date and time utility functions for AI Watch extension.
 */
import { InvalidWeekDayError } from '../error/InvalidWeekDayError';
import { InvalidDateError } from '../error/InvalidDateError';
import { SubtractTimeOptions } from '../../subtract-time/model/SubtractTimeOptions';
import { AddTimeOptions } from '../../add-time/model/AddTimeOptions';

const DAYS_IN_WEEK = 7;

const DAY_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

/**
 * Parses an ISO date string and returns a Date object.
 *
 * @param dateString - ISO date string to parse
 * @returns Parsed Date object
 * @throws {InvalidDateError} if the date format is invalid
 */
export function parseISOString(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new InvalidDateError(dateString);
  }

  // Check if the parsed date matches the input (detect auto-correction)
  // This catches cases like Feb 29 in non-leap years where JS auto-corrects to March 1
  // Handle the .000Z vs Z formatting difference that JavaScript introduces
  const normalizedInput =
    dateString.endsWith('Z') && !dateString.includes('.')
      ? dateString.replace('Z', '.000Z')
      : dateString;

  if (date.toISOString() !== normalizedInput) {
    throw new InvalidDateError(dateString);
  }

  return date;
}

/**
 * Converts a weekday string to its corresponding numeric value, with optional custom week start.
 *
 * @param weekday - String representation of weekday in various formats
 * @param weekStart - Optional week start (string or number). Defaults to 'Sunday'.
 * @returns Numeric day of week (0=first day of week, 1=second, ...)
 * @throws {InvalidWeekDayError} if weekday is invalid
 */
export function weekdayToNumber(
  weekday: string,
  weekStart: string | number | undefined = 'Sunday',
): number {
  const normalized = weekday.toLowerCase().trim();
  let dayNumber = DAY_MAP[normalized];
  if (dayNumber === undefined) {
    throw new InvalidWeekDayError(`Invalid weekday: ${weekday}`);
  }
  // Shift so that weekStart is 0
  let startIndex: number;
  if (typeof weekStart === 'number') {
    startIndex = weekStart;
  } else {
    const normalizedStart = weekStart.toLowerCase().trim();
    const mapped = DAY_MAP[normalizedStart];
    if (mapped === undefined) {
      throw new InvalidWeekDayError(`Invalid weekStart: ${weekStart}`);
    }
    startIndex = mapped;
  }
  dayNumber = (dayNumber - startIndex + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  return dayNumber;
}

/**
 * Builds duration description from parameters
 * @param params - Parameters containing time durations to subtract
 * @returns Array of formatted duration parts (e.g., ["2 years", "3 months"])
 */
export function buildDurationParts(params: AddTimeOptions | SubtractTimeOptions): string[] {
  const parts: string[] = [];
  const timeUnits = [
    { value: params.years, unit: 'year' },
    { value: params.months, unit: 'month' },
    { value: params.weeks, unit: 'week' },
    { value: params.days, unit: 'day' },
    { value: params.hours, unit: 'hour' },
    { value: params.minutes, unit: 'minute' },
    { value: params.seconds, unit: 'second' },
  ];

  timeUnits.forEach(({ value, unit }) => {
    if (value) {
      parts.push(`${value} ${unit}${value !== 1 ? 's' : ''}`);
    }
  });

  return parts;
}
