import * as assert from 'assert';
import { formatDurationCommand } from '../../modules/format-duration/command/formatDurationCommand';

suite('formatDurationCommand (errors)', () => {
  test('throws on invalid dates', () => {
    assert.throws(() => formatDurationCommand({ from: 'invalid', to: 'also-invalid' }));
  });
});
