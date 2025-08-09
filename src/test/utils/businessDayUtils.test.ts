import * as assert from 'assert';
import { isBusinessDay, addBusinessDays, parseBusinessDays } from '../../utils/businessDayUtils';

suite('Business Day Utils Tests', () => {
  const standardBusinessDays = [1, 2, 3, 4, 5]; // Monday through Friday
  const emptyExcludedDates = new Set<string>();

  test('isBusinessDay should correctly identify business days', () => {
    // Test Monday (business day)
    const monday = new Date('2025-08-11T12:00:00Z'); // Monday
    assert.strictEqual(isBusinessDay(monday, standardBusinessDays, emptyExcludedDates), true);

    // Test Tuesday (business day)
    const tuesday = new Date('2025-08-12T12:00:00Z'); // Tuesday
    assert.strictEqual(isBusinessDay(tuesday, standardBusinessDays, emptyExcludedDates), true);

    // Test Wednesday (business day)
    const wednesday = new Date('2025-08-13T12:00:00Z'); // Wednesday
    assert.strictEqual(isBusinessDay(wednesday, standardBusinessDays, emptyExcludedDates), true);

    // Test Thursday (business day)
    const thursday = new Date('2025-08-14T12:00:00Z'); // Thursday
    assert.strictEqual(isBusinessDay(thursday, standardBusinessDays, emptyExcludedDates), true);

    // Test Friday (business day)
    const friday = new Date('2025-08-15T12:00:00Z'); // Friday
    assert.strictEqual(isBusinessDay(friday, standardBusinessDays, emptyExcludedDates), true);
  });

  test('isBusinessDay should correctly identify weekends', () => {
    // Test Saturday (weekend)
    const saturday = new Date('2025-08-16T12:00:00Z'); // Saturday
    assert.strictEqual(isBusinessDay(saturday, standardBusinessDays, emptyExcludedDates), false);

    // Test Sunday (weekend)
    const sunday = new Date('2025-08-17T12:00:00Z'); // Sunday
    assert.strictEqual(isBusinessDay(sunday, standardBusinessDays, emptyExcludedDates), false);
  });

  test('isBusinessDay should handle custom business days configuration', () => {
    // Test with custom business days (e.g., Monday-Saturday)
    const customBusinessDays = [1, 2, 3, 4, 5, 6]; // Monday through Saturday

    const saturday = new Date('2025-08-16T12:00:00Z'); // Saturday
    const result = isBusinessDay(saturday, customBusinessDays, emptyExcludedDates);
    assert.strictEqual(result, true); // Saturday should be a business day with custom config

    const sunday = new Date('2025-08-17T12:00:00Z'); // Sunday
    const sundayResult = isBusinessDay(sunday, customBusinessDays, emptyExcludedDates);
    assert.strictEqual(sundayResult, false); // Sunday should still not be a business day
  });

  test('isBusinessDay should handle excluded dates', () => {
    const monday = new Date('2025-08-11T12:00:00Z'); // Monday (normally business day)
    const excludedDates = new Set(['2025-08-11']); // Exclude this specific Monday

    const result = isBusinessDay(monday, standardBusinessDays, excludedDates);
    assert.strictEqual(result, false); // Should be false due to exclusion

    // Test that other days are not affected
    const tuesday = new Date('2025-08-12T12:00:00Z'); // Tuesday
    const tuesdayResult = isBusinessDay(tuesday, standardBusinessDays, excludedDates);
    assert.strictEqual(tuesdayResult, true); // Should still be true
  });

  test('addBusinessDays should add business days correctly', () => {
    // Start on Monday, add 1 business day -> Tuesday
    const monday = new Date('2025-08-11T12:00:00Z');
    const oneDayLater = addBusinessDays(monday, 1, standardBusinessDays, emptyExcludedDates);
    assert.strictEqual(oneDayLater.getDay(), 2); // Tuesday

    // Start on Friday, add 1 business day -> next Monday (skip weekend)
    const friday = new Date('2025-08-15T12:00:00Z');
    const afterFriday = addBusinessDays(friday, 1, standardBusinessDays, emptyExcludedDates);
    assert.strictEqual(afterFriday.getDay(), 1); // Monday
    assert.strictEqual(afterFriday.getDate(), 18); // August 18th
  });

  test('addBusinessDays should handle multiple business days', () => {
    // Start on Monday, add 5 business days -> next Monday
    const monday = new Date('2025-08-11T12:00:00Z');
    const fiveDaysLater = addBusinessDays(monday, 5, standardBusinessDays, emptyExcludedDates);
    assert.strictEqual(fiveDaysLater.getDay(), 1); // Monday
    assert.strictEqual(fiveDaysLater.getDate(), 18); // August 18th (next week)

    // Start on Wednesday, add 3 business days -> next Monday
    const wednesday = new Date('2025-08-13T12:00:00Z');
    const threeDaysLater = addBusinessDays(wednesday, 3, standardBusinessDays, emptyExcludedDates);
    assert.strictEqual(threeDaysLater.getDay(), 1); // Monday
    assert.strictEqual(threeDaysLater.getDate(), 18); // August 18th
  });

  test('addBusinessDays should handle zero days', () => {
    const monday = new Date('2025-08-11T12:00:00Z');
    const same = addBusinessDays(monday, 0, standardBusinessDays, emptyExcludedDates);
    assert.strictEqual(same.getTime(), monday.getTime());
  });

  test('addBusinessDays should handle negative days (subtraction)', () => {
    // Start on Tuesday, subtract 1 business day -> Monday
    const tuesday = new Date('2025-08-12T12:00:00Z');
    const oneDayEarlier = addBusinessDays(tuesday, -1, standardBusinessDays, emptyExcludedDates);
    assert.strictEqual(oneDayEarlier.getDay(), 1); // Monday

    // Start on Monday, subtract 1 business day -> previous Friday (skip weekend)
    const monday = new Date('2025-08-11T12:00:00Z');
    const beforeMonday = addBusinessDays(monday, -1, standardBusinessDays, emptyExcludedDates);
    assert.strictEqual(beforeMonday.getDay(), 5); // Friday
    assert.strictEqual(beforeMonday.getDate(), 8); // August 8th
  });

  test('addBusinessDays should handle large numbers of business days', () => {
    const monday = new Date('2025-08-11T12:00:00Z');
    const twentyDaysLater = addBusinessDays(monday, 20, standardBusinessDays, emptyExcludedDates);

    // 20 business days = 4 weeks = 28 calendar days
    assert.ok(twentyDaysLater.getTime() > monday.getTime());
    assert.strictEqual(
      isBusinessDay(twentyDaysLater, standardBusinessDays, emptyExcludedDates),
      true,
    );
  });

  test('addBusinessDays should handle custom business days', () => {
    // Custom configuration: Tuesday through Saturday are business days
    const customBusinessDays = [2, 3, 4, 5, 6]; // Tuesday through Saturday

    const tuesday = new Date('2025-08-12T12:00:00Z'); // Tuesday
    const oneDayLater = addBusinessDays(tuesday, 1, customBusinessDays, emptyExcludedDates);
    assert.strictEqual(oneDayLater.getDay(), 3); // Wednesday

    // Test that it skips Sunday and Monday with custom config
    const saturday = new Date('2025-08-16T12:00:00Z'); // Saturday
    const afterSaturday = addBusinessDays(saturday, 1, customBusinessDays, emptyExcludedDates);
    assert.strictEqual(afterSaturday.getDay(), 2); // Tuesday (skip Sun, Mon)
  });

  test('addBusinessDays should respect excluded dates', () => {
    const monday = new Date('2025-08-11T12:00:00Z'); // Monday
    const excludedDates = new Set(['2025-08-12']); // Exclude Tuesday

    // Adding 1 business day from Monday should skip Tuesday and go to Wednesday
    const result = addBusinessDays(monday, 1, standardBusinessDays, excludedDates);
    assert.strictEqual(result.getDay(), 3); // Wednesday
    assert.strictEqual(result.getDate(), 13); // August 13th
  });

  test('parseBusinessDays should handle range format correctly', () => {
    // Test standard Mon-Fri range
    const monFri = parseBusinessDays('Mon-Fri');
    assert.deepStrictEqual(monFri, [1, 2, 3, 4, 5]);

    // Test Tue-Thu range
    const tueThu = parseBusinessDays('Tue-Thu');
    assert.deepStrictEqual(tueThu, [2, 3, 4]);

    // Test single day range
    const monMon = parseBusinessDays('Mon-Mon');
    assert.deepStrictEqual(monMon, [1]);
  });

  test('parseBusinessDays should handle wrap-around ranges', () => {
    // Test Fri-Mon range (wraps around weekend)
    const friMon = parseBusinessDays('Fri-Mon');
    assert.deepStrictEqual(friMon, [5, 6, 0, 1]); // Fri, Sat, Sun, Mon

    // Test Sat-Tue range
    const satTue = parseBusinessDays('Sat-Tue');
    assert.deepStrictEqual(satTue, [6, 0, 1, 2]); // Sat, Sun, Mon, Tue
  });

  test('parseBusinessDays should handle comma-separated format', () => {
    // Test specific days
    const monWedFri = parseBusinessDays('Mon,Wed,Fri');
    assert.deepStrictEqual(monWedFri, [1, 3, 5]);

    // Test with spaces
    const tueThu = parseBusinessDays('Tue, Thu');
    assert.deepStrictEqual(tueThu, [2, 4]);

    // Test single day
    const friOnly = parseBusinessDays('Fri');
    assert.deepStrictEqual(friOnly, [5]);
  });

  test('parseBusinessDays should handle abbreviations and full names', () => {
    // Test abbreviations
    const abbrev = parseBusinessDays('Mon,Tue,Wed');
    assert.deepStrictEqual(abbrev, [1, 2, 3]);

    // Test full names
    const fullNames = parseBusinessDays('Monday-Wednesday');
    assert.deepStrictEqual(fullNames, [1, 2, 3]);

    // Test mixed case
    const mixedCase = parseBusinessDays('MONDAY,tuesday,WedNesday');
    assert.deepStrictEqual(mixedCase, [1, 2, 3]);
  });

  test('parseBusinessDays should handle invalid inputs gracefully', () => {
    // Test with invalid day name
    const withInvalid = parseBusinessDays('Mon,InvalidDay,Wed');
    assert.deepStrictEqual(withInvalid, [1, 3]); // Should skip invalid and continue

    // Test empty string
    const empty = parseBusinessDays('');
    assert.deepStrictEqual(empty, []);
  });

  test('business day utilities should preserve time components', () => {
    const specificTime = new Date('2025-08-11T14:30:45.123Z'); // Monday 2:30:45.123 PM
    const nextBusinessDay = addBusinessDays(
      specificTime,
      1,
      standardBusinessDays,
      emptyExcludedDates,
    );

    // Time components should be preserved (use UTC methods for timezone-independent tests)
    assert.strictEqual(nextBusinessDay.getUTCHours(), 14);
    assert.strictEqual(nextBusinessDay.getUTCMinutes(), 30);
    assert.strictEqual(nextBusinessDay.getUTCSeconds(), 45);
    assert.strictEqual(nextBusinessDay.getUTCMilliseconds(), 123);
  });

  test('business day utilities should handle edge cases', () => {
    // Test end of month
    const endOfMonth = new Date('2025-08-29T12:00:00Z'); // Friday, August 29
    const nextBusinessDay = addBusinessDays(
      endOfMonth,
      1,
      standardBusinessDays,
      emptyExcludedDates,
    );
    assert.strictEqual(nextBusinessDay.getMonth(), 8); // September (0-indexed)
    assert.strictEqual(nextBusinessDay.getDay(), 1); // Monday

    // Test beginning of month with negative days
    const beginningOfMonth = new Date('2025-09-01T12:00:00Z'); // Monday, September 1
    const prevBusinessDay = addBusinessDays(
      beginningOfMonth,
      -1,
      standardBusinessDays,
      emptyExcludedDates,
    );
    assert.strictEqual(prevBusinessDay.getMonth(), 7); // August (0-indexed)
    assert.strictEqual(prevBusinessDay.getDay(), 5); // Friday
  });

  test('isBusinessDay should handle boundary times correctly', () => {
    // Test at midnight
    const midnightMonday = new Date('2025-08-11T00:00:00Z');
    assert.strictEqual(
      isBusinessDay(midnightMonday, standardBusinessDays, emptyExcludedDates),
      true,
    );

    // Test at end of day
    const endOfDayFriday = new Date('2025-08-15T23:59:59Z');
    assert.strictEqual(
      isBusinessDay(endOfDayFriday, standardBusinessDays, emptyExcludedDates),
      true,
    );

    // Test weekend boundaries
    const endOfFriday = new Date('2025-08-15T23:59:59Z');
    const startOfSaturday = new Date('2025-08-16T00:00:00Z');

    assert.strictEqual(isBusinessDay(endOfFriday, standardBusinessDays, emptyExcludedDates), true);
    assert.strictEqual(
      isBusinessDay(startOfSaturday, standardBusinessDays, emptyExcludedDates),
      false,
    );
  });
});
