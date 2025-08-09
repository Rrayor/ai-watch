/**
 * Command implementation for calculating differences between dates.
 */

import { CalculateDifferenceOptions } from '../types';
import { parseISOString, calculateDateDifference } from '../utils';

/**
 * Command function for calculating differences between dates.
 *
 * @param options - Configuration with from/to dates and unit
 * @returns Object with calculated date difference
 */
export function calculateDifferenceCommand(options: CalculateDifferenceOptions) {
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
