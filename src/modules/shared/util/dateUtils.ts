/**
 * Core date and time utility functions for AI Watch extension.
 */
import { InvalidWeekDayError } from '../error/InvalidWeekDayError';
import { InvalidDateError } from '../error/InvalidDateError';
import { InvalidTimezoneError } from '../error/InvalidTimezoneError';
import { UnsupportedRuntimeError } from '../error/UnsupportedRuntimeError';
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
 * Module-level cache of supported IANA timezones (lowercase -> canonical).
 *
 * Initialized at import-time using `Intl.supportedValuesOf('timeZone')`.
 * Left `null` when the runtime lacks the API or if retrieval fails so callers
 * (e.g. `validateIanaTimezone`) can fail fast with a clear message.
 *
 * @internal
 * @readonly
 */
const SUPPORTED_TIMEZONES: { zones: string[]; lowerToCanonical: Map<string, string> } = (() => {
  const intlAny = Intl as unknown as {
    supportedValuesOf?: (k: string) => string[];
  };
  const supportedFn = intlAny.supportedValuesOf;
  if (typeof supportedFn !== 'function') {
    throw new UnsupportedRuntimeError(
      'Intl.supportedValuesOf("timeZone") is required by this extension. Please use a modern VS Code runtime.',
    );
  }

  try {
    const zones: string[] = supportedFn.call(Intl, 'timeZone');
    const lowerToCanonical = new Map<string, string>(zones.map((z) => [z.toLowerCase(), z]));
    return { zones, lowerToCanonical };
  } catch (err) {
    throw new UnsupportedRuntimeError(
      `Failed to initialize timezone cache from Intl.supportedValuesOf("timeZone"): ${String(err)}`,
    );
  }
})();

/**
 * Parses an ISO date string and returns a Date object.
 *
 * If the input string is "naive" (lacks an explicit offset or 'Z'), and an IANA timezone is provided,
 * the function interprets the input as wall-clock time in that timezone and applies the correct offset.
 * If no timezone is provided for a naive input, UTC is assumed.
 *
 * @param dateString - ISO date string to parse (may be naive or include offset)
 * @param ianaTimezone - Optional IANA timezone name. If provided and dateString is naive, interprets as local time in this timezone.
 * @returns Parsed Date object
 * @throws {InvalidDateError} if the date format is invalid
 * @throws {InvalidTimezoneError} if the timezone is invalid
 */
export function parseISOString(dateString: string, ianaTimezone?: string): Date {
  const input = appendOffsetIfNeeded(dateString, ianaTimezone);

  const date = new Date(input);
  if (isNaN(date.getTime())) {
    throw new InvalidDateError(dateString);
  }

  validateParsedDate(dateString, input, date, ianaTimezone);

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

/**
 * Validate an IANA timezone string.
 *
 * This uses the module-level cache populated from
 * `Intl.supportedValuesOf('timeZone')`. Matching is tolerant for LLM-style
 * inputs: the input is compared case-insensitively against the canonical
 * zone list and mapped to the canonical name. If the runtime does not
 * provide `Intl.supportedValuesOf`, this function throws a clear Error
 * indicating the runtime requirement (no silent fallback). For invalid
 * timezone strings an `InvalidTimezoneError` is thrown.
 *
 * @param tz - Optional IANA timezone string to validate
 * @throws {InvalidTimezoneError} if the timezone is invalid
 */
function validateIanaTimezone(tz?: string): void {
  if (!tz) return;
  const canonical = SUPPORTED_TIMEZONES.lowerToCanonical.get(tz.toLowerCase());
  if (!canonical) throw new InvalidTimezoneError(tz);
}

/**
 * If an IANA timezone is provided and the input lacks an explicit timezone,
 * validate the timezone and attempt to append a computed offset string.
 * @param dateString - Input ISO date string (may be naive or include offset)
 * @param ianaTimezone - IANA timezone name (e.g. "America/New_York")
 * @returns the possibly-modified input string.
 * @throws {InvalidTimezoneError} if the timezone is invalid or offset computation fails
 */
function appendOffsetIfNeeded(dateString: string, ianaTimezone?: string): string {
  if (!ianaTimezone) return dateString;
  if (/([zZ]|[+-]\d{2}:?\d{2})$/.test(dateString)) return dateString;
  validateIanaTimezone(ianaTimezone);
  const maybeOffset = buildOffsetForLocalTime(dateString, ianaTimezone);
  if (!maybeOffset) throw new InvalidTimezoneError(ianaTimezone);
  return `${dateString}${maybeOffset}`;
}

const MAX_MONTH = 12;
const MAX_HOUR = 23;
const MAX_MIN_SEC = 59;
const MAX_OFFSET_HOUR = 14;

/**
 * Validates that the parsed Date corresponds to the provided input string: because
 * JavaScript's Date parser normalizes out-of-range components (e.g. "2025-02-30"
 * → 2025-03-02) this function detects such silent auto-corrections and throws
 * {@link InvalidDateError} instead of returning a corrected instant; inputs with
 * explicit offsets are structurally validated and accepted if well-formed, an
 * IANA timezone + naive input (where we append a computed offset) is accepted
 * because it represents a wall-clock in that zone, and naive inputs without a
 * timezone are strictly compared against `date.toISOString()` and rejected on
 * mismatch.
 *
 * @param dateString - Original input date string (may be naive or include offset)
 * @param input - The possibly-modified input string (with offset if applicable)
 * @param date - The parsed Date object
 * @param ianaTimezone - The IANA timezone name (if provided)
 * @throws {InvalidDateError} when mismatches indicating autocorrection are found.
 */
function validateParsedDate(
  dateString: string,
  input: string,
  date: Date,
  ianaTimezone?: string,
): void {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return;

  const originalHadTz = /([zZ]|[+-]\d{2}:?\d{2})$/.test(dateString);
  const weAppendedOffset = Boolean(ianaTimezone && !originalHadTz);

  if (originalHadTz) {
    if (!isWellFormedIsoWithOffset(dateString)) throw new InvalidDateError(dateString);
    return;
  }

  if (weAppendedOffset) return;

  let normalizedInput = input;
  if (input.endsWith('Z') && !input.includes('.')) normalizedInput = input.replace('Z', '.000Z');
  if (date.toISOString() !== normalizedInput) throw new InvalidDateError(dateString);
}

/**
 * Validates that an ISO 8601 date-time string with timezone/offset is well-formed
 * and that components fall into expected ranges (month 1-12, day valid for
 * month, hour 0-23, minute/second 0-59). Returns true for well-formed inputs.
 * @param isoString - ISO 8601 date-time string with timezone/offset (e.g. "2025-08-10T12:30:45+02:00")
 * @returns true if well-formed, false otherwise
 */
function isWellFormedIsoWithOffset(isoString: string): boolean {
  const parsed = parseIsoWithOffset(isoString);
  if (!parsed) return false;

  const { year, month, day, hour, minute, second, tz } = parsed;

  if (!validateYMD(year, month, day)) return false;
  if (!validateHMS(hour, minute, second)) return false;
  if (!tz) return false;
  if (tz === 'Z') return true;
  return validateOffsetString(tz);
}

/**
 * Parses an ISO 8601 date-time string with timezone/offset.
 * @param isoString - ISO 8601 date-time string (e.g. "2025-08-10T12:30:45+02:00")
 * @returns Parsed date components or null if invalid
 */
function parseIsoWithOffset(isoString: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  tz: string;
} | null {
  const re = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:?\d{2})$/;
  const m = isoString.match(re);
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

/**
 * Validates the year, month, and day components of a date.
 * @param year - The year component (e.g. 2025)
 * @param month - The month component (1-12)
 * @param day - The day component (1-31)
 * @returns True if the date is valid, false otherwise
 */
function validateYMD(year: number, month: number, day: number): boolean {
  if (!(month >= 1 && month <= MAX_MONTH)) return false;
  const dt = new Date(year, month - 1, day);
  return dt.getFullYear() === year && dt.getMonth() === month - 1 && dt.getDate() === day;
}

/**
 * Validates the hour, minute, and second components of a time.
 * @param hour - The hour component (0-23)
 * @param minute - The minute component (0-59)
 * @param second - The second component (0-59)
 * @returns True if the time is valid, false otherwise
 */
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

/**
 * Validates the timezone offset string.
 * @param tz - Timezone offset string (e.g. "+02:00")
 * @returns True if the offset string is valid, false otherwise
 */
function validateOffsetString(tz: string): boolean {
  // Accept +HH:MM, -HH:MM, +HHMM or -HHMM
  const m = tz.match(/^([+-])(\d{2}):?(\d{2})$/);
  if (!m) return false;
  const hh = Number(m[2]);
  const mm = Number(m[3]);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return false;
  return hh >= 0 && hh <= MAX_OFFSET_HOUR && mm >= 0 && mm <= MAX_MIN_SEC;
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
