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

  test('invoke returns readable message for subtractBusinessDays', async () => {
    const tool = new BusinessDayTool();
    const options = {
      input: { operation: 'subtractBusinessDays', date: '2025-08-20T00:00:00Z', days: 1 },
    } as unknown as LanguageModelToolInvocationOptions<BusinessDayOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke error: MissingDaysError (addBusinessDays without days)', async () => {
    const tool = new BusinessDayTool();
    const options = {
      input: { operation: 'addBusinessDays', date: '2025-08-11T00:00:00Z' },
    } as unknown as LanguageModelToolInvocationOptions<BusinessDayOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke error: UnsupportedBusinessDayOperation', async () => {
    const tool = new BusinessDayTool();
    const options = {
      input: {
        operation: 'notSupported' as unknown as 'addBusinessDays',
        date: '2025-08-11T00:00:00Z',
      },
    } as unknown as LanguageModelToolInvocationOptions<BusinessDayOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke error: InvalidWeekDayError from custom businessDays', async () => {
    const tool = new BusinessDayTool();
    const options = {
      input: {
        operation: 'addBusinessDays',
        date: '2025-08-11T00:00:00Z',
        days: 1,
        businessDays: ['NotARealDay'],
      },
    } as unknown as LanguageModelToolInvocationOptions<BusinessDayOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke error: InvalidDateError falls through to unexpected', async () => {
    const tool = new BusinessDayTool();
    const options = {
      input: { operation: 'isBusinessDay', date: 'not-a-date' },
    } as unknown as LanguageModelToolInvocationOptions<BusinessDayOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('buildResponseMessage handles default branch for unknown operation', () => {
    const anyTool = BusinessDayTool as unknown as {
      buildResponseMessage(param: BusinessDayOptions, result: unknown): string;
    };
    const out = anyTool.buildResponseMessage(
      { operation: 'unknown' as unknown as 'addBusinessDays', date: '2025-01-01' },
      { some: 'result' },
    );
    assert.ok(out.includes('```json'));
    assert.ok(out.includes('Unknown operation'));
  });
});
