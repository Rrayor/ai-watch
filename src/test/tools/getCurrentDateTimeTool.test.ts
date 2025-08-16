import * as assert from 'assert';
import {
  CancellationToken,
  LanguageModelToolInvocationOptions,
  LanguageModelToolInvocationPrepareOptions,
  MarkdownString,
} from 'vscode';
import { GetCurrentDateTimeTool } from '../../modules/current-date-time/lm-tool/GetCurrentDateTimeTool';
import { GetCurrentDateTimeOptions } from '../../modules/current-date-time/model/GetCurrentDateTimeOptions';

suite('GetCurrentDateTimeTool', () => {
  test('prepareInvocation: no params -> ISO/UTC message', async () => {
    const tool = new GetCurrentDateTimeTool();
    const prep = {
      input: {},
    } as unknown as LanguageModelToolInvocationPrepareOptions<GetCurrentDateTimeOptions>;
    const out = await tool.prepareInvocation(prep, undefined as unknown as CancellationToken);
    assert.ok(out.invocationMessage.toString().toLowerCase().includes('get current date and time'));
    const msg = (out.confirmationMessages.message as MarkdownString).value;
    assert.ok(msg.includes('ISO and UTC'));
  });

  test('prepareInvocation: with timezone and format', async () => {
    const tool = new GetCurrentDateTimeTool();
    const prep = {
      input: { timezone: 'UTC', format: 'YYYY-MM-DD' },
    } as unknown as LanguageModelToolInvocationPrepareOptions<GetCurrentDateTimeOptions>;
    const out = await tool.prepareInvocation(prep, undefined as unknown as CancellationToken);
    assert.ok(out.invocationMessage.toString().includes('UTC'));
    const msg = (out.confirmationMessages.message as MarkdownString).value;
    assert.ok(msg.includes('timezone UTC'));
    assert.ok(msg.includes('format "YYYY-MM-DD"'));
  });

  test('invoke: returns JSON block and timezone-formatted line when timezone provided', async () => {
    const tool = new GetCurrentDateTimeTool();
    const options = {
      input: { timezone: 'UTC', format: 'YYYY-MM-DD HH:mm' },
    } as unknown as LanguageModelToolInvocationOptions<GetCurrentDateTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    const serialized = JSON.stringify(res);
    assert.ok(serialized.includes('```json'));
    // Summary should include timezone-labeled formatted line
    assert.ok(serialized.includes('- UTC:'));
  });

  test('appendFormatted and appendInfo private branches', () => {
    const anyTool = GetCurrentDateTimeTool as unknown as {
      appendFormatted(lines: string[], result: unknown): void;
      appendInfo(lines: string[], info?: string[]): void;
    };

    // appendFormatted: branch without resultTimezone
    const lines1: string[] = [];
    anyTool.appendFormatted(lines1, { formattedResult: 'X' });
    assert.ok(lines1.some((l) => l.startsWith('- Formatted:')));

    // appendInfo: false branch (no info)
    const lines2: string[] = [];
    anyTool.appendInfo(lines2, undefined);
    assert.strictEqual(lines2.length, 0);

    // appendInfo: true branch (with info)
    const lines3: string[] = [];
    anyTool.appendInfo(lines3, ['a', 'b']);
    assert.ok(lines3[0] === '- Info:');
    assert.ok(lines3[1].trim().startsWith('•'));
    assert.ok(lines3[2].trim().startsWith('•'));
  });

  test('buildSummary adds local without timezone suffix when localTimezone is missing', () => {
    const anyTool = GetCurrentDateTimeTool as unknown as {
      buildSummary(r: unknown): string;
    };
    const summary = anyTool.buildSummary({ local: '2025-01-01 00:00:00' });
    assert.ok(summary.includes('Local time: 2025-01-01 00:00:00'));
    assert.ok(!summary.includes('Local time: 2025-01-01 00:00:00 ('));
  });
});
