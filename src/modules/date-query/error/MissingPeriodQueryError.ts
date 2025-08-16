/**
 * Thrown when a period query is missing.
 */
export class MissingPeriodQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingPeriodQueryError';
  }
}
