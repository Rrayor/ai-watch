import * as assert from 'assert';
import { workspace } from 'vscode';
import { businessDayCommand } from '../../modules/business-day/command/businessDayCommand';
import { BusinessDayOptions } from '../../modules/business-day/model/BusinessDayOptions';

suite('businessDayCommand', () => {
  test('isBusinessDay returns weekday and flag', () => {
    const res = businessDayCommand({ operation: 'isBusinessDay', date: '2025-08-15T10:00:00Z' }); // Friday
    assert.strictEqual(res.isBusinessDay, true);
    assert.strictEqual(res.weekday, 'Friday');
  });

  test('isBusinessDay false on weekend', () => {
    const res = businessDayCommand({ operation: 'isBusinessDay', date: '2025-08-16T10:00:00Z' }); // Saturday
    assert.strictEqual(res.isBusinessDay, false);
    assert.strictEqual(res.weekday, 'Saturday');
  });

  test('addBusinessDays requires days', () => {
    const bad: BusinessDayOptions = {
      operation: 'addBusinessDays',
      date: '2025-08-12T10:00:00Z',
    } as unknown as BusinessDayOptions;
    // Intentionally omit days to trigger error
    assert.throws(() => businessDayCommand(bad));
  });

  test('addBusinessDays honors excludedDates and custom businessDays', () => {
    // Start on Friday 2025-08-15, add 1 business day, but exclude Monday 2025-08-18
    const res = businessDayCommand({
      operation: 'addBusinessDays',
      date: '2025-08-15T10:00:00Z',
      days: 1,
      businessDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      excludedDates: ['2025-08-18'],
    });
    // Next business day should be Tuesday 2025-08-19 because Monday is excluded
    assert.strictEqual(res.result?.startsWith('2025-08-19'), true);
  });

  test('subtractBusinessDays subtracts using UTC-based logic', () => {
    const res = businessDayCommand({
      operation: 'subtractBusinessDays',
      date: '2025-08-20T10:00:00Z', // Wednesday
      days: 3,
    });
    // Three business days back from Wed: Tue, Mon, Fri -> 2025-08-15
    assert.strictEqual(res.result?.startsWith('2025-08-15'), true);
  });

  test('addBusinessDays with negative days subtracts using addBusinessDays branch', () => {
    const res = businessDayCommand({
      operation: 'addBusinessDays',
      date: '2025-08-18T10:00:00Z', // Monday
      days: -1,
    });
    // One business day back from Monday -> previous Friday 2025-08-15
    assert.strictEqual(res.result?.startsWith('2025-08-15'), true);
  });

  test('addBusinessDays with zero days throws MissingDaysError', () => {
    const opts = {
      operation: 'addBusinessDays',
      date: '2025-08-13T10:00:00Z',
      days: 0,
    } as unknown as BusinessDayOptions;
    assert.throws(() => businessDayCommand(opts));
  });

  test('unsupported operation throws', () => {
    // Cast to bypass type system intentionally to test runtime behavior
    const badOp = {
      operation: 'notSupported',
      date: '2025-08-12T10:00:00Z',
    } as unknown as BusinessDayOptions;
    assert.throws(() => businessDayCommand(badOp));
  });

  test('invalid custom businessDays throws', () => {
    const badDays = {
      operation: 'addBusinessDays',
      date: '2025-08-12T10:00:00Z',
      days: 1,
      businessDays: ['InvalidDay'], // intentionally invalid value
    } as unknown as BusinessDayOptions;
    assert.throws(() => businessDayCommand(badDays));
  });

  test('subtractBusinessDays with zero days throws MissingDaysError', () => {
    const opts = {
      operation: 'subtractBusinessDays',
      date: '2025-08-13T10:00:00Z',
      days: 0,
    } as unknown as BusinessDayOptions;
    assert.throws(() => businessDayCommand(opts));
  });

  test('uses configuration excludedDates when not provided', async () => {
    const cfg = workspace.getConfiguration('aiWatch');
    const prevExcluded = cfg.get('excludedDates');
    try {
      await cfg.update('excludedDates', ['2025-08-19'], true);
      // Start Monday 2025-08-18, add 1 business day; Tuesday 19th excluded -> expect Wednesday 20th
      const res = businessDayCommand({
        operation: 'addBusinessDays',
        date: '2025-08-18T10:00:00Z',
        days: 1,
      });
      assert.strictEqual(res.result?.startsWith('2025-08-20'), true);
    } finally {
      await cfg.update('excludedDates', prevExcluded, true);
    }
  });

  test('uses configuration businessDays when not provided', async () => {
    const cfg = workspace.getConfiguration('aiWatch');
    const prev = cfg.get('businessDays');
    try {
      await cfg.update('businessDays', ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], true);
      // From Thursday, adding 1 business day should skip Friday (not configured) and go to next Monday
      const res = businessDayCommand({
        operation: 'addBusinessDays',
        date: '2025-08-14T10:00:00Z', // Thursday
        days: 1,
      });
      assert.strictEqual(res.result?.startsWith('2025-08-18'), true); // Monday
    } finally {
      await cfg.update('businessDays', prev, true);
    }
  });

  test('falls back to STANDARD_BUSINESS_DAYS when businessDays config is missing', async () => {
    const originalGetConfiguration = workspace.getConfiguration;
    try {
      const fakeGetConfiguration: typeof workspace.getConfiguration = ((section?: string) => {
        if (section === 'aiWatch') {
          return {
            get: (_key: string) => undefined,
          } as unknown as ReturnType<typeof workspace.getConfiguration>;
        }
        return originalGetConfiguration.call(workspace, section) as unknown as ReturnType<
          typeof workspace.getConfiguration
        >;
      }) as typeof workspace.getConfiguration;
      // Override
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (workspace as any).getConfiguration = fakeGetConfiguration;

      const res = businessDayCommand({
        operation: 'addBusinessDays',
        date: '2025-08-15T10:00:00Z', // Friday
        days: 1,
      });
      assert.strictEqual(res.result?.startsWith('2025-08-18'), true);
    } finally {
      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (workspace as any).getConfiguration = originalGetConfiguration;
    }
  });
});
