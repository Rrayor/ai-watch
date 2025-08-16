/**
 * Language Model Tool for subtracting time from dates.
 * Subtracts specified amounts of time (years, months, weeks, days, hours, minutes, seconds) from a base date.
 */

import {
  LanguageModelTool,
  LanguageModelToolResult,
  LanguageModelTextPart,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolInvocationPrepareOptions,
  PreparedToolInvocation,
  MarkdownString,
} from 'vscode';
import { SubtractTimeOptions } from '../model/SubtractTimeOptions';
import { InvalidDateError, InvalidTimezoneError, buildDurationParts } from '../../shared';
import { subtractTimeCommand } from '../command/subtractTimeCommand';
import { SubtractTimeResult } from '../model/SubtractTimeResult';

export class SubtractTimeTool implements LanguageModelTool<SubtractTimeOptions> {
  /**
   * Invokes the subtract time tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with the calculated past date
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<SubtractTimeOptions>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    try {
      const result = subtractTimeCommand(options.input);

      const message = SubtractTimeTool.buildResultMessage(
        result,
        options.input,
        buildDurationParts(options.input),
        result.info ?? [],
      );

      return new LanguageModelToolResult([new LanguageModelTextPart(message)]);
    } catch (error: unknown) {
      return new LanguageModelToolResult([
        new LanguageModelTextPart(SubtractTimeTool.getErrorMessage(error)),
      ]);
    }
  }

  /**
   * Prepares the invocation of the subtract time tool.
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Prepared tool invocation object
   */
  async prepareInvocation(
    options: LanguageModelToolInvocationPrepareOptions<SubtractTimeOptions>,
    _token: CancellationToken,
  ): Promise<PreparedToolInvocation> {
    const params = options.input;

    // Build duration description for confirmation
    const durationParts = buildDurationParts(params);
    const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
    const baseText = params.baseTime ?? 'current time';

    const confirmationMessages = {
      title: 'Subtract time duration',
      message: new MarkdownString(`Subtract ${durationText} from ${baseText}?`),
    };

    return {
      invocationMessage: `Subtracting ${durationText}`,
      confirmationMessages,
    };
  }

  /**
   * Builds result message with timezone information
   * @param formattedDate - Calculated result date
   * @param params - Input parameters
   * @param durationParts - Array of formatted duration parts
   * @param userTimezone - User's local timezone
   * @param localFormatted - Formatted date in user's timezone
   * @returns Formatted result message string
   */
  private static buildResultMessage(
    result: SubtractTimeResult,
    params: SubtractTimeOptions,
    durationParts: string[],
    info: string[],
  ): string {
    const jsonBlock = ['```json', JSON.stringify(result, null, 2), '```'].join('\n');
    const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
    const baseText = params.baseTime ?? 'now';

    let message =
      `Subtracting ${durationText} from ${baseText}:\n` +
      `- Result: ${result.local} (${result.localTimezone})\n` +
      `- ISO format: ${result.iso}\n` +
      `- UTC format: ${result.utc}`;

    if (params.timezone) {
      message += `\n- ${params.timezone}: ${result.formattedResult}`;
    }

    if (info.length > 0) {
      message += `\n- Additional Information:\n${info.map((line) => `  - ${line}`).join('\n')}`;
    }

    return [jsonBlock, message].join('\n');
  }

  /**
   * Builds error message from caught error
   * @param error - Caught error
   * @returns Formatted error message
   */
  private static getErrorMessage(error: unknown): string {
    if (error instanceof InvalidDateError) {
      return 'Error subtracting time: Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.';
    } else if (error instanceof InvalidTimezoneError) {
      return `Error subtracting time: ${error.message}`;
    }
    return 'Error subtracting time: Unknown error.';
  }
}
