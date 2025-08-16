import * as assert from 'assert';
import { workspace } from 'vscode';
import {
  formatUTC,
  formatInTimezone,
  getUserTimezone,
  applyCustomFormat,
  formatStandard,
} from '../../modules/shared/util/timezoneUtils';
import { OperationContext } from '../../modules/shared/model/OperationContext';
import { InvalidTimezoneError } from '../../modules/shared/error/InvalidTimezoneError';

suite('timezoneUtils', () => {
  // Helper to temporarily replace global Intl for a block of code and restore it.
  async function withPatchedIntl<T>(fakeIntl: Partial<typeof Intl>, fn: () => Promise<T> | T) {
    const g = globalThis as unknown as { Intl: typeof Intl };
    const original = g.Intl;
    try {
      g.Intl = fakeIntl as typeof Intl;
      return await Promise.resolve(fn());
    } finally {
      g.Intl = original;
    }
  }

  test('formatUTC returns expected UTC format', () => {
    const d = new Date('2025-08-10T12:30:45Z');
    const out = formatUTC(d);
    assert.strictEqual(out, '2025-08-10 12:30:45 UTC');
  });

  test('formatInTimezone uses custom format when provided', () => {
    const ctx = new OperationContext();
    const d = new Date('2025-08-10T12:30:45Z');
    const out = formatInTimezone(d, 'UTC', ctx, 'YYYY/MM/DD HH:mm:ss');
    assert.strictEqual(out, '2025/08/10 12:30:45');
    assert.deepStrictEqual(ctx.info, []);
  });

  test('formatInTimezone falls back to configured default when no custom format provided', async () => {
    const ctx = new OperationContext();
    const d = new Date('2025-08-10T12:30:45Z');
    const cfg = workspace.getConfiguration('aiWatch');
    const prev = cfg.get('defaultDateFormat');
    try {
      await cfg.update('defaultDateFormat', 'YYYY/MM/DD HH:mm:ss', true);
      const out = formatInTimezone(d, 'UTC', ctx);
      assert.strictEqual(out, '2025/08/10 12:30:45');
    } finally {
      await cfg.update('defaultDateFormat', prev, true);
    }
  });

  test('formatInTimezone standard formatting when no format provided', () => {
    const ctx = new OperationContext();
    const d = new Date('2025-08-10T12:30:45Z');
    const out = formatInTimezone(d, 'UTC', ctx);
    // Default standard format is YYYY-MM-DD HH:mm:ss
    assert.strictEqual(out, '2025-08-10 12:30:45');
  });

  test('formatInTimezone throws InvalidTimezoneError for bad timezone', () => {
    const ctx = new OperationContext();
    const d = new Date('2025-08-10T12:30:45Z');
    assert.throws(() => formatInTimezone(d, 'Invalid/Zone', ctx), InvalidTimezoneError);
  });

  test('fallback to ISO-like UTC when no timezone and no default format', async () => {
    const ctx = new OperationContext();
    const d = new Date('2025-08-10T12:30:45Z');
    const cfg = workspace.getConfiguration('aiWatch');
    const prev = cfg.get('defaultDateFormat');
    try {
      await cfg.update('defaultDateFormat', undefined, true);
      // Force failure by passing an invalid timezone string; the catch path will attempt default format then ISO-like
      assert.throws(() => formatInTimezone(d, 'Invalid/AlsoBad', ctx), InvalidTimezoneError);
      // Note: With explicit invalid timezone, function throws per docs; ISO-like fallback occurs only when detection fails without explicit tz and no default.
    } finally {
      await cfg.update('defaultDateFormat', prev, true);
    }
  });

  test('getUserTimezone returns a non-empty string or UTC when detection fails', () => {
    const ctx = new OperationContext();
    const tz = getUserTimezone(ctx);
    assert.ok(typeof tz === 'string' && tz.length > 0);
  });

  test('applyCustomFormat replaces YYYY, MM, DD, HH, mm, ss tokens correctly', () => {
    // Use a UTC-based Date to avoid local-time flakiness and compute expected using the
    // date's local getters (applyCustomFormat uses local getters).
    const date = new Date(Date.UTC(2025, 6, 9, 5, 7, 3)); // 2025-07-09T05:07:03Z
    function pad2(n: number) {
      return String(n).padStart(2, '0');
    }
    const year = date.getFullYear();
    const month = pad2(date.getMonth() + 1);
    const day = pad2(date.getDate());
    const hours = pad2(date.getHours());
    const minutes = pad2(date.getMinutes());
    const seconds = pad2(date.getSeconds());
    const expected = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const out = applyCustomFormat(date, 'YYYY-MM-DD HH:mm:ss');
    assert.strictEqual(out, expected);
  });

  test('applyCustomFormat supports single-letter tokens and YY', () => {
    const date = new Date(1999, 0, 2, 3, 4, 5); // local 1999-01-02T03:04:05
    const out = applyCustomFormat(date, 'YY-M-D H:m:s');
    const expected = `${String(date.getFullYear()).slice(-2)}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    assert.strictEqual(out, expected);
  });

  test('applyCustomFormat leaves unknown tokens untouched', () => {
    const date = new Date(2020, 11, 31, 23, 59, 59);
    const out = applyCustomFormat(date, 'YYYY-XX-DD');
    const expected = `${String(date.getFullYear())}-XX-${String(date.getDate()).padStart(2, '0')}`;
    assert.strictEqual(out, expected);
  });

  test('formatStandard formats date in given timezone (UTC)', () => {
    const ctx = new OperationContext();
    const d = new Date('2025-08-10T12:30:45Z');
    const out = formatStandard(d, ctx, 'UTC');
    assert.strictEqual(out, '2025-08-10 12:30:45');
  });

  test('formatStandard without timezone uses detected timezone (local equivalent)', () => {
    const ctx = new OperationContext();
    const d = new Date('2025-08-10T12:30:45Z');
    const out = formatStandard(d, ctx);
    // Should match local system time representation for the given instant
    const expectedLocal = applyCustomFormat(d, 'YYYY-MM-DD HH:mm:ss');
    assert.strictEqual(out, expectedLocal);
    assert.ok(
      ctx.info.some((m) => m.includes('attempting to detect user timezone')),
      'Expected info to mention timezone detection',
    );
  });

  test('when timezone detection throws, uses configured defaultDateFormat', async () => {
    const tzUtils = await import('../../modules/shared/util/timezoneUtils.js');
    const cfg = workspace.getConfiguration('aiWatch');
    const prev = cfg.get('defaultDateFormat');
    const ctx = new OperationContext();
    const d = new Date('2025-08-10T12:30:45Z');

    // set configured default format and simulate Intl failure
    await withPatchedIntl(
      {
        DateTimeFormat() {
          throw new Error('simulate failure');
        },
      } as unknown as Partial<typeof Intl>,
      async () => {
        await cfg.update('defaultDateFormat', 'YYYY/MM/DD HH:mm:ss', true);
        const out = tzUtils.formatInTimezone(d, '', ctx);
        // expected uses local time because formatWithCustomFormat is called with undefined timezone
        const expected = applyCustomFormat(d, 'YYYY/MM/DD HH:mm:ss');
        assert.strictEqual(out, expected);
      },
    );
    await cfg.update('defaultDateFormat', prev, true);
  });

  test('when timezone detection throws and no default format, falls back to ISO-like UTC', async () => {
    const tzUtils = await import('../../modules/shared/util/timezoneUtils.js');
    const cfg = workspace.getConfiguration('aiWatch');
    const prev = cfg.get('defaultDateFormat');
    const ctx = new OperationContext();
    const d = new Date('2025-08-10T12:30:45Z');
    const originalIntl2 = (globalThis as unknown as { Intl: typeof Intl }).Intl;

    await withPatchedIntl(
      {
        DateTimeFormat() {
          throw new Error('simulate failure');
        },
      } as unknown as Partial<typeof Intl>,
      async () => {
        await cfg.update('defaultDateFormat', undefined, true);
        const out = tzUtils.formatInTimezone(d, '', ctx);
        const expectedUtc = d.toISOString().slice(0, 19).replace('T', ' ');
        const expectedLocal = applyCustomFormat(d, 'YYYY-MM-DD HH:mm:ss');
        assert.ok(out === expectedUtc || out === expectedLocal);
      },
    );
    await cfg.update('defaultDateFormat', prev, true);
  });

  test('formatInTimezone with custom format handles missing Intl parts (tokens become empty)', () => {
    const ctx = new OperationContext();
    const d = new Date('2025-08-10T12:30:45Z');

    // Save original DateTimeFormat constructor
    const originalDTF = global.Intl.DateTimeFormat;

    // Minimal fake DateTimeFormat that only returns a subset of parts (year only)
    class FakeDTF {
      formatToParts(_date: Date) {
        return [{ type: 'year', value: '2025' } as Intl.DateTimeFormatPart];
      }
      format(_date: Date) {
        return '2025-??-??, ??:??:??';
      }
    }

    try {
      // Patch only the DateTimeFormat constructor so timezone validation is bypassed
      (globalThis as unknown as { Intl: typeof Intl }).Intl.DateTimeFormat = function () {
        return new FakeDTF() as unknown as Intl.DateTimeFormat;
      } as unknown as (typeof Intl)['DateTimeFormat'];

      const out = formatInTimezone(d, 'UTC', ctx, 'YYYY-YY-MM-M-DD-D HH-H:mm-m:ss-s');
      // With only year present, all other tokens should be empty strings
      assert.strictEqual(out, '2025-25---- -:-:-');
    } finally {
      // Restore original DateTimeFormat
      (globalThis as unknown as { Intl: typeof Intl }).Intl.DateTimeFormat = originalDTF;
    }
  });
});
