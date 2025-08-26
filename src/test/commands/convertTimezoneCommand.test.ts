import * as assert from 'assert';
import { convertTimezoneCommand } from '../../modules/convert-timezone/command/convertTimezoneCommand';
import { InvalidTimezoneError } from '../../modules/shared/error/InvalidTimezoneError';
import { AmbiguousDateError } from '../../modules/shared/error/AmbiguousDateError';

suite('convertTimezoneCommand', () => {
  const date = '2025-08-14T10:00:00Z';

  test('defaults fromTimezone to UTC when not provided and returns info message', () => {
    const res = convertTimezoneCommand({ date, toTimezone: 'UTC' });
    assert.strictEqual(res.fromTimezone, 'UTC');
    assert.ok(res.info?.some((m) => m.toLowerCase().includes('defaulting to utc')));
    assert.strictEqual(res.resultTimezone, 'UTC');
    assert.ok(res.formattedResult.includes('UTC') || res.formattedResult.length > 0);
  });

  test('throws on invalid toTimezone', () => {
    assert.throws(
      () => convertTimezoneCommand({ date, toTimezone: 'Invalid/Zone' }),
      InvalidTimezoneError,
    );
  });

  test('includes local and localTimezone fields', () => {
    const res = convertTimezoneCommand({ date, toTimezone: 'America/New_York' });
    assert.ok(typeof res.local === 'string' && res.local.length > 0);
    assert.ok(typeof res.localTimezone === 'string' && res.localTimezone.length > 0);
  });

  test('accepts naive ISO string when fromTimezone is provided and computes correct UTC instant', () => {
    // 2025-08-26T15:00:00 in America/New_York should be 2025-08-26T19:00:00Z (NY is UTC-4 in August)
    const naive = '2025-08-26T15:00:00';
    const res = convertTimezoneCommand({
      date: naive,
      fromTimezone: 'America/New_York',
      toTimezone: 'UTC',
    });

    // iso is an ISO string in UTC produced by the command
    assert.strictEqual(res.iso, '2025-08-26T19:00:00.000Z');
    // formatted result should include UTC or a time that matches
    assert.ok(res.formattedResult.includes('UTC') || res.formattedResult.includes('19:00'));
  });

  test('throws AmbiguousDateError when naive date provided without fromTimezone or interpretAsLocal', () => {
    const naive = '2025-08-26T15:00:00';
    assert.throws(
      () => convertTimezoneCommand({ date: naive, toTimezone: 'UTC' }),
      AmbiguousDateError,
    );
  });

  test('throws InvalidTimezoneError when fromTimezone is invalid', () => {
    const naive = '2025-08-26T15:00:00';
    assert.throws(
      () =>
        convertTimezoneCommand({
          date: naive,
          fromTimezone: 'Invalid/Zone',
          toTimezone: 'UTC',
        }),
      InvalidTimezoneError,
    );
  });
});
