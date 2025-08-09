/**
 * Language Model Tool for getting the current date and time with timezone support.
 * Provides current date/time in various formats and timezones.
 */

import * as vscode from 'vscode';
import { IGetCurrentDateParameters } from '../types';
import { formatUTC, formatInTimezone, getUserTimezone } from '../utils';

export class GetCurrentDateTool implements vscode.LanguageModelTool<IGetCurrentDateParameters> {
  /**
   * Invokes the get current date tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with current date/time information
   */
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IGetCurrentDateParameters>,
    _token: vscode.CancellationToken,
  ) {
    const now = new Date();
    const params = options.input;

    const result: any = {
      iso: now.toISOString(),
      utc: formatUTC(now),
    };

    // Always include local timezone info for better context
    const userTimezone = getUserTimezone();
    result.local = formatInTimezone(now, userTimezone);
    result.localTimezone = userTimezone;

    if (params?.timezone) {
      try {
        result.formatted = formatInTimezone(now, params.timezone, params.format);
        result.timezone = params.timezone;
      } catch (error) {
        result.error = `Invalid timezone: ${params.timezone}`;
      }
    } else if (params?.format) {
      try {
        result.formatted = formatInTimezone(now, undefined, params.format);
      } catch (error) {
        result.error = `Invalid format: ${params.format}`;
      }
    }

    let message = `Current date and time:\n- ISO format: ${result.iso}\n- UTC format: ${result.utc}\n- Local time: ${result.local} (${result.localTimezone})`;
    if (result.formatted && params?.timezone) {
      message += `\n- ${params.timezone}: ${result.formatted}`;
    } else if (result.formatted) {
      message += `\n- Formatted: ${result.formatted}`;
    }
    if (result.error) {
      message += `\n- Error: ${result.error}`;
    }

    return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IGetCurrentDateParameters>,
    _token: vscode.CancellationToken,
  ) {
    const params = options.input;
    let title = 'Get current date and time';
    let message = 'Get the current date and time';

    if (params?.timezone || params?.format) {
      if (params.timezone) {
        title += ` in ${params.timezone}`;
        message += ` in timezone ${params.timezone}`;
      }
      if (params.format) {
        message += ` with format "${params.format}"`;
      }
    } else {
      message += ' in ISO and UTC formats';
    }

    const confirmationMessages = {
      title,
      message: new vscode.MarkdownString(message + '?'),
    };

    return {
      invocationMessage: title,
      confirmationMessages,
    };
  }
}
