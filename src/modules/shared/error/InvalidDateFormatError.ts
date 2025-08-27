/**
 * Thrown when a date format string contains invalid or unsupported tokens.
 */
export class InvalidDateFormatError extends Error {
  constructor(format: string, allowedTokens: string[]) {
    super(
      `Invalid date format: '${format}'. Allowed tokens: ${allowedTokens.join(', ')}. ` +
        `Use tokens like YYYY, MM, DD, HH, mm, ss (case-insensitive aliases are accepted).`,
    );
    this.name = 'InvalidDateFormatError';
  }
}
