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

import { ExtensionContext } from 'vscode';
import { registerChatTools, registerCommands } from './registration';

// Export organized namespaces to avoid conflicts
export * as Types from './types';
export * as Tools from './tools';
export * as Commands from './commands';
export * as Utils from './utils';

/**
 * Activates the AI Watch extension.
 * Registers all Language Model Tools and VS Code commands.
 *
 * @param context - VS Code extension context
 */
export function activate(context: ExtensionContext): void {
  registerChatTools(context);
  registerCommands(context);
}

/**
 * Deactivates the AI Watch extension.
 * Cleanup is handled automatically by VS Code through the context subscriptions.
 */
export function deactivate(): void {
  // Cleanup is handled automatically by VS Code through context subscriptions
}
