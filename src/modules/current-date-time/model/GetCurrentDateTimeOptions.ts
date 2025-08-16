/**
 * Options for getting current date/time.
 */
export interface GetCurrentDateTimeOptions {
  /** IANA timezone identifier (e.g., 'America/New_York', 'Europe/Berlin') */
  timezone?: string;
  /** Date format pattern, defaults to 'YYYY-MM-DD HH:mm:ss' */
  format?: string;
}
