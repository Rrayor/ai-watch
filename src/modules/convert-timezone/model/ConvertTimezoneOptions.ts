/**
 * Language Model Tool parameters for timezone conversion.
 */
export interface ConvertTimezoneOptions {
  /** Date/time in ISO 8601 format to convert */
  date: string;
  /** Source timezone (defaults to UTC if not specified) */
  fromTimezone?: string;
  /**
   * When true, force interpretation of `date` as a naive wall-clock in `fromTimezone` even if an offset is present.
   * Useful for deterministic testing. Default: false
   */
  interpretAsLocal?: boolean;
  /** Target IANA timezone identifier */
  toTimezone: string;
}
