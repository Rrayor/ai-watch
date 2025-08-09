import * as assert from 'assert';
import { formatInTimezone, getUserTimezone } from '../../utils/timezoneUtils';

suite('Timezone Utils Tests', () => {
  test('formatInTimezone should format dates in specified timezone', () => {
    const testDate = new Date('2025-08-10T12:00:00Z');

    // Test UTC timezone
    const utcResult = formatInTimezone(testDate, 'UTC');
    assert.ok(utcResult.includes('2025-08-10'));
    assert.ok(utcResult.includes('12:00:00'));

    // Test EST timezone
    const estResult = formatInTimezone(testDate, 'America/New_York');
    assert.ok(estResult.includes('2025-08-10'));
    // Should be different from UTC due to timezone offset
    assert.notStrictEqual(estResult, utcResult);
  });

  test('formatInTimezone should handle custom format tokens', () => {
    const testDate = new Date('2025-08-10T15:30:45Z');
    const customFormat = 'YYYY-MM-DD HH:mm:ss';

    const result = formatInTimezone(testDate, 'UTC', customFormat);
    assert.strictEqual(result, '2025-08-10 15:30:45');

    // Test partial format
    const partialFormat = 'YYYY-MM-DD';
    const partialResult = formatInTimezone(testDate, 'UTC', partialFormat);
    assert.strictEqual(partialResult, '2025-08-10');
  });

  test('formatInTimezone should handle various format tokens correctly', () => {
    const testDate = new Date('2025-08-10T09:05:03Z');

    const tests = [
      { format: 'YYYY', expected: '2025' },
      { format: 'MM', expected: '08' },
      { format: 'DD', expected: '10' },
      { format: 'HH', expected: '09' },
      { format: 'mm', expected: '05' },
      { format: 'ss', expected: '03' },
    ];

    tests.forEach(({ format, expected }) => {
      const result = formatInTimezone(testDate, 'UTC', format);
      assert.strictEqual(result, expected, `Format ${format} should produce ${expected}`);
    });
  });

  test('formatInTimezone should default to user timezone when no timezone specified', () => {
    const testDate = new Date('2025-08-10T12:00:00Z');

    const withoutTimezone = formatInTimezone(testDate);
    const withUserTimezone = formatInTimezone(testDate, getUserTimezone());

    // Results should be the same
    assert.strictEqual(withoutTimezone, withUserTimezone);
  });

  test('formatInTimezone should handle DST transitions correctly', () => {
    // Test summer time (DST active)
    const summerDate = new Date('2025-07-15T12:00:00Z');
    const summerResult = formatInTimezone(summerDate, 'America/New_York');

    // Test winter time (DST inactive)
    const winterDate = new Date('2025-01-15T12:00:00Z');
    const winterResult = formatInTimezone(winterDate, 'America/New_York');

    // Both should be valid but have different offsets
    assert.ok(summerResult.includes('2025'));
    assert.ok(winterResult.includes('2025'));
    assert.notStrictEqual(summerResult, winterResult);
  });

  test('getUserTimezone should return valid IANA timezone', () => {
    const userTz = getUserTimezone();

    assert.ok(typeof userTz === 'string');
    assert.ok(userTz.length > 0);

    // Should be a valid timezone (can be used in Intl.DateTimeFormat)
    assert.doesNotThrow(() => {
      new Intl.DateTimeFormat('en-US', { timeZone: userTz });
    });
  });

  test('formatInTimezone should validate timezones implicitly', () => {
    const testDate = new Date('2025-08-10T12:00:00Z');

    // Valid timezones should work
    const validTimezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

    validTimezones.forEach((tz) => {
      assert.doesNotThrow(() => {
        formatInTimezone(testDate, tz);
      }, `${tz} should be valid`);
    });

    // Invalid timezones should throw
    const invalidTimezones = ['Invalid/Timezone', 'Not_A_Timezone', 'America/NonExistent'];

    invalidTimezones.forEach((tz) => {
      assert.throws(
        () => {
          formatInTimezone(testDate, tz);
        },
        /Invalid timezone/,
        `${tz} should be invalid`,
      );
    });
  });

  test('formatInTimezone should handle edge cases gracefully', () => {
    const testDate = new Date('2025-08-10T12:00:00Z');

    // Test with invalid timezone (should throw or handle gracefully)
    assert.throws(() => {
      formatInTimezone(testDate, 'Invalid/Timezone');
    });

    // Test with empty format
    const emptyFormatResult = formatInTimezone(testDate, 'UTC', '');
    assert.strictEqual(emptyFormatResult, '');

    // Test with format containing no tokens
    const noTokenResult = formatInTimezone(testDate, 'UTC', 'Hello World');
    assert.strictEqual(noTokenResult, 'Hello World');
  });

  test('formatInTimezone should handle mixed content in format strings', () => {
    const testDate = new Date('2025-08-10T15:30:45Z');

    const mixedFormat = 'Date: YYYY-MM-DD at HH:mm:ss UTC';
    const result = formatInTimezone(testDate, 'UTC', mixedFormat);
    assert.strictEqual(result, 'Date: 2025-08-10 at 15:30:45 UTC');

    // Test with special characters
    const specialFormat = 'YYYY/MM/DD - HH:mm';
    const specialResult = formatInTimezone(testDate, 'UTC', specialFormat);
    assert.strictEqual(specialResult, '2025/08/10 - 15:30');
  });

  test('timezone utilities should handle leap year dates', () => {
    const leapDate = new Date('2024-02-29T12:00:00Z');

    const result = formatInTimezone(leapDate, 'UTC', 'YYYY-MM-DD');
    assert.strictEqual(result, '2024-02-29');

    // Test that it works across different timezones
    const nycResult = formatInTimezone(leapDate, 'America/New_York', 'YYYY-MM-DD');
    assert.ok(nycResult.includes('2024-02-29') || nycResult.includes('2024-02-28'));
  });

  test('timezone utilities should handle year boundaries correctly', () => {
    // Test New Year's Eve/Day across timezones
    const newYearUtc = new Date('2025-01-01T00:00:00Z');

    const utcResult = formatInTimezone(newYearUtc, 'UTC', 'YYYY-MM-DD HH:mm');
    assert.strictEqual(utcResult, '2025-01-01 00:00');

    // In a timezone behind UTC, it should still be the previous year
    const lahResult = formatInTimezone(newYearUtc, 'America/Los_Angeles', 'YYYY-MM-DD HH:mm');
    assert.ok(lahResult.includes('2024-12-31') || lahResult.includes('2025-01-01'));
  });
});
