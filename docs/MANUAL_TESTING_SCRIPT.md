
# AI Watch – Manual Testing Script

This script covers all features with prompts and expected outcomes for AI chat/manual testing. Check off each test as you go.

---

## Table of Contents

- [AI Watch – Manual Testing Script](#ai-watch--manual-testing-script)
  - [Table of Contents](#table-of-contents)
  - [Setup Instructions](#setup-instructions)
  - [Feature Tests](#feature-tests)
    - [Feature 1: Get Current Date and Time](#feature-1-get-current-date-and-time)
    - [Feature 2: Calculate Time Difference](#feature-2-calculate-time-difference)
    - [Feature 3: Convert Timezone](#feature-3-convert-timezone)
    - [Feature 4: Add Time Duration](#feature-4-add-time-duration)
    - [Feature 5: Subtract Time Duration](#feature-5-subtract-time-duration)
    - [Feature 6: Format Duration](#feature-6-format-duration)
    - [Feature 7: Business Day Operations](#feature-7-business-day-operations)
    - [Feature 8: Date Query Operations](#feature-8-date-query-operations)
  - [Configuration Testing](#configuration-testing)
  - [Error Handling Testing](#error-handling-testing)
  - [Integration Testing](#integration-testing)
  - [Performance Testing](#performance-testing)
  - [Edge Cases](#edge-cases)
  - [Completion Checklist](#completion-checklist)
  - [Notes Section](#notes-section)

---

## Setup Instructions

1. Ensure AI Watch extension is installed and activated
2. Open VS Code with the AI Chat panel
3. Configure settings as needed for specific tests
4. Use the exact prompts provided below
5. Compare actual results with expected outcomes

---

## Feature Tests

### Feature 1: Get Current Date and Time

|   | Prompt | Expected Outcome | Done |
|---|--------|-----------------|------|
| 1.1 | `What is the current date and time?` | Tool: `getCurrentDateTime`<br>Result: ISO 8601 & UTC formats, includes timezone | [ ] |
| 1.2 | `What time is it in Tokyo right now?` | Tool: `getCurrentDateTime` with timezone<br>Result: Asia/Tokyo time, correct offset | [ ] |
| 1.3 | `Show me the current date and time in MM/DD/YYYY format.` | Tool: `getCurrentDateTime` with custom format<br>Result: MM/DD/YYYY HH:mm:ss | [ ] |
| 1.4 | `What time is it in New York, London, and Sydney right now?` | Multiple calls or multi-timezone<br>Results for all 3, correct offsets | [ ] |
| 1.5 | `What time is it in EST timezone?` | Error: Suggest IANA timezone, e.g. "America/New_York" (NOTE: The LLM might be smart here and use IANA anyway. That's acceptable, but check the logs to see if maybe it first ran into an error. Not a problem if not, but counts as verification if it did) | [ ] |

---

### Feature 2: Calculate Time Difference

|   | Prompt | Expected Outcome | Done |
|---|--------|-----------------|------|
| 2.1 | `How much time is between August 1st, 2025 at midnight and August 9th, 2025 at 1:37 PM?` | Tool: `calculateDifference`<br>8d 13h 37m | [ ] |
| 2.2 | `How long ago was January 1st, 2025?` | Tool: `calculateDifference`<br>Elapsed since 2025-01-01 | [ ] |
| 2.3 | `What's the difference between 9:00 AM and 5:30 PM today?` | Tool: `calculateDifference`<br>8h 30m | [ ] |
| 2.4 | `How much time between 3 PM EST and 9 AM JST on the same calendar date?` | Tool: `calculateDifference` with timezone<br>Correct time span | [ ] |
| 2.5 | `Calculate difference between "next Tuesday" and "last Friday"` | Error: Request ISO 8601 format, show example | [ ] |

---

### Feature 3: Convert Timezone

|   | Prompt | Expected Outcome | Done |
|---|--------|-----------------|------|
| 3.1 | `Convert August 9th, 2025 1:37 PM UTC to New York time.` | Tool: `convertTimezone`<br>Correct EST/EDT, offset | [ ] |
| 3.2 | `Convert 2:00 PM London time to Tokyo, Sydney, and Los Angeles times.` | Tool: `convertTimezone` x3<br>All conversions accurate | [ ] |
| 3.3 | `Convert March 15th, 2025 2:00 PM EST to PST.` | Tool: `convertTimezone`<br>DST handled, 3h diff | [ ] |
| 3.4 | `What is 6:00 AM UTC in Berlin and Mumbai?` | Tool: `convertTimezone`<br>Correct CET/CEST, IST | [ ] |
| 3.5 | `Convert 3 PM to GMT timezone.` | Error: Suggest IANA timezone, e.g. "Europe/London" | [ ] |

---

### Feature 4: Add Time Duration

|   | Prompt | Expected Outcome | Done |
|---|--------|-----------------|------|
| 4.1 | `What time will it be 4 hours and 30 minutes from now?` | Tool: `addTime`<br>Current +4:30 | [ ] |
| 4.2 | `Add 2 weeks, 3 days, 5 hours, and 45 minutes to August 1st, 2025 at 9:00 AM.` | Tool: `addTime`<br>2025-08-18T14:45:00Z | [ ] |
| 4.3 | `What time will it be in Tokyo 6 hours from now?` | Tool: `addTime` with timezone<br>JST result | [ ] |
| 4.4 | `What was the time 2 hours and 15 minutes ago?` | Tool: `addTime` negative or `subtractTime`<br>Current -2:15 | [ ] |
| 4.5 | `Add 1 year, 3 months, and 15 days to December 15th, 2024.` | Tool: `addTime`<br>2026-03-30T00:00:00Z | [ ] |

---

### Feature 5: Subtract Time Duration

|   | Prompt | Expected Outcome | Done |
|---|--------|-----------------|------|
| 5.1 | `What was the time 3 days and 12 hours ago?` | Tool: `subtractTime`<br>Current -3d 12h | [ ] |
| 5.2 | `Subtract 4 weeks, 2 days, and 8 hours from August 20th, 2025 5:00 PM.` | Tool: `subtractTime`<br>2025-07-21T09:00:00Z | [ ] |
| 5.3 | `What was the time in London 5 hours and 30 minutes before 2 PM EST?` | Tool: `subtractTime` with timezone<br>London result | [ ] |
| 5.4 | `Go back 6 months and 10 days from March 15th, 2025.` | Tool: `subtractTime`<br>2024-09-05T00:00:00Z | [ ] |
| 5.5 | `What date was it 500 days ago?` | Tool: `subtractTime`<br>Current -500d | [ ] |

---

### Feature 6: Format Duration

|   | Prompt | Expected Outcome | Done |
|---|--------|-----------------|------|
| 6.1 | `How long is the duration between August 1st and August 9th, 2025 in a readable format?` | Tool: `formatDuration`<br>"8 days" or "1 week, 1 day" | [ ] |
| 6.2 | `Format the time between January 1st, 2025 and August 15th, 2025 in detailed format.` | Tool: `formatDuration` verbose<br>Detailed breakdown | [ ] |
| 6.3 | `Format 2 hours and 45 minutes in compact format.` | Tool: `formatDuration` compact<br>"2h 45m" | [ ] |
| 6.4 | `Show the duration between now and next year but limit to 2 units.` | Tool: `formatDuration` maxUnits=2<br>2 largest units | [ ] |
| 6.5 | `Format the duration between the same instant twice.` | Tool: `formatDuration`<br>"0 seconds" | [ ] |

---

### Feature 7: Business Day Operations

|   | Prompt | Expected Outcome | Done |
|---|--------|-----------------|------|
| 7.1 | `Is August 15th, 2025 a business day?` | Tool: `businessDay` isBusinessDay<br>{ isBusinessDay: true, weekday: "Friday" } | [ ] |
| 7.2 | `Is August 16th, 2025 a business day?` | Tool: `businessDay` isBusinessDay<br>{ isBusinessDay: false, weekday: "Saturday" } | [ ] |
| 7.3 | `What date is 5 business days after August 12th, 2025?` | Tool: `businessDay` addBusinessDays<br>2025-08-19T00:00:00Z | [ ] |
| 7.4 | `What date is 3 business days before August 20th, 2025?` | Tool: `businessDay` subtractBusinessDays<br>2025-08-15T00:00:00Z | [ ] |
| 7.5 | `Add 2 business days to Friday using Monday-Thursday as business days.` | Tool: `businessDay` custom businessDays<br>Skips Fri-Sun, lands on Tuesday | [ ] |
| 7.6 | `Add 1 business day to August 18th, 2025, excluding August 19th as a holiday.` | Tool: `businessDay` excludedDates<br>2025-08-20T00:00:00Z | [ ] |
| 7.7 | `Add 0 business days to today.` | Error: MissingDaysError or validation<br>Message about positive days | [ ] |
| 7.8 | `Perform "multiplyBusinessDays" operation on August 15th.` | Error: UnsupportedBusinessDayOperation<br>List valid ops | [ ] |

---

### Feature 8: Date Query Operations

|   | Prompt | Expected Outcome | Done |
|---|--------|-----------------|------|
| 8.1 | `When is the next Monday after August 15th, 2025?` | Tool: `dateQuery` nextWeekday<br>2025-08-18T00:00:00Z | [ ] |
| 8.2 | `When was the last Tuesday before August 15th, 2025?` | Tool: `dateQuery` previousWeekday<br>2025-08-12T00:00:00Z | [ ] |
| 8.3 | `What date is the start of the week containing August 15th, 2025?` | Tool: `dateQuery` startOfPeriod<br>Start of week (config) | [ ] |
| 8.4 | `What is the last day of August 2025?` | Tool: `dateQuery` endOfPeriod<br>2025-08-31T23:59:59.999Z | [ ] |
| 8.5 | `When does 2025 begin?` | Tool: `dateQuery` startOfPeriod<br>2025-01-01T00:00:00Z | [ ] |
| 8.6 | `Find the next Friday, then get the start of that week.` | Tool: `dateQuery` chained<br>Start of week for next Friday | [ ] |
| 8.7 | `Find the next "Funday" after today.` | Error: InvalidWeekDayQueryError<br>List valid weekdays | [ ] |
| 8.8 | `Get the start of the "semester" period.` | Error: InvalidPeriodQueryError<br>List valid periods | [ ] |

---

## Configuration Testing

|   | Setup | Prompt | Expected |
|---|-------|--------|----------|
| C1 | Set `aiWatch.defaultDateFormat` to `"MM/DD/YYYY"` | `What is the current date and time?` | Uses MM/DD/YYYY format |
| C2 | Set `aiWatch.businessDays` to `["Monday", "Tuesday", "Wednesday"]` | `Is Thursday a business day?` | Returns `false` |
| C3 | Set `aiWatch.excludedDates` to `["2025-08-19"]` | `Add 1 business day to August 18th, 2025.` | Skips 19th, returns 20th |
| C4 | Set `aiWatch.weekStart` to `"sunday"` | `What is the start of this week?` | Returns Sunday as start |
| C5 | Set `aiWatch.durationFormat` to `"compact"` | `Format 2 days and 3 hours.` | "2d 3h" |
| C6 | Set `aiWatch.maxDurationUnits` to `1` | `Format duration between January 1st and March 15th.` | Only 1 unit (e.g., "2 months") |

---

## Error Handling Testing

|   | Prompt | Expected |
|---|--------|----------|
| E1 | `Calculate difference from "yesterday" to "tomorrow".` | Error: Request ISO 8601 format, show example |
| E2 | `Calculate time difference without providing dates.` | Error: Missing required parameters |
| E3 | `Convert time to "XYZ" timezone.` | Error: Suggest valid IANA timezone |
| E4 | `Add 500 years to current date.` | Graceful error or reasonable result |
| E5 | `Perform date query with invalid structure.` | Error: Query format requirements |

---

## Integration Testing

|   | Prompt | Expected |
|---|--------|----------|
| I1 | `What time will it be in Tokyo 5 business days from now, then convert that to New York time?` | Chains multiple tools |
| I2 | `Add 2 business days using custom business days configuration that differs from settings.` | Uses per-request config |
| I3 | `Is it a business day in Sydney right now?` | Converts to Sydney, checks business day |

---

## Performance Testing

|   | Prompt | Expected |
|---|--------|----------|
| P1 | `Add 10,000 days to current date.` | Completes quickly |
| P2 | `Get current time in 10 different timezones.` | Handles efficiently |

---

## Edge Cases

|   | Prompt | Expected |
|---|--------|----------|
| X1 | `Add 1 year to February 29th, 2024.` | Handles leap year |
| X2 | `Add 1 hour to 1:30 AM during DST change.` | Handles DST transition |
| X3 | `Add 1 month to January 31st.` | Handles month-end overflow |
| X4 | `Add 1 day to December 31st, 2025.` | Handles year boundary |

---

## Completion Checklist

- [ ] All feature tests executed
- [ ] All expected outcomes verified
- [ ] Configuration tests completed
- [ ] Error handling verified
- [ ] Integration scenarios tested
- [ ] Performance tests passed
- [ ] Edge cases handled
- [ ] Documentation matches behavior
- [ ] All tools responding correctly
- [ ] No unexpected errors or crashes

---

## Notes Section

Use this space to record any issues, unexpected behaviors, or deviations from expected outcomes:

```
Test X.Y: [Issue description]
Expected: [What should happen]
Actual: [What actually happened]
Status: [Fixed/Known Issue/Needs Investigation]
```
