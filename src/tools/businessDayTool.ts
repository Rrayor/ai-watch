/**
 * Language Model Tool for business day operations.
 * Performs business day calculations including checking if a date is a business day,
 * adding/subtracting business days, and handling custom business day definitions.
 */

import {
  LanguageModelTool,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolResult,
  LanguageModelTextPart,
} from 'vscode';
import { IBusinessDayParameters } from '../types';
import { businessDayCommand } from '../commands';

export class BusinessDayTool implements LanguageModelTool<IBusinessDayParameters> {
  /**
   * Invokes the business day tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with business day operation results
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<IBusinessDayParameters>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    try {
      const params = options.input;
      const result = businessDayCommand(params);
      return new LanguageModelToolResult([new LanguageModelTextPart(JSON.stringify(result))]);
    } catch (_error) {
      void this.constructor.name;
      return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${_error}`)]);
    }
  }
}
