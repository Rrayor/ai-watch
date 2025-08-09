import * as assert from 'assert';
import * as vscode from 'vscode';

/**
 * Integration tests for AI Watch extension
 *
 * These tests verify that the modular architecture works together correctly
 * and that all commands and tools are properly registered and functional.
 */
suite('AI Watch Integration Tests', () => {
  test('All VS Code commands should be registered and functional', async () => {
    const commands = [
      'ai-watch.getCurrentDate',
      'ai-watch.addTime',
      'ai-watch.subtractTime',
      'ai-watch.calculateDifference',
      'ai-watch.convertTimezone',
      'ai-watch.formatDuration',
      'ai-watch.businessDay',
      'ai-watch.dateQuery',
    ];

    for (const commandName of commands) {
      // Test that command is registered
      const allCommands = await vscode.commands.getCommands();
      assert.ok(allCommands.includes(commandName), `Command ${commandName} should be registered`);
    }
  });

  test('getCurrentDate command should work end-to-end', async () => {
    const result = await vscode.commands.executeCommand('ai-watch.getCurrentDate');

    assert.ok(result);
    assert.ok((result as any).iso);
    assert.ok((result as any).utc);
    assert.ok((result as any).local);

    // Validate ISO format
    const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    assert.ok(isoPattern.test((result as any).iso));
  });

  test('getCurrentDate with timezone should work end-to-end', async () => {
    const options = { timezone: 'Asia/Tokyo' };
    const result = await vscode.commands.executeCommand('ai-watch.getCurrentDate', options);

    assert.ok(result);
    assert.ok((result as any).formatted);
    assert.strictEqual((result as any).timezone, 'Asia/Tokyo');
  });

  test('addTime command should work end-to-end', async () => {
    const options = { hours: 2, minutes: 30 };
    const result = await vscode.commands.executeCommand('ai-watch.addTime', options);

    assert.ok(result);
    assert.ok((result as any).iso);
    assert.ok((result as any).local);

    // Verify time was actually added
    const resultDate = new Date((result as any).iso);
    const now = new Date();
    const timeDiff = resultDate.getTime() - now.getTime();

    // Should be approximately 2.5 hours in the future (allow some tolerance)
    const expectedDiff = (2 * 60 + 30) * 60 * 1000; // 2.5 hours in ms
    const tolerance = 60 * 1000; // 1 minute tolerance

    assert.ok(
      Math.abs(timeDiff - expectedDiff) < tolerance,
      `Time difference should be approximately 2.5 hours, got ${timeDiff}ms`,
    );
  });

  test('calculateDifference command should work end-to-end', async () => {
    const options = {
      from: '2025-08-01T00:00:00Z',
      to: '2025-08-10T12:30:45Z',
    };
    const result = await vscode.commands.executeCommand('ai-watch.calculateDifference', options);

    assert.ok(result);
    assert.ok(typeof (result as any).days === 'number');
    assert.ok(typeof (result as any).hours === 'number');
    assert.ok(typeof (result as any).minutes === 'number');
    assert.ok(typeof (result as any).seconds === 'number');

    // Verify calculation is approximately correct
    assert.strictEqual((result as any).days, 9);
  });

  test('convertTimezone command should work end-to-end', async () => {
    const options = {
      date: '2025-08-10T15:30:00Z',
      toTimezone: 'America/New_York',
    };
    const result = await vscode.commands.executeCommand('ai-watch.convertTimezone', options);

    assert.ok(result);
    assert.ok((result as any).formatted);
    assert.strictEqual((result as any).toTimezone, 'America/New_York');
    assert.ok((result as any).originalISO);
  });

  test('formatDuration command should work end-to-end', async () => {
    const options = {
      from: '2025-08-10T12:00:00Z',
      to: '2025-08-10T14:30:00Z',
    };
    const result = await vscode.commands.executeCommand('ai-watch.formatDuration', options);

    assert.ok(result);
    assert.ok((result as any).formatted);

    // Should mention 2 hours and 30 minutes
    const formatted = (result as any).formatted;
    assert.ok(formatted.includes('2') && formatted.includes('hour'));
    assert.ok(formatted.includes('30') && formatted.includes('minute'));
  });

  test('businessDay command should work end-to-end', async () => {
    // Test isBusinessDay operation
    const options = {
      operation: 'isBusinessDay',
      date: '2025-08-11T10:00:00Z', // Monday
    };
    const result = await vscode.commands.executeCommand('ai-watch.businessDay', options);

    assert.ok(result);
    assert.strictEqual((result as any).isBusinessDay, true);
    assert.ok((result as any).date);
  });

  test('businessDay addBusinessDays should work end-to-end', async () => {
    const options = {
      operation: 'addBusinessDays',
      date: '2025-08-08T10:00:00Z', // Friday
      days: 1,
    };
    const result = await vscode.commands.executeCommand('ai-watch.businessDay', options);

    assert.ok(result);
    assert.ok((result as any).result);

    // Adding 1 business day to Friday should give Monday
    const resultDate = new Date((result as any).result);
    assert.strictEqual(resultDate.getDay(), 1); // Monday
  });

  test('dateQuery command should work end-to-end', async () => {
    const options = {
      baseDate: '2025-08-13T10:00:00Z', // Wednesday
      queries: [{ type: 'nextWeekday', weekday: 'friday' }],
    };
    const result = await vscode.commands.executeCommand('ai-watch.dateQuery', options);

    assert.ok(result);
    assert.ok((result as any).date);

    // Next Friday from Wednesday should be Friday
    const resultDate = new Date((result as any).date);
    assert.strictEqual(resultDate.getDay(), 5); // Friday
  });

  test('Commands should handle invalid input gracefully', async () => {
    // Test invalid timezone
    const invalidTzResult = await vscode.commands.executeCommand('ai-watch.getCurrentDate', {
      timezone: 'Invalid/Timezone',
    });

    // Should not throw, should include error information
    assert.ok(invalidTzResult);
    assert.ok((invalidTzResult as any).error || (invalidTzResult as any).iso);

    // Test invalid date format
    const invalidDateResult = await vscode.commands.executeCommand('ai-watch.addTime', {
      date: 'not-a-date',
      hours: 1,
    });

    // Should handle gracefully (either error or fallback behavior)
    assert.ok(invalidDateResult);
  });

  test('Commands should be consistent across multiple calls', async () => {
    // Multiple calls to getCurrentDate should return consistent formats
    const results = await Promise.all([
      vscode.commands.executeCommand('ai-watch.getCurrentDate'),
      vscode.commands.executeCommand('ai-watch.getCurrentDate'),
      vscode.commands.executeCommand('ai-watch.getCurrentDate'),
    ]);

    results.forEach((result) => {
      assert.ok((result as any).iso);
      assert.ok((result as any).utc);
      assert.ok((result as any).local);

      // All should have same format patterns
      const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      assert.ok(isoPattern.test((result as any).iso));
    });
  });

  test('Time calculations should be mathematically correct', async () => {
    const baseDate = '2025-08-10T12:00:00Z';

    // Add 2 hours then subtract 2 hours should return to original
    const addResult = await vscode.commands.executeCommand('ai-watch.addTime', {
      baseTime: baseDate,
      hours: 2,
    });

    const subtractResult = await vscode.commands.executeCommand('ai-watch.subtractTime', {
      baseTime: (addResult as any).iso,
      hours: 2,
    });

    // Should be back to approximately the original time
    const originalTime = new Date(baseDate).getTime();
    const finalTime = new Date((subtractResult as any).iso).getTime();
    const timeDiff = Math.abs(finalTime - originalTime);

    // Allow small tolerance for floating point precision
    assert.ok(timeDiff < 1000, 'Round trip calculation should return to original time');
  });

  test('Business day calculations should respect weekends', async () => {
    // Start on Friday, add 1 business day should skip weekend
    const fridayResult = await vscode.commands.executeCommand('ai-watch.businessDay', {
      operation: 'addBusinessDays',
      date: '2025-08-15T10:00:00Z', // Friday
      days: 1,
    });

    const resultDate = new Date((fridayResult as any).result);
    assert.strictEqual(resultDate.getDay(), 1); // Should be Monday, not Saturday

    // Verify Saturday and Sunday are not business days
    const saturdayResult = await vscode.commands.executeCommand('ai-watch.businessDay', {
      operation: 'isBusinessDay',
      date: '2025-08-16T10:00:00Z', // Saturday
    });

    const sundayResult = await vscode.commands.executeCommand('ai-watch.businessDay', {
      operation: 'isBusinessDay',
      date: '2025-08-17T10:00:00Z', // Sunday
    });

    assert.strictEqual((saturdayResult as any).isBusinessDay, false);
    assert.strictEqual((sundayResult as any).isBusinessDay, false);
  });

  test('Extension should handle concurrent command execution', async () => {
    // Execute multiple commands concurrently
    const promises = [
      vscode.commands.executeCommand('ai-watch.getCurrentDate'),
      vscode.commands.executeCommand('ai-watch.addTime', { hours: 1 }),
      vscode.commands.executeCommand('ai-watch.calculateDifference', {
        from: '2025-08-01T00:00:00Z',
        to: '2025-08-02T00:00:00Z',
      }),
      vscode.commands.executeCommand('ai-watch.formatDuration', {
        from: '2025-08-01T00:00:00Z',
        to: '2025-08-01T02:00:00Z',
      }),
    ];

    const results = await Promise.all(promises);

    // All commands should complete successfully
    results.forEach((result, index) => {
      assert.ok(result, `Command ${index} should return a result`);
    });

    // Verify specific results
    assert.ok((results[0] as any).iso); // getCurrentDate
    assert.ok((results[1] as any).iso); // addTime
    assert.ok(typeof (results[2] as any).days === 'number'); // calculateDifference
    assert.ok((results[3] as any).formatted); // formatDuration
  });
});
