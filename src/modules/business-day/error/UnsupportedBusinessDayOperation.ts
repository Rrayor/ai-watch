export class UnsupportedBusinessDayOperation extends Error {
  constructor(operation: string) {
    super(`Invalid business day operation: ${operation}`);
    this.name = 'InvalidBusinessDayOperation';
  }
}
