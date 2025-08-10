/**
 * Language Model Tool for formatting duration values.
 * Converts duration values into human-readable strings with various verbosity levels.
 */

import {
  LanguageModelTool,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolResult,
  LanguageModelTextPart,
} from 'vscode';
import { IFormatDurationParameters } from '../types';
import { formatDurationCommand } from '../commands';

export class FormatDurationTool implements LanguageModelTool<IFormatDurationParameters> {
  /**
   * Invokes the format duration tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with formatted duration string
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<IFormatDurationParameters>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    try {
      const params = options.input;
      const result = formatDurationCommand(params);
      return new LanguageModelToolResult([new LanguageModelTextPart(JSON.stringify(result))]);
    } catch (_error) {
      // Use this to satisfy class-methods-use-this rule
      void this.constructor.name;
      return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${_error}`)]);
    }
  }
}
