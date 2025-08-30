/**
 * Language Model Tool for business day operations.
 * Performs business day calculations including checking if a date is a business day,
 * adding/subtracting business days, and handling custom business day definitions.
 */

import {
  LanguageModelTool,
  LanguageModelToolResult,
  LanguageModelTextPart,
  LanguageModelToolInvocationOptions,
  CancellationToken,
} from 'vscode';
import { BusinessDayOptions } from '../model/BusinessDayOptions';
import { InvalidDateError, InvalidTimezoneError, InvalidWeekDayError } from '../../shared';
import { businessDayCommand } from '../command/businessDayCommand';
import { MissingDaysError } from '../error/MissingDaysError';
import { UnsupportedBusinessDayOperation } from '../error/UnsupportedBusinessDayOperation';
import { BusinessDayResult } from '../model/BusinessDayResult';

export class BusinessDayTool implements LanguageModelTool<BusinessDayOptions> {
  /**
   * Invokes the business day tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with business day operation results
   */

  async invoke(
    options: LanguageModelToolInvocationOptions<BusinessDayOptions>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    try {
      const params = options.input;
      const result = businessDayCommand(params);
      return new LanguageModelToolResult([
        new LanguageModelTextPart(BusinessDayTool.buildResponseMessage(params, result)),
      ]);
    } catch (error: unknown) {
      return new LanguageModelToolResult([
        new LanguageModelTextPart(`Error: ${BusinessDayTool.getErrorMessage(error)}`),
      ]);
    }
  }

  /**
   * Builds a response message for the business day tool.
   * @param param - The input parameters for the business day operation
   * @param result - The result of the business day operation
   * @returns The formatted response message
   */
  private static buildResponseMessage(
    param: BusinessDayOptions,
    result: BusinessDayResult,
  ): string {
    const jsonBlock = ['```json', JSON.stringify(result, null, 2), '```'].join('\n');
    let readableMessage;
    switch (param.operation) {
      case 'addBusinessDays':
        readableMessage = `The date ${result.days} after ${param.date} is ${result.result} using business days: ${result.businessDays}`;
        break;
      case 'subtractBusinessDays':
        readableMessage = `The date ${result.days} before ${param.date} is ${result.result} using business days: ${result.businessDays}`;
        break;
      case 'isBusinessDay':
        readableMessage = `The date ${param.date} is ${result.isBusinessDay ? '' : 'not '}a business day.`;
        break;
      default:
        readableMessage = `Unknown operation: ${jsonBlock}`; // This case should be unreachable but let's fail gracefully if it does happen
    }
    return [jsonBlock, readableMessage].join('\n');
  }

  /**
   * Get a user-friendly error message from an error object.
   * @param error - The error object
   * @returns A user-friendly error message
   */
  private static getErrorMessage(error: unknown): string {
    if (error instanceof InvalidDateError) {
      return `Invalid date: ${error.message}`;
    }

    if (error instanceof InvalidTimezoneError) {
      return `Invalid timezone: ${error.message}`;
    }

    if (error instanceof InvalidWeekDayError) {
      return `Invalid week day: ${error.message}`;
    }

    if (error instanceof MissingDaysError) {
      return `Missing days parameter: ${error.message}`;
    }

    if (error instanceof UnsupportedBusinessDayOperation) {
      return `Unsupported business day operation: ${error.message}`;
    }

    return `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`;
  }
}
