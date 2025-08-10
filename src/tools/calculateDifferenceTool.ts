/**
 * Language Model Tool for calculating time differences between two dates.
 * Provides detailed breakdown of the time difference in various units.
 */

import {
  LanguageModelTool,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolResult,
  LanguageModelTextPart,
  LanguageModelToolInvocationPrepareOptions,
  MarkdownString,
} from 'vscode';
import { ICalculateDifferenceParameters } from '../types';
import { parseISOString, calculateDateDifference } from '../utils';

export class CalculateDifferenceTool implements LanguageModelTool<ICalculateDifferenceParameters> {
  /**
   * Invokes the calculate difference tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with date difference information
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<ICalculateDifferenceParameters>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    const params = options.input;

    try {
      const fromDate = parseISOString(params.from);
      const toDate = parseISOString(params.to);

      const result = calculateDateDifference(fromDate, toDate);

      const message =
        `Time difference between ${params.from} and ${params.to}:\n` +
        `- Days: ${result.days}\n` +
        `- Hours: ${result.hours}\n` +
        `- Minutes: ${result.minutes}\n` +
        `- Seconds: ${result.seconds}`;

      return new LanguageModelToolResult([new LanguageModelTextPart(message)]);
    } catch (_error) {
      void this.constructor.name;
      return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${_error}`)]);
    }
  }

  async prepareInvocation(
    options: LanguageModelToolInvocationPrepareOptions<ICalculateDifferenceParameters>,
    _token: CancellationToken,
  ): Promise<{
    invocationMessage: string;
    confirmationMessages: { title: string; message: MarkdownString };
  }> {
    const params = options.input;
    void this.constructor.name;
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
}
