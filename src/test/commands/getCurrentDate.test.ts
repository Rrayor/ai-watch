import * as assert from 'assert';
import { getCurrentDateCommand } from '../../commands/getCurrentDate';

suite('Get Current Date Command Tests', () => {
  test('getCurrentDateCommand should return basic date information without options', () => {
    const result = getCurrentDateCommand();

    // Should contain required fields
    assert.ok(result.iso);
    assert.ok(result.utc);
    assert.ok(result.local);
    assert.ok(result.localTimezone);

    // Validate ISO format
    assert.ok(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(result.iso));

    // Validate UTC format (should include " UTC" suffix)
    assert.ok(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC$/.test(result.utc));

    // Validate local format
    assert.ok(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(result.local));

    // Local timezone should be a valid string
    assert.ok(typeof result.localTimezone === 'string');
    assert.ok(result.localTimezone.length > 0);

    // Should not have error
    assert.ok(!result.error);
  });

  test('getCurrentDateCommand should handle timezone parameter', () => {
    const options = { timezone: 'America/New_York' };
    const result = getCurrentDateCommand(options);

    // Should contain formatted field and timezone
    assert.ok(result.formatted);
    assert.strictEqual(result.timezone, 'America/New_York');

    // Should still have basic fields
    assert.ok(result.iso);
    assert.ok(result.utc);

    // Should not have error
    assert.ok(!result.error);
  });

  test('getCurrentDateCommand should handle custom format parameter', () => {
    const options = { format: 'YYYY-MM-DD HH:mm:ss' };
    const result = getCurrentDateCommand(options);

    // Should contain formatted field with custom format
    assert.ok(result.formatted);
    assert.ok(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(result.formatted));

    // Should still have basic fields
    assert.ok(result.iso);
    assert.ok(result.utc);

    // Should not have error
    assert.ok(!result.error);
  });

  test('getCurrentDateCommand should handle both timezone and format parameters', () => {
    const options = {
      timezone: 'Europe/London',
      format: 'DD/MM/YYYY HH:mm',
    };
    const result = getCurrentDateCommand(options);

    // Should contain formatted field and timezone
    assert.ok(result.formatted);
    assert.strictEqual(result.timezone, 'Europe/London');

    // Formatted should follow custom format pattern
    assert.ok(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(result.formatted));

    // Should not have error
    assert.ok(!result.error);
  });

  test('getCurrentDateCommand should handle invalid timezone gracefully', () => {
    const options = { timezone: 'Invalid/Timezone' };
    const result = getCurrentDateCommand(options);

    // Should still have basic fields
    assert.ok(result.iso);
    assert.ok(result.utc);

    // Should have error field with meaningful message
    assert.ok(result.error);
    assert.ok(result.error.includes('Invalid timezone'));
    assert.ok(result.error.includes('Invalid/Timezone'));
  });

  test('getCurrentDateCommand should handle invalid format gracefully', () => {
    const options = { format: 'INVALID-FORMAT-TOKENS' };
    const result = getCurrentDateCommand(options);

    // Should still have basic fields
    assert.ok(result.iso);
    assert.ok(result.utc);

    // Should handle gracefully (either error or pass through)
    if (result.error) {
      assert.ok(result.error.includes('Invalid format'));
    } else {
      // If no error, formatted should exist
      assert.ok(result.formatted);
    }
  });

  test('getCurrentDateCommand should handle empty options object', () => {
    const result = getCurrentDateCommand({});

    // Should behave like no options
    assert.ok(result.iso);
    assert.ok(result.utc);
    assert.ok(result.local);
    assert.ok(result.localTimezone);
    assert.ok(!result.error);
  });

  test('getCurrentDateCommand should return consistent timestamps', () => {
    const result1 = getCurrentDateCommand();
    const result2 = getCurrentDateCommand();

    // Should be very close in time (within 1 second)
    const date1 = new Date(result1.iso);
    const date2 = new Date(result2.iso);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());

    assert.ok(timeDiff < 1000, 'Commands executed close together should have similar timestamps');
  });

  test('getCurrentDateCommand should handle edge case timezones', () => {
    const edgeTimezones = [
      'UTC',
      'Pacific/Kiritimati', // UTC+14
      'Pacific/Niue', // UTC-11
      'Asia/Kolkata', // UTC+5:30 (non-hour offset)
    ];

    edgeTimezones.forEach((timezone) => {
      const result = getCurrentDateCommand({ timezone });

      assert.ok(result.formatted, `Should format for timezone ${timezone}`);
      assert.strictEqual(result.timezone, timezone);
      assert.ok(!result.error, `Should not error for timezone ${timezone}`);
    });
  });

  test('getCurrentDateCommand should preserve time precision', () => {
    const result = getCurrentDateCommand();

    // ISO format should include milliseconds
    const isoDate = new Date(result.iso);
    assert.ok(!isNaN(isoDate.getTime()), 'ISO date should be valid');

    // UTC format should be precise to seconds with UTC suffix
    const utcPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC$/;
    assert.ok(utcPattern.test(result.utc), 'UTC format should match expected pattern');
  });
});
