/**
 * Thrown when a period query is invalid.
 */
export class InvalidPeriodQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPeriodQueryError';
  }
}
