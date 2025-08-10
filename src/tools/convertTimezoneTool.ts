/**
 * Language Model Tool for converting timezones.
 * Converts dates and times from one timezone to another with proper formatting.
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
import { IConvertTimezoneParameters } from '../types';
import { parseISOString, formatInTimezone } from '../utils';

export class ConvertTimezoneTool implements LanguageModelTool<IConvertTimezoneParameters> {
  /**
   * Invokes the convert timezone tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with timezone conversion information
   */
  // eslint-disable-next-line class-methods-use-this
  async invoke(
    options: LanguageModelToolInvocationOptions<IConvertTimezoneParameters>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    const params = options.input;

    try {
      const date = parseISOString(params.date);
      // Default fromTimezone to UTC if not specified
      const fromTz = params.fromTimezone ?? 'UTC';
      const formatted = formatInTimezone(date, params.toTimezone);

      const message =
        `Converted ${params.date} from ${fromTz} to ${params.toTimezone}:\n` +
        `- Formatted: ${formatted}\n` +
        `- From timezone: ${fromTz}\n` +
        `- To timezone: ${params.toTimezone}\n` +
        `- Original ISO: ${date.toISOString()}`;

      return new LanguageModelToolResult([new LanguageModelTextPart(message)]);
    } catch {
      const errorMessage =
        'Error converting timezone: Invalid date format or timezone. Please use ISO format for date and valid IANA timezone.';
      return new LanguageModelToolResult([new LanguageModelTextPart(errorMessage)]);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async prepareInvocation(
    options: LanguageModelToolInvocationPrepareOptions<IConvertTimezoneParameters>,
    _token: CancellationToken,
  ): Promise<{
    invocationMessage: string;
    confirmationMessages: { title: string; message: MarkdownString };
  }> {
    const params = options.input;
    const confirmationMessages = {
      title: 'Convert timezone',
      message: new MarkdownString(`Convert ${params.date} to timezone ${params.toTimezone}?`),
    };

    return {
      invocationMessage: 'Converting timezone',
      confirmationMessages,
    };
  }
}
