/**
 * Language Model Tool for advanced date queries and navigation.
 * Performs complex date operations like finding next/previous weekdays,
 * calculating start/end of periods, and chaining multiple date operations.
 */

import {
  LanguageModelTool,
  LanguageModelToolResult,
  LanguageModelTextPart,
  LanguageModelToolInvocationOptions,
  CancellationToken,
} from 'vscode';
import { DateQueryOptions } from '../model/DateQueryOptions';
import { InvalidDateError } from '../../shared';
import { dateQueryCommand } from '../command/dateQueryCommand';
import { InvalidQueryError } from '../error/InvalidQueryError';
import { InvalidPeriodQueryError } from '../error/InvalidPeriodQueryError';
import { InvalidWeekDayQueryError } from '../error/InvalidWeekDayQueryError';
import { MissingPeriodQueryError } from '../error/MissingPeriodQueryError';
import { DateQueryResult } from '../model/DateQueryResult';

export class DateQueryTool implements LanguageModelTool<DateQueryOptions> {
  /**
   * Invokes the date query tool.
   *
   * @param options - Tool invocation options containing input parameters
   * @param _token - Cancellation token (unused)
   * @returns Language model tool result with date query operation results
   */
  async invoke(
    options: LanguageModelToolInvocationOptions<DateQueryOptions>,
    _token: CancellationToken,
  ): Promise<LanguageModelToolResult> {
    try {
      const params = options.input;
      const result = dateQueryCommand(params);
      return new LanguageModelToolResult([new LanguageModelTextPart(JSON.stringify(result))]);
    } catch (error: unknown) {
      return new LanguageModelToolResult([
        new LanguageModelTextPart(DateQueryTool.getErrorMessage(error)),
      ]);
    }
  }

  /**
   * Builds the response message for the date query tool.
   * @param commandResult - The result of the date query command.
   * @param queries - The original date queries.
   * @returns The formatted response message.
   */
  static buildResponseMessage(
    commandResult: DateQueryResult,
    queries: DateQueryOptions['queries'],
  ): string {
    const { dates } = commandResult;
    let message = '';
    if (Array.isArray(dates) && dates.length > 0 && Array.isArray(queries)) {
      message += 'Query Results:';
      message += '\n';
      for (let i = 0; i < dates.length; i++) {
        const dateStr = dates[i] ?? '';
        message += DateQueryTool.formatQueryResult(i, queries[i], dateStr);
      }
    } else {
      message += 'No dates found.';
    }
    const jsonBlock = ['```json', JSON.stringify(commandResult, null, 2), '```'].join('\n');
    return `${message}\n${jsonBlock}`;
  }

  /**
   * Formats the query result for display.
   * @param index - The index of the result.
   * @param query - The original query object.
   * @param date - The resulting date string.
   * @returns The formatted result string.
   */
  private static formatQueryResult(
    index: number,
    query: DateQueryOptions['queries'][0] | undefined,
    date: string,
  ): string {
    if (!query) {
      return `  ${index + 1}. ${date}\n`;
    }
    const baseLabel = index === 0 ? 'base date' : `result ${index}`;
    switch (query.type) {
      case 'nextWeekday':
        return `  ${index + 1}. Next ${query.weekday} after ${baseLabel}: ${date}\n`;
      case 'previousWeekday':
        return `  ${index + 1}. Previous ${query.weekday} before ${baseLabel}: ${date}\n`;
      case 'startOfPeriod':
        return `  ${index + 1}. Start of ${query.period} for ${baseLabel}: ${date}\n`;
      case 'endOfPeriod':
        return `  ${index + 1}. End of ${query.period} for ${baseLabel}: ${date}\n`;
      default:
        return `  ${index + 1}. ${date}\n`;
    }
  }

  /**
   * Gets the error message for a specific error type.
   * @param error - The error object.
   * @returns The formatted error message.
   */
  private static getErrorMessage(error: unknown): string {
    if (error instanceof InvalidQueryError) {
      return `Invalid query: ${error.message}`;
    }

    if (error instanceof InvalidDateError) {
      return `Invalid date: ${error.message}`;
    }

    if (error instanceof InvalidWeekDayQueryError) {
      return `Invalid weekday: ${error.message}`;
    }

    if (error instanceof MissingPeriodQueryError) {
      return `Missing period: ${error.message}`;
    }

    if (error instanceof InvalidPeriodQueryError) {
      return `Invalid period: ${error.message}`;
    }

    return `Unknown error: ${String(error)}`;
  }
}
