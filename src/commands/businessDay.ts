/**
 * Command implementation for business day operations.
 */

import { BusinessDayOptions } from '../types';
import { parseISOString, addBusinessDays } from '../utils';

/**
 * Command function for business day operations.
 *
 * @param options - Configuration with business day operation details
 * @returns Object with business day operation results
 */
export function businessDayCommand(options: BusinessDayOptions) {
  try {
    const date = parseISOString(options.date);

    switch (options.operation) {
      case 'isBusinessDay': {
        const isBusinessDay = date.getDay() >= 1 && date.getDay() <= 5;
        return {
          date: options.date,
          isBusinessDay,
          weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
            date.getDay()
          ],
        };
      }

      case 'addBusinessDays': {
        if (!options.days) {
          return { error: 'Days parameter required for addBusinessDays operation' };
        }
        const result = addBusinessDays(date, options.days, [1, 2, 3, 4, 5], new Set());
        return {
          date: options.date,
          operation: options.operation,
          days: options.days,
          result: result.toISOString(),
        };
      }

      case 'subtractBusinessDays': {
        if (!options.days) {
          return { error: 'Days parameter required for subtractBusinessDays operation' };
        }
        const result = addBusinessDays(date, -options.days, [1, 2, 3, 4, 5], new Set());
        return {
          date: options.date,
          operation: options.operation,
          days: options.days,
          result: result.toISOString(),
        };
      }

      default:
        return {
          error: 'Invalid operation. Use isBusinessDay, addBusinessDays, or subtractBusinessDays',
        };
    }
  } catch (error) {
    return { error: String(error) };
  }
}
