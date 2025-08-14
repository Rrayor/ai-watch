export class InvalidWeekDayQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidWeekDayQueryError';
  }
}
