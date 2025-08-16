import { BaseCommandResult } from '../../shared';

/**
 * Result interface for time subtraction operations.
 */
export interface SubtractTimeResult extends BaseCommandResult {
  /** Base time used for calculation */
  baseTime?: string;
}
