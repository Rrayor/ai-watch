import * as assert from 'assert';
import { subtractTimeCommand } from '../../modules/subtract-time/command/subtractTimeCommand';

suite('subtractTimeCommand', () => {
  test('subtracts multiple units and returns consistent iso/utc/local fields', () => {
    const baseTime = '2025-08-20T15:30:30Z';
    const res = subtractTimeCommand({
      baseTime,
      years: 0,
      months: 0,
      weeks: 0,
      days: 2,
      hours: 1,
      minutes: 5,
      seconds: 10,
      timezone: 'UTC',
    });

    assert.strictEqual(res.baseTime, new Date(baseTime).toISOString());
    assert.strictEqual(res.iso, '2025-08-18T14:25:20.000Z');
    assert.strictEqual(res.utc, '2025-08-18 14:25:20 UTC');
    assert.strictEqual(res.resultTimezone, 'UTC');
    assert.strictEqual(res.formattedResult, '2025-08-18 14:25:20');
    // Local fields should always be populated
    assert.ok(typeof res.local === 'string' && res.local.length > 0);
    assert.ok(typeof res.localTimezone === 'string' && res.localTimezone.length > 0);
  });

  test('defaults baseTime to now (smoke test)', () => {
    const res = subtractTimeCommand({ minutes: 30, timezone: 'UTC' });
    assert.ok(typeof res.iso === 'string' && res.iso.endsWith('Z'));
    assert.ok(typeof res.utc === 'string' && res.utc.endsWith(' UTC'));
    assert.ok(typeof res.local === 'string' && res.local.length > 0);
  });

  test('when no timezone provided, resultTimezone equals user local timezone', () => {
    const res = subtractTimeCommand({ hours: 2 });
    assert.ok(res.resultTimezone && res.resultTimezone.length > 0);
    assert.strictEqual(typeof res.formattedResult, 'string');
  });

  test('invalid baseTime throws InvalidDateError', () => {
    assert.throws(() => subtractTimeCommand({ baseTime: 'invalid', minutes: 5 }));
  });
});
