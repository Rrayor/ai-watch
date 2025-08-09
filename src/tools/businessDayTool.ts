/**
 * Language Model Tool for business day operations.
 * Performs business day calculations including checking if a date is a business day,
 * adding/subtracting business days, and handling custom business day definitions.
 */

import * as vscode from 'vscode';
import { IBusinessDayParameters } from '../types';
import { businessDayCommand } from '../commands';

export class BusinessDayTool implements vscode.LanguageModelTool<IBusinessDayParameters> {
  /**
   * Invokes the business day tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with business day operation results
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IBusinessDayParameters>,
    _token: vscode.CancellationToken,
  ) {
    try {
      const params = options.input;
      const result = businessDayCommand(params);
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
