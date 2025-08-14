import * as assert from 'assert';
import { BusinessDayTool } from '../../modules/business-day/lm-tool/businessDayTool';
import { CancellationToken, LanguageModelToolInvocationOptions } from 'vscode';
import { BusinessDayOptions } from '../../modules/business-day/model/BusinessDayOptions';

suite('BusinessDayTool', () => {
  test('invoke returns LanguageModelToolResult for addBusinessDays', async () => {
    const tool = new BusinessDayTool();
    const options = {
      input: { operation: 'addBusinessDays', date: '2025-08-11T00:00:00Z', days: 5 },
    } as unknown as LanguageModelToolInvocationOptions<BusinessDayOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke returns result for isBusinessDay', async () => {
    const tool = new BusinessDayTool();
    const options = {
      input: { operation: 'isBusinessDay', date: '2025-08-11T00:00:00Z' },
    } as unknown as LanguageModelToolInvocationOptions<BusinessDayOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });
});
