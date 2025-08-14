# AI Watch Configuration

This guide covers all configuration options and settings for AI Watch.

## VS Code Settings

AI Watch supports both user and workspace settings for flexible configuration across different environments and teams.

### Settings Overview

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `aiWatch.defaultDateFormat` | string | `"YYYY-MM-DD HH:mm:ss"` | Global default date/time display format when no explicit format is provided |
| `aiWatch.businessDays` | string[] | `["Mon","Tue","Wed","Thu","Fri"]` | Business days definition (array of day names/abbreviations) |
| `aiWatch.excludedDates` | array | `[]` | Dates to exclude from business calculations |
| `aiWatch.weekStart` | string | `"monday"` | First day of the week for period calculations (also accepts numbers 0–6) |
| `aiWatch.durationFormat` | string | `"standard"` | Default duration verbosity |
| `aiWatch.maxDurationUnits` | number | `3` | Maximum time units in duration display (1–6) |

## Detailed Configuration

### Removed: Default Timezone

`aiWatch.defaultTimezone` has been removed. The extension uses the system timezone by default and allows explicit `timezone` parameters per command. If you need a specific timezone, pass it to the command/tool call.

### Default Date Format

**Setting:** `aiWatch.defaultDateFormat`

Defines the global default format pattern for date/time display.

How it is applied:
- Used whenever a command/tool does not provide an explicit `format` parameter.
- Independent of timezone detection. The timezone only determines the clock time; the pattern controls how it’s rendered.
- If both `format` (per call) and `aiWatch.defaultDateFormat` are absent, a standard locale-safe format is used.

**Valid Values:** Format string using standard tokens
- `YYYY` - 4-digit year
- `MM` - 2-digit month
- `DD` - 2-digit day
- `HH` - 24-hour format hour
- `mm` - Minutes
- `ss` - Seconds

**Examples:**
```json
{
  "aiWatch.defaultDateFormat": "DD/MM/YYYY HH:mm"
}
```

**Common Patterns:**
- `"YYYY-MM-DD HH:mm:ss"` - ISO-like format (default)
- `"MM/DD/YYYY hh:mm A"` - US format with AM/PM
- `"DD.MM.YYYY HH:mm"` - European format
- `"YYYY年MM月DD日 HH:mm"` - Japanese format

### Business Days

**Setting:** `aiWatch.businessDays`

Defines which days of the week are considered business days.

**Valid Values:**
- Array of day names/abbreviations (case-insensitive), e.g.:
  - `["Mon","Tue","Wed","Thu","Fri"]`
  - `["Sun","Mon","Tue","Wed","Thu"]`
  - `["Mon","Wed","Fri"]`

**Examples:**
```json
{
  "aiWatch.businessDays": ["Sun","Mon","Tue","Wed","Thu"]
}
```

**Regional Examples:**
- **Western:** `"Mon-Fri"` (Monday to Friday)
- **Middle East:** `"Sun-Thu"` (Sunday to Thursday)
- **Custom:** `"Mon,Wed,Fri"` (specific days only)

### Excluded Dates

**Setting:** `aiWatch.excludedDates`

List of specific dates to exclude from business day calculations (holidays, shutdowns).

**Valid Values:** Array of dates in `YYYY-MM-DD` format

**Examples:**
```json
{
  "aiWatch.excludedDates": [
    "2025-12-25",
    "2025-12-26", 
    "2025-01-01",
    "2026-01-01"
  ]
}
```

**Use Cases:**
- National holidays
- Company-specific shutdowns
- Regional observances
- Maintenance windows

### Week Start

**Setting:** `aiWatch.weekStart`

Defines which day is considered the start of the week for period calculations.

**Valid Values:**
- Strings: weekday names/abbreviations like `"monday"`, `"sunday"` (case-insensitive)
- Numbers: 0–6 (0=Sunday, 1=Monday, ...)

**Examples:**
```json
{
  "aiWatch.weekStart": "sunday"
}
```

Notes:
- For start/end of period queries, the default when unset is Monday.
- For weekday navigation (next/previous weekday), when unset the internal default treats Sunday as index 0.

**Impact:**
- Affects `startOfPeriod` and `endOfPeriod` calculations for weeks
- Influences business day calculations
- Used in date navigation queries

### Duration Format

**Setting:** `aiWatch.durationFormat`

Default verbosity level for duration formatting.

**Valid Values:**
- `"compact"` - Shortest format: "2d 3h 45m"
- `"standard"` - Balanced format: "2 days, 3 hours, 45 minutes" (default)
- `"verbose"` - Most detailed: "2 days, 3 hours and 45 minutes"

**Examples:**
```json
{
  "aiWatch.durationFormat": "verbose"
}
```

**Sample Outputs:**
- **Compact:** `"1d 2h 30m"`
- **Standard:** `"1 day, 2 hours, 30 minutes"`
- **Verbose:** `"1 day, 2 hours and 30 minutes"`

Applied when:
- Using `formatDuration` without an explicit `verbosity` parameter.

### Max Duration Units

**Setting:** `aiWatch.maxDurationUnits`

Maximum number of time units to display in duration formatting.

**Valid Values:** Integer between 1 and 6

**Examples:**
```json
{
  "aiWatch.maxDurationUnits": 2
}
```

**Impact on Output:**
- **maxUnits: 1** - `"2 days"` (largest unit only)
- **maxUnits: 2** - `"2 days, 3 hours"` (two largest units)
- **maxUnits: 3** - `"2 days, 3 hours, 45 minutes"` (three largest units)

Applied when:
- Using `formatDuration` without an explicit `maxUnits` parameter.

## Configuration Examples

### Global Development Team

For teams working across multiple timezones with standardized practices:

```json
{
  "aiWatch.defaultDateFormat": "YYYY-MM-DD HH:mm:ss",
  "aiWatch.businessDays": ["Mon","Tue","Wed","Thu","Fri"],
  "aiWatch.weekStart": "monday",
  "aiWatch.durationFormat": "standard",
  "aiWatch.maxDurationUnits": 3,
  "aiWatch.excludedDates": [
    "2025-01-01",
    "2025-12-25"
  ]
}
```

### US Enterprise

For US-based companies with typical business practices:

```json
{
  "aiWatch.defaultDateFormat": "MM/DD/YYYY hh:mm A",
  "aiWatch.businessDays": ["Mon","Tue","Wed","Thu","Fri"],
  "aiWatch.weekStart": "sunday",
  "aiWatch.durationFormat": "verbose",
  "aiWatch.maxDurationUnits": 4,
  "aiWatch.excludedDates": [
    "2025-01-01",
    "2025-01-20",
    "2025-02-17",
    "2025-05-26",
    "2025-06-19",
    "2025-07-04",
    "2025-09-01",
    "2025-10-13",
    "2025-11-11",
    "2025-11-27",
    "2025-12-25"
  ]
}
```

### Middle East Region

For Middle Eastern companies with Friday-Saturday weekends:

```json
{
  "aiWatch.defaultDateFormat": "DD/MM/YYYY HH:mm",
  "aiWatch.businessDays": ["Sun","Mon","Tue","Wed","Thu"],
  "aiWatch.weekStart": "sunday",
  "aiWatch.durationFormat": "standard",
  "aiWatch.maxDurationUnits": 3,
  "aiWatch.excludedDates": [
    "2025-01-01",
    "2025-12-02",
    "2025-12-03"
  ]
}
```

### European Union

For EU-based teams with Monday week start:

```json
{
  "aiWatch.defaultDateFormat": "DD.MM.YYYY HH:mm",
  "aiWatch.businessDays": ["Mon","Tue","Wed","Thu","Fri"],
  "aiWatch.weekStart": "monday",
  "aiWatch.durationFormat": "standard",
  "aiWatch.maxDurationUnits": 3,
  "aiWatch.excludedDates": [
    "2025-01-01",
    "2025-04-18",
    "2025-04-21",
    "2025-05-01",
    "2025-05-29",
    "2025-06-09",
    "2025-10-03",
    "2025-12-25",
    "2025-12-26"
  ]
}
```

## Settings Scope

### User vs Workspace Settings

**User Settings** (`settings.json` in user profile):
- Apply globally to all VS Code workspaces
- Good for personal preferences and default timezones
- Located in VS Code user configuration

**Workspace Settings** (`.vscode/settings.json` in workspace):
- Apply only to the current workspace/project
- Good for team configurations and project-specific needs
- Committed to version control for team consistency

### Settings Priority

Settings are applied in order of precedence (highest to lowest):

1. **Function Parameters** - Direct API call parameters
2. **Workspace Settings** - Project-specific configuration
3. **User Settings** - Personal global configuration  
4. **Extension Defaults** - Built-in fallback values

**Example:**
```javascript
// This timezone parameter overrides all settings
await vscode.commands.executeCommand('ai-watch.getCurrentDate', {
  timezone: 'Asia/Tokyo'  // Takes precedence over all settings
});
```

## Configuration Management

### Team Setup

For consistent team configuration:

1. **Create workspace settings** in `.vscode/settings.json`
2. **Commit to version control** for team sharing
3. **Document decisions** in team guidelines
4. **Update as needed** for changing requirements

### Environment-Specific Settings

Different environments may need different configurations:

**Development:**
```json
{
  "aiWatch.excludedDates": [],
  "aiWatch.durationFormat": "compact"
}
```

**Production:**
```json
{
  "aiWatch.excludedDates": ["2025-12-25", "2025-01-01"],
  "aiWatch.durationFormat": "verbose"
}
```

## Validation and Troubleshooting

### Common Issues

**Invalid Timezone:**
```
Error: Invalid timezone 'EST'. Use IANA names like 'America/New_York'
```
**Solution:** Use full IANA timezone identifiers, not abbreviations.

**Invalid Date Format:**
```
Error: Invalid excluded date '25/12/2025'. Use YYYY-MM-DD format.
```
**Solution:** Ensure dates are in ISO date format (YYYY-MM-DD).

**Invalid Business Days:**
```
Error: Invalid business days 'Monday-Friday'. Provide an array like ["Mon","Tue","Wed","Thu","Fri"].
```
**Solution:** Provide an array of day names/abbreviations (case-insensitive).

### Settings Validation

AI Watch validates settings on startup and provides clear error messages for invalid configurations. Check the VS Code output panel for validation errors.

### Testing Configuration

Test your configuration with these commands:

```javascript
// Test timezone setting
await vscode.commands.executeCommand('ai-watch.getCurrentDate');

// Test business days setting  
await vscode.commands.executeCommand('ai-watch.businessDay', {
  operation: 'isBusinessDay',
  date: '2025-08-16T10:00:00Z'  // Saturday
});

// Test duration format setting
await vscode.commands.executeCommand('ai-watch.formatDuration', {
  from: '2025-08-09T10:00:00Z',
  to: '2025-08-09T12:30:45Z'
});
```

## Migration and Updates

### Updating Settings

When updating settings:

1. **Backup current configuration** before making changes
2. **Test new settings** in development environment
3. **Update documentation** for team members
4. **Communicate changes** to affected users

### Version Compatibility

AI Watch maintains backward compatibility for settings across versions. New settings are added with sensible defaults that don't break existing configurations.

## Best Practices

### For Teams

1. **Standardize on workspace settings** for consistency
2. **Document configuration decisions** in README or wiki
3. **Use version control** for workspace settings
4. **Regular review** of excluded dates and business rules

### For Individual Users

1. **Set user defaults** that match your typical work environment
2. **Override in workspaces** for project-specific needs
3. **Keep settings simple** unless specific requirements exist
4. **Test configuration changes** before committing

### For Global Organizations

1. **Establish regional defaults** for different locations
2. **Create configuration templates** for new projects
3. **Document timezone policies** for distributed teams
4. **Plan for holiday calendar updates** annually

## Support

For configuration help:
- Check the [User Guide](USER_GUIDE.md) for feature explanations
- Review the [API Reference](API_REFERENCE.md) for parameter details
- Report configuration issues on [GitHub](https://github.com/Rrayor/copilot-watch/issues)
