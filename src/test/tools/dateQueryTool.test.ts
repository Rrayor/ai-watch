import * as assert from 'assert';
import { DateQueryTool } from '../../modules/date-query/lm-tool/dateQueryTool';
import { CancellationToken, LanguageModelToolInvocationOptions } from 'vscode';
import { DateQueryOptions } from '../../modules/date-query/model/DateQueryOptions';

suite('DateQueryTool', () => {
  test('invoke returns JSON string part for valid input', async () => {
    const tool = new DateQueryTool();
    const invokeOptions = {
      input: {
        baseDate: '2025-08-14T10:00:00Z',
        timezone: 'UTC',
        queries: [
          { type: 'startOfPeriod', period: 'day' },
          { type: 'endOfPeriod', period: 'day' },
        ],
      },
    } as unknown as LanguageModelToolInvocationOptions<DateQueryOptions>;
    const res = await tool.invoke(invokeOptions, undefined as unknown as CancellationToken);
    assert.ok(res);
  });

  test('buildResponseMessage formats results with labels', () => {
    const message = DateQueryTool.buildResponseMessage(
      {
        dates: ['2025-01-01', '2025-12-31'],
      } as import('../../modules/date-query/model/DateQueryResult').DateQueryResult,
      [
        { type: 'startOfPeriod', period: 'year' },
        { type: 'endOfPeriod', period: 'year' },
      ] as unknown as DateQueryOptions['queries'],
    );
    assert.ok(message.includes('Start of year'));
    assert.ok(message.includes('End of year'));
  });

  test('buildResponseMessage includes next/previous weekday labels', () => {
    const message = DateQueryTool.buildResponseMessage(
      {
        dates: ['2025-08-18', '2025-08-08'],
      } as import('../../modules/date-query/model/DateQueryResult').DateQueryResult,
      [
        { type: 'nextWeekday', weekday: 'monday' },
        { type: 'previousWeekday', weekday: 'friday' },
      ] as unknown as DateQueryOptions['queries'],
    );
    assert.ok(message.includes('Next monday'));
    assert.ok(message.includes('Previous friday'));
  });
});
