export class MissingPeriodQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingPeriodQueryError';
  }
}
