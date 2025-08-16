# 📝 AI Watch – Changelog (Pre-Release)

This changelog summarizes the current state of the extension prior to its first public release.

---

## [Unreleased]

### Features Added
- Modular, feature-first TypeScript architecture
- Dual interface: all features as both VS Code commands and Language Model Tools
- 8 core capabilities:
	- Current date/time (multi-timezone)
	- Add/subtract time intervals
	- Timezone conversion (IANA, DST-aware)
	- Business day calculations (configurable, holiday exclusions)
	- Human-readable duration formatting
	- Time difference calculations
	- Advanced date queries (weekday navigation, period boundaries)
- Comprehensive error handling with specific error types
- Strict type safety and explicit TypeScript interfaces
- Full test suite: unit, integration, and document-driven tests
- Workspace and user configuration support
- Modern documentation: API reference, user guide, architecture, configuration, and testing guides

### Architectural Setup
- Modular directory structure: entry point, registration layer, feature modules, shared utilities
- Barrel exports for all modules
- No global state; stateless, testable modules
- Pre-commit quality gates (lint, typecheck, format)
- Ready for AI assistant and VS Code integration

---

_This changelog will be updated for the first public release. All features and architecture described above are present in the current codebase._
