/**
 * Command implementation for business day operations.
 */

import { BusinessDayOptions, BusinessDayResult } from '../types';
import { parseISOString, addBusinessDays, subtractBusinessDays } from '../utils';

// Constants for business day calculations
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const STANDARD_BUSINESS_DAYS = [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY];
const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Command function for business day operations.
 *
 * @param options - Configuration with business day operation details
 * @returns Object with business day operation results
 */
export function businessDayCommand(options: BusinessDayOptions): BusinessDayResult {
  try {
    const date = parseISOString(options.date);

    switch (options.operation) {
      case 'isBusinessDay': {
        const isBusinessDay = date.getDay() >= MONDAY && date.getDay() <= FRIDAY;
        const weekday = WEEKDAY_NAMES[date.getDay()];
        if (!weekday) {
          return { error: 'Invalid date: unable to determine weekday' };
        }
        return {
          date: options.date,
          operation: 'isBusinessDay',
          isBusinessDay,
          weekday,
        };
      }

      case 'addBusinessDays': {
        if (!options.days) {
          return { error: 'Days parameter required for addBusinessDays operation' };
        }
        const result = addBusinessDays(date, options.days, STANDARD_BUSINESS_DAYS, new Set());
        return {
          date: options.date,
          operation: 'addBusinessDays',
          result: result.toISOString(),
          days: options.days,
          businessDays: 'Monday to Friday',
        };
      }

      case 'subtractBusinessDays': {
        if (!options.days) {
          return { error: 'Days parameter required for subtractBusinessDays operation' };
        }
        const result = subtractBusinessDays(date, options.days, STANDARD_BUSINESS_DAYS, new Set());
        return {
          date: options.date,
          operation: 'subtractBusinessDays',
          result: result.toISOString(),
          days: options.days,
          businessDays: 'Monday to Friday',
        };
      }

      default:
        return {
          error: 'Invalid operation. Use isBusinessDay, addBusinessDays, or subtractBusinessDays',
        };
    }
  } catch (_error) {
    return { error: String(_error) };
  }
}
