import * as vscode from 'vscode';

export function registerChatTools(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.lm.registerTool('copilot-watch_getCurrentDate', new GetCurrentDateTool()));
}

interface IGetCurrentDateParameters {
	// No parameters needed for this tool
}

function formatUTC(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = date.getUTCFullYear();
  const m = pad(date.getUTCMonth() + 1);
  const d = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const mm = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

export class GetCurrentDateTool implements vscode.LanguageModelTool<IGetCurrentDateParameters> {
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<IGetCurrentDateParameters>,
		_token: vscode.CancellationToken
	) {
		const now = new Date();
		const result = {
			iso: now.toISOString(),
			utc: formatUTC(now)
		};

		const message = `Current date and time:\n- ISO format: ${result.iso}\n- UTC format: ${result.utc}`;
		return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
	}

	async prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<IGetCurrentDateParameters>,
		_token: vscode.CancellationToken
	) {
		const confirmationMessages = {
			title: 'Get current date and time',
			message: new vscode.MarkdownString('Get the current date and time in ISO and UTC formats?'),
		};

		return {
			invocationMessage: 'Getting current date and time',
			confirmationMessages,
		};
	}
}

export function activate(context: vscode.ExtensionContext) {
	registerChatTools(context);
}

export function deactivate() {}