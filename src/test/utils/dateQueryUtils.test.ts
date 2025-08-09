import * as assert from 'assert';
import {
  getNextWeekday,
  getPreviousWeekday,
  getStartOfPeriod,
  getEndOfPeriod,
} from '../../utils/dateQueryUtils';

suite('Date Query Utils Tests', () => {
  test('getNextWeekday should find next occurrence of specified weekday', () => {
    // Starting on Monday (2025-08-11), find next Friday
    const monday = new Date('2025-08-11T12:00:00Z');
    const nextFriday = getNextWeekday(monday, 'friday');

    assert.strictEqual(nextFriday.getUTCDay(), 5); // Friday
    assert.strictEqual(nextFriday.getUTCDate(), 15); // August 15th
    assert.strictEqual(nextFriday.getUTCMonth(), 7); // August (0-indexed)

    // Time should be preserved
    assert.strictEqual(nextFriday.getUTCHours(), 12);
    assert.strictEqual(nextFriday.getUTCMinutes(), 0);
  });

  test('getNextWeekday should handle wrap-around to next week', () => {
    // Starting on Friday (2025-08-15), find next Monday
    const friday = new Date('2025-08-15T12:00:00Z');
    const nextMonday = getNextWeekday(friday, 'monday');

    assert.strictEqual(nextMonday.getUTCDay(), 1); // Monday
    assert.strictEqual(nextMonday.getUTCDate(), 18); // August 18th (next week)
    assert.strictEqual(nextMonday.getMonth(), 7); // August (0-indexed)
  });

  test('getNextWeekday should handle same weekday (next occurrence)', () => {
    // Starting on Monday (2025-08-11), find next Monday
    const monday = new Date('2025-08-11T12:00:00Z');
    const nextMonday = getNextWeekday(monday, 'monday');

    // Should find next Monday, not the same day
    assert.strictEqual(nextMonday.getDay(), 1); // Monday
    assert.strictEqual(nextMonday.getDate(), 18); // August 18th (next week)
    assert.notStrictEqual(nextMonday.getDate(), 11); // Not the same day
  });

  test('getPreviousWeekday should find previous occurrence of specified weekday', () => {
    // Starting on Friday (2025-08-15), find previous Monday
    const friday = new Date('2025-08-15T12:00:00Z');
    const prevMonday = getPreviousWeekday(friday, 'monday');

    assert.strictEqual(prevMonday.getUTCDay(), 1); // Monday
    assert.strictEqual(prevMonday.getUTCDate(), 11); // August 11th
    assert.strictEqual(prevMonday.getUTCMonth(), 7); // August (0-indexed)

    // Time should be preserved
    assert.strictEqual(prevMonday.getUTCHours(), 12);
    assert.strictEqual(prevMonday.getMinutes(), 0);
  });

  test('getPreviousWeekday should handle wrap-around to previous week', () => {
    // Starting on Monday (2025-08-11), find previous Friday
    const monday = new Date('2025-08-11T12:00:00Z');
    const prevFriday = getPreviousWeekday(monday, 'friday');

    assert.strictEqual(prevFriday.getDay(), 5); // Friday
    assert.strictEqual(prevFriday.getDate(), 8); // August 8th (previous week)
    assert.strictEqual(prevFriday.getMonth(), 7); // August (0-indexed)
  });

  test('getPreviousWeekday should handle same weekday (previous occurrence)', () => {
    // Starting on Monday (2025-08-11), find previous Monday
    const monday = new Date('2025-08-11T12:00:00Z');
    const prevMonday = getPreviousWeekday(monday, 'monday');

    // Should find previous Monday, not the same day
    assert.strictEqual(prevMonday.getDay(), 1); // Monday
    assert.strictEqual(prevMonday.getDate(), 4); // August 4th (previous week)
    assert.notStrictEqual(prevMonday.getDate(), 11); // Not the same day
  });

  test('getStartOfPeriod should find start of week correctly', () => {
    // Test mid-week day (Wednesday, August 13)
    const wednesday = new Date('2025-08-13T15:30:45Z');
    const startOfWeek = getStartOfPeriod(wednesday, 'week');

    assert.strictEqual(startOfWeek.getDay(), 1); // Monday (start of week)
    assert.strictEqual(startOfWeek.getDate(), 11); // August 11th
    assert.strictEqual(startOfWeek.getHours(), 0); // Start of day
    assert.strictEqual(startOfWeek.getMinutes(), 0);
    assert.strictEqual(startOfWeek.getSeconds(), 0);
    assert.strictEqual(startOfWeek.getMilliseconds(), 0);
  });

  test('getStartOfPeriod should find start of month correctly', () => {
    // Test mid-month day (August 13)
    const midMonth = new Date('2025-08-13T15:30:45Z');
    const startOfMonth = getStartOfPeriod(midMonth, 'month');

    assert.strictEqual(startOfMonth.getDate(), 1); // 1st of month
    assert.strictEqual(startOfMonth.getMonth(), 7); // August (0-indexed)
    assert.strictEqual(startOfMonth.getHours(), 0); // Start of day
    assert.strictEqual(startOfMonth.getMinutes(), 0);
    assert.strictEqual(startOfMonth.getSeconds(), 0);
  });

  test('getStartOfPeriod should find start of year correctly', () => {
    // Test mid-year day
    const midYear = new Date('2025-08-13T15:30:45Z');
    const startOfYear = getStartOfPeriod(midYear, 'year');

    assert.strictEqual(startOfYear.getDate(), 1); // January 1st
    assert.strictEqual(startOfYear.getMonth(), 0); // January (0-indexed)
    assert.strictEqual(startOfYear.getFullYear(), 2025);
    assert.strictEqual(startOfYear.getHours(), 0); // Start of day
  });

  test('getStartOfPeriod should find start of day correctly', () => {
    // Test mid-day time
    const midDay = new Date('2025-08-13T15:30:45.123Z');
    const startOfDay = getStartOfPeriod(midDay, 'day');

    assert.strictEqual(startOfDay.getDate(), 13); // Same date
    assert.strictEqual(startOfDay.getMonth(), 7); // August (0-indexed)
    assert.strictEqual(startOfDay.getHours(), 0); // Start of day
    assert.strictEqual(startOfDay.getMinutes(), 0);
    assert.strictEqual(startOfDay.getSeconds(), 0);
    assert.strictEqual(startOfDay.getMilliseconds(), 0);
  });

  test('getEndOfPeriod should find end of week correctly', () => {
    // Test mid-week day (Wednesday, August 13)
    const wednesday = new Date('2025-08-13T15:30:45Z');
    const endOfWeek = getEndOfPeriod(wednesday, 'week');

    assert.strictEqual(endOfWeek.getDay(), 0); // Sunday (end of week)
    assert.strictEqual(endOfWeek.getDate(), 17); // August 17th
    assert.strictEqual(endOfWeek.getHours(), 23); // End of day
    assert.strictEqual(endOfWeek.getMinutes(), 59);
    assert.strictEqual(endOfWeek.getSeconds(), 59);
    assert.strictEqual(endOfWeek.getMilliseconds(), 999);
  });

  test('getEndOfPeriod should find end of month correctly', () => {
    // Test mid-month day (August 13)
    const midMonth = new Date('2025-08-13T15:30:45Z');
    const endOfMonth = getEndOfPeriod(midMonth, 'month');

    assert.strictEqual(endOfMonth.getDate(), 31); // August 31st
    assert.strictEqual(endOfMonth.getMonth(), 7); // August (0-indexed)
    assert.strictEqual(endOfMonth.getHours(), 23); // End of day
    assert.strictEqual(endOfMonth.getMinutes(), 59);
    assert.strictEqual(endOfMonth.getSeconds(), 59);
  });

  test('getEndOfPeriod should find end of year correctly', () => {
    // Test mid-year day
    const midYear = new Date('2025-08-13T15:30:45Z');
    const endOfYear = getEndOfPeriod(midYear, 'year');

    assert.strictEqual(endOfYear.getDate(), 31); // December 31st
    assert.strictEqual(endOfYear.getMonth(), 11); // December (0-indexed)
    assert.strictEqual(endOfYear.getFullYear(), 2025);
    assert.strictEqual(endOfYear.getHours(), 23); // End of day
  });

  test('getEndOfPeriod should find end of day correctly', () => {
    // Test mid-day time
    const midDay = new Date('2025-08-13T15:30:45.123Z');
    const endOfDay = getEndOfPeriod(midDay, 'day');

    assert.strictEqual(endOfDay.getDate(), 13); // Same date
    assert.strictEqual(endOfDay.getMonth(), 7); // August (0-indexed)
    assert.strictEqual(endOfDay.getHours(), 23); // End of day
    assert.strictEqual(endOfDay.getMinutes(), 59);
    assert.strictEqual(endOfDay.getSeconds(), 59);
    assert.strictEqual(endOfDay.getMilliseconds(), 999);
  });

  test('date query utilities should handle month boundaries correctly', () => {
    // Test end of month for February (non-leap year)
    const endOfJan = new Date('2025-01-31T12:00:00Z');
    const endOfFeb = getEndOfPeriod(endOfJan, 'month');

    assert.strictEqual(endOfFeb.getDate(), 31); // January 31st
    assert.strictEqual(endOfFeb.getMonth(), 0); // January (0-indexed)

    // Test February specifically
    const midFeb = new Date('2025-02-15T12:00:00Z');
    const endOfFebMonth = getEndOfPeriod(midFeb, 'month');

    assert.strictEqual(endOfFebMonth.getDate(), 28); // February 28th (non-leap year)
    assert.strictEqual(endOfFebMonth.getMonth(), 1); // February (0-indexed)
  });

  test('date query utilities should handle leap years correctly', () => {
    // Test February in leap year 2024
    const leapFeb = new Date('2024-02-15T12:00:00Z');
    const endOfLeapFeb = getEndOfPeriod(leapFeb, 'month');

    assert.strictEqual(endOfLeapFeb.getDate(), 29); // February 29th (leap year)
    assert.strictEqual(endOfLeapFeb.getMonth(), 1); // February (0-indexed)
    assert.strictEqual(endOfLeapFeb.getFullYear(), 2024);
  });

  test('date query utilities should handle year boundaries correctly', () => {
    // Test end of December
    const endOfDec = new Date('2025-12-31T12:00:00Z');
    const nextYear = getNextWeekday(endOfDec, 'wednesday'); // Find next Wednesday

    assert.strictEqual(nextYear.getFullYear(), 2026); // Should wrap to next year
    assert.strictEqual(nextYear.getDay(), 3); // Wednesday

    // Test start of January
    const startOfJan = new Date('2025-01-01T12:00:00Z');
    const prevYear = getPreviousWeekday(startOfJan, 'friday'); // Find previous Friday

    assert.strictEqual(prevYear.getFullYear(), 2024); // Should wrap to previous year
    assert.strictEqual(prevYear.getDay(), 5); // Friday
  });

  test('weekday utilities should handle all weekdays correctly', () => {
    const baseDate = new Date('2025-08-13T12:00:00Z'); // Wednesday

    // Test all weekdays
    const weekdays = [
      { name: 'sunday', day: 0 },
      { name: 'monday', day: 1 },
      { name: 'tuesday', day: 2 },
      { name: 'wednesday', day: 3 },
      { name: 'thursday', day: 4 },
      { name: 'friday', day: 5 },
      { name: 'saturday', day: 6 },
    ];

    weekdays.forEach(({ name, day }) => {
      const nextWeekday = getNextWeekday(baseDate, name);
      const prevWeekday = getPreviousWeekday(baseDate, name);

      assert.strictEqual(nextWeekday.getDay(), day, `Next ${name} should be day ${day}`);
      assert.strictEqual(prevWeekday.getDay(), day, `Previous ${name} should be day ${day}`);

      // Next should be after base date, previous should be before
      assert.ok(
        nextWeekday.getTime() > baseDate.getTime(),
        `Next ${name} should be after base date`,
      );
      assert.ok(
        prevWeekday.getTime() < baseDate.getTime(),
        `Previous ${name} should be before base date`,
      );
    });
  });

  test('period utilities should handle all period types correctly', () => {
    const testDate = new Date('2025-08-13T15:30:45.123Z');

    const periods = ['day', 'week', 'month', 'year'] as const;

    periods.forEach((period) => {
      const start = getStartOfPeriod(testDate, period);
      const end = getEndOfPeriod(testDate, period);

      // Start should be before or equal to test date
      assert.ok(start.getTime() <= testDate.getTime(), `Start of ${period} should be <= test date`);

      // End should be after or equal to test date
      assert.ok(end.getTime() >= testDate.getTime(), `End of ${period} should be >= test date`);

      // End should be after start
      assert.ok(end.getTime() > start.getTime(), `End of ${period} should be after start`);
    });
  });

  test('date query utilities should preserve timezone behavior', () => {
    // Test that utilities work consistently across different times on the same UTC date
    const earlyMorning = new Date('2025-08-13T02:00:00Z');
    const lateMorning = new Date('2025-08-13T10:00:00Z'); // Use a safer time within the same UTC day

    const earlyStart = getStartOfPeriod(earlyMorning, 'day');
    const lateStart = getStartOfPeriod(lateMorning, 'day');

    // Both should give same start of day in the same timezone context
    assert.strictEqual(earlyStart.getTime(), lateStart.getTime());

    const earlyEnd = getEndOfPeriod(earlyMorning, 'day');
    const lateEnd = getEndOfPeriod(lateMorning, 'day');

    // Both should give same end of day in the same timezone context
    assert.strictEqual(earlyEnd.getTime(), lateEnd.getTime());
  });
});
