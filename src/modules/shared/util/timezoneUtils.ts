import { workspace } from 'vscode';
import { InvalidTimezoneError } from '../error/InvalidTimezoneError';
import { InvalidDateFormatError } from '../error/InvalidDateFormatError';
import { OperationContext } from '../model/OperationContext';

const YEAR_SLICE_LENGTH = -2;

type TokenMap = { [key: string]: string };

/**
 * Formats a date in UTC.
 * @param date The date to format.
 * @returns The formatted date string.
 */
export function formatUTC(date: Date): string {
  return `${date
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '')} UTC`;
}

/**
 * Formats a date in a specific timezone.
 * @param date The date to format.
 * @param timezone The timezone to use for formatting.
 * @param context The operation context.
 * @param customFormat An optional custom format string.
 * @returns The formatted date string.
 * @throws {InvalidTimezoneError} If the timezone is invalid
 */
export function formatInTimezone(
  date: Date,
  timezone: string | undefined,
  context: OperationContext,
  customFormat?: string,
): string {
  try {
    const tz = timezone ?? getUserTimezone(context);
    const defaultFormat = workspace
      .getConfiguration('aiWatch')
      .get<string | undefined>('defaultDateFormat');
    const effectiveFormat = customFormat ?? defaultFormat;

    if (effectiveFormat) return formatWithCustomFormat(date, tz, context, effectiveFormat);
    return formatStandard(date, context, tz);
  } catch {
    return handleTimezoneResolutionFailure(date, timezone, context);
  }
}

/**
 * Formats a date in a specific timezone.
 * @param date The date to format.
 * @param timezone The timezone to use for formatting.
 * @param context The operation context.
 * @param customFormat An optional custom format string.
 * @returns The formatted date string.
 */
function formatWithCustomFormat(
  date: Date,
  timezone: string | undefined,
  context: OperationContext,
  customFormat = '',
): string {
  if (timezone) {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const tokens = buildTokensFromParts(parts);
    validateFormatString(customFormat, Object.keys(tokens));
    return replaceTokens(customFormat, tokens);
  }

  context.addInfo('No timezone provided; formatting using local system time.');
  const tokens = buildTokensFromDate(date);
  validateFormatString(customFormat, Object.keys(tokens));
  return replaceTokens(customFormat, tokens);
}

/**
 * Formats a date in a specific timezone.
 * @param date The date to format.
 * @param context The operation context.
 * @param timezone The timezone to use for formatting.
 * @returns The formatted date string.
 */
export function formatStandard(date: Date, context: OperationContext, timezone?: string): string {
  const tz =
    timezone ??
    (() => {
      context.addInfo('No timezone was provided, attempting to detect user timezone.');
      return getUserTimezone(context);
    })();

  const formatted = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
  return formatted.replace(', ', ' ');
}

/**
 * Gets the user's local timezone.
 * @param context The operation context.
 * @returns The user's local timezone.
 */
export function getUserTimezone(context: OperationContext): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    context.addInfo("The user's local timezone could not be detected, using UTC by default.");
    return 'UTC';
  }
}

/**
 * Applies a custom date format to a date.
 * @param date The date to format.
 * @param format The custom format string.
 * @returns The formatted date string.
 */
export function applyCustomFormat(date: Date, format: string): string {
  const tokens = buildTokensFromDate(date);
  validateFormatString(format, Object.keys(tokens));
  return replaceTokens(format, tokens);
}

/**
 * Builds a map of date tokens from a Date object.
 * @param date The date to extract tokens from.
 * @returns A map of date tokens.
 */
function buildTokensFromDate(date: Date): TokenMap {
  const pad2 = (n: number): string => String(n).padStart(2, '0');
  const tokens: TokenMap = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(YEAR_SLICE_LENGTH),
    MM: pad2(date.getMonth() + 1),
    M: String(date.getMonth() + 1),
    DD: pad2(date.getDate()),
    D: String(date.getDate()),
    HH: pad2(date.getHours()),
    H: String(date.getHours()),
    mm: pad2(date.getMinutes()),
    m: String(date.getMinutes()),
    ss: pad2(date.getSeconds()),
    s: String(date.getSeconds()),
  };

  // convenient lowercase aliases
  tokens['yyyy'] = tokens['YYYY'] ?? '';
  tokens['yy'] = tokens['YY'] ?? '';
  tokens['dd'] = tokens['DD'] ?? '';
  tokens['d'] = tokens['D'] ?? '';
  tokens['hh'] = tokens['HH'] ?? '';

  return tokens;
}

/**
 * Builds a map of date tokens from Intl.DateTimeFormatPart objects.
 * @param parts The array of date format parts.
 * @returns A map of date tokens.
 */
function buildTokensFromParts(parts: Intl.DateTimeFormatPart[]): TokenMap {
  const map: TokenMap = {};
  parts.forEach((p) => (map[p.type] = p.value));

  const year = (map['year'] as string) ?? '';
  const month = (map['month'] as string) ?? '';
  const day = (map['day'] as string) ?? '';
  const hour = (map['hour'] as string) ?? '';
  const minute = (map['minute'] as string) ?? '';
  const second = (map['second'] as string) ?? '';

  const toNumStr = (v: string): string => (v ? String(Number(v)) : '');

  const tokens: TokenMap = {
    YYYY: year,
    YY: year.slice(YEAR_SLICE_LENGTH),
    MM: month,
    M: toNumStr(month),
    DD: day,
    D: toNumStr(day),
    HH: hour,
    H: toNumStr(hour),
    mm: minute,
    m: toNumStr(minute),
    ss: second,
    s: toNumStr(second),
    yyyy: year,
    yy: year.slice(YEAR_SLICE_LENGTH),
    dd: day,
    d: toNumStr(day),
    hh: hour,
  };

  return tokens;
}

/**
 * Validates a date format string against a list of allowed tokens.
 * @param format The format string to validate.
 * @param allowedTokens The list of allowed token names.
 * @throws {InvalidDateFormatError} If the format string contains unknown tokens
 */
function validateFormatString(format: string, allowedTokens: string[]): void {
  const tokenCandidates = Array.from(format.matchAll(/[A-Za-z]+/g)).map((m) => m[0]);
  const unknown = tokenCandidates.filter((t) => !allowedTokens.includes(t));
  if (unknown.length > 0) throw new InvalidDateFormatError(format, allowedTokens);
}

/**
 * Replaces tokens in a format string with their corresponding values from a token map.
 * @param format The format string with tokens to replace.
 * @param tokens The map of tokens and their values.
 * @returns The format string with tokens replaced by their values.
 */
function replaceTokens(format: string, tokens: TokenMap): string {
  const keys = Object.keys(tokens).sort((a, b) => b.length - a.length);
  if (keys.length === 0) return format;
  const esc = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${esc.join('|')})`, 'g');
  return format.replace(re, (m) => tokens[m] ?? m);
}

/**
 * Handles failures when resolving a timezone inside `formatInTimezone`.
 * If an explicit timezone was provided, throws InvalidTimezoneError.
 * Otherwise, attempts to use configured default format or falls back to an ISO-like UTC string.
 * @param date The date to format.
 * @param timezone The timezone to use for formatting.
 * @param context The operation context.
 * @returns The formatted date string.
 * @throws {InvalidTimezoneError} if an explicit timezone is provided but cannot be resolved.
 */
function handleTimezoneResolutionFailure(
  date: Date,
  timezone: string | undefined,
  context: OperationContext,
): string {
  if (timezone) throw new InvalidTimezoneError(timezone);

  const defaultDateFormatConfiguration = workspace
    .getConfiguration('aiWatch')
    .get<string>('defaultDateFormat');
  if (defaultDateFormatConfiguration) {
    context.addInfo(`Using default date format from settings: ${defaultDateFormatConfiguration}`);
    return formatWithCustomFormat(date, undefined, context, defaultDateFormatConfiguration);
  }

  context.addInfo(
    'Timezone resolution failed and no default date format is set; falling back to ISO-like UTC.',
  );
  return formatUTC(date);
}
