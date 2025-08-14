import * as assert from 'assert';
import { workspace } from 'vscode';
import {
  formatUTC,
  formatInTimezone,
  getUserTimezone,
} from '../../modules/shared/util/timezoneUtils';
import { OperationContext } from '../../modules/shared/model/OperationContext';
import { InvalidTimezoneError } from '../../modules/shared/error/InvalidTimezoneError';

suite('timezoneUtils', () => {
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

  test('getUserTimezone returns a non-empty string or UTC when detection fails', () => {
    const ctx = new OperationContext();
    const tz = getUserTimezone(ctx);
    assert.ok(typeof tz === 'string' && tz.length > 0);
  });
});
