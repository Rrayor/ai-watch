/**
 * Language Model Tool for converting times between timezones.
 * Converts dates and times from one timezone to another with proper formatting.
 */

import * as vscode from 'vscode';
import { IConvertTimezoneParameters } from '../types';
import { parseISOString, formatInTimezone } from '../utils';

export class ConvertTimezoneTool implements vscode.LanguageModelTool<IConvertTimezoneParameters> {
  /**
   * Invokes the convert timezone tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with timezone conversion information
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IConvertTimezoneParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;

    try {
      const date = parseISOString(params.date);
      // Default fromTimezone to UTC if not specified
      const fromTz = params.fromTimezone || 'UTC';
      const formatted = formatInTimezone(date, params.toTimezone);

      const message =
        `Converted ${params.date} from ${fromTz} to ${params.toTimezone}:\n` +
        `- Formatted: ${formatted}\n` +
        `- From timezone: ${fromTz}\n` +
        `- To timezone: ${params.toTimezone}\n` +
        `- Original ISO: ${date.toISOString()}`;

      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
    } catch (error) {
      const errorMessage = `Error converting timezone: Invalid date format or timezone. Please use ISO format for date and valid IANA timezone.`;
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(errorMessage)]);
    }
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IConvertTimezoneParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;
    const confirmationMessages = {
      title: 'Convert timezone',
      message: new vscode.MarkdownString(
        `Convert ${params.date} to timezone ${params.toTimezone}?`,
      ),
    };

    return {
      invocationMessage: 'Converting timezone',
      confirmationMessages,
    };
  }
}
