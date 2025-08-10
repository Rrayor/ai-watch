/**
 * Language Model Tools registration for AI Watch extension.
 */

import { ExtensionContext, lm } from 'vscode';
import {
  GetCurrentDateTool,
  CalculateDifferenceTool,
  ConvertTimezoneTool,
  AddTimeTool,
  SubtractTimeTool,
  FormatDurationTool,
  BusinessDayTool,
  DateQueryTool,
} from '../tools';

/**
 * Registers all Language Model Tools with VS Code for AI assistant integration.
 * These tools enable AI assistants to perform sophisticated date/time operations.
 *
 * @param context - VS Code extension context for managing subscriptions
 */
export function registerChatTools(context: ExtensionContext): void {
  context.subscriptions.push(lm.registerTool('ai-watch_getCurrentDate', new GetCurrentDateTool()));
  context.subscriptions.push(
    lm.registerTool('ai-watch_calculateDifference', new CalculateDifferenceTool()),
  );
  context.subscriptions.push(
    lm.registerTool('ai-watch_convertTimezone', new ConvertTimezoneTool()),
  );
  context.subscriptions.push(lm.registerTool('ai-watch_addTime', new AddTimeTool()));
  context.subscriptions.push(lm.registerTool('ai-watch_subtractTime', new SubtractTimeTool()));
  context.subscriptions.push(lm.registerTool('ai-watch_formatDuration', new FormatDurationTool()));
  context.subscriptions.push(lm.registerTool('ai-watch_businessDay', new BusinessDayTool()));
  context.subscriptions.push(lm.registerTool('ai-watch_dateQuery', new DateQueryTool()));
}
