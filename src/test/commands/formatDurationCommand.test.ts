import * as assert from 'assert';
import { workspace } from 'vscode';
import { formatDurationCommand } from '../../modules/format-duration/command/formatDurationCommand';

suite('formatDurationCommand', () => {
  const from = '2025-01-01T00:00:00Z';
  const to = '2025-01-02T01:02:03Z';

  test('standard verbosity with default maxUnits=3', () => {
    const { formatted } = formatDurationCommand({ from, to });
    assert.strictEqual(formatted, '1 day, 1 hour, 2 minutes');
  });

  test('verbose includes "and" and can include all units when maxUnits is large', () => {
    const { formatted } = formatDurationCommand({ from, to, verbosity: 'verbose', maxUnits: 10 });
    assert.strictEqual(formatted, '1 day, 1 hour, 2 minutes and 3 seconds');
  });

  test('compact preserves sign and returns 0s for zero duration', () => {
    // Negative duration
    const neg = formatDurationCommand({ from: to, to: from, verbosity: 'compact', maxUnits: 2 });
    assert.strictEqual(neg.formatted, '-1d 1h');

    // Zero duration
    const zero = formatDurationCommand({ from, to: from, verbosity: 'compact' });
    assert.strictEqual(zero.formatted, '0s');
  });

  test('maxUnits negative or zero yields default behavior (top units fallback)', () => {
    const negUnits = formatDurationCommand({ from, to, verbosity: 'standard', maxUnits: 0 });
    // With zero maxUnits, date-fns falls back to default non-zero units rendering
    assert.strictEqual(negUnits.formatted, '1 day, 1 hour, 2 minutes');

    const veryNeg = formatDurationCommand({ from, to, verbosity: 'compact', maxUnits: -10 });
    assert.strictEqual(veryNeg.formatted, '1d 1h 2m');
  });

  test('maxUnits larger than available units includes all present units', () => {
    const { formatted } = formatDurationCommand({ from, to, verbosity: 'standard', maxUnits: 10 });
    assert.strictEqual(formatted, '1 day, 1 hour, 2 minutes, 3 seconds');
  });

  test('respects configuration defaults for verbosity and maxUnits', async () => {
    const cfg = workspace.getConfiguration('aiWatch');
    const prevVerbosity = cfg.get('durationFormat');
    const prevMaxUnits = cfg.get('maxDurationUnits');

    try {
      await cfg.update('durationFormat', 'compact', true);
      await cfg.update('maxDurationUnits', 2, true);

      const { formatted } = formatDurationCommand({ from, to });
      // With compact + maxUnits=2, expect top units: days, hours
      assert.strictEqual(formatted, '1d 1h');
    } finally {
      await cfg.update('durationFormat', prevVerbosity, true);
      await cfg.update('maxDurationUnits', prevMaxUnits, true);
    }
  });
});
