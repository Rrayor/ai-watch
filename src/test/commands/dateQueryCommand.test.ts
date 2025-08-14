import * as assert from 'assert';
import { workspace } from 'vscode';
import { dateQueryCommand } from '../../modules/date-query/command/dateQueryCommand';

suite('dateQueryCommand', () => {
  const base = '2025-08-14T10:00:00Z'; // Thursday

  test('nextWeekday from Thursday to Monday with weekStart config numeric', async () => {
    const cfg = workspace.getConfiguration('aiWatch');
    const prev = cfg.get('weekStart');
    try {
      await cfg.update('weekStart', 1, true); // Monday
      const res = dateQueryCommand({
        baseDate: base,
        timezone: 'UTC',
        queries: [{ type: 'nextWeekday', weekday: 'monday' }],
      });
      assert.strictEqual(res.dates?.[0].startsWith('2025-08-18'), true);
    } finally {
      await cfg.update('weekStart', prev, true);
    }
  });

  test('previousWeekday from Thursday to Monday with explicit weekStart string', () => {
    const res = dateQueryCommand({
      baseDate: base,
      timezone: 'UTC',
      queries: [{ type: 'previousWeekday', weekday: 'monday', weekStart: 'monday' }],
    });
    assert.strictEqual(res.dates?.[0].startsWith('2025-08-11'), true);
  });

  test('startOfPeriod day, week, month, quarter, year', () => {
    const res = dateQueryCommand({
      baseDate: base,
      timezone: 'UTC',
      queries: [
        { type: 'startOfPeriod', period: 'day' },
        { type: 'startOfPeriod', period: 'week', weekStart: 'monday' },
        { type: 'startOfPeriod', period: 'month' },
        { type: 'startOfPeriod', period: 'quarter' },
        { type: 'startOfPeriod', period: 'year' },
      ],
    });
    assert.strictEqual(res.dates?.[0].startsWith('2025-08-14'), true);
    assert.strictEqual(res.dates?.[1].startsWith('2025-08-11'), true);
    assert.strictEqual(res.dates?.[2].startsWith('2025-08-01'), true);
    assert.strictEqual(res.dates?.[3].startsWith('2025-07-01'), true);
    assert.strictEqual(res.dates?.[4].startsWith('2025-01-01'), true);
  });

  test('endOfPeriod day, week, month, quarter, year', () => {
    const res = dateQueryCommand({
      baseDate: base,
      timezone: 'UTC',
      queries: [
        { type: 'endOfPeriod', period: 'day' },
        { type: 'endOfPeriod', period: 'week', weekStart: 'monday' },
        { type: 'endOfPeriod', period: 'month' },
        { type: 'endOfPeriod', period: 'quarter' },
        { type: 'endOfPeriod', period: 'year' },
      ],
    });
    assert.strictEqual(res.dates?.[0].startsWith('2025-08-14'), true);
    assert.strictEqual(res.dates?.[1].startsWith('2025-08-17'), true);
    assert.strictEqual(res.dates?.[2].startsWith('2025-08-31'), true);
    assert.strictEqual(res.dates?.[3].startsWith('2025-09-30'), true);
    assert.strictEqual(res.dates?.[4].startsWith('2025-12-31'), true);
  });

  test('invalid query type throws', () => {
    const bad = { type: 'nope' } as unknown as Parameters<typeof dateQueryCommand>[0]['queries'][0];
    assert.throws(() => dateQueryCommand({ baseDate: base, timezone: 'UTC', queries: [bad] }));
  });

  test('missing weekday throws', () => {
    const q = { type: 'nextWeekday' } as unknown as Parameters<
      typeof dateQueryCommand
    >[0]['queries'][0];
    assert.throws(() => dateQueryCommand({ baseDate: base, timezone: 'UTC', queries: [q] }));
  });

  test('missing period throws', () => {
    const q = { type: 'startOfPeriod' } as unknown as Parameters<
      typeof dateQueryCommand
    >[0]['queries'][0];
    assert.throws(() => dateQueryCommand({ baseDate: base, timezone: 'UTC', queries: [q] }));
  });
});
