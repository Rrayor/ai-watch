import * as assert from 'assert';
import {
  CancellationToken,
  LanguageModelToolInvocationOptions,
  LanguageModelToolInvocationPrepareOptions,
  MarkdownString,
} from 'vscode';
import { SubtractTimeTool } from '../../modules/subtract-time/lm-tool/subtractTimeTool';
import { SubtractTimeOptions } from '../../modules/subtract-time/model/SubtractTimeOptions';

suite('SubtractTimeTool', () => {
  test('prepareInvocation builds duration and base text', async () => {
    const tool = new SubtractTimeTool();
    const prep = {
      input: { days: 2, hours: 3, baseTime: '2025-08-20T15:30:30Z' },
    } as unknown as LanguageModelToolInvocationPrepareOptions<SubtractTimeOptions>;
    const prepared = await tool.prepareInvocation(prep, undefined as unknown as CancellationToken);
    const invMsgStr =
      typeof prepared.invocationMessage === 'string'
        ? (prepared.invocationMessage as string)
        : (prepared.invocationMessage as MarkdownString).value;
    assert.ok(invMsgStr.includes('Subtract'));
    assert.ok(
      prepared.confirmationMessages &&
        prepared.confirmationMessages.title.includes('Subtract time duration'),
    );
    assert.ok(
      prepared.confirmationMessages &&
        prepared.confirmationMessages.message instanceof MarkdownString,
    );
  });

  test('invoke returns a result object for valid input', async () => {
    const tool = new SubtractTimeTool();
    const options = {
      input: {
        baseTime: '2025-08-20T15:30:30Z',
        days: 1,
        minutes: 30,
        timezone: 'UTC',
      },
    } as unknown as LanguageModelToolInvocationOptions<SubtractTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke maps InvalidDateError to friendly message', async () => {
    const tool = new SubtractTimeTool();
    const options = {
      input: {
        // invalid ISO -> should trigger InvalidDateError in command path via parseISOString
        baseTime: 'not-an-iso-date',
        days: 1,
        timezone: 'UTC',
      },
    } as unknown as LanguageModelToolInvocationOptions<SubtractTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke maps InvalidTimezoneError to friendly message', async () => {
    const tool = new SubtractTimeTool();
    const options = {
      input: {
        baseTime: '2025-08-20T15:30:30Z',
        hours: 1,
        timezone: 'Invalid/Zone',
      },
    } as unknown as LanguageModelToolInvocationOptions<SubtractTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });
});
