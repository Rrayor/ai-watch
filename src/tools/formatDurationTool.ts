/**
 * Language Model Tool for formatting duration values.
 * Converts duration values into human-readable strings with various verbosity levels.
 */

import * as vscode from 'vscode';
import { IFormatDurationParameters } from '../types';
import { formatDurationCommand } from '../commands';

export class FormatDurationTool implements vscode.LanguageModelTool<IFormatDurationParameters> {
  /**
   * Invokes the format duration tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with formatted duration string
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IFormatDurationParameters>,
    _token: vscode.CancellationToken,
  ) {
    try {
      const params = options.input;
      const result = formatDurationCommand(params);
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
