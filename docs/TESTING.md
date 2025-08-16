# Testing Guide

Comprehensive guide to the AI Watch testing strategy, architecture, and best practices.

## Overview

AI Watch employs a modular testing architecture with comprehensive test coverage across all functionality layers. The test suite aims to validate documented API behavior as the primary goal, but comprehensive coverage—including lower-level logic and edge cases—is also important. Some tests may target implementation details when it improves reliability or coverage, ensuring long-term maintainability.

## Test Architecture

### Layer-Based Organization

```
src/test/
├── commands/                 # Command Layer Tests
│   ├── addTimeCommand.test.ts
│   ├── businessDayCommand.test.ts
│   ├── calculateDifferenceCommand.test.ts
│   ├── convertTimezoneCommand.test.ts
│   ├── dateQueryCommand.test.ts
│   ├── formatDurationCommand.test.ts
│   ├── formatDurationCommand.invalid.test.ts
│   ├── getCurrentDateTimeCommand.test.ts
│   └── subtractTimeCommand.test.ts
├── tools/                   # Language Model Tool Tests
│   ├── addTimeTool.test.ts
│   ├── businessDayTool.test.ts
│   ├── calculateDifferenceTool.test.ts
│   ├── convertTimezoneTool.test.ts
│   ├── dateQueryTool.test.ts
│   ├── formatDurationTool.test.ts
│   ├── getCurrentDateTimeTool.test.ts
│   └── subtractTimeTool.test.ts
└── utils/                   # Shared Utility Tests
    ├── dateUtils.test.ts     # Date parsing, formatting, calculations
    ├── timezoneUtils.test.ts # Timezone conversions and DST
    └── timezoneUtils.tokens.test.ts # Token formatting tests
```

### Test Coverage by Layer

#### Command Layer
- **Feature Integration**: Tests for module command functions
- **Parameter Validation**: Input sanitization and error handling
- **Return Structure**: Complete API response validation
- **Error Scenarios**: Invalid input and edge case handling

#### Tool Layer
- **Language Model Integration**: LM Tool invoke/prepare methods
- **AI Assistant Interface**: Tool parameter processing
- **Response Formatting**: JSON and human-readable outputs
- **Tool Registration**: Availability and functionality

#### Utils Layer
- **Pure Business Logic**: No VS Code dependencies
- **Timezone-Independent**: UTC-based assertions
- **Mathematical Accuracy**: Precise calculations and edge cases
- **Format Validation**: Strict output format checking

## Testing Standards

### Document-Driven Testing

Tests aim to validate **documented API behavior** as the primary goal, but comprehensive coverage—including lower-level logic and edge cases—is also important. Some tests may target implementation details when it improves reliability or coverage:

```typescript
// ✅ Good: Tests documented return format
test('formatUTC includes UTC suffix', () => {
  const result = formatUTC(new Date('2025-08-10T12:30:45Z'));
  assert.strictEqual(result, '2025-08-10 12:30:45 UTC');
});

// ❌ Avoid: Tests implementation details unless necessary for reliability or coverage
test('formatUTC calls toISOString internally', () => {
  // Don't test internal method calls
});
```

### Timezone Independence

Use UTC methods to prevent environment-specific test failures:

```typescript
// ✅ Good: Timezone-independent
test('business day utilities preserve time components', () => {
  const result = addBusinessDays(specificTime, 1, businessDays, excludedDates);
  assert.strictEqual(result.getUTCHours(), 14);
  assert.strictEqual(result.getUTCMinutes(), 30);
});

// ❌ Avoid: Timezone-dependent
test('business day utilities preserve time components', () => {
  const result = addBusinessDays(specificTime, 1, businessDays, excludedDates);
  assert.strictEqual(result.getHours(), 14); // Fails in different timezones
});
```

### Error Coverage

Test both success and error conditions comprehensively:

```typescript
test('parseISOString should throw error for invalid dates', () => {
  const invalidDates = [
    'invalid-date',
    '2025-13-01T00:00:00Z', // Invalid month
    '2025-01-32T00:00:00Z', // Invalid day
  ];

  invalidDates.forEach((dateStr) => {
    assert.throws(
      () => parseISOString(dateStr),
      /Invalid date format/,
      `Should throw error for: ${dateStr}`
    );
  });
});
```

### Format Validation

Strictly validate return structures match documentation:

```typescript
test('businessDay command returns complete structure', () => {
  const result = businessDayCommand({
    operation: 'isBusinessDay',
    date: '2025-08-15T10:00:00Z'
  });

  // Validate all documented fields are present
  assert.strictEqual(result.date, '2025-08-15T10:00:00Z');
  assert.strictEqual(result.operation, 'isBusinessDay');
  assert.strictEqual(result.isBusinessDay, true);
  assert.strictEqual(result.weekday, 'Friday');
});
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run with coverage reporting
npm run test:coverage
```

### Targeted Testing

```bash
# Run specific test file
npm test -- --grep "timezoneUtils"

# Run specific test by name
npm test -- --grep "formatUTC returns expected UTC format"

# Run tests for specific layer
npm test src/test/utils/        # Utils layer only
npm test src/test/commands/     # Command layer only
npm test src/test/tools/        # Tool layer only
```

### Debugging Tests

```bash
# Run single test with detailed output
npm test -- --grep "specific test name" --reporter spec

# Debug test with VS Code debugger
# Use "Mocha Tests" debug configuration in .vscode/launch.json
```

## Test Development Guidelines

### Adding New Tests

When adding functionality, follow this checklist:

1. **Utils Layer**: Add unit tests for core logic
   ```typescript
   // In appropriate src/test/utils/*.test.ts file
   test('new utility function behavior', () => {
     // Test pure business logic
   });
   ```

2. **Command Layer**: Add integration tests
   ```typescript
   // In src/test/commands/*.test.ts file
   test('new command integration', () => {
     // Test VS Code command implementation
   });
   ```

3. **Documentation**: Ensure examples match API docs
   ```typescript
  // Test should validate documented behavior, but may cover lower-level logic or edge cases if needed
   // Return formats must match API_REFERENCE.md
   ```

4. **Error Cases**: Cover edge cases and error conditions
   ```typescript
   test('handles invalid input gracefully', () => {
     // Test error conditions and edge cases
   });
   ```

### Test File Naming

- **Utils**: `{utilityName}.test.ts` (e.g., `dateUtils.test.ts`)
- **Commands**: `{commandName}.test.ts` (e.g., `getCurrentDateTimeCommand.test.ts`)
- **Integration**: `integration.test.ts`
- **Extension**: `extension.test.ts`

### Test Structure

```typescript
import * as assert from 'assert';
import { functionToTest } from '../../utils/module';

suite('Module Name Tests', () => {
  test('should describe expected behavior', () => {
    // Arrange
    const input = 'test input';

    // Act
    const result = functionToTest(input);

    // Assert
    assert.strictEqual(result, 'expected output');
  });

  test('should handle error conditions', () => {
    assert.throws(
      () => functionToTest('invalid input'),
      /Expected error message pattern/
    );
  });
});
```

## Continuous Integration

### Pre-commit Hooks

Lint-staged runs linting and formatting on staged files before commit, but does not run tests. Tests are run automatically in CI (see below).

Example lint-staged config:

```json
{
  "src/**/*.{ts,tsx}": [
    "eslint --ext .ts --fix",
    "prettier --write"
  ],
  "src/**/*.{js,jsx,json,md}": [
    "prettier --write"
  ]
}
```

### GitHub Actions

Full test suite runs on:
- Every pull request
- Every push to main branch

## Troubleshooting

### Common Issues

1. **Timezone-related failures**
   ```bash
   # Fix: Use UTC methods instead of local time methods
   result.getUTCHours() // ✅ Instead of result.getHours()
   ```

2. **Format validation failures**
   ```bash
   # Fix: Check API documentation for exact expected format
   assert.strictEqual(result.utc, '2025-08-10 12:30:45 UTC');
   ```

3. **Async test issues**
   ```typescript
   // Fix: Ensure async tests are properly awaited
   test('async functionality', async () => {
     const result = await asyncFunction();
     assert.ok(result);
   });
   ```

### Debugging Test Failures

1. **Check recent changes**: Review what code changed since last passing tests
2. **Run single test**: Isolate the failing test for focused debugging
3. **Check documentation**: Ensure test expectations match documented behavior
4. **Verify timezone**: Confirm test uses UTC methods for date operations

## Contributing to Tests

### Test Review Checklist

When reviewing test-related PRs:

- [ ] Tests aim to validate documented behavior, but may cover implementation details for reliability or edge cases
- [ ] All date operations use UTC methods for timezone independence
- [ ] Error cases are thoroughly covered
- [ ] Return structures match API documentation exactly
- [ ] Test names clearly describe expected behavior
- [ ] Performance impact is minimal (tests complete quickly)

### Test Quality Metrics

- **Coverage**: Aim for 100% line and branch coverage, but 90% or higher is considered acceptable
- **Documentation Alignment**: All tests must match API documentation
- **Timezone Independence**: Zero environment-specific test failures
- **Maintainability**: Tests remain valid through refactoring

## Resources

- [API Reference](API_REFERENCE.md) - Documented behavior to validate
- [Architecture Guide](ARCHITECTURE.md) - Understanding the modular structure
- [Contributing Guide](../CONTRIBUTING.md) - Development workflow
- [Configuration Guide](CONFIGURATION.md) - Extension settings and testing

For questions about testing strategy or adding new tests, please refer to the contributing guidelines or open an issue for discussion.
