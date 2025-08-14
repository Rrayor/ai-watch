export class InvalidDateError extends Error {
  constructor(date: string) {
    super(`Invalid date: ${date}`);
    this.name = 'InvalidDateError';
  }
}
