/**
 * Thrown when a date string is ambiguous (no offset) and no source timezone is provided.
 */
export class AmbiguousDateError extends Error {
  constructor(date: string) {
    super(
      `Ambiguous date: '${date}' has no timezone offset. Provide 'fromTimezone' (IANA) or an ISO with offset (e.g., '${date}-04:00').`,
    );
    this.name = 'AmbiguousDateError';
  }
}
