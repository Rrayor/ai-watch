

# 🧑‍💻 AI Watch User Guide

> **Purpose:** This guide covers all features and capabilities of AI Watch, with practical, actionable examples for both users and AI assistants.


---

## 🗂️ Table of Contents

1. [Overview](#overview)
2. [AI Use Cases & Real-World Scenarios](#ai-use-cases--real-world-scenarios)
3. [Core Features](#core-features)
4. [Language Model Integration](#language-model-integration)
5. [Configuration](#configuration)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)



---

## 🌟 Overview


AI Watch is designed primarily for AI-assisted development workflows, providing comprehensive time and date tools that enable AI assistants, like GitHub Copilot, and other development tools to access accurate temporal information.


---

## 💡 AI Use Cases & Real-World Scenarios

AI Watch enables a wide range of practical, time-driven workflows for individuals and teams. Below are grouped use cases and real-world scenarios - mostly AI generated, because I couldn't come up with enough unique ideas :sweat_smile: - to inspire your automation:

### General Use Cases
- Generate recurring schedules
- Find optimal deployment windows
- Calculate quarterly/monthly reporting dates
- Plan milestone reviews and meetings
- Paste accurate timestamps in documentation
- Automated documentation updates (e.g., "Last Reviewed" dates)
- Change & decision logging with timestamps
- Log file analysis & timezone normalization
- Time-based TODOs and reminders
- SLA & deadline calculations
- Outdated date detection
- Human-readable change summaries
- Get creative! 😉

### Example Prompts
#### Comprehensive Example Prompt

> "For our global product launch, please:
> - Get the current time in UTC, Tokyo, and New York.
> - Schedule the release for 2 weeks and 3 business days from today, ensuring it lands on a business day in London.
> - Convert the planned release time to the local timezones for our teams in Sydney and Berlin.
> - Calculate how long it’s been since our last deployment on 2025-07-01T14:30:00Z, and format the duration in a human-readable way.
> - Add a TODO to review the deployment 1 month after the release date.
> - List all dates in this document older than 6 months and flag them for review.
> - Summarize the time difference between the last two releases in both total hours and a compact format."

**What this prompt demonstrates:**

- Get current time in multiple timezones: `getCurrentDateTime`, `convertTimezone`
- Schedule with business day math: `addTime`, `businessDay`
- Timezone conversion for teams: `convertTimezone`
- Duration since last deployment: `calculateDifference`, `formatDuration`
- Add a TODO for future review: `addTime`
- Find and flag old dates: `dateQuery` and date comparison
- Summarize time difference in various formats: `calculateDifference`, `formatDuration` with verbosity options

#### Specific Examples

> "Update the 'Last Reviewed' date in this README to today’s date in ISO format."
>
> "Log this architectural decision with the current UTC timestamp and a summary of the change."
>
> "Parse this log file and convert all timestamps to 'America/New_York' timezone."
>
> "Add a TODO to review this section by two weeks from today."
>
> "What is the SLA deadline if the ticket was opened at 2025-08-09T10:00:00Z and the SLA is 72 hours?"
>
> "Find all dates in this file older than 6 months and flag them for review."
>
> "Summarize how long it’s been since the last deployment in a human-readable format."


### Real-World Scenarios

#### Global Software Release

*"I'm planning a global software release. Help coordinate the timeline:"*

1. **Current Status Check**: Get current time across key timezones
2. **Release Scheduling**: Calculate deployment times 2 weeks from now
3. **Historical Analysis**: Compare with previous release timeline
4. **Performance Tracking**: Format build and deployment durations
5. **Business Day Planning**: Ensure releases on business days
6. **Deadline Management**: Find optimal deployment windows

#### Sprint Planning

*"Plan our 2-week sprint with proper timeline management:"*

1. **Sprint Duration**: Calculate exact end date from start
2. **Milestone Planning**: Find mid-sprint review dates
3. **Business Day Tracking**: Count only working days
4. **Timezone Coordination**: Align with global team schedules
5. **Performance Goals**: Set realistic deadlines
6. **Historical Context**: Compare with previous sprint durations

#### Performance Analysis

*"Analyze our build and deployment performance:"*

1. **Build Time Tracking**: Calculate durations between timestamps
2. **Human-Readable Reports**: Format times for stakeholders
3. **Historical Comparison**: Compare with previous builds
4. **Trend Analysis**: Track performance over time
5. **SLA Monitoring**: Ensure targets are met
6. **Global Impact**: Consider timezone differences


---

## 🤖 Language Model Integration

AI Watch integrates seamlessly with VS Code's Language Model Tools, making all functionality available to AI assistants through natural language.

### Supported Queries

AI assistants can handle conversational requests like:

- **Current Time**: *"What's the current time in Tokyo?"*
- **Future Planning**: *"When will it be 4 hours and 2 minutes from now?"*
- **Historical Analysis**: *"What was the date 6 months ago?"*
- **Duration Calculation**: *"How long between these two timestamps?"*
- **Timezone Conversion**: *"Convert this meeting time to London and Sydney"*
- **Business Planning**: *"Is tomorrow a business day for deployment?"*
- **Date Navigation**: *"When is the next Friday after today?"*

### Available Tools

All 8 language model tools are automatically registered:

1. **getCurrentDateTime** - Current time with timezone support
2. **addTime** - Add durations to dates
3. **subtractTime** - Subtract durations from dates
4. **calculateDifference** - Time differences between dates
5. **convertTimezone** - Convert between timezones
6. **formatDuration** - Human-readable duration formatting
7. **businessDay** - Business day operations
8. **dateQuery** - Advanced date navigation

> Note on tool outputs
>
> When used by AI agents via Language Model Tools, each tool returns:
> 1) A JSON payload that matches the API schema (for reliable parsing), followed by
> 2) A short, readable message summarizing the result.
>
> Agents should parse the JSON for facts and may include the message in user-facing replies.



---

## 🛠️ Core Features


### 📅 Current Date & Time

Get precise timestamps in multiple formats and timezones.

**Basic Usage:**
```javascript
// Get current time in all standard formats
const time = await vscode.commands.executeCommand('ai-watch.getCurrentDateTime');
// Returns (schema): {
//   iso?: string,
//   utc?: string,
//   local: string,
//   localTimezone: string,
//   formattedResult: string,
//   resultTimezone: string,
//   info?: string[]
// }
```

**AI Use Cases:**
- Generate accurate timestamps for commits and logs
- Create "last updated" dates in documentation
- Set cache expiration times
- Generate realistic test data


### 🌍 Timezone Operations

Convert between any IANA timezones with automatic DST handling.

**Basic Conversion:**
```javascript
// Preferred for AI assistants: pass a naive wall-clock together with an IANA source zone
const converted = await vscode.commands.executeCommand('ai-watch.convertTimezone', {
  date: '2025-08-16T15:00:00', // naive local wall-clock
  fromTimezone: 'America/New_York',
  toTimezone: 'Asia/Tokyo'
});
// Returns (schema): {
//   iso?: string,
//   utc?: string,
//   local: string,
//   localTimezone: string,
//   formattedResult: string,
//   resultTimezone: string, // target timezone
//   fromTimezone?: string,
//   info?: string[]
// }

// If you already have an absolute ISO with offset/Z, pass it directly and `fromTimezone` will be ignored
const converted2 = await vscode.commands.executeCommand('ai-watch.convertTimezone', {
  date: '2025-08-09T13:37:01Z',
  toTimezone: 'Asia/Tokyo'
});
```

**AI Use Cases:**
- Coordinate global team meetings
- Schedule deployments across regions
- Localize timestamps for different audiences
- Analyze logs from distributed systems


### ⏱️ Time Calculations

Add or subtract complex durations with precision.

**Future Calculations:**
```javascript
// What time will it be in 2 weeks, 3 days, and 4 hours?
const future = await vscode.commands.executeCommand('ai-watch.addTime', {
  weeks: 2,
  days: 3,
  hours: 4,
  timezone: 'Europe/London'
});
// Returns (schema): {
//   iso?: string,
//   utc?: string,
//   local: string,
//   localTimezone: string,
//   formattedResult: string,
//   resultTimezone: string,
//   baseTime?: string,
//   info?: string[]
// }
```

**Historical Calculations:**
```javascript
// What was the time 1 month and 15 days ago?
const past = await vscode.commands.executeCommand('ai-watch.subtractTime', {
  months: 1,
  days: 15
});
// Returns (schema): {
//   iso?: string,
//   utc?: string,
//   local: string,
//   localTimezone: string,
//   formattedResult: string,
//   resultTimezone: string,
//   baseTime?: string,
//   info?: string[]
// }
```

**Time Differences:**
```javascript
// How long between two releases?
const duration = await vscode.commands.executeCommand('ai-watch.calculateDifference', {
  from: '2025-07-01T14:30:00Z',
  to: '2025-08-09T13:37:01Z'
});
// Returns (schema): {
//   milliseconds?: number,
//   seconds?: number,
//   minutes?: number,
//   hours?: number,
//   days?: number,
//   formatted?: string
// }
```

**AI Use Cases:**
- Calculate project deadlines and milestones
- Measure performance and build times
- Plan sprint schedules and delivery dates
- Track time elapsed between events


### 🎨 Human-Readable Formatting

Convert durations into natural language.

**Basic Formatting:**
```javascript
const readable = await vscode.commands.executeCommand('ai-watch.formatDuration', {
  from: '2025-08-09T12:00:00Z',
  to: '2025-08-09T14:47:33Z'
});
// Returns (schema): { formatted?: string, totalMilliseconds?: number, error?: string }
// Example: { formatted: "2 hours, 47 minutes, 33 seconds" }
```

**Compact Format:**
```javascript
const compact = await vscode.commands.executeCommand('ai-watch.formatDuration', {
  from: '2025-08-01T00:00:00Z',
  to: '2025-08-09T13:37:01Z',
  verbosity: 'compact',
  maxUnits: 2
});
// Returns (schema): { formatted?: string, totalMilliseconds?: number, error?: string }
// Example: { formatted: "8d 13h" }
```

**AI Use Cases:**
- Generate user-friendly status reports
- Create readable performance summaries
- Format uptime and downtime reports
- Display "time ago" information


### 💼 Business Day Support

Handle workdays, weekends, and holiday exclusions.

**Business Day Validation:**
```javascript
const isWorkday = await vscode.commands.executeCommand('ai-watch.businessDay', {
  operation: 'isBusinessDay',
  date: '2025-08-15T10:00:00Z'
});
// Returns (schema): { isBusinessDay?: boolean, weekday?: string }
// Example: { isBusinessDay: true, weekday: "Friday" }
```

**Business Day Math:**
```javascript
// Add 5 business days
const workdaysAdded = await vscode.commands.executeCommand('ai-watch.businessDay', {
  operation: 'addBusinessDays',
  date: '2025-08-12T10:00:00Z',
  days: 5
});
// Returns (schema): { result?: string, days?: number, businessDays?: string, excludedDates?: string[] }

// Subtract 3 business days
const workdaysSubtracted = await vscode.commands.executeCommand('ai-watch.businessDay', {
  operation: 'subtractBusinessDays',
  date: '2025-08-20T10:00:00Z',
  days: 3
});
// Returns (schema): { result?: string, days?: number, businessDays?: string, excludedDates?: string[] }
```

**AI Use Cases:**
- Calculate realistic project deadlines
- Schedule deployments avoiding weekends
- Plan releases considering business hours
- Track SLA compliance


### 🔍 Advanced Date Queries

Find specific dates and navigate time periods.

**Weekday Navigation:**
```javascript
// Find next Friday
const nextFriday = await vscode.commands.executeCommand('ai-watch.dateQuery', {
  baseDate: '2025-08-11T10:00:00Z',
  queries: [{ type: 'nextWeekday', weekday: 'friday' }]
});
// Returns (schema): { dates?: string[] }
```

**Period Boundaries:**
```javascript
// Get start and end of current month
const monthBounds = await vscode.commands.executeCommand('ai-watch.dateQuery', {
  baseDate: '2025-08-15T10:00:00Z',
  queries: [
    { type: 'startOfPeriod', period: 'month' },
    { type: 'endOfPeriod', period: 'month' }
  ]
});
// Returns (schema): { dates?: string[] }
```

**Chained Operations:**
```javascript
// Find previous Wednesday, then next Monday from that date
const chained = await vscode.commands.executeCommand('ai-watch.dateQuery', {
  baseDate: '2025-08-15T10:00:00Z',
  queries: [
    { type: 'previousWeekday', weekday: 'wednesday' },
    { type: 'nextWeekday', weekday: 'monday' }
  ]
});
// Returns (schema): { dates?: string[] }
```


---

## ⚙️ Configuration

AI Watch can be customized through VS Code settings for team-specific needs:

```json
{
  "aiWatch.businessDays": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "aiWatch.excludedDates": ["2025-12-25", "2025-01-01"],
  "aiWatch.weekStart": "sunday",
  "aiWatch.durationFormat": "standard"
}
```

See [Configuration Guide](CONFIGURATION.md) for complete settings documentation.


---

## 🏅 Best Practices

### For AI Development

1. **Use specific timezones** - Always specify IANA timezone names
2. **Handle errors gracefully** - Check for error responses
3. **Cache results appropriately** - Time data can be cached briefly
4. **Consider user context** - Use local timezone when appropriate

### For Global Teams

1. **Standardize on UTC** - Use UTC for internal calculations
2. **Convert for users** - Display in user's local timezone
3. **Plan for DST** - Account for daylight saving changes
4. **Document timezones** - Always specify timezone in documentation

### For Performance

1. **Batch operations** - Combine multiple calculations when possible
2. **Use appropriate precision** - Not all use cases need milliseconds
3. **Format efficiently** - Choose appropriate verbosity levels
4. **Monitor usage** - Track API calls in high-frequency scenarios


---

## 🆘 Troubleshooting

### Common Issues

**Invalid timezone names**: Use IANA timezone identifiers like 'America/New_York', not abbreviations like 'EST'

**Date format and ambiguity guidance**:
- Preferred: when supplying a naive wall-clock (no offset), also supply `fromTimezone` (IANA) so the tool can unambiguously resolve the instant.
- If a naive ISO without offset is provided and `fromTimezone` is omitted, the tool will return an explicit error instructing the caller to provide `fromTimezone` or an ISO with offset. This prevents LLMs from silently making incorrect assumptions about timezone offsets.
- Example error message returned for ambiguous input:

```json
{
  "error": "Ambiguous date: '2025-08-16T15:00:00' has no timezone offset. Provide 'fromTimezone' (IANA) or an ISO with offset (e.g., '2025-08-16T15:00:00-04:00')."
}
```

**Business day configuration**: Check weekStart settings and excluded dates

**Timezone conversion accuracy**: Verify source and target timezones are correct


### 🆘 Getting Help

- Check the [API Reference](API_REFERENCE.md) for detailed parameter information
- Review [Configuration](CONFIGURATION.md) for settings help
- Report issues on the [GitHub repository](https://github.com/Rrayor/copilot-watch/issues)
