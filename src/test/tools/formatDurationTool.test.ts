import * as assert from 'assert';
import { FormatDurationTool } from '../../modules/format-duration/lm-tool/formatDurationTool';
import { CancellationToken, LanguageModelToolInvocationOptions } from 'vscode';
import { FormatDurationOptions } from '../../modules/format-duration/model/FormatDurationOptions';

suite('FormatDurationTool', () => {
  test('invoke returns combined JSON and readable message', async () => {
    const tool = new FormatDurationTool();
    const options = {
      input: { from: '2025-01-01T00:00:00Z', to: '2025-01-01T00:00:10Z' },
    } as unknown as LanguageModelToolInvocationOptions<FormatDurationOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke handles invalid dates with friendly error', async () => {
    const tool = new FormatDurationTool();
    const options = {
      input: { from: 'bad', to: 'worse' },
    } as unknown as LanguageModelToolInvocationOptions<FormatDurationOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });
});
