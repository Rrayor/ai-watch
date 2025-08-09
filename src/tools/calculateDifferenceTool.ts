/**
 * Language Model Tool for calculating differences between two dates.
 * Computes time differences in various units (days, hours, minutes, etc.).
 */

import * as vscode from 'vscode';
import { ICalculateDifferenceParameters } from '../types';
import { parseISOString, calculateDateDifference } from '../utils';

export class CalculateDifferenceTool
  implements vscode.LanguageModelTool<ICalculateDifferenceParameters>
{
  /**
   * Invokes the calculate difference tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with date difference information
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<ICalculateDifferenceParameters>,
    _token: vscode.CancellationToken,
  ) {
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

      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
    } catch (error) {
      const errorMessage = `Error calculating difference: Invalid date format. Please use ISO format (e.g., 2025-08-09T13:37:01Z)`;
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(errorMessage)]);
    }
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<ICalculateDifferenceParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;
    const confirmationMessages = {
      title: 'Calculate time difference',
      message: new vscode.MarkdownString(
        `Calculate the time difference between ${params.from} and ${params.to}?`,
      ),
    };

    return {
      invocationMessage: 'Calculating time difference',
      confirmationMessages,
    };
  }
}
