/**
 * Language Model Tool for calculating time differences between two dates.
 * Provides detailed breakdown of the time difference in various units.
 */

import {
  LanguageModelTool,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolInvocationPrepareOptions,
  MarkdownString,
} from 'vscode';
import { CalculateDifferenceOptions } from '../model/CalculateDifferenceOptions';
import { LanguageModelToolResult, LanguageModelTextPart, InvalidDateError } from '../../shared';
import { calculateDifferenceCommand } from '../command/calculateDifferenceCommand';
import { CalculateDifferenceResult } from '../model/CalculateDifferenceResult';

export class CalculateDifferenceTool implements LanguageModelTool<CalculateDifferenceOptions> {
  /**
   * Invokes the calculate difference tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with date difference information
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<CalculateDifferenceOptions>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    const params = options.input;

    try {
      const result = calculateDifferenceCommand(params);
      const message = CalculateDifferenceTool.buildResponseMessage(params, result);

      return new LanguageModelToolResult([new LanguageModelTextPart(message)]);
    } catch (error: unknown) {
      return new LanguageModelToolResult([
        new LanguageModelTextPart(CalculateDifferenceTool.getErrorMessage(error)),
      ]);
    }
  }

  async prepareInvocation(
    options: LanguageModelToolInvocationPrepareOptions<CalculateDifferenceOptions>,
    _token: CancellationToken,
  ): Promise<{
    invocationMessage: string;
    confirmationMessages: { title: string; message: MarkdownString };
  }> {
    const params = options.input;
    const confirmationMessages = {
      title: 'Calculate time difference',
      message: new MarkdownString(
        `Calculate the time difference between ${params.from} and ${params.to}?`,
      ),
    };

    return {
      invocationMessage: 'Calculating time difference',
      confirmationMessages,
    };
  }

  /**
   * Builds the response message for the time difference calculation.
   * @param params - The input parameters for the calculation.
   * @param result - The result of the calculation.
   * @returns The formatted response message.
   */
  private static buildResponseMessage(
    params: CalculateDifferenceOptions,
    result: CalculateDifferenceResult,
  ): string {
    return (
      `Time difference between ${params.from} and ${params.to}:\n` +
      `- Days: ${result.days}\n` +
      `- Hours: ${result.hours}\n` +
      `- Minutes: ${result.minutes}\n` +
      `- Seconds: ${result.seconds}`
    );
  }

  /**
   * Gets the error message for a failed difference calculation.
   * @param error - The error object.
   * @returns The formatted error message.
   */
  private static getErrorMessage(error: unknown): string {
    if (error instanceof InvalidDateError) {
      return `Difference calculation failed: ${error.message}`;
    }
    return `Difference calculation failed: An unknown error occurred: ${String(error)}`;
  }
}
