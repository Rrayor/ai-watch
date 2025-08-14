import * as assert from 'assert';
import {
  MarkdownString,
  CancellationToken,
  LanguageModelToolInvocationOptions,
  LanguageModelToolInvocationPrepareOptions,
} from 'vscode';
import { GetCurrentDateTimeTool } from '../../modules/current-date-time/lm-tool/GetCurrentDateTimeTool';
import { GetCurrentDateTimeOptions } from '../../modules/current-date-time/model/GetCurrentDateTimeOptions';

suite('GetCurrentDateTimeTool', () => {
  test('invoke returns JSON and summary message', async () => {
    const tool = new GetCurrentDateTimeTool();
    const options = {
      input: { timezone: 'UTC' },
    } as unknown as LanguageModelToolInvocationOptions<GetCurrentDateTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('prepareInvocation composes title and message from params', async () => {
    const tool = new GetCurrentDateTimeTool();
    const prep = {
      input: { timezone: 'UTC', format: 'YYYY-MM-DD' },
    } as unknown as LanguageModelToolInvocationPrepareOptions<GetCurrentDateTimeOptions>;
    const { invocationMessage, confirmationMessages } = await tool.prepareInvocation(
      prep,
      undefined as unknown as CancellationToken,
    );
    assert.ok(invocationMessage.includes('Get current date and time'));
    assert.ok(confirmationMessages.message instanceof MarkdownString);
  });

  test('prepareInvocation without params mentions ISO and UTC', async () => {
    const tool = new GetCurrentDateTimeTool();
    const prep = {
      input: {},
    } as unknown as LanguageModelToolInvocationPrepareOptions<GetCurrentDateTimeOptions>;
    const { confirmationMessages } = await tool.prepareInvocation(
      prep,
      undefined as unknown as CancellationToken,
    );
    const msgStr = (confirmationMessages.message as MarkdownString).value;
    assert.ok(/ISO and UTC/.test(msgStr));
  });

  test('invoke with explicit timezone returns a result', async () => {
    const tool = new GetCurrentDateTimeTool();
    const options = {
      input: { timezone: 'UTC' },
    } as unknown as LanguageModelToolInvocationOptions<GetCurrentDateTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });
});
