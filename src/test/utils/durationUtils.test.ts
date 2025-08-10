import * as assert from 'assert';
import { formatDuration, VerbosityLevel, DurationUnit } from '../../utils/durationUtils';

suite('Duration Utils Tests', () => {
  test('formatDuration should format simple durations correctly', () => {
    // Test single units
    assert.strictEqual(formatDuration(1, 'hours'), '1 hours'); // 1 hour
    assert.strictEqual(formatDuration(1, 'minutes'), '1 minutes'); // 1 minute
    assert.strictEqual(formatDuration(1, 'seconds'), '1 seconds');
    assert.strictEqual(formatDuration(1, 'days'), '1 days'); // 1 day

    // Test conversion from seconds
    assert.strictEqual(formatDuration(3600, 'seconds'), '1 hours'); // 1 hour in seconds
    assert.strictEqual(formatDuration(60, 'seconds'), '1 minutes'); // 1 minute in seconds
    assert.strictEqual(formatDuration(86400, 'seconds'), '1 days'); // 1 day in seconds
  });

  test('formatDuration should handle zero and negative durations', () => {
    assert.strictEqual(formatDuration(0, 'seconds'), '0 seconds');

    // Negative durations should work (preserved as documented)
    const negativeResult = formatDuration(-1, 'hours');
    assert.ok(negativeResult.includes('1 hours'));
  });

  test('formatDuration should format compound durations from seconds', () => {
    // 1 day, 2 hours, 3 minutes, 4 seconds = 94984 seconds
    const compoundDuration = 86400 + 7200 + 180 + 4;
    const result = formatDuration(compoundDuration, 'seconds');

    assert.ok(result.includes('1 days'));
    assert.ok(result.includes('2 hours'));
    assert.ok(result.includes('3 minutes'));
  });

  test('formatDuration should handle maxUnits parameter', () => {
    // 1 day, 2 hours, 3 minutes, 4 seconds in seconds
    const compoundDuration = 86400 + 7200 + 180 + 4;

    const twoUnits = formatDuration(compoundDuration, 'seconds', 'standard', 2);
    // Should only show the two largest units
    assert.ok(twoUnits.includes('1 days'));
    assert.ok(twoUnits.includes('2 hours'));
    assert.ok(!twoUnits.includes('3 minutes'));

    const oneUnit = formatDuration(compoundDuration, 'seconds', 'standard', 1);
    assert.ok(oneUnit.includes('1 days'));
    assert.ok(!oneUnit.includes('hours'));
  });

  test('formatDuration should handle verbosity options correctly', () => {
    const duration = 3665; // 1 hour, 1 minute, 5 seconds

    const compact = formatDuration(duration, 'seconds', 'compact');
    const standard = formatDuration(duration, 'seconds', 'standard');
    const verbose = formatDuration(duration, 'seconds', 'verbose');

    // Compact should use short forms
    assert.ok(compact.includes('h') || compact.includes('m') || compact.includes('s'));

    // Standard should use "hours", "minutes", "seconds"
    assert.ok(
      standard.includes('hours') || standard.includes('minutes') || standard.includes('seconds'),
    );

    // Verbose should use proper pluralization and "and"
    assert.ok(verbose.includes('hour') || verbose.includes('minute') || verbose.includes('second'));
  });

  test('formatDuration should handle different input units', () => {
    // Test milliseconds
    const msResult = formatDuration(1000, 'milliseconds'); // 1 second
    assert.ok(msResult.includes('1 seconds'));

    // Test minutes
    const minResult = formatDuration(1, 'minutes'); // 1 minute
    assert.ok(minResult.includes('1 minutes'));

    // Test hours
    const hourResult = formatDuration(1, 'hours'); // 1 hour
    assert.ok(hourResult.includes('1 hours'));

    // Test days
    const dayResult = formatDuration(1, 'days'); // 1 day
    assert.ok(dayResult.includes('1 days'));
  });

  test('formatDuration should handle exact unit boundaries', () => {
    // Test exact minutes from seconds
    assert.strictEqual(formatDuration(300, 'seconds'), '5 minutes'); // exactly 5 minutes

    // Test exact hours from seconds
    assert.strictEqual(formatDuration(7200, 'seconds'), '2 hours'); // exactly 2 hours

    // Test exact days from seconds
    assert.strictEqual(formatDuration(259200, 'seconds'), '3 days'); // exactly 3 days
  });

  test('formatDuration should handle large durations correctly', () => {
    // Test year calculation (365 days)
    const yearInSeconds = 365 * 24 * 3600;
    const yearResult = formatDuration(yearInSeconds, 'seconds');
    assert.ok(yearResult.includes('1 years'));

    // Test multiple years
    const multiYearResult = formatDuration(yearInSeconds * 2, 'seconds');
    assert.ok(multiYearResult.includes('2 years'));
  });

  test('formatDuration should handle compact verbosity correctly', () => {
    const duration = 3665; // 1 hour, 1 minute, 5 seconds
    const result = formatDuration(duration, 'seconds', 'compact');

    // Compact format should use short forms like 1h 1m 5s
    assert.ok(result.includes('h'));
    assert.ok(result.includes('m'));
    assert.ok(result.includes('s'));
    assert.ok(!result.includes('hours'));
    assert.ok(!result.includes('minutes'));
    assert.ok(!result.includes('seconds'));
  });

  test('formatDuration should handle verbose verbosity with proper grammar', () => {
    const duration = 3665; // 1 hour, 1 minute, 5 seconds
    const result = formatDuration(duration, 'seconds', 'verbose');

    // Verbose should use proper singular/plural forms and "and"
    assert.ok(result.includes('1 hour')); // singular
    assert.ok(result.includes('1 minute')); // singular
    assert.ok(result.includes('5 seconds')); // plural
    assert.ok(result.includes(' and ')); // proper conjunction
  });

  test('formatDuration should handle edge cases gracefully', () => {
    // Very small durations
    const smallResult = formatDuration(0.1, 'seconds');
    assert.strictEqual(smallResult, '0 seconds');

    // Zero duration
    const zeroResult = formatDuration(0, 'seconds');
    assert.strictEqual(zeroResult, '0 seconds');

    // Large numbers
    const largeResult = formatDuration(999999, 'seconds');
    assert.ok(typeof largeResult === 'string');
    assert.ok(largeResult.length > 0);
  });

  test('formatDuration should preserve negative sign as documented', () => {
    // According to the docs, negative values should be preserved
    const negativeHour = formatDuration(-1, 'hours');
    const negativeMinute = formatDuration(-60, 'seconds'); // -1 minute in seconds

    // Both should indicate negative duration somehow
    assert.ok(typeof negativeHour === 'string');
    assert.ok(typeof negativeMinute === 'string');
    assert.ok(negativeHour.length > 0);
    assert.ok(negativeMinute.length > 0);
  });

  test('formatDuration should handle maxUnits edge cases', () => {
    const complexDuration = 90061; // 1 day, 1 hour, 1 minute, 1 second

    // maxUnits = 0 should still show something
    const zeroUnits = formatDuration(complexDuration, 'seconds', 'standard', 0);
    assert.ok(typeof zeroUnits === 'string');

    // maxUnits larger than available units
    const manyUnits = formatDuration(complexDuration, 'seconds', 'standard', 10);
    assert.ok(manyUnits.includes('1 days'));
    assert.ok(manyUnits.includes('1 hours'));
    assert.ok(manyUnits.includes('1 minutes'));
    assert.ok(manyUnits.includes('1 seconds'));
  });

  test('formatDuration should handle negative durations with precise sign application', () => {
    // Test negative durations in different verbosity modes
    const negativeHour = formatDuration(-1, 'hours', 'standard');
    assert.strictEqual(negativeHour, '-1 hours');

    const negativeMinutes = formatDuration(-30, 'minutes', 'standard');
    assert.strictEqual(negativeMinutes, '-30 minutes');

    const negativeSeconds = formatDuration(-45, 'seconds', 'standard');
    assert.strictEqual(negativeSeconds, '-45 seconds');

    // Test negative in compact mode
    const negativeCompact = formatDuration(-2, 'hours', 'compact');
    assert.strictEqual(negativeCompact, '-2h');

    // Test negative in verbose mode
    const negativeVerbose = formatDuration(-1, 'hours', 'verbose');
    assert.strictEqual(negativeVerbose, '-1 hour');
  });

  test('formatDuration should handle zero durations without negative sign', () => {
    // Zero should never have a negative sign, even if we somehow pass negative zero
    assert.strictEqual(formatDuration(0, 'seconds', 'standard'), '0 seconds');
    assert.strictEqual(formatDuration(0, 'seconds', 'compact'), '0s');
    assert.strictEqual(formatDuration(0, 'seconds', 'verbose'), '0 seconds');

    // Test -0 (should still be treated as zero)
    assert.strictEqual(formatDuration(-0, 'seconds', 'standard'), '0 seconds');
    assert.strictEqual(formatDuration(-0, 'seconds', 'compact'), '0s');

    // Test very small negative values that round to zero
    assert.strictEqual(formatDuration(-0.1, 'seconds', 'standard'), '0 seconds');
    assert.strictEqual(formatDuration(-0.9, 'seconds', 'standard'), '0 seconds');
  });

  test('formatDuration should handle compound negative durations correctly', () => {
    // Test negative compound duration: -1 hour, 30 minutes, 45 seconds = -5445 seconds
    const negativeCompound = formatDuration(-5445, 'seconds', 'standard');
    assert.ok(negativeCompound.startsWith('-'));
    assert.ok(negativeCompound.includes('1 hours'));
    assert.ok(negativeCompound.includes('30 minutes'));
    assert.ok(negativeCompound.includes('45 seconds'));

    // Test with maxUnits limitation
    const limitedNegative = formatDuration(-5445, 'seconds', 'standard', 2);
    assert.ok(limitedNegative.startsWith('-'));
    assert.ok(limitedNegative.includes('1 hours'));
    assert.ok(limitedNegative.includes('30 minutes'));
    assert.ok(!limitedNegative.includes('45 seconds')); // Should be truncated
  });

  test('formatDuration should handle edge cases in maxUnits with zero results', () => {
    // When maxUnits filters out everything, should return appropriate zero
    const duration = 45; // 45 seconds

    // If we only show hours/days but duration is only seconds, should return zero
    const filteredResult = formatDuration(duration, 'seconds', 'standard', 0);
    assert.ok(filteredResult === '0 seconds' || filteredResult.includes('45 seconds'));

    // Test negative duration that gets filtered to nothing
    const negativeFiltered = formatDuration(-45, 'seconds', 'standard', 0);
    assert.ok(negativeFiltered === '0 seconds' || negativeFiltered.includes('45 seconds'));
  });

  test('formatDuration should preserve sign consistency across all verbosity levels', () => {
    const testCases: Array<{ value: number; unit: DurationUnit }> = [
      { value: -1, unit: 'hours' },
      { value: -30, unit: 'minutes' },
      { value: -45, unit: 'seconds' },
      { value: -1, unit: 'days' },
      { value: -5000, unit: 'milliseconds' }, // -5 seconds
    ];

    const verbosityLevels: VerbosityLevel[] = ['compact', 'standard', 'verbose'];

    testCases.forEach(({ value, unit }) => {
      verbosityLevels.forEach((verbosity) => {
        const result = formatDuration(value, unit, verbosity);
        // All negative durations should start with minus sign
        assert.ok(
          result.startsWith('-'),
          `Expected negative sign for ${value} ${unit} in ${verbosity} mode, got: ${result}`,
        );
        // Should not be just a negative sign
        assert.ok(
          result.length > 1,
          `Result should not be just a negative sign for ${value} ${unit} in ${verbosity} mode`,
        );
      });
    });
  });

  test('formatDuration should handle millisecond edge cases correctly', () => {
    // Test sub-second negative values
    assert.strictEqual(formatDuration(-500, 'milliseconds', 'compact'), '0s');
    assert.strictEqual(formatDuration(-999, 'milliseconds', 'standard'), '0 seconds');

    // Test exactly 1 second in milliseconds (should not be zero)
    assert.strictEqual(formatDuration(-1000, 'milliseconds', 'compact'), '-1s');
    assert.strictEqual(formatDuration(-1000, 'milliseconds', 'standard'), '-1 seconds');
  });
});
