import * as assert from 'assert';
import { calculateDifferenceCommand } from '../../modules/calculate-difference/command/calculateDifferenceCommand';

suite('calculateDifferenceCommand', () => {
  test('calculates positive difference correctly', () => {
    const res = calculateDifferenceCommand({
      from: '2025-01-01T00:00:00Z',
      to: '2025-01-02T01:02:03Z',
    });
    assert.deepStrictEqual(res, {
      days: 1,
      hours: 25,
      minutes: 1502,
      seconds: 90123,
    });
  });

  test('calculates negative difference correctly (from>to)', () => {
    const res = calculateDifferenceCommand({
      from: '2025-01-02T01:02:03Z',
      to: '2025-01-01T00:00:00Z',
    });
    // date-fns returns negative values for these functions when end < start
    assert.deepStrictEqual(res, {
      days: -1,
      hours: -25,
      minutes: -1502,
      seconds: -90123,
    });
  });
});
