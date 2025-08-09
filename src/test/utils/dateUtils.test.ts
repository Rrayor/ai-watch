import * as assert from 'assert';
import {
  formatUTC,
  parseISOString,
  calculateDateDifference,
  weekdayToNumber,
} from '../../utils/dateUtils';

suite('Date Utils Tests', () => {
  test('formatUTC should format Date to UTC string correctly', () => {
    const testDate = new Date('2025-08-10T12:30:45.123Z');
    const result = formatUTC(testDate);

    // Should match format 'YYYY-MM-DD HH:mm:ss'
    assert.strictEqual(result, '2025-08-10 12:30:45');

    // Test edge case: beginning of year
    const newYearDate = new Date('2025-01-01T00:00:00.000Z');
    const newYearResult = formatUTC(newYearDate);
    assert.strictEqual(newYearResult, '2025-01-01 00:00:00');

    // Test edge case: end of year
    const endYearDate = new Date('2025-12-31T23:59:59.999Z');
    const endYearResult = formatUTC(endYearDate);
    assert.strictEqual(endYearResult, '2025-12-31 23:59:59');
  });

  test('parseISOString should parse valid ISO strings correctly', () => {
    const validDates = [
      '2025-08-10T12:30:45.123Z',
      '2025-08-10T12:30:45Z',
      '2025-08-10T12:30:45.000Z',
      '2025-01-01T00:00:00Z',
      '2025-12-31T23:59:59Z',
    ];

    validDates.forEach((dateStr) => {
      const result = parseISOString(dateStr);
      assert.ok(result instanceof Date);
      assert.ok(!isNaN(result.getTime()));
      assert.strictEqual(result.toISOString(), dateStr);
    });
  });

  test('parseISOString should throw error for invalid dates', () => {
    const invalidDates = [
      'invalid-date',
      '2025-13-01T00:00:00Z', // Invalid month
      '2025-01-32T00:00:00Z', // Invalid day
      '2025-01-01T25:00:00Z', // Invalid hour
      '2025-01-01T12:60:00Z', // Invalid minute
      '2025-01-01T12:30:60Z', // Invalid second
      '',
      'not-a-date',
    ];

    invalidDates.forEach((dateStr) => {
      assert.throws(
        () => parseISOString(dateStr),
        /Invalid date format/,
        `Should throw error for: ${dateStr}`,
      );
    });
  });

  test('calculateDateDifference should calculate positive differences correctly', () => {
    const from = new Date('2025-08-01T00:00:00Z');
    const to = new Date('2025-08-10T12:30:45Z');

    const result = calculateDateDifference(from, to);

    // Verify individual components
    assert.strictEqual(result.days, 9);
    assert.strictEqual(result.hours, 228); // 9 days * 24 hours + 12 hours
    assert.strictEqual(result.minutes, 13710); // 228 hours * 60 + 30 minutes
    assert.strictEqual(result.seconds, 822645); // 13710 minutes * 60 + 45 seconds
  });

  test('calculateDateDifference should calculate negative differences correctly', () => {
    const from = new Date('2025-08-10T12:30:45Z');
    const to = new Date('2025-08-01T00:00:00Z');

    const result = calculateDateDifference(from, to);

    // All values should be negative
    assert.strictEqual(result.days, -9);
    assert.strictEqual(result.hours, -228);
    assert.strictEqual(result.minutes, -13710);
    assert.strictEqual(result.seconds, -822645);
  });

  test('calculateDateDifference should handle same dates', () => {
    const date = new Date('2025-08-10T12:00:00Z');
    const result = calculateDateDifference(date, date);

    assert.strictEqual(result.days, 0);
    assert.strictEqual(result.hours, 0);
    assert.strictEqual(result.minutes, 0);
    assert.strictEqual(result.seconds, 0);
  });

  test('calculateDateDifference should handle millisecond precision', () => {
    const from = new Date('2025-08-10T12:00:00.000Z');
    const to = new Date('2025-08-10T12:00:00.500Z');

    const result = calculateDateDifference(from, to);

    // 500ms should round down to 0 seconds
    assert.strictEqual(result.seconds, 0);
    assert.strictEqual(result.minutes, 0);
    assert.strictEqual(result.hours, 0);
    assert.strictEqual(result.days, 0);
  });

  test('weekdayToNumber should handle full weekday names', () => {
    const weekdays = [
      { name: 'sunday', expected: 0 },
      { name: 'monday', expected: 1 },
      { name: 'tuesday', expected: 2 },
      { name: 'wednesday', expected: 3 },
      { name: 'thursday', expected: 4 },
      { name: 'friday', expected: 5 },
      { name: 'saturday', expected: 6 },
    ];

    weekdays.forEach(({ name, expected }) => {
      assert.strictEqual(weekdayToNumber(name), expected);
    });
  });

  test('weekdayToNumber should handle abbreviated weekday names', () => {
    const abbreviations = [
      { name: 'sun', expected: 0 },
      { name: 'mon', expected: 1 },
      { name: 'tue', expected: 2 },
      { name: 'wed', expected: 3 },
      { name: 'thu', expected: 4 },
      { name: 'fri', expected: 5 },
      { name: 'sat', expected: 6 },
    ];

    abbreviations.forEach(({ name, expected }) => {
      assert.strictEqual(weekdayToNumber(name), expected);
    });
  });

  test('weekdayToNumber should handle case variations', () => {
    const variations = [
      'MONDAY',
      'Monday',
      'monday',
      'MONDAY   ', // with trailing spaces
      '   monday', // with leading spaces
      ' Monday ', // with both
    ];

    variations.forEach((variation) => {
      assert.strictEqual(weekdayToNumber(variation), 1, `Failed for: "${variation}"`);
    });
  });

  test('weekdayToNumber should throw error for invalid weekdays', () => {
    const invalidWeekdays = [
      'invalid',
      'not-a-day',
      '',
      '123',
      'sundayy', // typo
      'mo', // too short
    ];

    invalidWeekdays.forEach((invalid) => {
      assert.throws(
        () => weekdayToNumber(invalid),
        /Invalid weekday/,
        `Should throw error for: ${invalid}`,
      );
    });
  });

  test('date utilities should handle leap year correctly', () => {
    // 2024 is a leap year
    const leapDate = new Date('2024-02-29T00:00:00Z');
    assert.ok(!isNaN(leapDate.getTime()));

    const formattedLeap = formatUTC(leapDate);
    assert.strictEqual(formattedLeap, '2024-02-29 00:00:00');

    // 2025 is not a leap year
    assert.throws(() => parseISOString('2025-02-29T00:00:00Z'));
  });

  test('date utilities should handle timezone boundaries correctly', () => {
    // Test UTC midnight
    const utcMidnight = new Date('2025-08-10T00:00:00Z');
    const formatted = formatUTC(utcMidnight);
    assert.strictEqual(formatted, '2025-08-10 00:00:00');

    // Test just before midnight
    const beforeMidnight = new Date('2025-08-09T23:59:59Z');
    const formattedBefore = formatUTC(beforeMidnight);
    assert.strictEqual(formattedBefore, '2025-08-09 23:59:59');
  });
});
