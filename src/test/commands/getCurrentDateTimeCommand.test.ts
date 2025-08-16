import * as assert from 'assert';
import { getCurrentDateTimeCommand } from '../../modules/current-date-time/command/getCurrentDateTimeCommand';
import { InvalidTimezoneError } from '../../modules/shared/error/InvalidTimezoneError';

suite('getCurrentDateTimeCommand', () => {
  test('returns local date info when no options are provided', () => {
    const res = getCurrentDateTimeCommand();

    // iso and utc are present on local path
    assert.ok(typeof res.iso === 'string' && res.iso.endsWith('Z'));
    assert.ok(typeof res.utc === 'string' && res.utc.endsWith(' UTC'));

    // local fields are present and consistent
    assert.ok(typeof res.local === 'string' && res.local.length > 0);
    assert.ok(typeof res.localTimezone === 'string' && res.localTimezone.length > 0);
    assert.strictEqual(res.formattedResult, res.local);
    assert.strictEqual(res.resultTimezone, res.localTimezone);

    // info is defined (may be empty)
    assert.ok(Array.isArray(res.info) || res.info === undefined);
  });

  test('returns formatted result for explicit timezone and format (UTC)', () => {
    const res = getCurrentDateTimeCommand({ timezone: 'UTC', format: 'YYYY-MM-DD HH:mm:ss' });

    assert.ok(typeof res.local === 'string');
    assert.match(res.local as string, /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    assert.match(res.formattedResult as string, /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    assert.ok(typeof res.localTimezone === 'string');
    assert.strictEqual(res.resultTimezone, 'UTC');
  });

  test('returns formatted result for explicit timezone without custom format (uses default)', () => {
    const res = getCurrentDateTimeCommand({ timezone: 'UTC' });

    // Should use configured default format from package contributes (YYYY-MM-DD HH:mm:ss)
    assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(res.formattedResult));
    assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(res.local));
    assert.strictEqual(res.resultTimezone, 'UTC');
    assert.ok(typeof res.localTimezone === 'string');
  });

  test('throws InvalidTimezoneError for bad timezone', () => {
    assert.throws(
      () => getCurrentDateTimeCommand({ timezone: 'Invalid/Zone' }),
      InvalidTimezoneError,
    );
  });
});
