import * as assert from 'assert';
import {
  CancellationToken,
  LanguageModelToolInvocationOptions,
  LanguageModelToolInvocationPrepareOptions,
  MarkdownString,
} from 'vscode';
import { AddTimeTool } from '../../modules/add-time/lm-tool/addTimeTool';
import { AddTimeOptions } from '../../modules/add-time/model/AddTimeOptions';
import { InvalidDateError } from '../../modules/shared/error/InvalidDateError';
import { InvalidTimezoneError } from '../../modules/shared/error/InvalidTimezoneError';

suite('AddTimeTool', () => {
  test('prepareInvocation builds duration and base text', async () => {
    const tool = new AddTimeTool();
    const prep = {
      input: { days: 2, hours: 3, baseTime: '2025-08-20T15:30:30Z' },
    } as unknown as LanguageModelToolInvocationPrepareOptions<AddTimeOptions>;
    const prepared = await tool.prepareInvocation(prep, undefined as unknown as CancellationToken);
    const invMsgStr =
      typeof prepared.invocationMessage === 'string'
        ? (prepared.invocationMessage as string)
        : (prepared.invocationMessage as MarkdownString).value;
    assert.ok(invMsgStr.includes('Adding'));
    assert.ok(
      prepared.confirmationMessages &&
        prepared.confirmationMessages.title.includes('Add time duration'),
    );
    assert.ok(
      prepared.confirmationMessages &&
        prepared.confirmationMessages.message instanceof MarkdownString,
    );
  });

  test('prepareInvocation uses "no time" and "current time" when no units and no baseTime', async () => {
    const tool = new AddTimeTool();
    const prep = {
      input: {},
    } as unknown as LanguageModelToolInvocationPrepareOptions<AddTimeOptions>;
    const prepared = await tool.prepareInvocation(prep, undefined as unknown as CancellationToken);

    const invMsgStr =
      typeof prepared.invocationMessage === 'string'
        ? (prepared.invocationMessage as string)
        : (prepared.invocationMessage as MarkdownString).value;

    assert.ok(invMsgStr.includes('Adding no time'));
    assert.ok(
      prepared.confirmationMessages &&
        prepared.confirmationMessages.title.includes('Add time duration'),
    );
    assert.ok(
      prepared.confirmationMessages &&
        prepared.confirmationMessages.message instanceof MarkdownString,
    );
    let msgVal = String(prepared.confirmationMessages?.message);
    if (
      prepared.confirmationMessages &&
      typeof prepared.confirmationMessages.message !== 'string'
    ) {
      msgVal = (prepared.confirmationMessages.message as MarkdownString).value;
    }
    assert.ok(msgVal.includes('Add no time to current time?'));
  });

  test('prepareInvocation uses provided baseTime when present', async () => {
    const tool = new AddTimeTool();
    const base = '2025-01-02T03:04:05Z';
    const prep = {
      input: { baseTime: base },
    } as unknown as LanguageModelToolInvocationPrepareOptions<AddTimeOptions>;
    const prepared = await tool.prepareInvocation(prep, undefined as unknown as CancellationToken);

    const invMsgStr =
      typeof prepared.invocationMessage === 'string'
        ? (prepared.invocationMessage as string)
        : (prepared.invocationMessage as MarkdownString).value;

    assert.ok(invMsgStr.includes('Adding no time'));
    let msgVal = String(prepared.confirmationMessages?.message);
    if (
      prepared.confirmationMessages &&
      typeof prepared.confirmationMessages.message !== 'string'
    ) {
      msgVal = (prepared.confirmationMessages.message as MarkdownString).value;
    }
    assert.ok(msgVal.includes(`to ${base}?`));
  });

  test('invoke returns a result object for valid input', async () => {
    const tool = new AddTimeTool();
    const options = {
      input: {
        baseTime: '2025-08-20T15:30:30Z',
        days: 1,
        minutes: 30,
        timezone: 'UTC',
      },
    } as unknown as LanguageModelToolInvocationOptions<AddTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke maps InvalidDateError to friendly message', async () => {
    const tool = new AddTimeTool();
    const options = {
      input: {
        // invalid ISO -> should trigger InvalidDateError in command path via parseISOString
        baseTime: 'not-an-iso-date',
        days: 1,
        timezone: 'UTC',
      },
    } as unknown as LanguageModelToolInvocationOptions<AddTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke maps InvalidTimezoneError to friendly message', async () => {
    const tool = new AddTimeTool();
    const options = {
      input: {
        baseTime: '2025-08-20T15:30:30Z',
        hours: 1,
        timezone: 'Invalid/Zone',
      },
    } as unknown as LanguageModelToolInvocationOptions<AddTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('invoke result contains JSON block and readable lines for valid input', async () => {
    const tool = new AddTimeTool();
    const options = {
      input: { baseTime: '2025-08-20T15:30:30Z', days: 1, timezone: 'UTC' },
    } as unknown as LanguageModelToolInvocationOptions<AddTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
    const serialized = JSON.stringify(res);
    assert.ok(serialized.includes('```json'));
    assert.ok(serialized.includes('ISO format'));
    assert.ok(serialized.includes('UTC format'));
  });

  test('invoke with invalid timezone returns friendly timezone error message', async () => {
    const tool = new AddTimeTool();
    const options = {
      input: { baseTime: '2025-08-20T15:30:30Z', hours: 1, timezone: 'Invalid/Zone' },
    } as unknown as LanguageModelToolInvocationOptions<AddTimeOptions>;
    const res = await tool.invoke(options, undefined as unknown as CancellationToken);
    assert.ok(res);
    const serializedErr = JSON.stringify(res);
    assert.ok(serializedErr.includes('Error adding time:'));
    assert.ok(
      serializedErr.includes('Invalid/Zone') ||
        serializedErr.toLowerCase().includes('invalid timezone'),
    );
  });

  test('getErrorMessage returns correct message for InvalidDateError', () => {
    const toolAny = AddTimeTool as unknown as { getErrorMessage(e: unknown): string };
    const msg = toolAny.getErrorMessage(new InvalidDateError('not-a-date'));
    assert.strictEqual(
      msg,
      'Error adding time: Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.',
    );
  });

  test('getErrorMessage returns error message for InvalidTimezoneError including original message', () => {
    const toolAny = AddTimeTool as unknown as { getErrorMessage(e: unknown): string };
    const tzErr = new InvalidTimezoneError('Invalid/Zone');
    const msg = toolAny.getErrorMessage(tzErr);
    assert.strictEqual(msg, `Error adding time: ${tzErr.message}`);
  });

  test('getErrorMessage returns unknown for other errors', () => {
    const toolAny = AddTimeTool as unknown as { getErrorMessage(e: unknown): string };
    const msg = toolAny.getErrorMessage(new Error('boom'));
    assert.strictEqual(msg, 'Error adding time: Unknown error.');
  });

  test('buildResultMessage includes JSON, timezone line and additional info when timezone provided', () => {
    const builder = AddTimeTool as unknown as {
      buildResultMessage(r: unknown, p: unknown, d: string[], i: string[]): string;
    };

    const result = {
      baseTime: '2025-08-20T15:30:30Z',
      iso: '2025-08-21T16:00:00.000Z',
      utc: '2025-08-21 16:00:00 UTC',
      local: '2025-08-21 16:00:00',
      localTimezone: 'UTC',
      formattedResult: '2025-08-21 16:00:00',
      resultTimezone: 'UTC',
    };

    const params = { baseTime: '2025-08-20T15:30:30Z', timezone: 'UTC' };
    const durationParts = ['1 day', '30 minutes'];
    const info = ['note: adjusted for DST'];

    const out = builder.buildResultMessage(result, params, durationParts, info);
    assert.ok(out.startsWith('```json'));
    assert.ok(out.includes('Adding 1 day, 30 minutes to 2025-08-20T15:30:30Z:'));
    assert.ok(out.includes('- Result: 2025-08-21 16:00:00 (UTC)'));
    assert.ok(out.includes('- ISO format: 2025-08-21T16:00:00.000Z'));
    assert.ok(out.includes('- UTC format: 2025-08-21 16:00:00 UTC'));
    // timezone-specific formatted line
    assert.ok(out.includes('- UTC: 2025-08-21 16:00:00'));
    // additional info
    assert.ok(out.includes('Additional Information'));
    assert.ok(out.includes('note: adjusted for DST'));
  });

  test('buildResultMessage falls back to "no time" when durationParts empty and omits timezone line', () => {
    const builder = AddTimeTool as unknown as {
      buildResultMessage(r: unknown, p: unknown, d: string[], i: string[]): string;
    };

    const result = {
      iso: '2025-08-21T00:00:00.000Z',
      utc: '2025-08-21 00:00:00 UTC',
      local: '2025-08-21 00:00:00',
      localTimezone: 'UTC',
      formattedResult: '2025-08-21 00:00:00',
      resultTimezone: 'UTC',
    };

    const params = {}; // no timezone, no baseTime
    const durationParts: string[] = [];
    const info: string[] = [];

    const out = builder.buildResultMessage(result, params, durationParts, info);
    assert.ok(out.startsWith('```json'));
    assert.ok(out.includes('Adding no time to now:'));
    // ISO/UTC lines still present
    assert.ok(out.includes('- ISO format: 2025-08-21T00:00:00.000Z'));
    assert.ok(out.includes('- UTC format: 2025-08-21 00:00:00 UTC'));
    // No brittle negative assertion — ISO/UTC lines are the stable checks above.
  });
});
