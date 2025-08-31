import { workspace } from 'vscode';

suite('test-environment-reset', () => {
  test('clear aiWatch.defaultDateFormat to avoid leakage from previous runs', async () => {
    const cfg = workspace.getConfiguration('aiWatch');
    const prev = cfg.get('defaultDateFormat');
    if (prev !== undefined) {
      // Clear the global/user setting to ensure tests start from defaults
      await cfg.update('defaultDateFormat', undefined, true);
    }
  });
});
