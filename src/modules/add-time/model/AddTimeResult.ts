import { BaseCommandResult } from '../../shared';

/**
 * Result interface for time addition operations.
 */
export interface AddTimeResult extends BaseCommandResult {
  /** Base time used for calculation */
  baseTime?: string;
}
