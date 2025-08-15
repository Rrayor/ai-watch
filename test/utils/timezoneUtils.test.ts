import { strict as assert } from 'assert';
import { applyCustomFormat } from '../../src/modules/shared/util/timezoneUtils';

describe('timezoneUtils - applyCustomFormat', () => {
  it('replaces YYYY, MM, DD, HH, mm, ss tokens correctly', () => {
    const date = new Date(Date.UTC(2025, 6, 9, 5, 7, 3)); // 2025-07-09T05:07:03Z
    // Use local getters by calling with the date already in local timezone; tests use UTC values
    const formatted = applyCustomFormat(date, 'YYYY-MM-DD HH:mm:ss');
    // Because applyCustomFormat uses local getHours/getMinutes etc. in node the Date above in UTC will display local -
    // to avoid flaky behavior use components from the date object explicitly
    function pad2(n: number) {
      return String(n).padStart(2, '0');
    }
    const year = date.getFullYear();
    const month = pad2(date.getMonth() + 1);
    const day = pad2(date.getDate());
    const hours = pad2(date.getHours());
    const minutes = pad2(date.getMinutes());
    const seconds = pad2(date.getSeconds());
    const expected = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    assert.equal(formatted, expected);
  });

  it('supports single-letter tokens M, D, H, m, s and YY', () => {
    const date = new Date(1999, 0, 2, 3, 4, 5); // local 1999-01-02T03:04:05
    const formatted = applyCustomFormat(date, 'YY-M-D H:m:s');
    const expected = `${String(date.getFullYear()).slice(-2)}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    assert.equal(formatted, expected);
  });

  it('leaves unknown tokens untouched', () => {
    const date = new Date(2020, 11, 31, 23, 59, 59);
    const formatted = applyCustomFormat(date, 'YYYY-XX-DD');
    assert.equal(formatted, `${date.getFullYear()}-XX-${String(date.getDate()).padStart(2,'0')}`);
  });
});
