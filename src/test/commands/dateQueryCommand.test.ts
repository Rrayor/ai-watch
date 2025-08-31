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

  test('previousWeekday missing weekday throws', () => {
    const q = { type: 'previousWeekday' } as unknown as Parameters<
      typeof dateQueryCommand
    >[0]['queries'][0];
    assert.throws(() => dateQueryCommand({ baseDate: base, timezone: 'UTC', queries: [q] }));
  });

  test('endOfPeriod missing period throws', () => {
    const q = { type: 'endOfPeriod' } as unknown as Parameters<
      typeof dateQueryCommand
    >[0]['queries'][0];
    assert.throws(() => dateQueryCommand({ baseDate: base, timezone: 'UTC', queries: [q] }));
  });

  test('endOfPeriod invalid period throws', () => {
    const q = { type: 'endOfPeriod', period: 'decade' } as unknown as Parameters<
      typeof dateQueryCommand
    >[0]['queries'][0];
    assert.throws(() => dateQueryCommand({ baseDate: base, timezone: 'UTC', queries: [q] }));
  });

  test('undefined query in list throws with index', () => {
    const queries = [
      { type: 'startOfPeriod', period: 'day' } as Parameters<
        typeof dateQueryCommand
      >[0]['queries'][0],
      undefined as unknown as Parameters<typeof dateQueryCommand>[0]['queries'][0],
    ];
    assert.throws(() => dateQueryCommand({ baseDate: base, timezone: 'UTC', queries }));
  });

  test('nextWeekday same day uses +7 days', () => {
    const res = dateQueryCommand({
      baseDate: base,
      timezone: 'UTC',
      queries: [{ type: 'nextWeekday', weekday: 'thursday', weekStart: 'monday' }],
    });
    assert.strictEqual(res.dates?.[0].startsWith('2025-08-21'), true);
  });

  test('previousWeekday same day uses -7 days', () => {
    const res = dateQueryCommand({
      baseDate: base,
      timezone: 'UTC',
      queries: [{ type: 'previousWeekday', weekday: 'thursday', weekStart: 'monday' }],
    });
    assert.strictEqual(res.dates?.[0].startsWith('2025-08-07'), true);
  });

  test('no timezone provided falls back to system timezone', () => {
    const res = dateQueryCommand({
      baseDate: base,
      // omit timezone to exercise getEffectiveTimezone
      queries: [{ type: 'startOfPeriod', period: 'day' }],
    } as unknown as Parameters<typeof dateQueryCommand>[0]);
    // Be tolerant of local tz; just assert it's an ISO-like string beginning with year-month
    assert.ok(/^2025-08-\d{2}T/.test(res.dates?.[0] ?? ''));
  });

  test('December boundaries: endOfMonth and endOfQuarter', () => {
    const decBase = '2025-12-14T10:00:00Z';
    const res = dateQueryCommand({
      baseDate: decBase,
      timezone: 'UTC',
      queries: [
        { type: 'endOfPeriod', period: 'month' },
        { type: 'endOfPeriod', period: 'quarter' },
      ],
    });
    assert.strictEqual(res.dates?.[0].startsWith('2025-12-31'), true);
    assert.strictEqual(res.dates?.[1].startsWith('2025-12-31'), true);
  });

  test('when timezone detection throws, falls back to UTC', () => {
    const original = Intl.DateTimeFormat;
    try {
      // Force detection failure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Intl as any).DateTimeFormat = function () {
        throw new Error('boom');
      } as unknown as typeof Intl.DateTimeFormat;
      const res = dateQueryCommand({
        baseDate: base,
        // omit timezone to trigger detection
        queries: [{ type: 'startOfPeriod', period: 'day' }],
      } as unknown as Parameters<typeof dateQueryCommand>[0]);
      // Should still return a valid ISO string for the same local day
      assert.ok(/^\d{4}-\d{2}-\d{2}T/.test(res.dates?.[0] ?? ''));
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Intl as any).DateTimeFormat = original as unknown as typeof Intl.DateTimeFormat;
    }
  });

  test('nextWeekday uses previous result as base when index > 0', () => {
    const res = dateQueryCommand({
      baseDate: base,
      timezone: 'UTC',
      queries: [
        { type: 'nextWeekday', weekday: 'monday', weekStart: 'monday' },
        { type: 'nextWeekday', weekday: 'friday', weekStart: 'monday' },
      ],
    });
    const first = new Date(res.dates?.[0] ?? '');
    const second = new Date(res.dates?.[1] ?? '');
    assert.ok(second > first);
  });

  test('non-chained queries use baseDate for each query when chain is false', () => {
    // base is 2025-08-14 (Thursday)
    const res = dateQueryCommand({
      baseDate: base,
      timezone: 'UTC',
      chain: false,
      queries: [
        { type: 'nextWeekday', weekday: 'tuesday' },
        { type: 'previousWeekday', weekday: 'friday' },
      ],
    } as unknown as Parameters<typeof dateQueryCommand>[0]);
    // next Tuesday after 2025-08-14 is 2025-08-19
    assert.strictEqual(res.dates?.[0].startsWith('2025-08-19'), true);
    // previous Friday before 2025-08-14 is 2025-08-08
    assert.strictEqual(res.dates?.[1].startsWith('2025-08-08'), true);
  });

  test('startOfPeriod week with numeric weekStart', async () => {
    const cfg = workspace.getConfiguration('aiWatch');
    const prev = cfg.get('weekStart');
    try {
      await cfg.update('weekStart', 0, true); // Sunday
      const res = dateQueryCommand({
        baseDate: base,
        timezone: 'UTC',
        queries: [{ type: 'startOfPeriod', period: 'week', weekStart: 0 }], // Sunday start
      });
      assert.strictEqual(res.dates?.[0].startsWith('2025-08-10'), true);
    } finally {
      await cfg.update('weekStart', prev, true);
    }
  });
});
