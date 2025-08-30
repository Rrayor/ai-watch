
# 📚 AI Watch API Reference

> **Purpose:** This document provides complete, actionable API documentation for developers and AI assistants integrating with AI Watch.

---

## 🛠️ Language Model Tools & Commands

AI Watch exposes 8 tools as both VS Code commands and Language Model Tools. All tools provide input validation, sensible defaults, and detailed error handling.


### `getCurrentDateTime`
**Returns current date and time with timezone and formatting support.**

#### Parameters
- `timezone` (optional, string): IANA timezone identifier
- `format` (optional, string): Date format pattern, defaults to 'YYYY-MM-DD HH:mm:ss'

#### Returns
```typescript
{
  iso?: string;            // ISO 8601 format (if available)
  utc?: string;            // UTC format (if available)
  local: string;           // Local timezone formatted time
  localTimezone: string;   // Detected timezone
  formattedResult: string; // Formatted string using requested format/timezone
  resultTimezone: string;  // Timezone used for formattedResult
  info?: string[];         // Additional informational messages
}
```

#### Examples
```javascript
// Basic current time
await vscode.commands.executeCommand('ai-watch.getCurrentDateTime');

// Test configuration changes
await vscode.commands.executeCommand('ai-watch.getCurrentDateTime', {
  timezone: userTimezone
});

// Custom format
await vscode.commands.executeCommand('ai-watch.getCurrentDateTime', {
  timezone: 'Europe/London',
  format: 'DD/MM/YYYY HH:mm'
});
```


### `calculateDifference`
**Calculates precise time differences between two dates.**

#### Parameters
- `from` (required, string): Starting date/time in ISO 8601 format
- `to` (required, string): Ending date/time in ISO 8601 format

#### Returns
```typescript
{
  milliseconds?: number; // Total difference in milliseconds
  seconds?: number;      // Total difference in seconds
  minutes?: number;      // Total difference in minutes
  hours?: number;        // Total difference in hours
  days?: number;         // Total difference in days
  formatted?: string;    // Human-readable duration
}
```

#### Example
```javascript
await vscode.commands.executeCommand('ai-watch.calculateDifference', {
  from: '2025-08-01T00:00:00Z',
  to: '2025-08-09T13:37:01Z'
});
// Returns: { days: 8, hours: 205, minutes: 12317, seconds: 739021 }
```


### `convertTimezone`
**Converts date/time between different timezones.**

#### Parameters
- `date` (required, string): Date/time value. Two accepted forms:
  - Absolute ISO with timezone offset or trailing Z (e.g. `2025-08-09T13:37:01Z` or `2025-08-09T13:37:01+09:00`).
  - Naive wall-clock local time (e.g. `2025-08-16T15:00:00` or `2025-08-16 15:00:00`). If a naive wall-clock is supplied it MUST be accompanied by `fromTimezone`.
- `toTimezone` (required, string): Target IANA timezone
- `fromTimezone` (optional, string): Source IANA timezone. REQUIRED when `date` is naive. If `date` already contains an offset, `fromTimezone` is ignored.
- `interpretAsLocal` (optional, boolean): If true forces the `date` to be treated as a naive wall-clock in `fromTimezone` even when an offset is present (useful for deterministic testing).

#### Returns
```typescript
{
  iso?: string;            // ISO 8601 format (canonical UTC instant if resolvable)
  utc?: string;            // UTC formatted string
  local: string;           // Local timezone formatted time
  localTimezone: string;   // Detected local timezone
  formattedResult: string; // Converted/Formatted string in target timezone
  resultTimezone: string;  // Target timezone identifier
  fromTimezone?: string;   // Source timezone (if provided)
  info?: string[];         // Informational messages, e.g. DST disambiguation notes
}
```

#### Notes and error behavior
- If `date` contains an explicit offset/Z it will be parsed as an absolute instant and `fromTimezone` will be ignored (but may be echoed in `info`).
- If `date` is naive (no offset) and `fromTimezone` is omitted, the command will return an explicit error indicating the ambiguity and instructing the caller to provide an IANA `fromTimezone` or an ISO with offset. This avoids silent, incorrect assumptions by LLMs.
- DST edge-cases:
  - Non-existent local times (DST gaps) will produce an error with guidance to select a different wall time or provide an explicit offset.
  - Ambiguous local times (DST overlaps) will either be deterministically resolved and noted in `info` or return an error depending on the configuration; callers should check `info` for details.

#### Example
```javascript
// Naive wall-clock with explicit fromTimezone (recommended for LLMs)
await vscode.commands.executeCommand('ai-watch.convertTimezone', {
  date: '2025-08-16T15:00:00',
  fromTimezone: 'America/New_York',
  toTimezone: 'Asia/Tokyo'
});

// Absolute ISO (offset present) — fromTimezone ignored
await vscode.commands.executeCommand('ai-watch.convertTimezone', {
  date: '2025-08-09T13:37:01Z',
  toTimezone: 'Asia/Tokyo'
});

// Ambiguous/incorrect input will receive a clear error prompting the caller to disambiguate
// Example: { error: "Ambiguous date: '2025-08-16T15:00:00' has no timezone offset. Provide `fromTimezone` or an ISO with offset." }
```


### `addTime`
**Adds specified duration components to a base time.**

#### Parameters
- `baseTime` (optional, string): Starting time in ISO format, defaults to current time
- `years` (optional, number): Years to add, defaults to 0
- `months` (optional, number): Months to add, defaults to 0
- `weeks` (optional, number): Weeks to add, defaults to 0
- `days` (optional, number): Days to add, defaults to 0
- `hours` (optional, number): Hours to add, defaults to 0
- `minutes` (optional, number): Minutes to add, defaults to 0
- `seconds` (optional, number): Seconds to add, defaults to 0
- `timezone` (optional, string): Display result in specific timezone

#### Returns
```typescript
{
  iso?: string;            // Result in ISO format (if available)
  utc?: string;            // Result in UTC format (if available)
  local: string;           // Result in local timezone
  localTimezone: string;   // Detected local timezone
  formattedResult: string; // Result in requested timezone/format
  resultTimezone: string;  // Requested timezone
  baseTime?: string;       // Base time used for calculation
  info?: string[];         // Informational messages
}
```

#### Examples
```javascript
// Add 2 hours and 30 minutes from now
await vscode.commands.executeCommand('ai-watch.addTime', {
  hours: 2,
  minutes: 30
});

// Complex duration with specific base time and timezone
await vscode.commands.executeCommand('ai-watch.addTime', {
  baseTime: '2025-08-09T10:00:00Z',
  weeks: 2,
  days: 3,
  hours: 6,
  timezone: 'Europe/London'
});
```


### `subtractTime`
**Subtracts specified duration components from a base time.**

#### Parameters
- `baseTime` (optional, string): Starting time in ISO format, defaults to current time
- `years` (optional, number): Years to subtract, defaults to 0
- `months` (optional, number): Months to subtract, defaults to 0
- `weeks` (optional, number): Weeks to subtract, defaults to 0
- `days` (optional, number): Days to subtract, defaults to 0
- `hours` (optional, number): Hours to subtract, defaults to 0
- `minutes` (optional, number): Minutes to subtract, defaults to 0
- `seconds` (optional, number): Seconds to subtract, defaults to 0
- `timezone` (optional, string): Display result in specific timezone

#### Returns
```typescript
{
  iso?: string;            // Result in ISO format (if available)
  utc?: string;            // Result in UTC format (if available)
  local: string;           // Result in local timezone
  localTimezone: string;   // Detected local timezone
  formattedResult: string; // Result in requested timezone/format
  resultTimezone: string;  // Requested timezone
  baseTime?: string;       // Base time used for calculation
  info?: string[];         // Informational messages
}
```

#### Examples
```javascript
// Go back 4 weeks, 2 days, and 3 hours from now
await vscode.commands.executeCommand('ai-watch.subtractTime', {
  weeks: 4,
  days: 2,
  hours: 3
});

// Historical calculation from specific time
await vscode.commands.executeCommand('ai-watch.subtractTime', {
  baseTime: '2025-08-09T14:30:00Z',
  months: 1,
  days: 15,
  timezone: 'America/New_York'
});
```


### `formatDuration`
**Converts time duration between two dates into human-readable format with type-safe parameters.**

#### Parameters
- `from` (required, string): Starting date/time in ISO format
- `to` (required, string): Ending date/time in ISO format
- `verbosity` (optional, VerbosityLevel): Format verbosity level with compile-time type safety
  - `'compact'`: "2d 3h 45m" (shortest)
  - `'standard'`: "2 days, 3 hours, 45 minutes" (default)
  - `'verbose'`: "2 days, 3 hours and 45 minutes" (most detailed)
- `maxUnits` (optional, number): Maximum number of time units to display, defaults to 3

#### Type Safety
- TypeScript union types prevent invalid verbosity values at compile time
- Negative durations are properly handled with sign preservation
- Zero durations return unsigned results (prevents "-0s" outputs)

#### Returns
```typescript
{
  formatted?: string;      // Human-readable duration
  totalMilliseconds?: number; // Total duration in milliseconds
  error?: string;          // Error message if invalid input
}
```

#### Examples
```javascript
// Basic duration formatting
await vscode.commands.executeCommand('ai-watch.formatDuration', {
  from: '2025-08-09T12:00:00Z',
  to: '2025-08-09T14:47:33Z'
});
// Returns: { formatted: "2 hours, 47 minutes, 33 seconds" }

// Compact format with limited units
await vscode.commands.executeCommand('ai-watch.formatDuration', {
  from: '2025-08-01T00:00:00Z',
  to: '2025-08-09T13:37:01Z',
  verbosity: 'compact',
  maxUnits: 2
});
// Returns: { formatted: "8d 13h" }
```


### `businessDay`
**Performs business day calculations including validation and math operations.**

#### Parameters
- `operation` (required, string): Operation type
  - `'isBusinessDay'`: Check if date is a business day
  - `'addBusinessDays'`: Add business days to date
  - `'subtractBusinessDays'`: Subtract business days from date
- `date` (required, string): Base date in ISO format
- `days` (optional, number): Number of business days to add/subtract (required for add/subtract operations)

#### Returns
```typescript
// For 'isBusinessDay'
{
  isBusinessDay?: boolean; // Whether it's a business day
  weekday?: string;        // Day name (e.g., "Monday")
}

// For 'addBusinessDays' or 'subtractBusinessDays'
{
  result?: string;         // Result date in ISO format
  days?: number;           // Number of days added/subtracted
  businessDays?: string;   // Business day configuration used
  excludedDates?: string[];// Excluded dates considered
}

// Error case remains returned via thrown errors in commands layer
```

#### Examples
```javascript
// Check if date is business day
await vscode.commands.executeCommand('ai-watch.businessDay', {
  operation: 'isBusinessDay',
  date: '2025-08-15T10:00:00Z'
});

// Add business days
await vscode.commands.executeCommand('ai-watch.businessDay', {
  operation: 'addBusinessDays',
  date: '2025-08-12T10:00:00Z',
  days: 5
});

// Subtract business days
await vscode.commands.executeCommand('ai-watch.businessDay', {
  operation: 'subtractBusinessDays',
  date: '2025-08-20T10:00:00Z',
  days: 3
});
```


### `dateQuery`
**Performs advanced date queries including weekday navigation and period boundaries.**

#### Parameters
- `baseDate` (required, string): Base date for calculations in ISO format
- `queries` (required, array): Array of query operations to perform in sequence
  - Each query object supports:
    - `type` (required, string): Query type
      - `'nextWeekday'`: Find next occurrence of specified weekday
      - `'previousWeekday'`: Find previous occurrence of specified weekday
      - `'startOfPeriod'`: Get start of specified period
      - `'endOfPeriod'`: Get end of specified period
    - `weekday` (optional, string): Weekday name for weekday queries
      - Valid: 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    - `period` (optional, string): Period type for period queries
      - Valid: 'week', 'month', 'quarter', 'year'
    - `weekStart` (optional, string|number): Week start day for period queries
      - Valid: 'sunday' (default), 'monday', or numbers 0–6 (0=Sunday)

    - `chain` (optional, boolean): Controls whether queries are evaluated in sequence (chained) or independently.
      - `true` (default): each query uses the previous query's result as its base.
      - `false`: every query is evaluated against `baseDate` (useful for comparisons like "next Tuesday" vs "last Friday").

#### Returns
```typescript
{
  dates?: string[];     // Array of result dates in ISO format
}
```

#### Examples
```javascript
// Find next Friday
await vscode.commands.executeCommand('ai-watch.dateQuery', {
  baseDate: '2025-08-11T10:00:00Z',
  queries: [{ type: 'nextWeekday', weekday: 'friday' }]
});

// Get start and end of current month
await vscode.commands.executeCommand('ai-watch.dateQuery', {
  baseDate: '2025-08-15T10:00:00Z',
  queries: [
    { type: 'startOfPeriod', period: 'month' },
    { type: 'endOfPeriod', period: 'month' }
  ]
});

// Chained operations
await vscode.commands.executeCommand('ai-watch.dateQuery', {
  baseDate: '2025-08-15T10:00:00Z',
  queries: [
    { type: 'previousWeekday', weekday: 'wednesday' },
    { type: 'nextWeekday', weekday: 'monday' }
  ]
});

// Independent queries (non-chained): both queries use baseDate rather than chaining
await vscode.commands.executeCommand('ai-watch.dateQuery', {
  baseDate: '2025-08-15T10:00:00Z',
  chain: false,
  queries: [
    { type: 'nextWeekday', weekday: 'tuesday' },
    { type: 'previousWeekday', weekday: 'friday' }
  ]
});
```


---

## 🔗 Extension Integration

All capabilities are available as VS Code commands for programmatic access. See [User Guide](USER_GUIDE.md) for practical examples.

#### Available Commands
- `ai-watch.getCurrentDateTime`
- `ai-watch.calculateDifference`
- `ai-watch.convertTimezone`
- `ai-watch.addTime`
- `ai-watch.subtractTime`
- `ai-watch.formatDuration`
- `ai-watch.businessDay`
- `ai-watch.dateQuery`

#### Usage Pattern
```typescript
const result = await vscode.commands.executeCommand('ai-watch.[command]', parameters);
```


---

## ⚠️ Error Handling

All tools provide comprehensive error handling with descriptive messages. Always check for errors before using results.


#### Common Error Types

**Invalid Date Format:**
```javascript
{
  error: "Invalid date format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)"
}
```

**Invalid Timezone:**
```javascript
{
  error: "Invalid timezone 'EST'. Please use IANA timezone names like 'America/New_York'"
}
```

**Unsupported Runtime:**
```javascript
{
  error: "UnsupportedRuntimeError: Host runtime missing required platform APIs (e.g. Intl.supportedValuesOf)"
}
```

**Missing Required Parameters:**
```javascript
{
  error: "Parameter 'from' is required for calculateDifference operation"
}
```

**Invalid Operation:**
```javascript
{
  error: "Invalid operation 'invalid'. Supported operations: isBusinessDay, addBusinessDays, subtractBusinessDays"
}
```


#### Best Practices

1. **Always check for errors** before using results
2. **Use try-catch blocks** for robust error handling
3. **Validate input data** before making API calls
4. **Provide user feedback** for error conditions

```javascript
try {
  const result = await vscode.commands.executeCommand('ai-watch.getCurrentDate', {
    timezone: userTimezone
  });

  if (result.error) {
    console.error('AI Watch error:', result.error);
    return;
  }

  // Use result.iso, result.utc, etc.
} catch (error) {
  console.error('Command execution failed:', error);
}
```


---

## ⚡ Performance Considerations

#### Optimization Tips

1. **Batch operations** when possible to reduce command calls
2. **Cache results** for repeated calculations with same parameters
3. **Use appropriate precision** - not all use cases need millisecond accuracy
4. **Choose efficient formats** - compact formatting is faster than verbose


#### Rate Limiting

No explicit rate limiting is implemented, but consider:
- Avoiding high-frequency polling for current time
- Batching multiple date calculations
- Caching results when appropriate


#### Memory Usage

All operations are stateless and don't retain data between calls. Memory usage is minimal and proportional to the complexity of the operation.


---

## 💡 Integration Examples

#### Extension Development

```typescript
// In your VS Code extension
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('myext.scheduleTask', async () => {
    // Calculate deadline 5 business days from now
    const deadline = await vscode.commands.executeCommand('ai-watch.businessDay', {
      operation: 'addBusinessDays',
      date: new Date().toISOString(),
      days: 5
    });

    vscode.window.showInformationMessage(`Task deadline: ${deadline.result}`);
  });

  context.subscriptions.push(disposable);
}
```


#### Language Model Tool

```typescript
// AI Assistant integration
class TimeAwareAssistant {
  async getCurrentContext() {
    const now = await vscode.commands.executeCommand('ai-watch.getCurrentDateTime');
    return {
      timestamp: now.iso,
      timezone: now.localTimezone,
      formatted: now.local
    };
  }

  async calculateProjectDeadline(startDate: string, businessDays: number) {
    return await vscode.commands.executeCommand('ai-watch.businessDay', {
      operation: 'addBusinessDays',
      date: startDate,
      days: businessDays
    });
  }
}
```


#### Testing

The modular architecture enables comprehensive testing across multiple layers. Here are examples for each layer:


##### Integration Testing

```typescript
// End-to-end VS Code command testing
import assert from 'assert';
import * as vscode from 'vscode';

suite('AI Watch Integration Tests', () => {
  test('getCurrentDateTime command returns valid formats', async () => {
    const result = await vscode.commands.executeCommand('ai-watch.getCurrentDateTime');

    // Validate required fields
    assert.ok(result.iso);
    assert.ok(result.utc);
    assert.ok(result.local);

    // Validate specific formats
    assert.ok(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(result.iso));
    assert.ok(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC$/.test(result.utc));
  });

  test('calculateDifference returns cumulative totals', async () => {
    const result = await vscode.commands.executeCommand('ai-watch.calculateDifference', {
      from: '2025-08-01T00:00:00Z',
      to: '2025-08-09T13:37:01Z'
    });

    // Validate cumulative behavior as documented
    assert.strictEqual(result.days, 8);
    assert.strictEqual(result.hours, 205); // 8*24 + 13
    assert.strictEqual(result.minutes, 12317); // 205*60 + 37
  });
});
```


##### Unit Testing

```typescript
// Utils layer testing
import assert from 'assert';
import { formatUTC, calculateDateDifference } from '../utils/dateUtils';

suite('Date Utils Tests', () => {
  test('formatUTC includes UTC suffix', () => {
    const testDate = new Date('2025-08-10T12:30:45Z');
    const result = formatUTC(testDate);

    assert.strictEqual(result, '2025-08-10 12:30:45 UTC');
  });

  test('calculateDateDifference returns cumulative totals', () => {
    const from = new Date('2025-08-01T00:00:00Z');
    const to = new Date('2025-08-09T13:37:01Z');

    const result = calculateDateDifference(from, to);

    // Cumulative totals as documented
    assert.strictEqual(result.days, 8);
    assert.strictEqual(result.hours, 205);
    assert.strictEqual(result.minutes, 12317);
    assert.strictEqual(result.seconds, 739021);
  });
});
```


##### Command Testing

```typescript
// Command layer testing
import assert from 'assert';
import { businessDayCommand } from '../commands/businessDay';

suite('Business Day Command Tests', () => {
  test('isBusinessDay returns complete structure', () => {
    const result = businessDayCommand({
      operation: 'isBusinessDay',
      date: '2025-08-15T10:00:00Z'
    });

    // Validate complete return structure matches docs
    assert.strictEqual(result.date, '2025-08-15T10:00:00Z');
    assert.strictEqual(result.operation, 'isBusinessDay');
    assert.strictEqual(result.isBusinessDay, true);
    assert.strictEqual(result.weekday, 'Friday');
  });
});
```


##### Test Organization

The test suite consists of multiple test files organized by layer:

- **Utils Layer**: Multiple test files covering core business logic
- **Command Layer**: Test files covering VS Code command implementations
- **Integration Layer**: Test files covering end-to-end functionality
- **Extension Layer**: Test files covering tool registration and lifecycle


##### Best Practices

1. **Document-Driven Testing**: Validate documented behavior, not implementation
2. **Timezone Independence**: Use UTC methods to prevent environment-specific failures
3. **Error Coverage**: Test both success and error conditions thoroughly
4. **Format Validation**: Strictly check return structures match documentation


---

## 🔄 Migration Guide

#### From Direct Date Usage

If you're currently using JavaScript's Date object directly:

**Before:**
```javascript
const now = new Date();
const futureDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Add 1 day
```

**After:**
```javascript
const future = await vscode.commands.executeCommand('ai-watch.addTime', {
  days: 1
});
const futureDate = new Date(future.iso);
```


#### From Other Time Libraries

Migrating from libraries like moment.js or date-fns:

**Benefits:**
- No additional dependencies
- Built-in timezone support
- AI assistant integration
- Consistent error handling
- Business day calculations

**Considerations:**
- Async API (returns Promises)
- VS Code environment requirement
- Limited to supported operations


---

## 🆘 Support

- Review the [User Guide](USER_GUIDE.md) for practical examples
- Check [Configuration](CONFIGURATION.md) for settings
- Report issues on [GitHub](https://github.com/Rrayor/copilot-watch/issues)
- Request features through GitHub Issues
