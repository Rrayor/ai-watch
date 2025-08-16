/**
 * Thrown when a weekday query is invalid.
 */
export class InvalidWeekDayQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidWeekDayQueryError';
  }
}
