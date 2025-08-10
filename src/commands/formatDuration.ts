/**
 * Command implementation for formatting duration values.
 */

import { FormatDurationOptions, FormatDurationResult } from '../types';
import { formatDuration } from '../utils';

/**
 * Command function for formatting duration values.
 *
 * @param options - Configuration with duration parameters
 * @returns Object with formatted duration string
 */
export function formatDurationCommand(options: FormatDurationOptions): FormatDurationResult {
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
      options.verbosity ?? 'standard',
      options.maxUnits ?? 3,
    );

    return { formatted };
  } catch (_error) {
    return { error: String(_error) };
  }
}
