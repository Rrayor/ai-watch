/**
 * Core date and time utility functions for AI Watch extension.
 */
import { InvalidWeekDayError } from '../error/InvalidWeekDayError';
import { InvalidDateError } from '../error/InvalidDateError';
import { InvalidTimezoneError } from '../error/InvalidTimezoneError';
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
 * Validate an IANA timezone string using Intl. Throws InvalidTimezoneError on failure.
 * @throws {InvalidTimezoneError} if the timezone is invalid
 */
function validateIanaTimezone(tz?: string): void {
  if (!tz) return;
  try {
    // Prefer modern API when available: Intl.supportedValuesOf('timeZone')
    // provides a canonical list of zones and is deterministic across
    // environments.
    // feature-detect supportedValuesOf in a safe, typed way
    const { supportedValuesOf } = Intl as unknown as {
      supportedValuesOf?: (k: string) => string[];
    };
    if (typeof supportedValuesOf === 'function') {
      const zones: string[] = supportedValuesOf.call(Intl, 'timeZone');
      // IANA identifiers are case sensitive, but we're developing for LLMs, so we ignore case when matching.
      if (!zones.some((z) => z.toLowerCase() === tz.toLowerCase())) {
        throw new InvalidTimezoneError(tz);
      }
    } else {
      // Fallback: use date-fns-tz to validate; zonedTimeToUtc may throw
      // or return an invalid date for unknown zones.
      const test = zonedTimeToUtc('1970-01-01T00:00:00', tz);
      if (isNaN(test.getTime())) {
        throw new InvalidTimezoneError(tz);
      }
    }
  } catch {
    throw new InvalidTimezoneError(tz);
  }
}

/**
 * Parses an ISO date string and returns a Date object.
 *
 * @param dateString - ISO date string to parse
 * @returns Parsed Date object
 * @throws {InvalidDateError} if the date format is invalid
 */
export function parseISOString(dateString: string, ianaTimezone?: string): Date {
  const input = appendOffsetIfNeeded(dateString, ianaTimezone);

  const date = new Date(input);
  if (isNaN(date.getTime())) {
    // Use the original input for the error message to avoid leaking our
    // constructed input which may include an added offset.
    throw new InvalidDateError(dateString);
  }

  // Validate that parsing didn't auto-correct the user's input in a way
  // that indicates an invalid/malformed ISO string. This validation is
  // intentionally conservative for naive inputs; see helpers.
  validateParsedDate(dateString, input, date, ianaTimezone);

  return date;
}

/**
 * If an IANA timezone is provided and the input lacks an explicit timezone,
 * validate the timezone and attempt to append a computed offset string.
 * Returns the possibly-modified input string.
 */
function appendOffsetIfNeeded(dateString: string, ianaTimezone?: string): string {
  if (!ianaTimezone) return dateString;
  if (/([zZ]|[+-]\d{2}:?\d{2})$/.test(dateString)) return dateString;
  validateIanaTimezone(ianaTimezone);
  const maybeOffset = buildOffsetForLocalTime(dateString, ianaTimezone);
  if (!maybeOffset) throw new InvalidTimezoneError(ianaTimezone);
  return `${dateString}${maybeOffset}`;
}

// ... canonicalization helper removed (unused)
const MAX_MONTH = 12;
const MAX_HOUR = 23;
const MAX_MIN_SEC = 59;
const MAX_OFFSET_HOUR = 14;

/**
 * Validates that the parsed Date corresponds to the provided input string.
 * @throws {InvalidDateError} when mismatches indicating autocorrection are found.
 */
function validateParsedDate(
  dateString: string,
  input: string,
  date: Date,
  ianaTimezone?: string,
): void {
  // Fast-path: accept bare calendar dates like "YYYY-MM-DD".
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return;

  const originalHadTz = /([zZ]|[+-]\d{2}:?\d{2})$/.test(dateString);
  const weAppendedOffset = Boolean(ianaTimezone && !originalHadTz);

  // If the caller included an explicit timezone/offset, validate the
  // ISO components structurally (month/day/hour ranges). This lets inputs
  // like "2025-08-27T12:00:00+02:00" pass while rejecting malformed values.
  if (originalHadTz) {
    if (!isWellFormedIsoWithOffset(dateString)) throw new InvalidDateError(dateString);
    return;
  }

  // If we appended an offset for an IANA timezone, accept the parsed date.
  // Otherwise (naive date-time without timezone) perform the strict
  // equality check to detect JS autocorrections.
  if (weAppendedOffset) return;

  // Strict check: normalize inputs like "...Z" to include milliseconds so
  // comparison against date.toISOString() is consistent.
  let normalizedInput = input;
  if (input.endsWith('Z') && !input.includes('.')) normalizedInput = input.replace('Z', '.000Z');
  if (date.toISOString() !== normalizedInput) throw new InvalidDateError(dateString);
}

/**
 * Validates that an ISO 8601 date-time string with timezone/offset is well-formed
 * and that components fall into expected ranges (month 1-12, day valid for
 * month, hour 0-23, minute/second 0-59). Returns true for well-formed inputs.
 */
function isWellFormedIsoWithOffset(s: string): boolean {
  const parsed = parseIsoWithOffset(s);
  if (!parsed) return false;

  const { year, month, day, hour, minute, second, tz } = parsed;

  if (!validateYMD(year, month, day)) return false;
  if (!validateHMS(hour, minute, second)) return false;
  if (!tz) return false;
  if (tz === 'Z') return true;
  return validateOffsetString(tz);
}

function parseIsoWithOffset(s: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  tz: string;
} | null {
  const re = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:?\d{2})$/;
  const m = s.match(re);
  if (!m) return null;
  const [, y, mo, da, hh, mi, ss, , tz] = m;
  return {
    year: Number(y),
    month: Number(mo),
    day: Number(da),
    hour: Number(hh),
    minute: Number(mi),
    second: Number(ss),
    tz: tz as string,
  };
}

function validateYMD(year: number, month: number, day: number): boolean {
  if (!(month >= 1 && month <= MAX_MONTH)) return false;
  const dt = new Date(year, month - 1, day);
  return dt.getFullYear() === year && dt.getMonth() === month - 1 && dt.getDate() === day;
}

function validateHMS(hour: number, minute: number, second: number): boolean {
  return (
    hour >= 0 &&
    hour <= MAX_HOUR &&
    minute >= 0 &&
    minute <= MAX_MIN_SEC &&
    second >= 0 &&
    second <= MAX_MIN_SEC
  );
}

function validateOffsetString(tz: string): boolean {
  const off = tz.replace(':', ''); // +0900
  const [sign] = off;
  if (sign !== '+' && sign !== '-') return false;
  const HOUR_SLICE_START = 1;
  const HOUR_SLICE_END = 3;
  const MIN_SLICE_START = 3;
  const oh = Number(off.slice(HOUR_SLICE_START, HOUR_SLICE_END));
  const om = Number(off.slice(MIN_SLICE_START));
  if (Number.isNaN(oh) || Number.isNaN(om)) return false;
  return oh >= 0 && oh <= MAX_OFFSET_HOUR && om >= 0 && om <= MAX_MIN_SEC;
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
