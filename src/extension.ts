/**
 * AI Watch Extension
 *
 * Provides comprehensive date and time manipulation tools for AI assistants and VS Code.
 * Enables AI-assisted development workflows with accurate timezone handling, business day
 * calculations, duration formatting, and advanced date queries.
 *
 * @author Benjamin Simon
 * @version 1.0.0
 */

import * as vscode from 'vscode';
import { registerChatTools, registerCommands } from './registration';

// Export all types for external use
export * from './types';

// Export all tools for testing and external use
export * from './tools';

// Export all commands for external use
export * from './commands';

// Export all utilities for external use
export * from './utils';

/**
 * Activates the AI Watch extension.
 * Registers all Language Model Tools and VS Code commands.
 *
 * @param context - VS Code extension context
 */
export function activate(context: vscode.ExtensionContext) {
  registerChatTools(context);
  registerCommands(context);
}

/**
 * Deactivates the AI Watch extension.
 * Cleanup is handled automatically by VS Code through the context subscriptions.
 */
export function deactivate() {
  // Cleanup is handled automatically by VS Code through context subscriptions
}
