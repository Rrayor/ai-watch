/**
 * Language Model Tool for subtracting time from dates.
 * Subtracts specified amounts of time (years, months, weeks, days, hours, minutes, seconds) from a base date.
 */

import {
  LanguageModelTool,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolResult,
  LanguageModelTextPart,
  LanguageModelToolInvocationPrepareOptions,
  PreparedToolInvocation,
  MarkdownString,
} from 'vscode';
import { ISubtractTimeParameters } from '../types';
import { subtractTimeCommand } from '../commands';

export class SubtractTimeTool implements LanguageModelTool<ISubtractTimeParameters> {
  /**
   * Builds duration description from parameters
   * @param params - Parameters containing time durations to subtract
   * @returns Array of formatted duration parts (e.g., ["2 years", "3 months"])
   */
  private static buildDurationParts(params: ISubtractTimeParameters): string[] {
    const parts: string[] = [];
    const timeUnits = [
      { value: params.years, unit: 'year' },
      { value: params.months, unit: 'month' },
      { value: params.weeks, unit: 'week' },
      { value: params.days, unit: 'day' },
      { value: params.hours, unit: 'hour' },
      { value: params.minutes, unit: 'minute' },
      { value: params.seconds, unit: 'second' },
    ];

    timeUnits.forEach(({ value, unit }) => {
      if (value) {
        parts.push(`${value} ${unit}${value !== 1 ? 's' : ''}`);
      }
    });

    return parts;
  }
  /**
   * Invokes the subtract time tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with the calculated past date
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<ISubtractTimeParameters>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    try {
      void this.constructor.name;
      const result = subtractTimeCommand(options.input);
      if (result.error) {
        return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.error}`)]);
      }

      let message = `Time calculation result:\n- Base time: ${result.baseTime}\n- Result: ${result.iso}\n- UTC format: ${result.utc}\n- Local time: ${result.local} (${result.localTimezone})`;
      if (result.formatted && result.timezone) {
        message += `\n- ${result.timezone}: ${result.formatted}`;
      }

      return new LanguageModelToolResult([new LanguageModelTextPart(message)]);
    } catch {
      return new LanguageModelToolResult([
        new LanguageModelTextPart('Error: Failed to subtract time'),
      ]);
    }
  }

  async prepareInvocation(
    options: LanguageModelToolInvocationPrepareOptions<ISubtractTimeParameters>,
    _token: CancellationToken,
  ): Promise<PreparedToolInvocation> {
    const params = options.input;
    void this.constructor.name;

    // Build duration description for confirmation
    const durationParts = SubtractTimeTool.buildDurationParts(params);
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
}
