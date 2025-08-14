import * as assert from 'assert';
import {
  parseISOString,
  weekdayToNumber,
  buildDurationParts,
} from '../../modules/shared/util/dateUtils';

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
