import * as assert from 'assert';
import { convertTimezoneCommand } from '../../modules/convert-timezone/command/convertTimezoneCommand';
import { InvalidTimezoneError } from '../../modules/shared/error/InvalidTimezoneError';

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
});
