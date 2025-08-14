/**
 * Language Model Tool for adding time to dates.
 * Adds specified amounts of time (years, months, weeks, days, hours, minutes, seconds) to a base date.
 */

import {
  LanguageModelTool,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolInvocationPrepareOptions,
  MarkdownString,
} from 'vscode';
import { addTimeCommand } from '../command/addTimeCommand';
import { AddTimeOptions } from '../model/AddTimeOptions';
import { LanguageModelToolResult } from '../../shared';
import { LanguageModelTextPart } from '../../shared';
import { AddTimeResult } from '../model/AddTimeResult';
import { InvalidDateError } from '../../shared';
import { InvalidTimezoneError } from '../../shared';
import { buildDurationParts } from '../../shared';

export class AddTimeTool implements LanguageModelTool<AddTimeOptions> {
  /**
   * Invokes the add time tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with the calculated future date
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<AddTimeOptions>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    const params = options.input;

    try {
      // Calculate the new date by adding the specified time units (returns new Date)
      const addTimeResult = addTimeCommand(params);

      // Build duration description
      const durationParts = buildDurationParts(params);
      const message = AddTimeTool.buildResultMessage(
        addTimeResult,
        params,
        durationParts,
        addTimeResult.info ?? [],
      );

      return new LanguageModelToolResult([new LanguageModelTextPart(message)]);
    } catch (error: unknown) {
      const errorMessage = AddTimeTool.getErrorMessage(error);
      return new LanguageModelToolResult([new LanguageModelTextPart(errorMessage)]);
    }
  }

  async prepareInvocation(
    options: LanguageModelToolInvocationPrepareOptions<AddTimeOptions>,
    _token: CancellationToken,
  ): Promise<{
    invocationMessage: string;
    confirmationMessages: { title: string; message: MarkdownString };
  }> {
    const params = options.input;

    // Build duration description for confirmation
    const durationParts = buildDurationParts(params);
    const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
    const baseText = params.baseTime ?? 'current time';

    const confirmationMessages = {
      title: 'Add time duration',
      message: new MarkdownString(`Add ${durationText} to ${baseText}?`),
    };

    return {
      invocationMessage: `Adding ${durationText}`,
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
    result: AddTimeResult,
    params: AddTimeOptions,
    durationParts: string[],
    info: string[],
  ): string {
    const jsonBlock = ['```json', JSON.stringify(result, null, 2), '```'].join('\n');
    const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
    const baseText = params.baseTime ?? 'now';

    let message =
      `Adding ${durationText} to ${baseText}:\n` +
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
      return 'Error adding time: Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.';
    } else if (error instanceof InvalidTimezoneError) {
      return `Error adding time: ${error.message}`;
    }
    return 'Error adding time: Unknown error.';
  }
}
