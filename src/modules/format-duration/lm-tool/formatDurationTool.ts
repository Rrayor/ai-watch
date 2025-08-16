/**
 * Language Model Tool for formatting duration values.
 * Converts duration values into human-readable strings with various verbosity levels.
 */

import {
  LanguageModelTool,
  LanguageModelToolResult,
  LanguageModelTextPart,
  LanguageModelToolInvocationOptions,
  CancellationToken,
} from 'vscode';
import { InvalidDateError } from '../../shared';
import { formatDurationCommand } from '../command/formatDurationCommand';
import { FormatDurationOptions } from '../model/FormatDurationOptions';
import { FormatDurationResult } from '../model/FormatDurationResult';

export class FormatDurationTool implements LanguageModelTool<FormatDurationOptions> {
  /**
   * Invokes the format duration tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with formatted duration string
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<FormatDurationOptions>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    try {
      const params = options.input;
      const result = formatDurationCommand(params);
      return new LanguageModelToolResult([
        new LanguageModelTextPart(FormatDurationTool.buildResponseMessage(params, result)),
      ]);
    } catch (_error) {
      return new LanguageModelToolResult([
        new LanguageModelTextPart(FormatDurationTool.getErrorMessage(_error)),
      ]);
    }
  }

  /**
   * Builds a response message for the format duration tool.
   * @param param - The input parameters for the duration formatting
   * @param result - The result of the duration formatting
   * @returns A formatted response message
   */
  private static buildResponseMessage(
    param: FormatDurationOptions,
    result: FormatDurationResult,
  ): string {
    const jsonBlock = JSON.stringify({ ...param, ...result }, null, 2);
    const readableMessage = `Formatted duration from ${param.from} to ${param.to}`;
    return [jsonBlock, readableMessage].join('\n');
  }

  /**
   * Builds an error message for the format duration tool.
   * @param error - The error encountered during duration formatting
   * @returns A formatted error message
   */
  private static getErrorMessage(error: unknown): string {
    if (error instanceof InvalidDateError) {
      return `Failed formatting duration: ${error.message}`;
    }
    return `Failed formatting duration: ${error instanceof Error ? error.message : String(error)}`;
  }
}
