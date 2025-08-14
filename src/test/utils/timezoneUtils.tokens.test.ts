import * as assert from 'assert';
import { OperationContext } from '../../modules/shared/model/OperationContext';
import { formatInTimezone } from '../../modules/shared/util/timezoneUtils';

suite('timezoneUtils token formatting', () => {
  test('supports YYYY, YY, MM, M, DD, D, HH, H, mm, m, ss, s tokens', () => {
    const d = new Date('2025-01-02T03:04:05Z');
    const ctx = new OperationContext();
    // UTC formatting
    const out = formatInTimezone(d, 'UTC', ctx, 'YYYY YY MM M DD D HH H mm m ss s');
    assert.strictEqual(out, '2025 25 01 1 02 2 03 3 04 4 05 5');
  });
});
