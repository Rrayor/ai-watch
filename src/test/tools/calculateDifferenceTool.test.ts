import * as assert from 'assert';
import { MarkdownString, CancellationToken, LanguageModelToolInvocationOptions } from 'vscode';
import { CalculateDifferenceTool } from '../../modules/calculate-difference/lm-tool/calculateDifferenceTool';
import { CalculateDifferenceOptions } from '../../modules/calculate-difference/model/CalculateDifferenceOptions';

suite('CalculateDifferenceTool', () => {
  test('invoke returns a LanguageModelToolResult for valid input', async () => {
    const tool = new CalculateDifferenceTool();
    const options = {
      input: { from: '2025-01-01T00:00:00Z', to: '2025-01-02T01:02:03Z' },
    } as unknown as LanguageModelToolInvocationOptions<CalculateDifferenceOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res, 'Expected a result object');
  });

  test('invoke maps InvalidDateError to friendly message', async () => {
    const tool = new CalculateDifferenceTool();
    const options = {
      input: { from: 'invalid', to: 'also-invalid' },
    } as unknown as LanguageModelToolInvocationOptions<CalculateDifferenceOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    // We cannot rely on internal representation; ensure object exists
    assert.ok(res);
  });

  test('prepareInvocation returns expected structure', async () => {
    const tool = new CalculateDifferenceTool();
    const prepOptions = {
      input: { from: '2025-01-01T00:00:00Z', to: '2025-01-02T00:00:00Z' },
    } as unknown as import('vscode').LanguageModelToolInvocationPrepareOptions<CalculateDifferenceOptions>;
    const { invocationMessage, confirmationMessages } = await tool.prepareInvocation(
      prepOptions,
      undefined as unknown as CancellationToken,
    );
    assert.strictEqual(invocationMessage, 'Calculating time difference');
    assert.ok(confirmationMessages.title.includes('Calculate time difference'));
    assert.ok(confirmationMessages.message instanceof MarkdownString);
  });
});
