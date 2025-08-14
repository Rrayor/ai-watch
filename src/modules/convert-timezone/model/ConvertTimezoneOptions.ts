/**
 * Language Model Tool parameters for timezone conversion.
 */
export interface ConvertTimezoneOptions {
  /** Date/time in ISO 8601 format to convert */
  date: string;
  /** Source timezone (defaults to UTC if not specified) */
  fromTimezone?: string;
  /** Target IANA timezone identifier */
  toTimezone: string;
}
