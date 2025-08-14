export class InvalidWeekDayError extends Error {
  constructor(weekday: string | undefined) {
    super(`Invalid weekday: ${weekday}`);
    this.name = 'InvalidWeekDayError';
  }
}
