/**
 * Tests for the addTime command
 *
 * This test suite validates the addTime command which adds time durations
 * to the current date. Tests are based on documented behavior from
 * CONFIGURATION.md and API_REFERENCE.md.
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { addTimeCommand } from '../../commands/addTime';
import { AddTimeResult } from '../../types';

/**
 * Type guard to check if AddTimeResult is successful (not an error)
 */
function isSuccessResult(result: AddTimeResult): result is AddTimeResult & {
  iso: string;
  utc: string;
  baseTime: string;
} {
  return !('error' in result) && !!result.iso && !!result.utc && !!result.baseTime;
}

suite('addTime Command Tests', () => {
  test('should add hours and minutes correctly', async () => {
    const options = {
      hours: 4,
      minutes: 30,
    };

    const result = addTimeCommand(options);

    assert.ok(result);
    assert.ok(result.iso);
    assert.ok(result.local);
    assert.ok(result.utc);
    assert.ok(result.baseTime);

    // Verify the result is properly formatted
    assert.ok(typeof result.iso === 'string');
    assert.ok(typeof result.local === 'string');
    assert.ok(typeof result.utc === 'string');
    assert.ok(typeof result.baseTime === 'string');

    // Verify ISO format
    assert.ok(result.iso.includes('T'));
    assert.ok(result.iso.endsWith('Z'));
  });

  test('should add weeks and days correctly', async () => {
    const options = {
      weeks: 2,
      days: 3,
    };

    const result = addTimeCommand(options);

    assert.ok(result);
    assert.ok(result.iso);
    assert.ok(result.local);
    assert.ok(result.utc);

    // Verify dates are valid
    assert.ok(result.baseTime, 'baseTime should be defined');
    assert.ok(result.iso, 'iso should be defined');
    const originalDate = new Date(result.baseTime);
    const resultDate = new Date(result.iso);

    // Should be 17 days later (2 weeks = 14 days + 3 days)
    const diffMs = resultDate.getTime() - originalDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    assert.strictEqual(Math.round(diffDays), 17);
  });

  test('should add mixed time units correctly', async () => {
    const options = {
      years: 1,
      months: 2,
      weeks: 1,
      days: 3,
      hours: 4,
      minutes: 30,
      seconds: 45,
    };

    const result = addTimeCommand(options);

    assert.ok(result);
    if (!isSuccessResult(result)) {
      assert.fail(`Unexpected error: ${result.error || 'Unknown error'}`);
    }

    assert.ok(result.iso);
    assert.ok(result.local);
    assert.ok(result.utc);
    assert.ok(result.baseTime);

    // Verify all time units are included in calculation
    const originalDate = new Date(result.baseTime);
    const resultDate = new Date(result.iso);

    // Result should be significantly later
    assert.ok(resultDate > originalDate);

    // Should be at least 1 year later
    const yearDiff = resultDate.getFullYear() - originalDate.getFullYear();
    assert.ok(yearDiff >= 1);
  });

  test('should handle zero values gracefully', async () => {
    const options = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    const result = addTimeCommand(options);

    assert.ok(result);
    if (!isSuccessResult(result)) {
      assert.fail(`Unexpected error: ${result.error || 'Unknown error'}`);
    }

    // Result should be the same as original time
    const originalDate = new Date(result.baseTime);
    const resultDate = new Date(result.iso);

    // Should be very close (within a few milliseconds for processing time)
    const diffMs = Math.abs(resultDate.getTime() - originalDate.getTime());
    assert.ok(diffMs < 1000); // Less than 1 second difference
  });

  test('should handle negative values by subtracting', async () => {
    const options = {
      hours: -2,
      minutes: -30,
    };

    const result = addTimeCommand(options);

    assert.ok(result);
    if (!isSuccessResult(result)) {
      assert.fail(`Unexpected error: ${result.error || 'Unknown error'}`);
    }

    // Result should be earlier than original
    const originalDate = new Date(result.baseTime);
    const resultDate = new Date(result.iso);

    assert.ok(resultDate < originalDate);

    // Should be 2.5 hours earlier
    const diffMs = originalDate.getTime() - resultDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    assert.ok(Math.abs(diffHours - 2.5) < 0.1); // Within 6 minutes tolerance
  });

  test('should work via VS Code command API', async () => {
    const options = {
      hours: 1,
      minutes: 15,
    };

    const result = await vscode.commands.executeCommand('ai-watch.addTime', options);

    assert.ok(result);
    const typedResult = result as AddTimeResult;
    if (!isSuccessResult(typedResult)) {
      assert.fail(`Unexpected error: ${typedResult.error || 'Unknown error'}`);
    }
    assert.ok(typedResult.iso);
    assert.ok(typedResult.local);
    assert.ok(typedResult.utc);
    assert.ok(typedResult.baseTime);
  });

  test('should include proper metadata in result', async () => {
    const options = {
      days: 1,
      hours: 12,
    };

    const result = addTimeCommand(options);

    assert.ok(result);
    assert.ok(isSuccessResult(result), 'Result should be successful');

    // Should include all required fields
    assert.ok('iso' in result);
    assert.ok('local' in result);
    assert.ok('utc' in result);
    assert.ok('baseTime' in result);

    // Formats should be different but valid
    assert.notStrictEqual(result.iso, result.local);
    assert.notStrictEqual(result.iso, result.utc);

    // All should be valid date strings
    assert.ok(!isNaN(Date.parse(result.iso)));
    assert.ok(!isNaN(Date.parse(result.utc)));
    assert.ok(!isNaN(Date.parse(result.baseTime)));
  });

  test('should handle large time additions', async () => {
    const options = {
      years: 5,
      days: 1000,
      hours: 10000,
    };

    const result = addTimeCommand(options);

    assert.ok(result);
    if (!isSuccessResult(result)) {
      assert.fail(`Unexpected error: ${result.error || 'Unknown error'}`);
    }

    // Should handle large values without error
    const originalDate = new Date(result.baseTime);
    const resultDate = new Date(result.iso);

    // Should be many years in the future
    const yearDiff = resultDate.getFullYear() - originalDate.getFullYear();
    assert.ok(yearDiff >= 7); // At least 5 years + additional from days/hours
  });

  test('should preserve timezone information correctly', async () => {
    const options = {
      hours: 6,
    };

    const result = addTimeCommand(options);

    assert.ok(result);
    if (!isSuccessResult(result)) {
      assert.fail(`Unexpected error: ${result.error || 'Unknown error'}`);
    }

    // ISO should always be in UTC (end with Z)
    assert.ok(result.iso.endsWith('Z'));

    // UTC format should be explicitly UTC with suffix
    assert.ok(result.utc.includes('UTC'));

    // Local format should be different from UTC (unless user is in UTC)
    // This test may vary based on system timezone
    assert.ok(typeof result.local === 'string');
  });
});
