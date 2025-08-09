/**
 * Language Model Tool for adding time to dates.
 * Adds specified amounts of time (years, months, weeks, days, hours, minutes, seconds) to a base date.
 */

import * as vscode from 'vscode';
import { IAddTimeParameters } from '../types';
import { parseISOString, formatUTC, formatInTimezone, getUserTimezone } from '../utils';

export class AddTimeTool implements vscode.LanguageModelTool<IAddTimeParameters> {
  /**
   * Invokes the add time tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with the calculated future date
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IAddTimeParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;

    try {
      // Use provided base time or current time
      const baseDate = params.baseTime ? parseISOString(params.baseTime) : new Date();

      // Calculate the new date by adding the specified time units
      const newDate = new Date(baseDate);

      if (params.years) {
        newDate.setFullYear(newDate.getFullYear() + params.years);
      }
      if (params.months) {
        newDate.setMonth(newDate.getMonth() + params.months);
      }
      if (params.weeks) {
        newDate.setDate(newDate.getDate() + params.weeks * 7);
      }
      if (params.days) {
        newDate.setDate(newDate.getDate() + params.days);
      }
      if (params.hours) {
        newDate.setHours(newDate.getHours() + params.hours);
      }
      if (params.minutes) {
        newDate.setMinutes(newDate.getMinutes() + params.minutes);
      }
      if (params.seconds) {
        newDate.setSeconds(newDate.getSeconds() + params.seconds);
      }

      // Include local timezone info
      const userTimezone = getUserTimezone();
      const localFormatted = formatInTimezone(newDate, userTimezone);

      // Build duration description
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
      const baseText = params.baseTime ? params.baseTime : 'now';

      let message =
        `Adding ${durationText} to ${baseText}:\n` +
        `- Result: ${localFormatted} (${userTimezone})\n` +
        `- ISO format: ${newDate.toISOString()}\n` +
        `- UTC format: ${formatUTC(newDate)}`;

      // If specific timezone requested, include that too
      if (params.timezone) {
        try {
          const tzFormatted = formatInTimezone(newDate, params.timezone);
          message += `\n- ${params.timezone}: ${tzFormatted}`;
        } catch (error) {
          message += `\n- Error: Invalid timezone: ${params.timezone}`;
        }
      }

      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
    } catch (error) {
      const errorMessage = `Error adding time: Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.`;
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(errorMessage)]);
    }
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IAddTimeParameters>,
    _token: vscode.CancellationToken,
  ) {
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
      title: 'Add time duration',
      message: new vscode.MarkdownString(`Add ${durationText} to ${baseText}?`),
    };

    return {
      invocationMessage: `Adding ${durationText}`,
      confirmationMessages,
    };
  }
}
