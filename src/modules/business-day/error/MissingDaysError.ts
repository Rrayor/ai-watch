import { BusinessDayOperation } from '../model/BusinessDayOptions';

export class MissingDaysError extends Error {
  constructor(operation: BusinessDayOperation) {
    super(`Missing number of days for business day operation: ${operation}`);
    this.name = 'MissingDaysError';
  }
}
