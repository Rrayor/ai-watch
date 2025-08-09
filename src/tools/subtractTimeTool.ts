/**
 * Language Model Tool for subtracting time from dates.
 * Subtracts specified amounts of time (years, months, weeks, days, hours, minutes, seconds) from a base date.
 */

import * as vscode from 'vscode';
import { ISubtractTimeParameters } from '../types';
import { subtractTimeCommand } from '../commands';

export class SubtractTimeTool implements vscode.LanguageModelTool<ISubtractTimeParameters> {
  /**
   * Invokes the subtract time tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with the calculated past date
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<ISubtractTimeParameters>,
    _token: vscode.CancellationToken,
  ): Promise<vscode.LanguageModelToolResult> {
    try {
      const result = subtractTimeCommand(options.input);
      if (result.error) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error: ${result.error}`),
        ]);
      }

      let message = `Time calculation result:\n- Base time: ${result.baseTime}\n- Result: ${result.iso}\n- UTC format: ${result.utc}\n- Local time: ${result.local} (${result.localTimezone})`;
      if (result.formatted && result.timezone) {
        message += `\n- ${result.timezone}: ${result.formatted}`;
      }

      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
    } catch (error) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart('Error: Failed to subtract time'),
      ]);
    }
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<ISubtractTimeParameters>,
    _token: vscode.CancellationToken,
  ): Promise<vscode.PreparedToolInvocation> {
    const params = options.input;

    // Build duration description for confirmation
    const durationParts = [];
    if (params.years) {
      durationParts.push(`${params.years} year${params.years !== 1 ? 's' : ''}`);
    }
    if (params.months) {
      durationParts.push(`${params.months} month${params.months !== 1 ? 's' : ''}`);
    }
    if (params.weeks) {
      durationParts.push(`${params.weeks} week${params.weeks !== 1 ? 's' : ''}`);
    }
    if (params.days) {
      durationParts.push(`${params.days} day${params.days !== 1 ? 's' : ''}`);
    }
    if (params.hours) {
      durationParts.push(`${params.hours} hour${params.hours !== 1 ? 's' : ''}`);
    }
    if (params.minutes) {
      durationParts.push(`${params.minutes} minute${params.minutes !== 1 ? 's' : ''}`);
    }
    if (params.seconds) {
      durationParts.push(`${params.seconds} second${params.seconds !== 1 ? 's' : ''}`);
    }

    const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
    const baseText = params.baseTime ? params.baseTime : 'current time';

    const confirmationMessages = {
      title: 'Subtract time duration',
      message: new vscode.MarkdownString(`Subtract ${durationText} from ${baseText}?`),
    };

    return {
      invocationMessage: `Subtracting ${durationText}`,
      confirmationMessages,
    };
  }
}
