import * as assert from 'assert';
import { MarkdownString, CancellationToken, LanguageModelToolInvocationOptions } from 'vscode';
import { ConvertTimezoneTool } from '../../modules/convert-timezone/lm-tool/ConvertTimezoneTool';
import { ConvertTimezoneOptions } from '../../modules/convert-timezone/model/ConvertTimezoneOptions';

suite('ConvertTimezoneTool', () => {
  test('invoke returns a formatted message for valid input', async () => {
    const tool = new ConvertTimezoneTool();
    const options = {
      input: { date: '2025-08-14T10:00:00Z', toTimezone: 'UTC' },
    } as unknown as LanguageModelToolInvocationOptions<ConvertTimezoneOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
    const serialized = JSON.stringify(res);
    assert.ok(serialized.includes('```json'));
    // Human summary should include timezone label
    assert.ok(serialized.includes('- From timezone:'));
    assert.ok(serialized.includes('- To timezone:'));
  });

  test('prepareInvocation returns confirmation structure', async () => {
    const tool = new ConvertTimezoneTool();
    const prep = {
      input: { date: '2025-08-14T10:00:00Z', toTimezone: 'America/New_York' },
    } as unknown as import('vscode').LanguageModelToolInvocationPrepareOptions<ConvertTimezoneOptions>;
    const out = await tool.prepareInvocation(prep, undefined as unknown as CancellationToken);
    assert.strictEqual(out.invocationMessage, 'Converting timezone');
    assert.ok(out.confirmationMessages.title.includes('Convert timezone'));
    assert.ok(out.confirmationMessages.message instanceof MarkdownString);
  });

  test('invoke handles invalid date with error message', async () => {
    const tool = new ConvertTimezoneTool();
    const options = {
      input: { date: 'not-a-date', toTimezone: 'UTC' },
    } as unknown as LanguageModelToolInvocationOptions<ConvertTimezoneOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke handles invalid timezone with error message', async () => {
    const tool = new ConvertTimezoneTool();
    const options = {
      input: { date: '2025-08-14T10:00:00Z', toTimezone: 'Invalid/Zone' },
    } as unknown as LanguageModelToolInvocationOptions<ConvertTimezoneOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('getErrorMessage returns fallback for unexpected errors', () => {
    const anyInstance = new ConvertTimezoneTool() as unknown as {
      getErrorMessage(e: unknown): string;
    };
    const msg = anyInstance.getErrorMessage(new Error('boom'));
    assert.strictEqual(msg, 'Unexpected Error!');
  });
});
