/**
 * Language Model Tool for adding time to dates.
 * Adds specified amounts of time (years, months, weeks, days, hours, minutes, seconds) to a base date.
 */

import {
  LanguageModelTool,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolResult,
  LanguageModelTextPart,
  LanguageModelToolInvocationPrepareOptions,
  MarkdownString,
} from 'vscode';
import { IAddTimeParameters } from '../types';
import { parseISOString, formatUTC, formatInTimezone, getUserTimezone } from '../utils';

export class AddTimeTool implements LanguageModelTool<IAddTimeParameters> {
  /**
   * Adds time units to a date
   */
  private static addTimeUnits(date: Date, params: IAddTimeParameters): void {
    if (params.years) {
      date.setFullYear(date.getFullYear() + params.years);
    }
    if (params.months) {
      date.setMonth(date.getMonth() + params.months);
    }
    if (params.weeks) {
      const DAYS_PER_WEEK = 7;
      date.setDate(date.getDate() + params.weeks * DAYS_PER_WEEK);
    }
    if (params.days) {
      date.setDate(date.getDate() + params.days);
    }
    if (params.hours) {
      date.setHours(date.getHours() + params.hours);
    }
    if (params.minutes) {
      date.setMinutes(date.getMinutes() + params.minutes);
    }
    if (params.seconds) {
      date.setSeconds(date.getSeconds() + params.seconds);
    }
  }

  /**
   * Builds duration description from parameters
   */
  private static buildDurationParts(params: IAddTimeParameters): string[] {
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
   * Builds result message with timezone information
   */
  private static buildResultMessage(
    newDate: Date,
    params: IAddTimeParameters,
    durationParts: string[],
    userTimezone: string,
    localFormatted: string,
  ): string {
    const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
    const baseText = params.baseTime ?? 'now';

    let message =
      `Adding ${durationText} to ${baseText}:\n` +
      `- Result: ${localFormatted} (${userTimezone})\n` +
      `- ISO format: ${newDate.toISOString()}\n` +
      `- UTC format: ${formatUTC(newDate)}`;

    if (params.timezone) {
      try {
        const tzFormatted = formatInTimezone(newDate, params.timezone);
        message += `\n- ${params.timezone}: ${tzFormatted}`;
      } catch {
        message += `\n- Error: Invalid timezone: ${params.timezone}`;
      }
    }

    return message;
  }
  /**
   * Invokes the add time tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with the calculated future date
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<IAddTimeParameters>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    const params = options.input;

    try {
      // Use provided base time or current time
      const baseDate = params.baseTime ? parseISOString(params.baseTime) : new Date();
      void this.constructor.name;

      // Calculate the new date by adding the specified time units
      const newDate = new Date(baseDate);
      AddTimeTool.addTimeUnits(newDate, params);

      // Include local timezone info
      const userTimezone = getUserTimezone();
      const localFormatted = formatInTimezone(newDate, userTimezone);

      // Build duration description
      const durationParts = AddTimeTool.buildDurationParts(params);
      const message = AddTimeTool.buildResultMessage(
        newDate,
        params,
        durationParts,
        userTimezone,
        localFormatted,
      );

      return new LanguageModelToolResult([new LanguageModelTextPart(message)]);
    } catch {
      const errorMessage = `Error adding time: Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.`;
      return new LanguageModelToolResult([new LanguageModelTextPart(errorMessage)]);
    }
  }

  async prepareInvocation(
    options: LanguageModelToolInvocationPrepareOptions<IAddTimeParameters>,
    _token: CancellationToken,
  ): Promise<{
    invocationMessage: string;
    confirmationMessages: { title: string; message: MarkdownString };
  }> {
    const params = options.input;
    void this.constructor.name;

    // Build duration description for confirmation
    const durationParts = AddTimeTool.buildDurationParts(params);
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
}
