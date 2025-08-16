import { BaseCommandResult } from '../../shared';

/**
 * Result interface for timezone conversion operations.
 */
export interface ConvertTimezoneResult extends BaseCommandResult {
  /** Source timezone identifier */
  fromTimezone?: string;
}
