# Change Log

All notable changes to AI Watch will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-09

### Added
- **Initial Release** - Complete time and date toolkit for AI-assisted development
- **8 Language Model Tools** - Full integration with VS Code's Language Model Tools API
- **Current Date & Time** - Get timestamps in multiple formats and timezones
- **Timezone Operations** - Convert between any IANA timezones with DST handling
- **Time Calculations** - Add/subtract durations, calculate time differences
- **Business Day Support** - Handle workdays, weekends, and holiday exclusions
- **Advanced Date Queries** - Find weekdays, period boundaries, and date navigation
- **Human-Readable Formatting** - Convert durations to natural language
- **VS Code Commands** - Complete programmatic API for extension developers
- **Comprehensive Settings** - Configurable business days, timezones, and formats
- **Error Handling** - Robust validation with clear error messages
- **AI Assistant Integration** - Ready for GitHub Copilot and AI chat extensions

### Language Model Tools
- `getCurrentDate` - Current time with timezone awareness
- `addTime` - Add durations to dates with multi-unit support
- `subtractTime` - Subtract durations from dates for historical calculations
- `calculateDifference` - Precise time differences between any two dates
- `convertTimezone` - Convert dates between IANA timezones
- `formatDuration` - Human-readable duration formatting with verbosity control
- `businessDay` - Business day validation and calculations
- `dateQuery` - Advanced date navigation and period boundary queries

### Features
- **Multi-timezone Support** - Full IANA timezone database with DST handling
- **Business Day Intelligence** - Configurable business rules and holiday exclusions
- **Performance Optimized** - Efficient calculations with minimal memory usage
- **Developer Friendly** - TypeScript definitions and comprehensive error handling
- **Team Collaboration** - Workspace settings for consistent team configuration
- **Global Ready** - Support for different week starts and date formats

### Documentation
- Complete user guide with practical examples
- Comprehensive API reference for developers
- Configuration guide for team setup
- Real-world usage scenarios and best practices