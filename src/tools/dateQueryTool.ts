/**
 * Language Model Tool for advanced date queries and navigation.
 * Performs complex date operations like finding next/previous weekdays,
 * calculating start/end of periods, and chaining multiple date operations.
 */

import * as vscode from 'vscode';
import { IDateQueryParameters } from '../types';
import { dateQueryCommand } from '../commands';

export class DateQueryTool implements vscode.LanguageModelTool<IDateQueryParameters> {
  /**
   * Invokes the date query tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with date query operation results
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IDateQueryParameters>,
    _token: vscode.CancellationToken,
  ) {
    try {
      const params = options.input;
      const result = dateQueryCommand(params);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(JSON.stringify(result)),
      ]);
    } catch (error) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(`Error: ${error}`),
      ]);
    }
  }
}
