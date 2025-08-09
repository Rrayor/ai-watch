import * as assert from 'assert';

import * as vscode from 'vscode';
import { GetCurrentDateTool } from '../extension';

suite('Copilot Watch Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('GetCurrentDateTool should work', async () => {
		const tool = new GetCurrentDateTool();
		const mockOptions = {
			input: {}
		} as vscode.LanguageModelToolInvocationOptions<{}>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		assert.ok(result.content);
		assert.strictEqual(result.content.length, 1);
		assert.ok(result.content[0] instanceof vscode.LanguageModelTextPart);
		
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		assert.ok(textContent.includes('Current date and time:'));
		assert.ok(textContent.includes('ISO format:'));
		assert.ok(textContent.includes('UTC format:'));
	});

	test('GetCurrentDateTool prepareInvocation should work', async () => {
		const tool = new GetCurrentDateTool();
		const mockOptions = {
			input: {}
		} as vscode.LanguageModelToolInvocationPrepareOptions<{}>;
		
		const result = await tool.prepareInvocation(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		assert.strictEqual(result.invocationMessage, 'Getting current date and time');
		assert.ok(result.confirmationMessages);
		assert.strictEqual(result.confirmationMessages.title, 'Get current date and time');
	});
});
