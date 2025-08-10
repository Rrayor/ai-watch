# Change Log

All notable changes to AI Watch will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Type Safety Improvements** - Union types for `VerbosityLevel` and `DurationUnit` with compile-time validation
- **Comprehensive Edge Case Testing** - 6 new test cases covering negative durations, zero handling, and complex scenarios
- **Namespace Exports** - Organized exports to prevent naming conflicts (`Types`, `Tools`, `Commands`, `Utils`)
- **Enhanced DeepSource Configuration** - Improved test pattern detection and TypeScript support
- **Custom Format Support** - Token-based date formatting (YYYY, MM, DD, HH, mm, ss)
- **Enhanced Error Handling** - Improved timezone validation with user-friendly messages
- **Business Day Wrap-around** - Support for date boundaries in business day calculations
- **Architecture Documentation** - Comprehensive documentation with Mermaid diagrams

### Changed
- **Negative Duration Handling** - Fixed bug where negative durations weren't properly signed
- **Zero Duration Edge Cases** - Prevents nonsensical "-0s" outputs in all verbosity modes
- **Export Structure** - Namespace-based exports prevent Node.js syntax errors from conflicting names
- **Type Interfaces** - Updated to use centralized union types for better maintainability
- **Modular Architecture** - Organized code into 6-layer module system with 23+ focused files
- **Zero Code Duplication** - Eliminated redundancy through centralized utilities
- **Performance Optimizations** - Enhanced string operations and timezone formatting
- **Duration Logic** - Removed confusing "ago" suffix from positive durations

### Fixed
- **Negative Sign Preservation** - Duration formatting now properly handles negative values as documented
- **Type Safety** - Compile-time prevention of invalid verbosity and unit values
- **Export Conflicts** - Eliminated potential Node.js naming conflicts through namespace organization

### Fixed
- **Timezone Validation** - Proper error handling for invalid timezone inputs
- **Business Day Calculations** - Corrected wrap-around behavior for date boundaries
- **Duration Formatting** - Fixed inconsistent "ago" suffix in positive durations

### Technical
- **Single Responsibility** - Each module has a clear, focused purpose
- **100% Backward Compatibility** - All APIs preserved during restructuring
- **Enhanced Type Safety** - Comprehensive TypeScript interfaces across all modules
- **Improved Maintainability** - Significantly better code organization and readability

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