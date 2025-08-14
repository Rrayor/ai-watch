/**
 * Command registration for AI Watch extension.
 */

import { ExtensionContext, commands } from 'vscode';
import {
  getCurrentDateTimeCommand,
  CalculateDifferenceOptions,
  calculateDifferenceCommand,
  ConvertTimezoneOptions,
  convertTimezoneCommand,
  AddTimeOptions,
  addTimeCommand,
  SubtractTimeOptions,
  subtractTimeCommand,
  formatDurationCommand,
  BusinessDayOptions,
  businessDayCommand,
  DateQueryOptions,
  dateQueryCommand,
  GetCurrentDateTimeOptions,
  FormatDurationOptions,
} from '../modules';

/**
 * Registers all VS Code commands for programmatic access by other extensions.
 * Commands provide the same functionality as Language Model Tools but with direct API access.
 *
 * @param context - VS Code extension context for managing command subscriptions
 */
export function registerCommands(context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand('ai-watch.getCurrentDate', (options?: GetCurrentDateTimeOptions) => {
      return getCurrentDateTimeCommand(options);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand(
      'ai-watch.calculateDifference',
      (options: CalculateDifferenceOptions) => {
        return calculateDifferenceCommand(options);
      },
    ),
  );

  context.subscriptions.push(
    commands.registerCommand('ai-watch.convertTimezone', (options: ConvertTimezoneOptions) => {
      return convertTimezoneCommand(options);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand('ai-watch.addTime', (options: AddTimeOptions) => {
      return addTimeCommand(options);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand('ai-watch.subtractTime', (options: SubtractTimeOptions) => {
      return subtractTimeCommand(options);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand('ai-watch.formatDuration', (options: FormatDurationOptions) => {
      return formatDurationCommand(options);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand('ai-watch.businessDay', (options: BusinessDayOptions) => {
      return businessDayCommand(options);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand('ai-watch.dateQuery', (options: DateQueryOptions) => {
      return dateQueryCommand(options);
    }),
  );
}
