/**
 * Language Model Tool for getting the current date and time with timezone support.
 * Provides current date/time in various formats and timezones.
 */

import {
  LanguageModelTool,
  LanguageModelToolResult,
  LanguageModelTextPart,
  LanguageModelToolInvocationOptions,
  CancellationToken,
  LanguageModelToolInvocationPrepareOptions,
  MarkdownString,
} from 'vscode';
import { GetCurrentDateTimeResult } from '../model/GetCurrentDateTimeResult';
import { getCurrentDateTimeCommand } from '../command/getCurrentDateTimeCommand';
import { GetCurrentDateTimeOptions } from '../model/GetCurrentDateTimeOptions';

export class GetCurrentDateTimeTool implements LanguageModelTool<GetCurrentDateTimeOptions> {
  /**
   * Invokes the get current date tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with current date/time information
   * @throws {InvalidTimeZoneError} If the timezone is invalid
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<GetCurrentDateTimeOptions>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    const params = options.input;

    const message = GetCurrentDateTimeTool.buildResponseMessage(getCurrentDateTimeCommand(params));
    return new LanguageModelToolResult([new LanguageModelTextPart(message)]);
  }
  async prepareInvocation(
    options: LanguageModelToolInvocationPrepareOptions<GetCurrentDateTimeOptions>,
    _token: CancellationToken,
  ): Promise<{
    invocationMessage: string;
    confirmationMessages: { title: string; message: MarkdownString };
  }> {
    const params = options.input;
    let title = 'Get current date and time';
    let message = 'Get the current date and time';

    if (params?.timezone) {
      title += ` in ${params.timezone}`;
      message += ` in timezone ${params.timezone}`;
    }

    if (params?.format) {
      message += ` with format "${params.format}"`;
    }

    if (!params?.timezone && !params?.format) {
      message += ' in ISO and UTC formats';
    }

    const confirmationMessages = {
      title,
      message: new MarkdownString(`${message}?`),
    };

    return {
      invocationMessage: title,
      confirmationMessages,
    };
  }

  /**
   * Builds the response message from result data
   */
  private static buildResponseMessage(result: GetCurrentDateTimeResult): string {
    // JSON representation
    const jsonBlock = ['```json', JSON.stringify(result, null, 2), '```'].join('\n');
    // Human-readable summary
    const summary = GetCurrentDateTimeTool.buildSummary(result);
    return [jsonBlock, summary].join('\n');
  }

  /**
   * Builds the human-readable summary for the result.
   */
  private static buildSummary(result: GetCurrentDateTimeResult): string {
    const summaryLines: string[] = ['Current date and time:'];
    if (result.iso) summaryLines.push(`- ISO format: ${result.iso}`);
    if (result.utc) summaryLines.push(`- UTC format: ${result.utc}`);
    if (result.local) {
      const tz = result.localTimezone ? ` (${result.localTimezone})` : '';
      summaryLines.push(`- Local time: ${result.local}${tz}`);
    }
    GetCurrentDateTimeTool.appendFormatted(summaryLines, result);
    GetCurrentDateTimeTool.appendInfo(summaryLines, result.info);

    return summaryLines.join('\n');
  }

  /**
   * Appends formatted/timezone info to summary lines.
   */
  private static appendFormatted(summaryLines: string[], result: GetCurrentDateTimeResult): void {
    if (result.formattedResult) {
      if (result.resultTimezone) {
        summaryLines.push(`- ${result.resultTimezone}: ${result.formattedResult}`);
      } else {
        summaryLines.push(`- Formatted: ${result.formattedResult}`);
      }
    }
  }

  /**
   * Appends info messages to summary lines.
   */
  private static appendInfo(summaryLines: string[], info?: string[]): void {
    if (info && info.length > 0) {
      summaryLines.push('- Info:');
      for (const infoMsg of info) {
        summaryLines.push(`  • ${infoMsg}`);
      }
    }
  }
}
