/**
 * Command implementation for calculating differences between dates.
 */

import { parseISOString } from '../../shared';
import { CalculateDifferenceOptions } from '../model/CalculateDifferenceOptions';
import { CalculateDifferenceResult } from '../model/CalculateDifferenceResult';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

/**
 * Command function for calculating differences between dates.
 *
 * @param options - Configuration with from/to dates and unit
 * @returns Object with calculated date difference
 * @throws {InvalidDateError} If the date format is invalid
 */
export function calculateDifferenceCommand(
  options: CalculateDifferenceOptions,
): CalculateDifferenceResult {
  const fromDate = parseISOString(options.from);
  const toDate = parseISOString(options.to);

  return calculateDateDifference(fromDate, toDate);
}

/**
 * Calculates the difference between two dates in various units.
 *
 * @param from - Start date
 * @param to - End date
 * @returns Object containing the difference in days, hours, minutes, and seconds
 */
function calculateDateDifference(from: Date, to: Date): CalculateDifferenceResult {
  return {
    days: differenceInDays(to, from),
    hours: differenceInHours(to, from),
    minutes: differenceInMinutes(to, from),
    seconds: differenceInSeconds(to, from),
  };
}
