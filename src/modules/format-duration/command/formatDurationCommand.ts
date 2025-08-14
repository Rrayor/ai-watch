/**
 * Command implementation for formatting duration values.
 */

import { InvalidDateError } from '../../shared';
import { intervalToDuration, formatDuration as formatDurationFns } from 'date-fns';
import { FormatDurationOptions, VerbosityLevel } from '../model/FormatDurationOptions';
import { FormatDurationResult } from '../model/FormatDurationResult';
import { workspace } from 'vscode';

type DurationUnits = 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds';

// Constants
const DEFAULT_MAX_UNITS = 3;
const ORDERED_UNITS: Array<DurationUnits> = [
  'years',
  'months',
  'days',
  'hours',
  'minutes',
  'seconds',
];

/**
 * Command function for formatting duration values.
 *
 * @param options - Configuration with duration parameters
 * @returns Object with formatted duration string
 * @throws {InvalidDateError} If date format is invalid
 */
export function formatDurationCommand(options: FormatDurationOptions): FormatDurationResult {
  const fromDate = new Date(options.from);
  const toDate = new Date(options.to);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw new InvalidDateError(
      'Invalid date format. Please use ISO 8601 format (e.g., 2025-08-01T00:00:00Z)',
    );
  }

  const aiWatchConfig = workspace.getConfiguration('aiWatch');
  const durationFormatConfiguration = aiWatchConfig.get<VerbosityLevel | undefined>(
    'durationFormat',
  );

  if (!options.verbosity && durationFormatConfiguration) {
    options.verbosity = durationFormatConfiguration;
  }

  const maxUnitsConfiguration = aiWatchConfig.get<number | undefined>('maxDurationUnits');

  if (!options.maxUnits && maxUnitsConfiguration) {
    options.maxUnits = maxUnitsConfiguration;
  }

  const formatted = formatDurationFromInterval(
    fromDate,
    toDate,
    options.verbosity ?? 'standard',
    options.maxUnits ?? DEFAULT_MAX_UNITS,
  );

  return { formatted };
}

/**
 * Formats a duration between two dates using date-fns for calendar-accurate components.
 * Preserves the sign for non-zero durations. Zero durations never show a minus sign.
 *
 * @param start - The earlier or nominal start date
 * @param end - The later or nominal end date
 * @param verbosity - Output verbosity: 'compact' | 'standard' | 'verbose'
 * @param maxUnits - Maximum number of units to include in the output
 * @returns A human-readable duration string
 */
function formatDurationFromInterval(
  start: Date,
  end: Date,
  verbosity: VerbosityLevel = 'standard',
  maxUnits = DEFAULT_MAX_UNITS,
): string {
  const { earlier, later, isNegative } = boundsAndSign(start, end);
  const fullDuration = intervalToDuration({ start: earlier, end: later });
  const isZero = ORDERED_UNITS.every((u) => (fullDuration[u] ?? 0) === 0);
  const selectedUnits = selectTopUnits(fullDuration, maxUnits);
  let rendered = renderDuration(fullDuration, selectedUnits, verbosity, isZero);
  if (!rendered) rendered = verbosity === 'compact' ? '0s' : '0 seconds';
  return isZero ? rendered : isNegative ? `-${rendered}` : rendered;
}

function boundsAndSign(
  start: Date,
  end: Date,
): { earlier: Date; later: Date; isNegative: boolean } {
  const isNegative = end.getTime() < start.getTime();
  return { earlier: isNegative ? end : start, later: isNegative ? start : end, isNegative };
}

/**
 * Selects up to `maxUnits` non-zero duration units in fixed priority order.
 * Falls back to ['seconds'] when all units are zero.
 *
 * @param duration - A date-fns duration object
 * @param maxUnits - Maximum number of units to return
 * @returns An ordered array of unit names to render
 */
function selectTopUnits(
  duration: Partial<Record<DurationUnits, number>>,
  maxUnits: number,
): Array<DurationUnits> {
  const nonZeroUnits = ORDERED_UNITS.filter((u) => (duration[u] ?? 0) > 0);
  return (
    nonZeroUnits.length > 0 ? nonZeroUnits.slice(0, Math.max(0, maxUnits)) : ['seconds']
  ) as Array<DurationUnits>;
}

function renderDuration(
  duration: Partial<Record<DurationUnits, number>>,
  selectedUnits: Array<DurationUnits>,
  verbosity: VerbosityLevel,
  isZero: boolean,
): string {
  if (verbosity === 'compact') {
    return formatCompactFromDuration(duration, selectedUnits);
  }
  const base = formatDurationFns(duration, {
    format: selectedUnits,
    delimiter: ', ',
    zero: isZero,
  });
  return verbosity === 'verbose' ? withAndDelimiter(base) : base;
}

/**
 * Inserts the word "and" before the last item of a comma-separated list.
 * Example: "1 hour, 2 minutes, 3 seconds" -> "1 hour, 2 minutes and 3 seconds".
 *
 * @param input - A comma-separated list string
 * @returns The input string with the final comma replaced by " and "
 */
function withAndDelimiter(input: string): string {
  const idx = input.lastIndexOf(', ');
  if (idx === -1) return input;
  return `${input.slice(0, idx)} and ${input.slice(idx + 2)}`;
}

/**
 * Renders a compact duration string using short unit labels (y, mo, d, h, m, s).
 * Only non-zero selected units are included, joined by spaces.
 *
 * @param duration - A date-fns duration object
 * @param order - Units to include in order, typically a subset of ORDERED_UNITS
 * @returns A compact duration string (e.g., "2d 4h 3m") or "0s" when empty
 */
function formatCompactFromDuration(
  duration: Partial<Record<DurationUnits, number>>,
  order: Array<DurationUnits>,
): string {
  const abbr: Record<DurationUnits, string> = {
    years: 'y',
    months: 'mo',
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
  };
  const parts: string[] = [];
  for (const u of order) {
    const v = duration[u] ?? 0;
    if (v > 0) parts.push(`${v}${abbr[u]}`);
  }
  return parts.length ? parts.join(' ') : '0s';
}
