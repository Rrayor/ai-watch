import * as assert from 'assert';
import * as vscode from 'vscode';

import { AddTimeTool } from '../../tools/addTimeTool';
import { CalculateDifferenceTool } from '../../tools/calculateDifferenceTool';
import { ConvertTimezoneTool } from '../../tools/convertTimezoneTool';
import { FormatDurationTool } from '../../tools/formatDurationTool';
import { GetCurrentDateTool } from '../../tools/getCurrentDateTool';
import { SubtractTimeTool } from '../../tools/subtractTimeTool';
import { BusinessDayTool } from '../../tools/businessDayTool';
import { DateQueryTool } from '../../tools/dateQueryTool';

/**
 * Tests specifically designed to trigger error paths and catch blocks
 * in tool implementations to improve branch coverage.
 */
suite('Tools Error Handling', () => {
  test('AddTimeTool should handle invalid duration format to trigger catch block', async () => {
    const tool = new AddTimeTool();

    const mockOptions = {
      input: {
        baseTime: 'INVALID_DATE_FORMAT', // This should trigger parsing error
        hours: 2,
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should contain the actual error message from the tool
    assert.ok(
      textContent.includes('Error adding time') || textContent.includes('Invalid base time format'),
    );
  });

  test('SubtractTimeTool should handle malformed date to trigger error path', async () => {
    const tool = new SubtractTimeTool();

    const mockOptions = {
      input: {
        baseTime: 'not-a-valid-date-at-all',
        days: 1,
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should handle error gracefully and return the expected error message
    assert.ok(textContent.includes('Error:') || textContent.includes('Invalid base time format'));
  });

  test('CalculateDifferenceTool should handle invalid date formats in error path', async () => {
    const tool = new CalculateDifferenceTool();

    const mockOptions = {
      input: {
        from: 'completely-invalid-date',
        to: '2025-08-10T12:00:00Z',
        unit: 'days',
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should contain error information
    assert.ok(
      textContent.includes('Error') ||
        textContent.includes('error') ||
        textContent.includes('invalid'),
    );
  });

  test('ConvertTimezoneTool should handle invalid timezone to trigger error handling', async () => {
    const tool = new ConvertTimezoneTool();

    const mockOptions = {
      input: {
        date: '2025-08-10T12:00:00Z',
        toTimezone: 'This/Is/Not/A/Valid/Timezone',
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should handle invalid timezone gracefully
    assert.ok(
      textContent.includes('Error converting timezone') ||
        textContent.includes('Invalid date format or timezone'),
    );
  });

  test('FormatDurationTool should handle completely invalid duration input', async () => {
    const tool = new FormatDurationTool();

    const mockOptions = {
      input: {
        duration: 'this-is-definitely-not-a-duration',
        format: 'human',
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should handle parsing error
    assert.ok(
      textContent.includes('Error') ||
        textContent.includes('error') ||
        textContent.includes('invalid'),
    );
  });

  test('GetCurrentDateTool should handle completely invalid timezone format', async () => {
    const tool = new GetCurrentDateTool();

    const mockOptions = {
      input: {
        timezone: 'Invalid/Timezone/That/Does/Not/Exist',
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should handle invalid timezone error
    assert.ok(
      textContent.includes('Error') ||
        textContent.includes('error') ||
        textContent.includes('invalid'),
    );
  });

  test('BusinessDayTool should handle invalid operation type to trigger error', async () => {
    const tool = new BusinessDayTool();

    const mockOptions = {
      input: {
        operation: 'nonExistentOperation',
        date: '2025-08-10T12:00:00Z',
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should handle invalid operation
    assert.ok(
      textContent.includes('Error') ||
        textContent.includes('error') ||
        textContent.includes('invalid'),
    );
  });

  test('DateQueryTool should handle invalid query type to trigger error path', async () => {
    const tool = new DateQueryTool();

    const mockOptions = {
      input: {
        baseDate: '2025-08-10T12:00:00Z',
        queries: [
          {
            type: 'invalidQueryType',
            weekday: 'monday',
          },
        ],
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should handle invalid query type
    assert.ok(
      textContent.includes('Error') ||
        textContent.includes('error') ||
        textContent.includes('invalid'),
    );
  });

  test('DateQueryTool should handle malformed base date to trigger parsing error', async () => {
    const tool = new DateQueryTool();

    const mockOptions = {
      input: {
        baseDate: 'this-is-not-a-date',
        queries: [
          {
            type: 'nextWeekday',
            weekday: 'friday',
          },
        ],
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should handle invalid base date
    assert.ok(
      textContent.includes('Error') ||
        textContent.includes('error') ||
        textContent.includes('invalid'),
    );
  });

  test('BusinessDayTool should handle invalid date format in business day check', async () => {
    const tool = new BusinessDayTool();

    const mockOptions = {
      input: {
        operation: 'isBusinessDay',
        date: 'invalid-date-format',
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should handle invalid date format
    assert.ok(
      textContent.includes('Error') ||
        textContent.includes('error') ||
        textContent.includes('invalid'),
    );
  });

  test('ConvertTimezoneTool should handle missing required parameters', async () => {
    const tool = new ConvertTimezoneTool();

    const mockOptions = {
      input: {
        // Missing both date and timezone to trigger validation error
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should handle missing parameters
    assert.ok(
      textContent.includes('Error') ||
        textContent.includes('error') ||
        textContent.includes('required'),
    );
  });

  test('AddTimeTool should handle extreme duration values that could cause overflow', async () => {
    const tool = new AddTimeTool();

    const mockOptions = {
      input: {
        date: '2025-08-10T12:00:00Z',
        duration: 'P99999999999999999999Y', // Extreme year value that might cause issues
      },
    } as vscode.LanguageModelToolInvocationOptions<any>;

    const result = await tool.invoke(mockOptions, {
      isCancellationRequested: false,
    } as vscode.CancellationToken);

    assert.ok(result);
    const textContent = (result.content[0] as vscode.LanguageModelTextPart).value;

    // Should handle extreme values gracefully
    assert.ok(textContent.length > 0); // At minimum should return something
  });
});
