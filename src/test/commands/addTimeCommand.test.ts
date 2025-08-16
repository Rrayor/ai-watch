import * as assert from 'assert';
import { addTimeCommand } from '../../modules/add-time/command/addTimeCommand';

suite('addTimeCommand', () => {
  test('adds multiple units and returns consistent iso/utc/local fields', () => {
    const baseTime = '2025-08-10T12:00:00Z';
    const res = addTimeCommand({
      baseTime,
      years: 0,
      months: 0,
      weeks: 0,
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
      timezone: 'UTC',
    });
    assert.strictEqual(res.baseTime, new Date(baseTime).toISOString());
    assert.strictEqual(res.iso, '2025-08-11T14:03:04.000Z');
    assert.strictEqual(res.utc, '2025-08-11 14:03:04 UTC');
    assert.strictEqual(res.resultTimezone, 'UTC');
    assert.strictEqual(res.formattedResult, '2025-08-11 14:03:04');
    // Local fields should always be populated
    assert.ok(typeof res.local === 'string' && res.local.length > 0);
    assert.ok(typeof res.localTimezone === 'string' && res.localTimezone.length > 0);
  });

  test('defaults baseTime to now (smoke test)', () => {
    // Not asserting actual value (non-deterministic); just ensure shape and that it does not throw
    const res = addTimeCommand({ hours: 1, timezone: 'UTC' });
    assert.ok(typeof res.iso === 'string' && res.iso.endsWith('Z'));
    assert.ok(typeof res.utc === 'string' && res.utc.endsWith(' UTC'));
    assert.ok(typeof res.local === 'string' && res.local.length > 0);
  });
});
