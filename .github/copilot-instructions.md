# 🧠 AI Watch Extension – Copilot & AI Agent Instructions

## 🏗️ Project Overview

AI Watch is a modular VS Code extension providing advanced date and time tools for AI assistants and developers. It is designed for maintainability, extensibility, and seamless integration with both VS Code commands and Language Model Tools.

### 📦 Architecture at a Glance
- **Entry Point:** `src/extension.ts` – Handles activation/deactivation
- **Registration Layer:** `src/registration/` – Wires up commands and LM tools
- **Feature Modules:** `src/modules/<feature>/` – Each feature is self-contained with:
  - `command/` – Pure command logic
  - `lm-tool/` – Language Model Tool wrappers
  - `model/` – TypeScript types for options/results
- **Shared Layer:** `src/modules/shared/` – Utilities, errors, and shared models

### 🧩 Key Patterns
- **Dual Interface:** Every feature exposes both a VS Code command (e.g. `ai-watch.addTime`) and a Language Model Tool (e.g. `ai-watch_addTime`).
- **Barrel Exports:** Each module uses an `index.ts` for clean imports/exports.
- **Strict TypeScript:** All strict flags enabled, no `any`, explicit return types, and no wildcard imports (except in tests).

### 🛠️ Example Feature Layout
```text
src/modules/add-time/
├── index.ts
├── command/addTimeCommand.ts
├── lm-tool/addTimeTool.ts
├── model/AddTimeOptions.ts
├── model/AddTimeResult.ts
```

### 🚦 Adding a New Feature
1. Create `command/`, `lm-tool/`, and `model/` folders in a new module
2. Implement the pure command function first
3. Add the LM Tool wrapper
4. Register both in `src/registration/commands.ts` and `tools.ts`
5. Update `package.json` (`contributes.commands` and LM tools)
6. Export via the module's `index.ts`

### ⚠️ Common Gotchas
- Always use `parseISOString()` for date parsing (never `new Date(string)`)
- Default to UTC for calculations, convert for display
- Update barrel exports (`index.ts`) when adding new exports
- Add new commands/tools to `package.json` and keep in sync
- Use UTC dates in tests to avoid timezone issues

---

# AI Watch Extension - Detailed Instructions

## 1. Architecture Overview

- **Entry point**: `src/extension.ts` - minimal activation/deactivation
- **Registration layer**: `src/registration/` - wires commands and LM tools to VS Code APIs
- **Feature modules**: `src/modules/<feature>/` - self-contained capabilities with command/, lm-tool/, model/ subfolders
- **Shared layer**: `src/modules/shared/` - cross-cutting utilities, errors, and models

Each feature follows the **dual interface pattern**: both a VS Code command (`ai-watch.addTime`) and Language Model Tool (`ai-watch_addTime`).

## 2. Key Development Patterns

### Module Structure
```
src/modules/<feature>/
├── index.ts              # Barrel exports
├── command/              # Pure command functions (validate → compute → return)
├── lm-tool/             # LM Tool classes bridging AI to commands
├── model/               # TypeScript interfaces (Options, Result types)
```

### Adding New Features
1. Create module structure with command/, lm-tool/, model/ folders
2. Implement pure command function first (in command/)
3. Create LM Tool wrapper (in lm-tool/)
4. Register both in `src/registration/commands.ts` and `tools.ts`
5. Update `package.json` contributes section
6. Export via module's `index.ts`

### Error Handling
- Use specific error classes from `src/modules/shared/error/`
- Command functions throw typed errors, tools catch and transform to `LanguageModelToolResult`
- Examples: `InvalidDateError`, `InvalidTimezoneError`, `MissingDaysError`

## 3. Build and Test Workflow

### Essential Commands
```bash
npm run watch          # TypeScript compilation in watch mode (use during development)
npm run test           # Full test suite (161 tests across 22 files)
npm run quality        # Complete quality check: typecheck + lint + format check
npm run quality:fix    # Auto-fix quality issues
```

### Testing Strategy
- **Test organization**: `src/test/commands/`, `src/test/tools/`, `src/test/utils/`
- **Layer isolation**: Test each architectural layer independently
- **UTC assertions**: All date tests use UTC to avoid timezone issues
- **Document validation**: Tests aim to validate API documentation primarily

## 4. TypeScript Configuration

**Strict settings enabled** in `tsconfig.json`:
- All strict type-checking options enabled
- `noUnusedLocals`/`noUnusedParameters` enforced
- `exactOptionalPropertyTypes` for precise type safety
- `noUncheckedIndexedAccess` for array/object safety

**ESLint rules** target DeepSource issues:
- No `any` types (`@typescript-eslint/no-explicit-any`)
- No wildcard imports except in tests
- Complexity limit: 10 per function
- Explicit return types required for functions

## 5. VS Code Integration Specifics

### Language Model Tools Registration
```typescript
// Pattern used in src/registration/tools.ts
vscode.lm.registerTool('ai-watch_featureName', new FeatureTool());
```

### Configuration Integration
- Read from `aiWatch.*` settings namespace
- Per-call parameters override global defaults
- Shared utilities apply effective values via `OperationContext`

### Extension Activation
- `onStartupFinished` activation event
- Registers all 8 tools automatically for AI assistant use
- No user configuration required for basic functionality

## 6. Dependencies and External Integration

**Core dependencies:**
- `date-fns` + `date-fns-tz` for all date calculations (prefer over native Date methods)
- `@types/vscode` for VS Code API integration

**Timezone handling:**
- IANA timezone names exclusively
- DST-aware conversions via `date-fns-tz`
- User timezone detection through VS Code environment

## 7. Common Gotchas

1. **Date parsing**: Always use `parseISOString()` from shared utils, not `new Date(string)`
2. **Timezone safety**: Default to UTC for calculations, convert for display
3. **Error boundaries**: LM Tools must catch command errors and return `LanguageModelToolResult.fromError()`
4. **Barrel exports**: Update module `index.ts` when adding new exports
5. **Package.json sync**: Add new commands to `contributes.commands` section
6. **Test isolation**: Use UTC dates in assertions to avoid local timezone issues

## 8. Business Domain Knowledge

This extension specializes in **AI-assisted development workflows** with precise time/date operations. Focus areas:
- Cross-timezone coordination for global teams
- Business day calculations with holiday exclusions
- Human-readable duration formatting for build times/deployments
- Date arithmetic for scheduling and deadline calculations
---

# 🧠 AI Coding Agent General Instructions

## 🏗️ Overview

This section provides general-purpose instructions and best practices for AI coding agents (such as GitHub Copilot) working in professional software repositories. It is designed to be portable across projects and should be adapted to the specific context of each repository.

## 🤖 Agent Workflow Principles

### 🧠 Core Philosophy
- **Quality by default**: Be thorough and complete unless explicitly told otherwise.
- **Autonomous but careful**: Make reasonable decisions independently, but ask when there's genuine ambiguity.
- **Complete implementations**: Never leave broken or fake code behind—finish what you start or ask for help.
- **Documentation-driven**: Follow existing documentation first, always flag contradictions.

### 🏗️ Decision Hierarchy (When Sources Conflict)
When information conflicts between sources, follow this priority order:
1. **Existing Documentation** (ADRs, specs, API guidelines) – unless it would break existing code
2. **Current Codebase Implementation** – when documentation would break behavior
3. **Copilot/Agent Instructions** – as fallback patterns and guidance

**Conflict Resolution:**
- Always flag contradictions in chat when you encounter them
- If any choice would break behavior → stop and escalate to developer
- If documentation conflicts with code → align with code but warn about the contradiction

### 🎯 Agent-Specific Workflow Rules
1. **Research first**: Always check existing documentation and codebase patterns before starting any task.
2. **Smart questioning**: Ask clarifying questions to prevent errors, not to optimize perfection.
	- Ask when: Instructions could reasonably lead to wrong implementation
	- Don't ask when: Implementation details are clear or follow obvious patterns
	- Avoid: Question loops over trivial details like field types or naming conventions
3. **No stubbing/incomplete implementations**: Never create placeholder code that pretends to work but doesn't.
	- Complete the implementation or ask for guidance on missing business logic
	- If you can't complete it properly → ask for help rather than fake it
4. **Examples are guidelines**: Code examples are illustrative patterns—adapt to your use case, verify field names, and check existing implementations for current patterns.
5. **Follow established patterns**: Use core domain patterns for business logic, infrastructure domain patterns for technical concerns.
6. **Quality standards**:
	- Use modern, project-standard testing frameworks
	- Write meaningful documentation for all public methods and classes
	- Avoid generic comments that don't add value
7. **Documentation updates** (two-phase approach):
	- Before coding: Update requirements, architectural decisions, API contracts
	- After coding: Update implementation details, cache keys, known issues, troubleshooting guides
	- Always: Update documentation with code changes
	- Verify: Check that final implementation aligns with existing documentation
8. **Decision recording**:
	- Note recurring or potentially recurring issues in troubleshooting guides
	- Record architectural decisions in ADRs with current date
	- Update relevant documentation if your changes affect existing patterns

### ✅ Success Criteria
A task is considered successfully completed when:
- [ ] Code follows established domain or architectural patterns
- [ ] All business logic is complete and functional (no stubbing or TODOs)
- [ ] Error handling follows domain or project exception patterns
- [ ] Unit and/or integration tests cover business logic and data flows
- [ ] Tests use the project-standard testing framework
- [ ] All tests pass and code compiles without errors
- [ ] Documentation is meaningful and complete for public methods/classes
- [ ] Implementation aligns with existing documentation
- [ ] Any contradictions with existing docs have been flagged
- [ ] Relevant documentation has been updated (two-phase approach)
- [ ] Architectural decisions are recorded in ADRs if applicable
- [ ] Code quality standards are met (line length, explicit imports, etc.)
- [ ] No placeholder implementations or incomplete features
- [ ] Code is ready for production use

### 📝 General Best Practices (For All Contributors)
- Check existing documentation before starting work
- Update documentation if your changes affect existing docs or patterns
- Ask clarifying questions only when information is genuinely missing or ambiguous
- Document code and changes with meaningful, future-proof comments and docstrings
- Record recurring issues in the troubleshooting guide
- Log architectural decisions in the ADRs

---

## 📚 Documentation Standards & Guidelines

### 🎯 Writing Principles
- **Clarity over cleverness**: Write for developers who are new to the project
- **Actionable content**: Every document should enable someone to DO something
- **Consistency**: Follow established patterns and terminology across all docs
- **Authority**: Reference ADRs and governance docs for backing decisions

### 🎨 Visual Formatting Standards
- Use strategic emoji to improve scanning and context (🎯 🏗️ 📋 ⚙️ 🔧)
- Markdown headers: Proper hierarchy with H1 for title, H2 for major sections, H3 for subsections
- Code blocks: Always specify language for syntax highlighting
- Diagrams: Use diagrams (e.g., mermaid) for flows, relationships, or processes when helpful
- Links: Use relative paths for internal docs, absolute for external resources

### ✍️ Writing Style Guide
- Organize content with clear, action-oriented headers
- Include practical examples
- Reference related documents
- Use checklists for process steps
- Group related items logically

### 🔗 Cross-References
- Internal links: Use relative paths for internal documentation
- Code references: Wrap in backticks (e.g., `ClassName`, `methodName()`)
- ADR references: Always link to backing architectural decisions
- Issue/ticket integration: Use project-standard ticket references

### 📚 Documentation Maintenance
- Update related docs when changing code
- Keep examples current
- Update docs when architectural patterns change
- Verify internal links after changes

---

## 🔍 Research & Context Gathering

### 📖 Required Reading Before Changes
1. Domain specifications for business context
2. Entity relationships for data model
3. Related ADRs for technical decisions
4. Existing patterns in the codebase

### 🧭 Navigation Strategy
- Start broad: Read overview docs first (README, governance)
- Drill down: Find domain-specific docs and patterns
- Cross-reference: Verify consistency with architectural decisions
- Validate approach: Ensure proposed changes align with established patterns
