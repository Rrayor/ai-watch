import * as assert from 'assert';
import { OperationContext } from '../../modules/shared/model/OperationContext';
import { formatInTimezone } from '../../modules/shared/util/timezoneUtils';
import { workspace } from 'vscode';

suite('timezoneUtils token formatting', () => {
  test('supports YYYY, YY, MM, M, DD, D, HH, H, mm, m, ss, s tokens', () => {
    const d = new Date('2025-01-02T03:04:05Z');
    const ctx = new OperationContext();
    // UTC formatting
    const out = formatInTimezone(d, 'UTC', ctx, 'YYYY YY MM M DD D HH H mm m ss s');
    assert.strictEqual(out, '2025 25 01 1 02 2 03 3 04 4 05 5');
  });

  test('uses configured default format when no explicit timezone provided', async () => {
    const d = new Date('2025-01-02T03:04:05Z');
    const ctx = new OperationContext();
    const cfg = workspace.getConfiguration('aiWatch');
    const prev = cfg.get('defaultDateFormat');
    try {
      await cfg.update('defaultDateFormat', 'YYYY-MM-DD HH:mm:ss', true);
      // Pass empty timezone string to force formatWithCustomFormat using local/system path
      const out = formatInTimezone(d, '', ctx);
      // Should match configured format in some timezone; assert tokens applied (YYYY-MM-DD present and HH:mm:ss digits)
      // We avoid exact string due to host timezone, but ensure token structure is respected.
      assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(out));
    } finally {
      await cfg.update('defaultDateFormat', prev, true);
    }
  });
});
