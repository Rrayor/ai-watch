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

    // For explicit timezone path, iso/utc are not included by design
    assert.strictEqual(res.iso, undefined);
    assert.strictEqual(res.utc, undefined);

    // Local fields reflect the requested timezone in this path
    assert.ok(typeof res.local === 'string');
    assert.match(res.local as string, /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    assert.strictEqual(res.localTimezone, 'UTC');
    assert.strictEqual(res.formattedResult, res.local);
    assert.strictEqual(res.resultTimezone, 'UTC');
  });

  test('returns formatted result for explicit timezone without custom format (uses default)', () => {
    const res = getCurrentDateTimeCommand({ timezone: 'UTC' });

    // For explicit timezone path, iso/utc are not included
    assert.strictEqual(res.iso, undefined);
    assert.strictEqual(res.utc, undefined);

    // Should use configured default format from package contributes (YYYY-MM-DD HH:mm:ss)
    assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(res.formattedResult));
    assert.strictEqual(res.resultTimezone, 'UTC');
    assert.strictEqual(res.localTimezone, 'UTC');
    assert.strictEqual(res.local, res.formattedResult);
  });

  test('throws InvalidTimezoneError for bad timezone', () => {
    assert.throws(
      () => getCurrentDateTimeCommand({ timezone: 'Invalid/Zone' }),
      InvalidTimezoneError,
    );
  });
});
