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
});
