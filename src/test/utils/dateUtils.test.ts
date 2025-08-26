import * as assert from 'assert';
import {
  parseISOString,
  weekdayToNumber,
  buildDurationParts,
} from '../../modules/shared/util/dateUtils';
import { InvalidTimezoneError } from '../../modules/shared/error/InvalidTimezoneError';
import { AmbiguousDateError } from '../../modules/shared/error/AmbiguousDateError';

suite('dateUtils', () => {
  suite('parseISOString', () => {
    test('parses valid ISO string and preserves exact value', () => {
      const input = '2025-08-10T12:30:45.000Z';
      const d = parseISOString(input);
      assert.strictEqual(d.toISOString(), input);
    });

    test('throws on invalid dates and autocorrected values', () => {
      const invalidInputs = [
        'invalid-date',
        '2025-13-01T00:00:00Z',
        '2025-02-29T00:00:00Z', // 2025 not leap year
      ];
      for (const s of invalidInputs) {
        assert.throws(() => parseISOString(s));
      }
    });

    test('interprets naive ISO with provided IANA timezone correctly', () => {
      // 15:00 in New York (UTC-4 in August) -> 19:00Z
      const naive = '2025-08-26T15:00:00';
      const d = parseISOString(naive, 'America/New_York');
      assert.strictEqual(d.toISOString(), '2025-08-26T19:00:00.000Z');
    });

    test('throws InvalidTimezoneError for bad IANA timezone when interpreting naive ISO', () => {
      const naive = '2025-08-26T15:00:00';
      assert.throws(() => parseISOString(naive, 'Invalid/Zone'), InvalidTimezoneError);
    });
  });

  suite('weekdayToNumber', () => {
    test('maps weekday names with default Sunday week start', () => {
      assert.strictEqual(weekdayToNumber('Sunday'), 0);
      assert.strictEqual(weekdayToNumber('Monday'), 1);
      assert.strictEqual(weekdayToNumber('Saturday'), 6);
    });

    test('respects custom weekStart as string', () => {
      // With Monday as start, Monday becomes 0, Sunday becomes 6
      assert.strictEqual(weekdayToNumber('Monday', 'Monday'), 0);
      assert.strictEqual(weekdayToNumber('Sunday', 'Monday'), 6);
    });

    test('respects custom weekStart as number', () => {
      // If week starts on Wednesday (3), then Wednesday is 0, Thursday is 1
      assert.strictEqual(weekdayToNumber('Wednesday', 3), 0);
      assert.strictEqual(weekdayToNumber('Thursday', 3), 1);
    });

    test('throws on invalid weekday', () => {
      assert.throws(() => weekdayToNumber('Funday'));
    });

    test('throws on invalid weekStart string', () => {
      assert.throws(() => weekdayToNumber('Monday', 'Someday'));
    });
  });

  suite('buildDurationParts', () => {
    test('builds pluralized parts and omits zeros', () => {
      const parts = buildDurationParts({
        years: 1,
        months: 0,
        weeks: 2,
        days: 3,
        hours: 0,
        minutes: 4,
        seconds: 5,
      });
      assert.deepStrictEqual(parts, ['1 year', '2 weeks', '3 days', '4 minutes', '5 seconds']);
    });
  });
});
