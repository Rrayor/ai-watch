/**
 * Core date and time utility functions for AI Watch extension.
 */
import { InvalidWeekDayError } from '../error/InvalidWeekDayError';
import { InvalidDateError } from '../error/InvalidDateError';
import { InvalidTimezoneError } from '../error/InvalidTimezoneError';
import { UnsupportedRuntimeError } from '../error/UnsupportedRuntimeError';
import { SubtractTimeOptions } from '../../subtract-time/model/SubtractTimeOptions';
import { AddTimeOptions } from '../../add-time/model/AddTimeOptions';
import { parseISO, isValid as isValidDate } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

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
  // Preserve fast-path for YYYY-MM-DD bare dates
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const d = parseISO(dateString);
    if (!isValidDate(d)) throw new InvalidDateError(dateString);
    return d;
  }

  const originalHadTz = /([zZ]|[+-]\d{2}:?\d{2})$/.test(dateString);

  // If the string is naive (no explicit offset) but an IANA timezone was provided,
  // interpret the input as a wall-clock in that timezone and convert to the corresponding UTC instant.
  if (!originalHadTz && ianaTimezone) {
    validateIanaTimezone(ianaTimezone);
    const canonical = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
    const dt = zonedTimeToUtc(canonical, ianaTimezone);
    if (!isValidDate(dt)) throw new InvalidDateError(dateString);
    return dt;
  }

  // Otherwise parse directly (handles explicit offsets and Z). Rely on parseISO for correctness.
  const parsed = parseISO(dateString);
  if (!isValidDate(parsed)) throw new InvalidDateError(dateString);
  return parsed;
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
