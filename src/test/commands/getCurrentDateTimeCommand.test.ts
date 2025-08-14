import * as assert from 'assert';
import { workspace } from 'vscode';
import { formatInTimezone, formatUTC } from '../../modules/shared/util/timezoneUtils';
import { OperationContext } from '../../modules/shared/model/OperationContext';

suite('shared timezone utils used by getCurrentDate-like commands', () => {
  test('formatUTC has fixed suffix', () => {
    const d = new Date('2025-08-10T12:30:45Z');
    assert.strictEqual(formatUTC(d), '2025-08-10 12:30:45 UTC');
  });

  test('formatInTimezone respects defaultDateFormat config when set', async () => {
    const cfg = workspace.getConfiguration('aiWatch');
    const prev = cfg.get('defaultDateFormat');
    try {
      await cfg.update('defaultDateFormat', 'YYYY-MM-DD HH:mm:ss', true);
      const out = formatInTimezone(new Date('2025-08-10T12:30:45Z'), 'UTC', new OperationContext());
      assert.strictEqual(out, '2025-08-10 12:30:45');
    } finally {
      await cfg.update('defaultDateFormat', prev, true);
    }
  });
});
