/**
 * Core date and time utility functions for AI Watch extension.
 */
import { InvalidWeekDayError } from '../error/InvalidWeekDayError';
import { InvalidDateError } from '../error/InvalidDateError';
import { SubtractTimeOptions } from '../../subtract-time/model/SubtractTimeOptions';
import { AddTimeOptions } from '../../add-time/model/AddTimeOptions';
import { zonedTimeToUtc } from 'date-fns-tz';

const DAYS_IN_WEEK = 7;
const MS_PER_MIN = 60_000;

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
export function parseISOString(dateString: string, ianaTimezone?: string): Date {
  // If an IANA timezone is provided and the input lacks an explicit timezone
  // (no trailing 'Z' or offset), try to interpret the string in that timezone
  let input = dateString;
  if (ianaTimezone && !/([zZ]|[+-]\d{2}:?\d{2})$/.test(dateString)) {
    // Build an offset for the provided timezone at the given local wall time.
    // We create a Date from the components in UTC by asking Intl for the
    // timezone offset at the same wall-clock instant in the target timezone.
    const maybeOffset = buildOffsetForLocalTime(dateString, ianaTimezone);
    if (maybeOffset) {
      input = `${dateString}${maybeOffset}`;
    }
  }

  const date = new Date(input);
  if (isNaN(date.getTime())) {
    // Use the original input for the error message to avoid leaking our
    // constructed input which may include an added offset.
    throw new InvalidDateError(dateString);
  }

  // Check if the parsed date matches the input (detect auto-correction) only
  // when the original input included explicit timezone information or when
  // we did not append an offset. If we appended an offset for a naive input
  // (to interpret it in an IANA zone), comparing the produced UTC ISO to the
  // constructed input will always differ and produce false positives.
  const originalHadTz = /([zZ]|[+-]\d{2}:?\d{2})$/.test(dateString);
  const weAppendedOffset = Boolean(ianaTimezone && !originalHadTz);

  // Only perform strict ISO equality check when the original input had explicit
  // timezone info or when we did not append an offset ourselves.
  if (!weAppendedOffset) {
    // Handle the .000Z vs Z formatting difference that JavaScript introduces
    let normalizedInput = input;
    if (input.endsWith('Z') && !input.includes('.')) {
      normalizedInput = input.replace('Z', '.000Z');
    }

    if (date.toISOString() !== normalizedInput) {
      throw new InvalidDateError(dateString);
    }
  }

  return date;
}

/**
 * Build an ISO offset string (e.g. +02:00) for the provided local wall time in the
 * given IANA timezone. Returns the offset string or undefined on failure.
 * @param localIsoWithoutTz - Local ISO-like date string without timezone (e.g. "2025-08-10T12:30:45")
 * @param timezone - IANA timezone string (e.g. "America/New_York")
 */
function buildOffsetForLocalTime(localIsoWithoutTz: string, timezone: string): string | undefined {
  try {
    // Normalize to canonical YYYY-MM-DDTHH:mm:ss
    const canonical = localIsoWithoutTz.includes('T')
      ? localIsoWithoutTz
      : localIsoWithoutTz.replace(' ', 'T');

    // Interpret the canonical wall-clock as if it were UTC by appending 'Z'.
    // This gives the epoch ms for the same wall-clock when read as UTC.
    const wallAsUtc = new Date(`${canonical}Z`);
    if (isNaN(wallAsUtc.getTime())) return undefined;
    const wallAsUTCms = wallAsUtc.getTime();

    // Use date-fns-tz to convert the wall-clock in the target timezone to the
    // corresponding UTC instant. zonedTimeToUtc handles DST and historical rules.
    const zonedUtc = zonedTimeToUtc(canonical, timezone);
    if (isNaN(zonedUtc.getTime())) return undefined;

    const offsetMinutes = Math.round((zonedUtc.getTime() - wallAsUTCms) / MS_PER_MIN);

    // Convert minutes to ±HH:MM
    const sign = offsetMinutes <= 0 ? '+' : '-';
    const absMinutes = Math.abs(offsetMinutes);
    const hhOff = String(Math.floor(absMinutes / 60)).padStart(2, '0');
    const mmOff = String(absMinutes % 60).padStart(2, '0');
    return `${sign}${hhOff}:${mmOff}`;
  } catch {
    return undefined;
  }
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
