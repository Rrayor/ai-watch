export class InvalidPeriodQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPeriodQueryError';
  }
}
