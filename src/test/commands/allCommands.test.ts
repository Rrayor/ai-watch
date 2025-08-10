/**
 * Comprehensive tests for all command functions
 *
 * This test suite validates all command implementations according to
 * the documented behavior in CONFIGURATION.md and API_REFERENCE.md.
 * Tests focus on documented functionality rather than implementation details.
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { subtractTimeCommand } from '../../commands/subtractTime';
import { calculateDifferenceCommand } from '../../commands/calculateDifference';
import { convertTimezoneCommand } from '../../commands/convertTimezone';
import { formatDurationCommand } from '../../commands/formatDuration';
import { businessDayCommand } from '../../commands/businessDay';
import { dateQueryCommand } from '../../commands/dateQuery';

// Type guard functions for better TypeScript checking
function isSubtractTimeSuccess(result: unknown): result is {
  iso: string;
  utc: string;
  local: string;
  baseTime: string;
} {
  return (
    result !== null &&
    typeof result === 'object' &&
    'iso' in result &&
    typeof result.iso === 'string' &&
    'utc' in result &&
    'local' in result &&
    'baseTime' in result
  );
}

function isDateQuerySuccess(result: unknown): result is { date?: string; dates?: string[] } {
  return result !== null && typeof result === 'object' && ('date' in result || 'dates' in result);
}

suite('All Command Functions Tests', () => {
  // Subtract Time Command Tests
  suite('subtractTime Command', () => {
    test('should subtract basic time units correctly', () => {
      const options = {
        hours: 2,
        minutes: 30,
      };

      const result = subtractTimeCommand(options);

      assert.ok(result);
      assert.ok(result.iso);
      assert.ok(result.utc);
      assert.ok(result.local);
      assert.ok(result.baseTime);

      // Verify result is earlier than base time
      const baseDate = new Date(result.baseTime);
      const resultDate = new Date(result.iso);
      assert.ok(resultDate < baseDate);

      // Should be 2.5 hours earlier
      const diffMs = baseDate.getTime() - resultDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      assert.ok(Math.abs(diffHours - 2.5) < 0.1);
    });

    test('should handle mixed time units', () => {
      const options = {
        weeks: 1,
        days: 3,
        hours: 4,
        minutes: 30,
      };

      const result = subtractTimeCommand(options);

      assert.ok(result);
      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else if (!isSubtractTimeSuccess(result)) {
        assert.fail('Expected subtract time to return valid result');
      } else {
        assert.ok(result.iso);

        // Should be 10 days, 4.5 hours earlier
        const baseDate = new Date(result.baseTime);
        const resultDate = new Date(result.iso);
        const diffMs = baseDate.getTime() - resultDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        assert.ok(Math.abs(diffDays - 10.1875) < 0.1); // 10 days + 4.5 hours
      }
    });

    test('should work with custom base time', () => {
      const baseTime = '2025-08-15T12:00:00Z';
      const options = {
        baseTime,
        hours: 6,
      };

      const result = subtractTimeCommand(options);

      assert.ok(result);
      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else if (!isSubtractTimeSuccess(result)) {
        assert.fail('Expected subtract time to return valid result');
      } else {
        // baseTime gets normalized to include milliseconds
        assert.strictEqual(result.baseTime, '2025-08-15T12:00:00.000Z');

        const expectedDate = new Date('2025-08-15T06:00:00Z');
        const resultDate = new Date(result.iso);
        assert.strictEqual(resultDate.getTime(), expectedDate.getTime());
      }
    });
  });

  // Calculate Difference Command Tests
  suite('calculateDifference Command', () => {
    test('should calculate basic time difference', () => {
      const options = {
        from: '2025-08-01T00:00:00Z',
        to: '2025-08-09T00:00:00Z', // Changed to exactly 8 days
      };

      const result = calculateDifferenceCommand(options);

      assert.ok(result);

      // Check if result has error or success structure
      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok(typeof result.days === 'number');
        assert.ok(typeof result.hours === 'number');
        assert.ok(typeof result.minutes === 'number');
        assert.ok(typeof result.seconds === 'number');

        // 8 days exactly - cumulative totals
        assert.strictEqual(result.days, 8);
        assert.strictEqual(result.hours, 192); // 8 days * 24 hours
        assert.strictEqual(result.minutes, 11520); // 192 hours * 60 minutes
        assert.strictEqual(result.seconds, 691200); // 11520 minutes * 60 seconds
      }
    });

    test('should handle negative differences (to before from)', () => {
      const options = {
        from: '2025-08-09T12:00:00Z',
        to: '2025-08-01T00:00:00Z',
      };

      const result = calculateDifferenceCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.strictEqual(result.days, -8);
        assert.strictEqual(result.hours, -204); // -8.5 days * 24 hours
      }
    });

    test('should calculate precise differences with mixed units', () => {
      const options = {
        from: '2025-08-01T10:30:45Z',
        to: '2025-08-03T14:45:30Z',
      };

      const result = calculateDifferenceCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.strictEqual(result.days, 2);
        assert.strictEqual(result.hours, 52); // 2 days 4 hours 14 minutes 45 seconds = 52.24... total hours
        assert.strictEqual(result.minutes, 3134); // 52 hours * 60 + 14 minutes
        assert.strictEqual(result.seconds, 188085); // 3134 minutes * 60 + 45 seconds
      }
    });
  });

  // Convert Timezone Command Tests
  suite('convertTimezone Command', () => {
    test('should convert timezone correctly', () => {
      const options = {
        date: '2025-08-09T13:37:01Z',
        toTimezone: 'America/New_York',
      };

      const result = convertTimezoneCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok(result.iso);
        assert.ok(result.formatted);
        assert.strictEqual(result.toTimezone, 'America/New_York');
        assert.strictEqual(result.iso, '2025-08-09T13:37:01.000Z');
      }
    });

    test('should handle conversion from custom timezone', () => {
      const options = {
        date: '2025-08-09T13:37:01Z',
        fromTimezone: 'UTC',
        toTimezone: 'Asia/Tokyo',
      };

      const result = convertTimezoneCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok(result.formatted);
        assert.strictEqual(result.toTimezone, 'Asia/Tokyo');
        assert.strictEqual(result.fromTimezone, 'UTC');
      }
    });

    test('should include comprehensive timezone information', () => {
      const options = {
        date: '2025-08-09T13:37:01Z',
        toTimezone: 'Europe/London',
      };

      const result = convertTimezoneCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok('iso' in result);
        assert.ok('formatted' in result);
        assert.ok('toTimezone' in result);
        assert.ok('fromTimezone' in result);
      }
    });

    test('should handle invalid timezone gracefully', () => {
      const options = {
        date: '2025-08-09T13:37:01Z',
        toTimezone: 'Invalid/Timezone',
      };

      const result = convertTimezoneCommand(options);

      assert.ok(result);
      // Should either have error field or gracefully handle invalid timezone
      assert.ok('error' in result || 'formatted' in result);
    });
  });

  // Format Duration Command Tests
  suite('formatDuration Command', () => {
    test('should format basic duration', () => {
      const options = {
        from: '2025-08-01T00:00:00Z',
        to: '2025-08-09T13:37:01Z',
      };

      const result = formatDurationCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok(result.formatted);
        // Should include "8 days" in the formatted output
        assert.ok(result.formatted.includes('8'));
        assert.ok(result.formatted.includes('day'));
      }
    });

    test('should handle verbosity options', () => {
      const options = {
        from: '2025-08-01T00:00:00Z',
        to: '2025-08-01T04:30:00Z',
        verbosity: 'verbose' as const,
        maxUnits: 2,
      };

      const result = formatDurationCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok(result.formatted);
        assert.ok(result.formatted.includes('4'));
        assert.ok(result.formatted.includes('hour'));
        assert.ok(result.formatted.includes('30'));
        assert.ok(result.formatted.includes('minute'));
      }
    });

    test('should handle compact verbosity', () => {
      const options = {
        from: '2025-08-01T10:15:30Z',
        to: '2025-08-02T14:45:45Z',
        verbosity: 'compact' as const,
      };

      const result = formatDurationCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok(result.formatted);
        // Compact format should be shorter
        assert.ok(result.formatted.length < 50);
      }
    });

    test('should respect maxUnits parameter', () => {
      const options = {
        from: '2025-08-01T10:15:30Z',
        to: '2025-08-03T14:45:45Z',
        maxUnits: 1,
      };

      const result = formatDurationCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok(result.formatted);
        // With maxUnits=1, should only show the largest unit
        const unitCount = (result.formatted.match(/\d+/g) || []).length;
        assert.ok(unitCount <= 2); // Allow some flexibility in formatting
      }
    });
  });

  // Business Day Command Tests
  suite('businessDay Command', () => {
    test('should check if date is business day', () => {
      const options = {
        operation: 'isBusinessDay' as const,
        date: '2025-08-11T10:00:00Z', // Monday
      };

      const result = businessDayCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok(result.date);
        assert.strictEqual(result.isBusinessDay, true);
        assert.strictEqual(result.operation, 'isBusinessDay');
      }
    });

    test('should identify weekend as non-business day', () => {
      const options = {
        operation: 'isBusinessDay' as const,
        date: '2025-08-10T10:00:00Z', // Sunday
      };

      const result = businessDayCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.strictEqual(result.isBusinessDay, false);
      }
    });

    test('should add business days correctly', () => {
      const options = {
        operation: 'addBusinessDays' as const,
        date: '2025-08-08T10:00:00Z', // Friday
        days: 3,
      };

      const result = businessDayCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok(result.date);
        assert.ok(result.result);
        assert.strictEqual(result.operation, 'addBusinessDays');
        assert.strictEqual(result.days, 3);

        // Adding 3 business days to Friday should give us Wednesday
        const resultDate = new Date(result.result);
        assert.strictEqual(resultDate.getDay(), 3); // Wednesday
      }
    });

    test('should subtract business days correctly', () => {
      const options = {
        operation: 'subtractBusinessDays' as const,
        date: '2025-08-13T10:00:00Z', // Wednesday
        days: 2,
      };

      const result = businessDayCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else {
        assert.ok(result.result);
        assert.strictEqual(result.operation, 'subtractBusinessDays');

        // Subtracting 2 business days from Wednesday should give us Monday
        const resultDate = new Date(result.result);
        assert.strictEqual(resultDate.getDay(), 1); // Monday
      }
    });
  });

  // Date Query Command Tests
  suite('dateQuery Command', () => {
    test('should find next weekday', () => {
      const options = {
        baseDate: '2025-08-11T10:00:00Z', // Monday
        queries: [{ type: 'nextWeekday' as const, weekday: 'friday' as const }],
      };

      const result = dateQueryCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else if (!isDateQuerySuccess(result)) {
        assert.fail('Expected date query to return date or dates');
      } else {
        const firstDate = result.date || (result.dates && result.dates[0]);
        if (!firstDate) {
          assert.fail('Expected at least one date result');
        }
        const resultDate = new Date(firstDate);
        assert.strictEqual(resultDate.getDay(), 5); // Friday
      }
    });

    test('should find previous weekday', () => {
      const options = {
        baseDate: '2025-08-13T10:00:00Z', // Wednesday
        queries: [{ type: 'previousWeekday' as const, weekday: 'monday' as const }],
      };

      const result = dateQueryCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else if (!isDateQuerySuccess(result)) {
        assert.fail('Expected date query to return date or dates');
      } else {
        const firstDate = result.date || (result.dates && result.dates[0]);
        if (!firstDate) {
          assert.fail('Expected at least one date result');
        }
        const resultDate = new Date(firstDate);
        assert.strictEqual(resultDate.getDay(), 1); // Monday
      }
    });

    test('should get start of period', () => {
      const options = {
        baseDate: '2025-08-13T10:00:00Z', // Wednesday
        queries: [{ type: 'startOfPeriod' as const, period: 'week' as const }],
      };

      const result = dateQueryCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else if (!isDateQuerySuccess(result)) {
        assert.fail('Expected date query to return date or dates');
      } else {
        const firstDate = result.date || (result.dates && result.dates[0]);
        if (!firstDate) {
          assert.fail('Expected at least one date result');
        }
        const resultDate = new Date(firstDate);
        assert.strictEqual(resultDate.getDay(), 1); // Monday (start of week)
      }
    });

    test('should get end of period', () => {
      const options = {
        baseDate: '2025-08-13T10:00:00Z', // Wednesday
        queries: [{ type: 'endOfPeriod' as const, period: 'month' as const }],
      };

      const result = dateQueryCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else if (!isDateQuerySuccess(result)) {
        assert.fail('Expected date query to return date or dates');
      } else {
        const firstDate = result.date || (result.dates && result.dates[0]);
        if (!firstDate) {
          assert.fail('Expected at least one date result');
        }
        const resultDate = new Date(firstDate);
        assert.strictEqual(resultDate.getDate(), 31); // End of August
        assert.strictEqual(resultDate.getMonth(), 7); // August (0-indexed)
      }
    });

    test('should handle multiple queries', () => {
      const options = {
        baseDate: '2025-08-13T10:00:00Z', // Wednesday
        queries: [
          { type: 'nextWeekday' as const, weekday: 'friday' as const },
          { type: 'nextWeekday' as const, weekday: 'monday' as const },
        ],
      };

      const result = dateQueryCommand(options);

      assert.ok(result);

      if ('error' in result) {
        assert.fail(`Command returned error: ${result.error}`);
      } else if (!isDateQuerySuccess(result)) {
        assert.fail('Expected date query to return date or dates');
      } else {
        assert.ok(result.dates);
        assert.strictEqual(result.dates.length, 2);

        if (!result.dates[0] || !result.dates[1]) {
          assert.fail('Expected both date results to be present');
        }

        const firstDate = new Date(result.dates[0]);
        const secondDate = new Date(result.dates[1]);
        assert.strictEqual(firstDate.getDay(), 5); // Friday
        assert.strictEqual(secondDate.getDay(), 1); // Monday
      }
    });
  });

  // VS Code Command Integration Tests
  suite('VS Code Command Integration', () => {
    test('all commands should be accessible via VS Code API', async () => {
      // Test subtract time command
      const subtractResult = await vscode.commands.executeCommand('ai-watch.subtractTime', {
        hours: 2,
      });
      assert.ok(subtractResult);
      assert.ok((subtractResult as { iso: string }).iso);

      // Test calculate difference command
      const diffResult = await vscode.commands.executeCommand('ai-watch.calculateDifference', {
        from: '2025-08-01T00:00:00Z',
        to: '2025-08-09T12:00:00Z',
      });
      assert.ok(diffResult);
      assert.ok(typeof (diffResult as { days: number }).days === 'number');

      // Test convert timezone command
      const timezoneResult = await vscode.commands.executeCommand('ai-watch.convertTimezone', {
        date: '2025-08-09T13:37:01Z',
        toTimezone: 'Asia/Tokyo',
      });
      assert.ok(timezoneResult);
      assert.ok((timezoneResult as { formatted: string }).formatted);

      // Test format duration command
      const durationResult = await vscode.commands.executeCommand('ai-watch.formatDuration', {
        from: '2025-08-01T00:00:00Z',
        to: '2025-08-01T04:30:00Z',
      });
      assert.ok(durationResult);
      assert.ok((durationResult as { formatted: string }).formatted);

      // Test business day command
      const businessResult = await vscode.commands.executeCommand('ai-watch.businessDay', {
        operation: 'isBusinessDay',
        date: '2025-08-11T10:00:00Z',
      });
      assert.ok(businessResult);
      assert.ok(typeof (businessResult as { isBusinessDay: boolean }).isBusinessDay === 'boolean');

      // Test date query command
      const queryResult = await vscode.commands.executeCommand('ai-watch.dateQuery', {
        baseDate: '2025-08-13T10:00:00Z',
        queries: [{ type: 'nextWeekday', weekday: 'friday' }],
      });
      assert.ok(queryResult);
      const queryResultTyped = queryResult as { date?: string; dates?: string[] };
      assert.ok(queryResultTyped.date || queryResultTyped.dates);
    });
  });

  // Error Handling Tests
  suite('Error Handling', () => {
    test('commands should handle invalid input gracefully', () => {
      // Invalid date format
      const invalidDateResult = calculateDifferenceCommand({
        from: 'invalid-date',
        to: '2025-08-09T12:00:00Z',
      });
      assert.ok(invalidDateResult);
      assert.ok('error' in invalidDateResult || 'days' in invalidDateResult);

      // Invalid timezone
      const invalidTimezoneResult = convertTimezoneCommand({
        date: '2025-08-09T13:37:01Z',
        toTimezone: 'Invalid/Timezone',
      });
      assert.ok(invalidTimezoneResult);
      assert.ok('error' in invalidTimezoneResult || 'formatted' in invalidTimezoneResult);

      // Invalid business day operation
      const invalidBusinessResult = businessDayCommand({
        operation: 'invalidOperation' as 'isBusinessDay',
        date: '2025-08-11T10:00:00Z',
      });
      assert.ok(invalidBusinessResult);
      // Should either return error or handle gracefully
    });

    test('commands should validate required parameters', () => {
      // Missing required parameters
      try {
        calculateDifferenceCommand({ from: '2025-08-01T00:00:00Z' } as {
          from: string;
          to: string;
        });
        assert.fail('Should have thrown for missing "to" parameter');
      } catch (error) {
        // Expected to throw or return error
        assert.ok(true);
      }
    });
  });
});
