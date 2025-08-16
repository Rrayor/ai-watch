import { BusinessDayOperation } from '../model/BusinessDayOptions';

/**
 * Thrown when the number of days is missing for a business day operation.
 */
export class MissingDaysError extends Error {
  constructor(operation: BusinessDayOperation) {
    super(`Missing number of days for business day operation: ${operation}`);
    this.name = 'MissingDaysError';
  }
}
