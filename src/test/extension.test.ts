import * as assert from 'assert';

import * as vscode from 'vscode';
import { GetCurrentDateTool, CalculateDifferenceTool, ConvertTimezoneTool, AddTimeTool, SubtractTimeTool, FormatDurationTool, BusinessDayTool, DateQueryTool } from '../extension';

suite('AI Watch Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('GetCurrentDateTool should work without parameters', async () => {
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

	test('GetCurrentDateTool should work with timezone parameter', async () => {
		const tool = new GetCurrentDateTool();
		const mockOptions = {
			input: { timezone: 'America/New_York' }
		} as vscode.LanguageModelToolInvocationOptions<{ timezone: string }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		assert.ok(textContent.includes('America/New_York:'));
	});

	test('GetCurrentDateTool prepareInvocation should work', async () => {
		const tool = new GetCurrentDateTool();
		const mockOptions = {
			input: {}
		} as vscode.LanguageModelToolInvocationPrepareOptions<{}>;
		
		const result = await tool.prepareInvocation(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		assert.strictEqual(result.invocationMessage, 'Get current date and time');
		assert.ok(result.confirmationMessages);
		assert.strictEqual(result.confirmationMessages.title, 'Get current date and time');
	});

	test('CalculateDifferenceTool should work', async () => {
		const tool = new CalculateDifferenceTool();
		const mockOptions = {
			input: { 
				from: '2025-08-01T00:00:00Z',
				to: '2025-08-09T12:00:00Z'
			}
		} as vscode.LanguageModelToolInvocationOptions<{ from: string, to: string }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		assert.ok(textContent.includes('Time difference between'));
		assert.ok(textContent.includes('Days:'));
		assert.ok(textContent.includes('Hours:'));
		assert.ok(textContent.includes('Minutes:'));
		assert.ok(textContent.includes('Seconds:'));
	});

	test('ConvertTimezoneTool should work', async () => {
		const tool = new ConvertTimezoneTool();
		const mockOptions = {
			input: { 
				date: '2025-08-09T13:37:01Z',
				toTimezone: 'Asia/Tokyo'
			}
		} as vscode.LanguageModelToolInvocationOptions<{ date: string, toTimezone: string }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		assert.ok(textContent.includes('Converted'));
		assert.ok(textContent.includes('Asia/Tokyo'));
		assert.ok(textContent.includes('Formatted:'));
		assert.ok(textContent.includes('Original ISO:'));
	});

	test('AddTimeTool should work', async () => {
		const tool = new AddTimeTool();
		const mockOptions = {
			input: { 
				hours: 4,
				minutes: 2
			}
		} as vscode.LanguageModelToolInvocationOptions<{ hours: number, minutes: number }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		assert.ok(textContent.includes('Adding 4 hours, 2 minutes'));
		assert.ok(textContent.includes('Result:'));
		assert.ok(textContent.includes('ISO format:'));
	});

	test('Commands should be registered', async () => {
		// Test that commands work
		const getCurrentDateResult = await vscode.commands.executeCommand('ai-watch.getCurrentDate');
		assert.ok(getCurrentDateResult);
		assert.ok((getCurrentDateResult as any).iso);
		assert.ok((getCurrentDateResult as any).utc);

		const calculateDifferenceResult = await vscode.commands.executeCommand('ai-watch.calculateDifference', {
			from: '2025-08-01T00:00:00Z',
			to: '2025-08-09T12:00:00Z'
		});
		assert.ok(calculateDifferenceResult);
		assert.ok(typeof (calculateDifferenceResult as any).days === 'number');

		const convertTimezoneResult = await vscode.commands.executeCommand('ai-watch.convertTimezone', {
			date: '2025-08-09T13:37:01Z',
			toTimezone: 'Asia/Tokyo'
		});
		assert.ok(convertTimezoneResult);
		assert.ok((convertTimezoneResult as any).formatted);
		assert.ok((convertTimezoneResult as any).toTimezone);

		const addTimeResult = await vscode.commands.executeCommand('ai-watch.addTime', {
			hours: 4,
			minutes: 2
		});
		assert.ok(addTimeResult);
		assert.ok((addTimeResult as any).iso);
		assert.ok((addTimeResult as any).local);
	});

	test('SubtractTimeTool should work with time parameters', async () => {
		const tool = new SubtractTimeTool();
		const mockOptions = {
			input: { weeks: 4, hours: 2, minutes: 64 }
		} as vscode.LanguageModelToolInvocationOptions<{ weeks: number; hours: number; minutes: number }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		assert.ok(result.content);
		assert.strictEqual(result.content.length, 1);
		assert.ok(result.content[0] instanceof vscode.LanguageModelTextPart);
		
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		assert.ok(textContent.includes('Time calculation result:'));
		assert.ok(textContent.includes('Base time:'));
		assert.ok(textContent.includes('Result:'));
	});

	test('SubtractTimeTool prepareInvocation should work', async () => {
		const tool = new SubtractTimeTool();
		const mockOptions = {
			input: { weeks: 4, hours: 2, minutes: 64 }
		} as vscode.LanguageModelToolInvocationPrepareOptions<{ weeks: number; hours: number; minutes: number }>;
		
		const result = await tool.prepareInvocation(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		assert.ok(result.invocationMessage);
		const invocationMessage = result.invocationMessage as string;
		assert.ok(invocationMessage.includes('Subtracting'));
		assert.ok(invocationMessage.includes('4 weeks'));
		assert.ok(invocationMessage.includes('2 hours'));
		assert.ok(invocationMessage.includes('64 minutes'));
	});

	test('FormatDurationTool should work with basic duration', async () => {
		const tool = new FormatDurationTool();
		const mockOptions = {
			input: {
				from: '2025-08-01T00:00:00Z',
				to: '2025-08-09T13:37:01Z'
			}
		} as vscode.LanguageModelToolInvocationOptions<{ from: string; to: string }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		const parsed = JSON.parse(textContent);
		assert.ok(parsed.formatted);
		assert.ok(parsed.formatted.includes('8 days'));
	});

	test('FormatDurationTool should work with verbosity options', async () => {
		const tool = new FormatDurationTool();
		const mockOptions = {
			input: {
				from: '2025-08-01T00:00:00Z',
				to: '2025-08-01T04:30:00Z',
				verbosity: 'verbose' as const,
				maxUnits: 2
			}
		} as vscode.LanguageModelToolInvocationOptions<{ from: string; to: string; verbosity: 'verbose'; maxUnits: number }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		const parsed = JSON.parse(textContent);
		assert.ok(parsed.formatted);
		assert.ok(parsed.formatted.includes('4 hours'));
		assert.ok(parsed.formatted.includes('30 minutes'));
	});

	test('BusinessDayTool should check if date is business day', async () => {
		const tool = new BusinessDayTool();
		const mockOptions = {
			input: {
				operation: 'isBusinessDay' as const,
				date: '2025-08-11T10:00:00Z' // Monday
			}
		} as vscode.LanguageModelToolInvocationOptions<{ operation: 'isBusinessDay'; date: string }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		const parsed = JSON.parse(textContent);
		assert.ok(parsed.date);
		assert.strictEqual(parsed.isBusinessDay, true);
	});

	test('BusinessDayTool should add business days', async () => {
		const tool = new BusinessDayTool();
		const mockOptions = {
			input: {
				operation: 'addBusinessDays' as const,
				date: '2025-08-08T10:00:00Z', // Friday
				days: 3
			}
		} as vscode.LanguageModelToolInvocationOptions<{ operation: 'addBusinessDays'; date: string; days: number }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		const parsed = JSON.parse(textContent);
		assert.ok(parsed.date);
		assert.ok(parsed.result);
		// Adding 3 business days to Friday should give us Wednesday (skipping weekend)
		const resultDate = new Date(parsed.result);
		assert.strictEqual(resultDate.getDay(), 3); // Wednesday
	});

	test('BusinessDayTool should subtract business days', async () => {
		const tool = new BusinessDayTool();
		const mockOptions = {
			input: {
				operation: 'subtractBusinessDays' as const,
				date: '2025-08-13T10:00:00Z', // Wednesday
				days: 2
			}
		} as vscode.LanguageModelToolInvocationOptions<{ operation: 'subtractBusinessDays'; date: string; days: number }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		const parsed = JSON.parse(textContent);
		assert.ok(parsed.date);
		assert.ok(parsed.result);
		// Subtracting 2 business days from Wednesday should give us Monday
		const resultDate = new Date(parsed.result);
		assert.strictEqual(resultDate.getDay(), 1); // Monday
	});

	test('DateQueryTool should find next weekday', async () => {
		const tool = new DateQueryTool();
		const mockOptions = {
			input: {
				baseDate: '2025-08-11T10:00:00Z', // Monday
				queries: [{ type: 'nextWeekday', weekday: 'friday' }]
			}
		} as vscode.LanguageModelToolInvocationOptions<{ baseDate: string; queries: any[] }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		const parsed = JSON.parse(textContent);
		assert.ok(parsed.date);
		// Next Friday from Monday should be 4 days later
		const resultDate = new Date(parsed.date);
		assert.strictEqual(resultDate.getDay(), 5); // Friday
	});

	test('DateQueryTool should find previous weekday', async () => {
		const tool = new DateQueryTool();
		const mockOptions = {
			input: {
				baseDate: '2025-08-13T10:00:00Z', // Wednesday
				queries: [{ type: 'previousWeekday', weekday: 'monday' }]
			}
		} as vscode.LanguageModelToolInvocationOptions<{ baseDate: string; queries: any[] }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		const parsed = JSON.parse(textContent);
		assert.ok(parsed.date);
		// Previous Monday from Wednesday should be 2 days before
		const resultDate = new Date(parsed.date);
		assert.strictEqual(resultDate.getDay(), 1); // Monday
	});

	test('DateQueryTool should get start of period', async () => {
		const tool = new DateQueryTool();
		const mockOptions = {
			input: {
				baseDate: '2025-08-13T10:00:00Z', // Wednesday
				queries: [{ type: 'startOfPeriod', period: 'week' }]
			}
		} as vscode.LanguageModelToolInvocationOptions<{ baseDate: string; queries: any[] }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		const parsed = JSON.parse(textContent);
		assert.ok(parsed.date);
		// Start of week should be Monday
		const resultDate = new Date(parsed.date);
		assert.strictEqual(resultDate.getDay(), 1); // Monday
	});

	test('DateQueryTool should get end of period', async () => {
		const tool = new DateQueryTool();
		const mockOptions = {
			input: {
				baseDate: '2025-08-13T10:00:00Z', // Wednesday
				queries: [{ type: 'endOfPeriod', period: 'month' }]
			}
		} as vscode.LanguageModelToolInvocationOptions<{ baseDate: string; queries: any[] }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		const parsed = JSON.parse(textContent);
		assert.ok(parsed.date);
		// End of August should be August 31st
		const resultDate = new Date(parsed.date);
		assert.strictEqual(resultDate.getDate(), 31);
		assert.strictEqual(resultDate.getMonth(), 7); // August (0-indexed)
	});

	test('DateQueryTool should handle chained queries', async () => {
		const tool = new DateQueryTool();
		const mockOptions = {
			input: {
				baseDate: '2025-08-13T10:00:00Z', // Wednesday
				queries: [
					{ type: 'nextWeekday', weekday: 'friday' },
					{ type: 'nextWeekday', weekday: 'monday' }
				]
			}
		} as vscode.LanguageModelToolInvocationOptions<{ baseDate: string; queries: any[] }>;
		
		const result = await tool.invoke(mockOptions, { isCancellationRequested: false } as vscode.CancellationToken);
		
		assert.ok(result);
		const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;
		const parsed = JSON.parse(textContent);
		assert.ok(parsed.dates);
		assert.strictEqual(parsed.dates.length, 2);
		// First should be Friday, second should be Monday
		const firstDate = new Date(parsed.dates[0]);
		const secondDate = new Date(parsed.dates[1]);
		assert.strictEqual(firstDate.getDay(), 5); // Friday
		assert.strictEqual(secondDate.getDay(), 1); // Monday
	});

	test('All new commands should be registered', async () => {
		// Test format duration command
		const formatDurationResult = await vscode.commands.executeCommand('ai-watch.formatDuration', {
			from: '2025-08-01T00:00:00Z',
			to: '2025-08-01T04:30:00Z'
		});
		assert.ok(formatDurationResult);
		assert.ok((formatDurationResult as any).formatted);

		// Test business day command
		const businessDayResult = await vscode.commands.executeCommand('ai-watch.businessDay', {
			operation: 'isBusinessDay',
			date: '2025-08-11T10:00:00Z'
		});
		assert.ok(businessDayResult);
		assert.ok(typeof (businessDayResult as any).isBusinessDay === 'boolean');

		// Test date query command
		const dateQueryResult = await vscode.commands.executeCommand('ai-watch.dateQuery', {
			baseDate: '2025-08-13T10:00:00Z',
			queries: [{ type: 'nextWeekday', weekday: 'friday' }]
		});
		assert.ok(dateQueryResult);
		assert.ok((dateQueryResult as any).date);
	});
});
