# AI Watch

A VSCode extension to provide AI assistants with a tool to request the current time.

## Features

AI Watch enables AI assistants and other VS Code extensions to reliably access accurate, up-to-date time and date information for AI-assisted development workflows.

### **Current Capabilities**

- **📅 Current Date and Time**
  - Retrieve precise timestamps in ISO, UTC, and local timezone formats
  - AI Use Case: Generate accurate timestamps for commits, logs, documentation
  
- **🌍 Comprehensive Time Zone Support**
  - Get current time in any IANA timezone (e.g., "America/New_York", "Asia/Tokyo")
  - Convert between timezones with automatic DST handling
  - AI Use Case: Coordinate global teams, schedule deployments, localize timestamps
  
- **🎨 Custom Formatting**
  - Flexible date/time formatting for different contexts and locales
  - AI Use Case: Generate properly formatted dates for documentation, UI strings
  
- **⏱️ Advanced Date/Time Calculations**
  - **Addition**: Add durations (years/months/weeks/days/hours/minutes/seconds) to any base time
  - **Subtraction**: Calculate past times by subtracting durations
  - **Difference**: Calculate precise time differences between any two dates
  - AI Use Cases: 
    - Project timeline estimation: "When will this 3-day task be completed?"
    - Performance analysis: "How long did this build process take?"
    - Historical analysis: "What was the time 6 months ago for changelog?"
    - Deadline management: "When should we start to finish by Friday?"

### **AI-Assisted Development Benefits**

These features specifically support AI and agentic development workflows:

- **🤖 Intelligent Code Generation**: AI can generate datetime logic with real, current timestamps
- **📝 Smart Documentation**: Auto-generate "last updated" dates, changelog entries, version histories  
- **⏰ Timeline Planning**: AI assists with sprint planning, milestone calculations, deployment scheduling
- **🔍 Log Analysis**: Parse and correlate timestamps across different timezones and formats
- **🎯 Deadline Management**: Calculate realistic delivery dates considering time zones and durations
- **⚡ Performance Tracking**: Measure and report build times, response times, development cycles
- **🌐 Global Coordination**: Schedule meetings, releases, and activities across multiple time zones

### **Supported Query Types**

The extension handles natural AI conversations about time:
- "What time will it be in 4 hours and 2 minutes?"
- "How many days between the start and end of this sprint?"  
- "Convert this UTC timestamp to Tokyo time"
- "What was the date 4 weeks 2 hours and 64 minutes before?"
- "When does this 30-day trial expire?"
- "Show me the current time in all major timezones"

## Programmatic Usage

Other extensions, AI agents, and development tools can access all functionality through VS Code commands:

### **Basic Current Time**
```typescript
const result = await vscode.commands.executeCommand('ai-watch.getCurrentDate');
// result: { 
//   iso: "2025-08-09T13:37:01.000Z", 
//   utc: "2025-08-09 13:37:01",
//   local: "2025-08-09 09:37:01",
//   localTimezone: "America/New_York"
// }
```

### **Advanced Usage Examples**

#### Get Current Date/Time in a Specific Time Zone
```typescript
const result = await vscode.commands.executeCommand('ai-watch.getCurrentDate', {
  timezone: 'Asia/Tokyo'
});
// result: { 
//   iso: "2025-08-09T13:37:01.000Z", 
//   utc: "2025-08-09 13:37:01",
//   local: "2025-08-09 09:37:01",
//   localTimezone: "America/New_York",
//   formatted: "2025-08-09 22:37:01", 
//   timezone: "Asia/Tokyo" 
// }
```

#### Calculate Time Differences for Performance Analysis
```typescript
const result = await vscode.commands.executeCommand('ai-watch.calculateDifference', {
  from: '2025-08-01T00:00:00Z',
  to: '2025-08-09T13:37:01Z'
});
// result: { 
//   days: 8, 
//   hours: 205, 
//   minutes: 12317, 
//   seconds: 739021 
// }

// AI Use Case: "The build process took 2 minutes and 15 seconds"
```

#### Future Time Calculations for Scheduling
```typescript
const result = await vscode.commands.executeCommand('ai-watch.addTime', {
  hours: 4,
  minutes: 2,
  timezone: 'Europe/London'
});
// result: { 
//   iso: "2025-08-09T17:39:01.000Z", 
//   utc: "2025-08-09 17:39:01",
//   local: "2025-08-09 13:39:01",
//   localTimezone: "America/New_York",
//   baseTime: "2025-08-09T13:37:01.000Z",
//   formatted: "2025-08-09 18:39:01",
//   timezone: "Europe/London"
// }

// AI Use Case: "Schedule deployment for 4 hours and 2 minutes from now in London time"
```

#### Historical Time Calculations for Analysis
```typescript
const result = await vscode.commands.executeCommand('ai-watch.subtractTime', {
  weeks: 4,
  hours: 2,
  minutes: 64
});
// result: {
//   iso: "2025-07-11T10:23:01.000Z",
//   utc: "2025-07-11 10:23:01", 
//   local: "2025-07-11 06:23:01",
//   localTimezone: "America/New_York",
//   baseTime: "2025-08-09T13:37:01.000Z"
// }

// AI Use Case: "When did this incident start if it lasted 4 weeks, 2 hours, and 64 minutes?"
```

#### Cross-Timezone Coordination
```typescript
const result = await vscode.commands.executeCommand('ai-watch.convertTimezone', {
  date: '2025-08-09T13:37:01Z',
  toTimezone: 'Asia/Tokyo'
});
// result: { 
//   formatted: "2025-08-09 22:37:01", 
//   fromTimezone: "UTC",
//   toTimezone: "Asia/Tokyo", 
//   iso: "2025-08-09T13:37:01.000Z" 
// }

// AI Use Case: "Convert this meeting time to all team member timezones"
```

## Language Model Tools

AI Watch provides five comprehensive language model tools that AI assistants can use for time-related operations in AI-assisted development:

### `getCurrentDate`
- **Description**: Returns the current date and time with timezone awareness
- **Parameters**: 
  - `timezone` (optional): IANA timezone (e.g., 'America/New_York', 'Europe/Berlin')
  - `format` (optional): Date format pattern (defaults to 'YYYY-MM-DD HH:mm:ss')
- **Defaults**: Always includes ISO, UTC, and local timezone. When no parameters provided, returns all three formats.
- **AI Use Cases**: 
  - **Timestamp Generation**: Accurate timestamps for logs, comments, documentation
  - **Code Generation**: Current time for default values, cache expiration
  - **Documentation**: "Last updated" timestamps in auto-generated docs
- **Example Queries**: 
  - "What's the current time in Tokyo?"
  - "Give me an ISO timestamp for this commit"
  - "What time is it in my local timezone?"

### `addTime`
- **Description**: Adds time durations to a base time (current time by default)
- **Parameters**:
  - `baseTime` (optional): Starting time in ISO format (defaults to current time)
  - `years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds` (optional): Duration to add
  - `timezone` (optional): Display result in specific timezone
- **Defaults**: Uses current time as base if not specified
- **AI Use Cases**:
  - **Deadline Calculation**: "When should this 3-day task be completed?"
  - **Scheduling**: "Schedule deployment 2 hours from now"
  - **Expiration Dates**: "Set cache to expire in 30 minutes"
  - **Future Planning**: "What's the date 2 sprints (4 weeks) from now?"
- **Example Queries**:
  - "What time will it be in 4 hours and 2 minutes?"
  - "When does this 30-day trial expire?"
  - "Schedule the meeting for 2 weeks from today"

### `subtractTime`
- **Description**: Subtracts time durations from a base time (current time by default)
- **Parameters**:
  - `baseTime` (optional): Starting time in ISO format (defaults to current time)
  - `years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds` (optional): Duration to subtract
  - `timezone` (optional): Display result in specific timezone
- **Defaults**: Uses current time as base if not specified
- **AI Use Cases**:
  - **Historical Analysis**: "When was this feature last updated?"
  - **Rollback Planning**: "What was the timestamp 3 hours before the incident?"
  - **Version History**: "Show me the date 6 months ago for changelog"
  - **Deadline Backtracking**: "When should we start to finish by Friday?"
- **Example Queries**:
  - "What was the time 4 weeks 2 hours and 64 minutes before?"
  - "When did this 90-day notice period start?"
  - "What was the date 1 year ago today?"

### `calculateDifference`
- **Description**: Calculates time differences between two dates with detailed breakdown
- **Parameters**:
  - `from` (required): Starting date/time in ISO format
  - `to` (required): Ending date/time in ISO format
- **AI Use Cases**:
  - **Performance Analysis**: "How long did this build take?"
  - **Project Metrics**: "Calculate development time between milestones"
  - **SLA Tracking**: "How long was the system down?"
  - **Version Comparisons**: "Time elapsed between releases"
- **Example Queries**:
  - "How many days between the start and end of this sprint?"
  - "Calculate the downtime duration from these timestamps"
  - "How long did this migration take?"
- **Returns**: Difference in days, hours, minutes, and seconds with detailed breakdown

### `convertTimezone`
- **Description**: Converts a date/time between different timezones with IANA support
- **Parameters**:
  - `date` (required): Date/time in ISO format
  - `toTimezone` (required): Target IANA timezone
  - `fromTimezone` (optional): Source timezone (defaults to UTC)
- **Defaults**: Source timezone defaults to UTC if not specified
- **AI Use Cases**:
  - **Global Coordination**: "Convert this meeting time to all team timezones"
  - **Log Analysis**: "What time did this error occur in production timezone?"
  - **Release Planning**: "When should we deploy to minimize global impact?"
  - **Documentation**: "Show this timestamp in user's local time"
- **Example Queries**:
  - "Convert this UTC timestamp to Tokyo time"
  - "What time is this meeting in London and New York?"
  - "Show this log entry in Pacific time"
- **Returns**: Formatted date/time in target timezone with source/target timezone info

## Planned Features

### 🆕 **Date-Based Query & Recurring Support** (High Priority)
- **Description:** Provides deterministic answers to structured, date-based queries (e.g., “When is the next Monday?”, “What is the last day of this month?”, “What date is the 3rd Friday of next month?”) and can return a single date or a series of dates for recurring patterns.
- **Scope:**
  - Not full natural language parsing—focus on clear, structured queries.
  - Designed to be easily extended as new query types are requested.
- **Supported Queries (Initial):**
  - Next/previous occurrence of a weekday
  - Nth weekday of a month
  - First/last day of week/month/quarter/year
  - Date math based on current or provided date
  - Recurring patterns: all Mondays in a month, next N billing dates, etc.
- **Configuration:**
  - Reference date (defaults to now)
  - Week start day (Monday/Sunday, defaults to Monday)
  - Output format (ISO, custom, defaults to ISO)
  - `count` or `range` parameter to control how many dates to return (single or series)
- **API Design:**
  - Simple, composable query objects (e.g., `{ type: 'nextWeekday', weekday: 'Monday', from: '2025-08-09', count: 5 }`)
  - Comprehensive, sensible defaults for all options
  - Extensible: new query types can be added without breaking changes
- **Output:**
  - Returns either a single date or a list of dates, depending on the query and `count`/`range` parameter.
- **Usage Note:**
  - If a query is not supported, the tool should return a clear error or suggestion for supported query types.
  - Designed for easy extension as user needs evolve.
- **Examples:**
  - “When is the next Monday?”
  - “What is the last business day of this month?”
  - “What date is the 2nd Tuesday of next month?”
  - “Generate the next 5 monthly billing dates starting from 2025-08-09”
  - “List all first Mondays of the next quarter”
  - “What are the next 3 business days, skipping holidays?”

### 🏢 **Business Day Operations** (Medium Priority)
- **Description**: Working day calculations with configurable business rules
- **Configuration Needed**: 
  - Custom weekend definitions (e.g., Friday-Saturday for Middle East)
  - Holiday calendars (country/region specific)
  - Custom business hours
- **AI Use Cases**:
  - **Project Planning**: Realistic timeline estimation excluding weekends
  - **SLA Calculations**: Business-hours-only response times
  - **Deployment Scheduling**: Avoid deployments on weekends/holidays
- **Example Queries**:
  - "Add 5 business days to today's date"
  - "How many working days until the deadline?"
  - "Is tomorrow a business day?"

#### Configuration and Customization

AI Watch supports flexible business day calculations with the following options:

- **Business Day Range**: Specify which days are considered business days using a string like `"Mon-Fri"` (default), `"Sun-Thu"`, or a comma-separated list like `"Mon,Wed,Fri"`.
- **Custom Excluded Dates**: Provide a list of dates (e.g., holidays, company shutdowns) in `YYYY-MM-DD` format to be excluded from business day calculations.
  - This list can be provided per prompt (operation) or set globally in VS Code settings.
  - If both are provided, the prompt list takes precedence.
- **No Built-in Holidays**: The extension does not maintain or infer global/national holiday calendars. Moving holidays (like Easter) must be provided by the user if needed.
- **Fallbacks**: If no configuration is provided, defaults to `"Mon-Fri"` and no excluded dates.

**Example Prompt Usage:**
```json
{
  "businessDays": "Mon-Thu",
  "excludedDates": ["2025-08-20", "2025-08-21"]
}
```

**Example VS Code Settings:**
```json
"aiWatch.businessDays": "Sun-Thu",
"aiWatch.excludedDates": ["2025-12-25", "2025-12-26"]
```

**How it works:**
- The extension parses the business day range and excluded dates.
- When adding/subtracting business days, it skips days not in the allowed set or in the excluded list.
- VS Code settings are used as a fallback if not provided in the prompt.

### 📊 **Human-Readable Duration Formatting** (Medium Priority)
- **Description**: Convert seconds/milliseconds into natural language
- **AI Use Cases**:
  - **Performance Reports**: "Build completed in 2 minutes, 30 seconds"
  - **User-Friendly Messages**: "Last backup was 3 hours, 15 minutes ago"
  - **Documentation**: "This process typically takes 1 hour, 45 minutes"
- **Example Queries**:
  - "Format 7890 seconds as human-readable duration"
  - "How long ago was this timestamp in plain English?"
  - "Convert build time to user-friendly format"
- **Unit:** The input unit (seconds, milliseconds, minutes, etc.) must be specified explicitly. The tool does not infer units from the value alone.
  - Example: `{ value: 90, unit: 'seconds' }` → `1m 30s`
  - Example: `{ value: 90000, unit: 'milliseconds' }` → `1m 30s`

#### Configuration and Usage Notes
- **Input:** Accepts durations as a number with an explicit unit (e.g., `{ value: 90, unit: 'seconds' }`, `{ value: 90000, unit: 'milliseconds' }`). ISO 8601 duration strings may also be supported. No object/interval input.
- **Unit:** The unit must always be specified. The tool does not infer units from the value alone.
- **Output:** Always returns a short, English format (e.g., "2h 3m 5s"). No localization or long format.
- **Phrasing:** Supports both "ago" and "in" (e.g., "3d 2h ago", "in 5m 10s").
- **Conversion:** Always uses the largest possible units (e.g., "1y 2d" instead of "367d").
- **Configuration:** No user configuration; sensible defaults only.
- **Examples:**
  - `{ value: 7890, unit: 'seconds' }` → `2h 11m 30s`
  - `{ value: -3600, unit: 'seconds' }` → `1h ago`
  - `{ value: 90, unit: 'seconds' }` → `1m 30s`
  - `{ value: 86400, unit: 'seconds' }` → `1d`
  - `{ value: 90000, unit: 'milliseconds' }` → `1m 30s`

### 📅 **Date Component Manipulation** (Low Priority)
- **Description**: Set dates to specific boundaries (start/end of periods)
- **AI Use Cases**:
  - **Report Generation**: "Start of current quarter for financial reports"
  - **Data Analysis**: "Group events by month start dates"
  - **Test Data**: "Generate realistic test dates at period boundaries"
- **Example Queries**:
  - "What's the start of this week?"
  - "Set date to end of current month"
  - "Find the beginning of this year"

#### Configuration and Usage Notes
- **Supported Operations:** `start`, `end`, `middle`, or custom (e.g., `set the minute to 27`).
- **Periods:** Only standard calendar periods (day, week, month, quarter, year) are supported. Fiscal/custom periods are out of scope.
- **Week Start:** Customizable via prompt or VS Code settings (prompt takes precedence). Default is Monday.
- **Timezone:** Customizable via prompt or VS Code settings (prompt takes precedence). If not defined, the tool throws an error.
- **Return Value:** Only the manipulated date is returned.
- **Composability:** API supports chaining of multiple operations in a single call (e.g., `startOfMonth` then `endOfWeek`).
- **Examples:**
  - `startOfWeek` for `2025-08-09` with week starting on Sunday
  - `endOfMonth` for `2025-08-09` in UTC
  - `setMinute` to 27 for `2025-08-09T13:37:00Z`
  - `startOfMonth` → `endOfWeek` for `2025-08-09`

### 🌍 **Advanced Timezone Features (Not Supported)**
This extension does **not** support advanced timezone features such as:
- Mapping city or country names to IANA timezones
- Listing all timezones for a country or region
- Determining daylight saving time transitions or status
- Providing timezone data for ambiguous or partial names

**Supported:**
- Only direct use of valid IANA timezone names (e.g., "Europe/Berlin", "America/New_York") for conversions and offset calculations

**No External Services:**
- The extension does not bundle a city/country-to-timezone database or use external APIs for such lookups

**User Responsibility:**
- Users must provide valid IANA timezone names. If mapping is needed, it should be handled outside the extension (e.g., by AI assistants or user prompt)

**Examples:**
- ✅ Supported: `convertTimezone({ date: '2025-08-09T13:37:01Z', toTimezone: 'Asia/Tokyo' })`
- ❌ Not supported: `getTimezoneForCity('Sydney')`, `listTimezonesForCountry('US')`, `isDST('Europe/Berlin', '2025-08-09')`

## Before

```
I'm unable to retrieve the current date and time using the tool right now due to a technical issue. However, the current date is August 9, 2025, as shown in the context. If you need the exact time, you may need to check your system clock.
```

## 🚀 Complete Feature Demonstration

Here's a comprehensive prompt that demonstrates **every single feature** of the AI Watch extension:

### **Master Demonstration Prompt**

> *"I'm planning a global software release for our new product. Help me with the following timeline and coordination tasks:*
> 
> *1. **Current Status**: What's the current date and time in UTC, my local timezone, and Tokyo (where our main development team is)?*
> 
> *2. **Release Scheduling**: If we deploy 2 weeks, 3 days, and 6 hours from now, what will be the exact deployment time in London, New York, and Sydney timezones?*
> 
> *3. **Historical Analysis**: Our last major release was on July 1st, 2025 at 14:30 UTC. How much time has passed since then, and what was the exact time 4 weeks, 2 days, and 3 hours before that release?*
> 
> *4. **Performance Tracking**: Our build process started at 2025-08-09T12:00:00Z and finished at 2025-08-09T12:47:33Z. Format this duration in a human-readable way for our status report.*
> 
> *5. **Business Day Planning**: Is August 15th, 2025 a business day? If we need to add 5 business days to August 12th, 2025, what date do we get? Also, if we need to subtract 3 business days from August 20th, 2025, what's the result?*
> 
> *6. **Advanced Date Queries**: Find the next Friday from today, then find the start and end dates of this month, and chain these together: find the next Monday after finding the previous Wednesday from today.*
> 
> *7. **Timezone Conversion**: Convert the timestamp '2025-08-09T09:30:00Z' to Japan Standard Time for our Tokyo team meeting.*
> 
> *Please provide all results with clear explanations of how each calculation supports our release planning.*"

### **Feature Mapping & Explanations**

This single prompt demonstrates **all 8 tools** and their key capabilities:

#### **✅ Point 1 → `getCurrentDate` Tool**
- **Feature**: Current time retrieval with multiple timezone support
- **Parameters Used**: Default (UTC/local) + `timezone: 'Asia/Tokyo'`
- **Demonstrates**: Basic time retrieval, timezone awareness, multiple format outputs

#### **✅ Point 2 → `addTime` Tool** 
- **Feature**: Future time calculations with complex durations
- **Parameters Used**: `weeks: 2, days: 3, hours: 6` + multiple timezone outputs
- **Demonstrates**: Relative time addition, multi-unit durations, global timezone coordination

#### **✅ Point 3 → `calculateDifference` + `subtractTime` Tools**
- **Feature**: Time difference calculation and historical time computation
- **Parameters Used**: Specific historical dates + `weeks: 4, days: 2, hours: 3` subtraction
- **Demonstrates**: Precise difference calculations, backward time calculations, project timeline analysis

#### **✅ Point 4 → `formatDuration` Tool**
- **Feature**: Human-readable duration formatting from timestamps
- **Parameters Used**: `from/to` timestamps with natural language output
- **Demonstrates**: Performance reporting, build time analysis, user-friendly duration display

#### **✅ Point 5 → `businessDay` Tool**
- **Feature**: Business day operations and calculations
- **Parameters Used**: 
  - `operation: 'isBusinessDay'` for validation
  - `operation: 'addBusinessDays', days: 5` for forward planning
  - `operation: 'subtractBusinessDays', days: 3` for backward planning
- **Demonstrates**: Workday validation, project deadline planning, business calendar awareness

#### **✅ Point 6 → `dateQuery` Tool**
- **Feature**: Advanced date navigation and chained queries
- **Parameters Used**: 
  - `nextWeekday: 'friday'` for weekday finding
  - `startOfPeriod/endOfPeriod: 'month'` for period boundaries
  - Chained queries with multiple operations
- **Demonstrates**: Complex date navigation, period calculations, sophisticated query composition

#### **✅ Point 7 → `convertTimezone` Tool**
- **Feature**: Precise timezone conversion with IANA timezone support
- **Parameters Used**: `date: '2025-08-09T09:30:00Z', toTimezone: 'Asia/Tokyo'`
- **Demonstrates**: Global coordination, meeting scheduling, timezone-aware operations

#### **✅ Additional Features Demonstrated**
- **Error Handling**: Robust validation and clear error messages
- **Input Schemas**: Proper parameter validation with sensible defaults
- **Multiple Output Formats**: ISO, UTC, local, and custom formatted timestamps
- **Integration**: VS Code command compatibility and Language Model Tool registration
- **Comprehensive Coverage**: Every possible use case from basic queries to complex multi-step calculations

### **Expected Output Structure**

The response to this prompt would showcase:

1. **Multiple timezone displays** (UTC, local, Tokyo)
2. **Complex duration arithmetic** (weeks + days + hours)
3. **Precise time differences** (days, hours, minutes, seconds breakdown)
4. **Natural language formatting** ("47 minutes, 33 seconds")
5. **Business day intelligence** (weekday validation, workday calculations)
6. **Advanced date navigation** (next/previous weekdays, period boundaries)
7. **Timezone conversion accuracy** (UTC to JST with proper formatting)
8. **Real-world context** (release planning, team coordination, performance tracking)

This single prompt validates that **all 8 tools are working correctly** and demonstrates the extension's capability to handle complex, real-world development scenarios that require sophisticated time and date manipulation.

## 📚 API Documentation

### Language Model Tools API

All tools are accessible to AI assistants through the Language Model Tools interface. Each tool provides comprehensive input validation, sensible defaults, and detailed error handling.

#### **getCurrentDate**

Returns current date and time with optional timezone and formatting support.

**Parameters:**
- `timezone` (optional, string): IANA timezone identifier (e.g., 'America/New_York', 'Europe/Berlin', 'Asia/Tokyo')
- `format` (optional, string): Date format pattern, defaults to 'YYYY-MM-DD HH:mm:ss'

**Returns:**
```typescript
{
  iso: string;           // ISO 8601 format: "2025-08-09T13:37:01.000Z"
  utc: string;           // UTC format: "2025-08-09 13:37:01"
  local: string;         // Local timezone: "2025-08-09 09:37:01"
  localTimezone: string; // Detected timezone: "America/New_York"
  formatted?: string;    // Custom format (if timezone specified)
  timezone?: string;     // Requested timezone (if specified)
}
```

**Example Usage:**
```javascript
// Basic current time
await vscode.commands.executeCommand('ai-watch.getCurrentDate');

// Specific timezone
await vscode.commands.executeCommand('ai-watch.getCurrentDate', {
  timezone: 'Asia/Tokyo'
});

// Custom format
await vscode.commands.executeCommand('ai-watch.getCurrentDate', {
  timezone: 'Europe/London',
  format: 'DD/MM/YYYY HH:mm'
});
```

#### **calculateDifference**

Calculates precise time differences between two dates with detailed breakdown.

**Parameters:**
- `from` (required, string): Starting date/time in ISO 8601 format
- `to` (required, string): Ending date/time in ISO 8601 format

**Returns:**
```typescript
{
  days: number;     // Total days difference
  hours: number;    // Total hours difference
  minutes: number;  // Total minutes difference
  seconds: number;  // Total seconds difference
  from: string;     // Echo of input from date
  to: string;       // Echo of input to date
}
```

**Example Usage:**
```javascript
await vscode.commands.executeCommand('ai-watch.calculateDifference', {
  from: '2025-08-01T00:00:00Z',
  to: '2025-08-09T13:37:01Z'
});
// Returns: { days: 8, hours: 205, minutes: 12317, seconds: 739021, ... }
```

#### **convertTimezone**

Converts date/time between different timezones using IANA timezone identifiers.

**Parameters:**
- `date` (required, string): Date/time in ISO 8601 format
- `toTimezone` (required, string): Target IANA timezone
- `fromTimezone` (optional, string): Source timezone, defaults to 'UTC'

**Returns:**
```typescript
{
  formatted: string;     // Converted date in target timezone
  fromTimezone: string;  // Source timezone
  toTimezone: string;    // Target timezone
  iso: string;          // Original ISO date
}
```

**Example Usage:**
```javascript
await vscode.commands.executeCommand('ai-watch.convertTimezone', {
  date: '2025-08-09T13:37:01Z',
  toTimezone: 'Asia/Tokyo'
});
// Returns: { formatted: "2025-08-09 22:37:01", fromTimezone: "UTC", toTimezone: "Asia/Tokyo", ... }
```

#### **addTime**

Adds specified duration components to a base time (current time if not specified).

**Parameters:**
- `baseTime` (optional, string): Starting time in ISO format, defaults to current time
- `years` (optional, number): Years to add, defaults to 0
- `months` (optional, number): Months to add, defaults to 0
- `weeks` (optional, number): Weeks to add, defaults to 0
- `days` (optional, number): Days to add, defaults to 0
- `hours` (optional, number): Hours to add, defaults to 0
- `minutes` (optional, number): Minutes to add, defaults to 0
- `seconds` (optional, number): Seconds to add, defaults to 0
- `timezone` (optional, string): Display result in specific timezone

**Returns:**
```typescript
{
  iso: string;           // Result in ISO format
  utc: string;           // Result in UTC format
  local: string;         // Result in local timezone
  localTimezone: string; // Detected local timezone
  baseTime: string;      // Original base time used
  formatted?: string;    // Result in requested timezone (if specified)
  timezone?: string;     // Requested timezone (if specified)
}
```

**Example Usage:**
```javascript
// Add 2 hours and 30 minutes from now
await vscode.commands.executeCommand('ai-watch.addTime', {
  hours: 2,
  minutes: 30
});

// Add complex duration to specific base time
await vscode.commands.executeCommand('ai-watch.addTime', {
  baseTime: '2025-08-09T10:00:00Z',
  weeks: 2,
  days: 3,
  hours: 6,
  timezone: 'Europe/London'
});
```

#### **subtractTime**

Subtracts specified duration components from a base time (current time if not specified).

**Parameters:**
- `baseTime` (optional, string): Starting time in ISO format, defaults to current time
- `years` (optional, number): Years to subtract, defaults to 0
- `months` (optional, number): Months to subtract, defaults to 0
- `weeks` (optional, number): Weeks to subtract, defaults to 0
- `days` (optional, number): Days to subtract, defaults to 0
- `hours` (optional, number): Hours to subtract, defaults to 0
- `minutes` (optional, number): Minutes to subtract, defaults to 0
- `seconds` (optional, number): Seconds to subtract, defaults to 0
- `timezone` (optional, string): Display result in specific timezone

**Returns:**
```typescript
{
  iso: string;           // Result in ISO format
  utc: string;           // Result in UTC format
  local: string;         // Result in local timezone
  localTimezone: string; // Detected local timezone
  baseTime: string;      // Original base time used
  formatted?: string;    // Result in requested timezone (if specified)
  timezone?: string;     // Requested timezone (if specified)
}
```

**Example Usage:**
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

#### **formatDuration**

Converts time duration between two dates into human-readable format with configurable verbosity.

**Parameters:**
- `from` (required, string): Starting date/time in ISO format
- `to` (required, string): Ending date/time in ISO format
- `verbosity` (optional, string): Format verbosity level
  - `'compact'`: "2d 3h 45m" (shortest)
  - `'standard'`: "2 days, 3 hours, 45 minutes" (default)
  - `'verbose'`: "2 days, 3 hours and 45 minutes" (most detailed)
- `maxUnits` (optional, number): Maximum number of time units to display, defaults to 3

**Returns:**
```typescript
{
  formatted: string;  // Human-readable duration
} | {
  error: string;     // Error message if invalid input
}
```

**Example Usage:**
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

#### **businessDay**

Performs business day calculations including validation and addition/subtraction of business days.

**Parameters:**
- `operation` (required, string): Operation type
  - `'isBusinessDay'`: Check if date is a business day
  - `'addBusinessDays'`: Add business days to date
  - `'subtractBusinessDays'`: Subtract business days from date
- `date` (required, string): Base date in ISO format
- `days` (optional, number): Number of business days to add/subtract (required for add/subtract operations)

**Returns:**
```typescript
// For 'isBusinessDay'
{
  date: string;        // Input date
  isBusinessDay: boolean; // Whether it's a business day
  weekday: string;     // Day name (e.g., "Monday")
}

// For 'addBusinessDays' or 'subtractBusinessDays'
{
  date: string;        // Input date
  operation: string;   // Operation performed
  days: number;        // Number of days added/subtracted
  result: string;      // Result date in ISO format
}

// Error case
{
  error: string;       // Error description
}
```

**Example Usage:**
```javascript
// Check if date is business day
await vscode.commands.executeCommand('ai-watch.businessDay', {
  operation: 'isBusinessDay',
  date: '2025-08-15T10:00:00Z'
});
// Returns: { date: "2025-08-15T10:00:00Z", isBusinessDay: true, weekday: "Friday" }

// Add business days
await vscode.commands.executeCommand('ai-watch.businessDay', {
  operation: 'addBusinessDays',
  date: '2025-08-12T10:00:00Z',
  days: 5
});
// Returns: { date: "2025-08-12T10:00:00Z", operation: "addBusinessDays", days: 5, result: "2025-08-19T10:00:00Z" }
```

#### **dateQuery**

Performs advanced date queries including weekday navigation and period boundary calculations with support for chained operations.

**Parameters:**
- `baseDate` (required, string): Base date for calculations in ISO format
- `queries` (required, array): Array of query operations to perform in sequence
  - Each query object supports:
    - `type` (required, string): Query type
      - `'nextWeekday'`: Find next occurrence of specified weekday
      - `'previousWeekday'`: Find previous occurrence of specified weekday
      - `'startOfPeriod'`: Get start of specified period
      - `'endOfPeriod'`: Get end of specified period
    - `weekday` (optional, string): Weekday name for weekday queries
      - Valid values: 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    - `period` (optional, string): Period type for period queries
      - Valid values: 'week', 'month', 'quarter', 'year'
    - `weekStart` (optional, string): Week start day for period queries
      - Valid values: 'monday' (default), 'sunday'

**Returns:**
```typescript
// Single query result
{
  date: string;        // Result date in ISO format
}

// Multiple query results
{
  dates: string[];     // Array of result dates in ISO format
}

// Error case
{
  error: string;       // Error description
}
```

**Example Usage:**
```javascript
// Find next Friday
await vscode.commands.executeCommand('ai-watch.dateQuery', {
  baseDate: '2025-08-11T10:00:00Z',
  queries: [{ type: 'nextWeekday', weekday: 'friday' }]
});
// Returns: { date: "2025-08-15T10:00:00Z" }

// Get start and end of current month
await vscode.commands.executeCommand('ai-watch.dateQuery', {
  baseDate: '2025-08-15T10:00:00Z',
  queries: [
    { type: 'startOfPeriod', period: 'month' },
    { type: 'endOfPeriod', period: 'month' }
  ]
});
// Returns: { dates: ["2025-08-01T00:00:00Z", "2025-08-31T23:59:59Z"] }

// Chained operations: find previous Wednesday, then next Monday from that date
await vscode.commands.executeCommand('ai-watch.dateQuery', {
  baseDate: '2025-08-15T10:00:00Z',
  queries: [
    { type: 'previousWeekday', weekday: 'wednesday' },
    { type: 'nextWeekday', weekday: 'monday' }
  ]
});
// Returns: { dates: ["2025-08-13T10:00:00Z", "2025-08-18T10:00:00Z"] }
```

### VS Code Commands API

All functionality is also available through direct VS Code commands for programmatic access by other extensions.

**Available Commands:**
- `ai-watch.getCurrentDate`
- `ai-watch.calculateDifference`
- `ai-watch.convertTimezone`
- `ai-watch.addTime`
- `ai-watch.subtractTime`
- `ai-watch.formatDuration`
- `ai-watch.businessDay`
- `ai-watch.dateQuery`

**Usage Pattern:**
```typescript
const result = await vscode.commands.executeCommand('ai-watch.[command]', parameters);
```

## ⚙️ VS Code Settings

AI Watch supports the following workspace and user settings for customization:

### **aiWatch.defaultTimezone**
- **Type:** `string`
- **Default:** Auto-detected from system
- **Description:** Default timezone for operations when not specified
- **Valid Values:** Any IANA timezone identifier (e.g., 'America/New_York', 'Europe/Berlin', 'Asia/Tokyo')
- **Scope:** User, Workspace
- **Example:**
```json
{
  "aiWatch.defaultTimezone": "Europe/London"
}
```

### **aiWatch.defaultDateFormat**
- **Type:** `string`
- **Default:** `"YYYY-MM-DD HH:mm:ss"`
- **Description:** Default date/time format pattern for display
- **Valid Values:** Format string using standard date formatting tokens
- **Scope:** User, Workspace
- **Examples:**
```json
{
  "aiWatch.defaultDateFormat": "DD/MM/YYYY HH:mm"
}
```

### **aiWatch.businessDays**
- **Type:** `string`
- **Default:** `"Mon-Fri"`
- **Description:** Defines which days are considered business days
- **Valid Values:** 
  - Range format: `"Mon-Fri"`, `"Sun-Thu"`
  - List format: `"Mon,Wed,Fri"`, `"Tue,Thu,Sat"`
- **Scope:** User, Workspace
- **Examples:**
```json
{
  "aiWatch.businessDays": "Sun-Thu"
}
```

### **aiWatch.excludedDates**
- **Type:** `array of strings`
- **Default:** `[]`
- **Description:** List of dates to exclude from business day calculations (holidays, company shutdowns)
- **Valid Values:** Array of dates in `YYYY-MM-DD` format
- **Scope:** User, Workspace
- **Examples:**
```json
{
  "aiWatch.excludedDates": [
    "2025-12-25",
    "2025-12-26",
    "2025-01-01",
    "2025-07-04"
  ]
}
```

### **aiWatch.weekStart**
- **Type:** `string`
- **Default:** `"monday"`
- **Description:** Defines which day is considered the start of the week for period calculations
- **Valid Values:** `"monday"`, `"sunday"`
- **Scope:** User, Workspace
- **Examples:**
```json
{
  "aiWatch.weekStart": "sunday"
}
```

### **aiWatch.durationFormat**
- **Type:** `string`
- **Default:** `"standard"`
- **Description:** Default verbosity level for duration formatting
- **Valid Values:** `"compact"`, `"standard"`, `"verbose"`
- **Scope:** User, Workspace
- **Examples:**
```json
{
  "aiWatch.durationFormat": "verbose"
}
```

### **aiWatch.maxDurationUnits**
- **Type:** `number`
- **Default:** `3`
- **Description:** Maximum number of time units to display in duration formatting
- **Valid Values:** Integer between 1 and 7
- **Scope:** User, Workspace
- **Examples:**
```json
{
  "aiWatch.maxDurationUnits": 2
}
```

### Settings Configuration Examples

#### **Global Team Configuration**
```json
{
  "aiWatch.defaultTimezone": "UTC",
  "aiWatch.defaultDateFormat": "YYYY-MM-DD HH:mm:ss",
  "aiWatch.businessDays": "Mon-Fri",
  "aiWatch.weekStart": "monday",
  "aiWatch.durationFormat": "standard"
}
```

#### **Middle East Regional Configuration**
```json
{
  "aiWatch.defaultTimezone": "Asia/Dubai",
  "aiWatch.businessDays": "Sun-Thu",
  "aiWatch.weekStart": "sunday",
  "aiWatch.excludedDates": [
    "2025-12-02",  // UAE National Day
    "2025-12-03"   // UAE National Day Holiday
  ]
}
```

#### **US Enterprise Configuration**
```json
{
  "aiWatch.defaultTimezone": "America/New_York",
  "aiWatch.defaultDateFormat": "MM/DD/YYYY hh:mm A",
  "aiWatch.businessDays": "Mon-Fri",
  "aiWatch.excludedDates": [
    "2025-01-01",  // New Year's Day
    "2025-07-04",  // Independence Day
    "2025-11-28",  // Thanksgiving
    "2025-12-25"   // Christmas
  ],
  "aiWatch.durationFormat": "verbose",
  "aiWatch.maxDurationUnits": 4
}
```

### Settings Priority

Settings are applied in the following priority order (highest to lowest):
1. **Function parameters** (direct API calls)
2. **Workspace settings** (`.vscode/settings.json`)
3. **User settings** (global VS Code settings)
4. **Extension defaults**

This allows for flexible configuration at different levels while maintaining sensible defaults for immediate usability.