/**
 * Language Model Tool for converting timezones.
 * Converts dates and times from one timezone to another with proper formatting.
 */

import {
  LanguageModelTool,
  LanguageModelToolResult,
  LanguageModelTextPart,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolInvocationPrepareOptions,
  MarkdownString,
} from 'vscode';
import { ConvertTimezoneOptions } from '../model/ConvertTimezoneOptions';
import {
  parseISOString,
  InvalidDateError,
  InvalidTimezoneError,
  AmbiguousDateError,
} from '../../shared';
import { convertTimezoneCommand } from '../command/convertTimezoneCommand';
import { ConvertTimezoneResult } from '../model/ConvertTimezoneResult';

/**
 * Structure for the message returned by ConvertTimezoneTool, including original input and conversion result.
 */
interface ConvertTimezoneMessage {
  /**
   * The original date and source timezone.
   */
  original: {
    /**
     * The original date as a Date object.
     */
    date: Date;
    /**
     * The source timezone (optional).
     */
    fromTimezone?: string | undefined;
  };
  /**
   * The result of the timezone conversion.
   */
  result: ConvertTimezoneResult;
}

export class ConvertTimezoneTool implements LanguageModelTool<ConvertTimezoneOptions> {
  /**
   * Invokes the convert timezone tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with timezone conversion information
   */

  /**
   * Invokes the convert timezone tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with timezone conversion information
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<ConvertTimezoneOptions>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    const params = options.input;
    try {
      const commandResult = convertTimezoneCommand(params);
      const messageData: ConvertTimezoneMessage = {
        original: {
          date: parseISOString(params.date, params.fromTimezone),
          fromTimezone: params.fromTimezone,
        },
        result: commandResult,
      };
      const message = ConvertTimezoneTool.buildResponseMessage(messageData);
      return new LanguageModelToolResult([new LanguageModelTextPart(message)]);
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(error);
      return new LanguageModelToolResult([new LanguageModelTextPart(errorMessage)]);
    }
  }

  /**
   * Builds the response message from result data
   */
  /**
   * Builds the response message from result data, including both JSON and human-readable summary.
   *
   * @param message - The message data containing original input and conversion result
   * @returns Combined JSON and human-readable summary string
   */
  private static buildResponseMessage(message: ConvertTimezoneMessage): string {
    const jsonBlock = ['```json', JSON.stringify(message, null, 2), '```'].join('\n');
    const summary = ConvertTimezoneTool.buildSummary(message);
    return [jsonBlock, summary].join('\n');
  }

  /**
   * Builds the human-readable summary for the result.
   */
  /**
   * Builds the human-readable summary for the result.
   *
   * @param message - The message data containing original input and conversion result
   * @returns Human-readable summary string
   */
  private static buildSummary(message: ConvertTimezoneMessage): string {
    const { original, result } = message;
    const summaryLines = [
      `Converted ${original.date} from ${original.fromTimezone} to ${result.resultTimezone}:`,
      `- Formatted: ${result.formattedResult}`,
      `- From timezone: ${original.fromTimezone}`,
      `- To timezone: ${result.resultTimezone}`,
      `- Original ISO: ${original.date.toISOString()}`,
    ];
    return summaryLines.join('\n');
  }

  /**
   * Prepares the invocation message and confirmation prompts for the tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Invocation and confirmation messages for the tool
   */
  async prepareInvocation(
    options: LanguageModelToolInvocationPrepareOptions<ConvertTimezoneOptions>,
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

  /**
   * Returns a user-friendly error message for known error types.
   *
   * @param error - The error thrown during timezone conversion
   * @returns User-friendly error message string
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof AmbiguousDateError) {
      return `Ambiguous date: ${error.message}`;
    }

    if (error instanceof InvalidDateError) {
      return `Error converting timezone: ${error.message}`;
    }

    if (error instanceof InvalidTimezoneError) {
      return `Error converting timezone: ${error.message}`;
    }

    return 'Unexpected Error!';
  }
}
