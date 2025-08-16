/**
 * Thrown when a date query is invalid.
 */
export class InvalidQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidQueryError';
  }
}
