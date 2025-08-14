import { BaseCommandResult } from '../../shared';

/**
 * Result interface for current date operations.
 */
export interface GetCurrentDateTimeResult extends BaseCommandResult {
  /** Human-readable local time */
  localTime?: string;
}
