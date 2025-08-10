/**
 * Language Model Tool for advanced date queries and navigation.
 * Performs complex date operations like finding next/previous weekdays,
 * calculating start/end of periods, and chaining multiple date operations.
 */

import {
  LanguageModelTool,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolResult,
  LanguageModelTextPart,
} from 'vscode';
import { IDateQueryParameters } from '../types';
import { dateQueryCommand } from '../commands';

export class DateQueryTool implements LanguageModelTool<IDateQueryParameters> {
  /**
   * Invokes the date query tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with date query operation results
   */
  // eslint-disable-next-line class-methods-use-this
  async invoke(
    options: LanguageModelToolInvocationOptions<IDateQueryParameters>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    try {
      const params = options.input;
      const result = dateQueryCommand(params);
      return new LanguageModelToolResult([new LanguageModelTextPart(JSON.stringify(result))]);
    } catch (_error) {
      return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${_error}`)]);
    }
  }
}
