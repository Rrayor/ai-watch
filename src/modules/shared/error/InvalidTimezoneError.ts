export class InvalidTimezoneError extends Error {
  constructor(timezone: string) {
    super(`Invalid timezone: ${timezone}`);
    this.name = 'InvalidTimezoneError';
  }
}
