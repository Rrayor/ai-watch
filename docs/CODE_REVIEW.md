

# 📋 Code Review Checklist – AI Watch Extension

> **Purpose:** Actionable, production-ready checklist for reviewers and authors, ensuring quality, maintainability, and compliance with project standards.

---

## 🎯 Review Objectives
- ✅ Ensure code is correct, safe, and maintainable
- 🏗️ Enforce modular boundaries and architectural patterns
- 🛡️ Maintain security, performance, and code quality
- 📚 Support learning and knowledge sharing

---

## ✅ Review Checklist

### 1. 🏗️ Architecture & Modularity
- [ ] No cross-feature dependencies except via the shared layer
- [ ] New features are in their own module folders with `command/`, `lm-tool/`, and `model/` subfolders
- [ ] Barrel exports (`index.ts`) are used for clean imports/exports
- [ ] No star imports; all imports are explicit

### 2. 📏 Type Safety & Consistency
- [ ] Strict TypeScript settings enforced (no `any`, explicit return types, union types for enums)
- [ ] Interfaces and types are updated as features evolve

### 3. ⚠️ Error Handling
- [ ] All errors use specific error types (e.g., `InvalidDateError`, `InvalidTimezoneError`)
- [ ] LM Tools catch and transform errors into user-friendly messages
- [ ] All new error types are documented and tested

### 4. 🧪 Testing
- [ ] Unit, integration, and end-to-end tests cover new/changed logic
- [ ] UTC is used in all date/time tests
- [ ] Both success and error paths are tested
- [ ] All tests pass in CI

### 5. 📚 Documentation Discipline
- [ ] All relevant docs (API reference, user guide, configuration, ADRs) are updated with code changes
- [ ] Code examples in docs are tested and match the current API

### 6. ⚙️ Configuration
- [ ] Per-call parameters are preferred over global settings for flexibility
- [ ] Configuration values are validated with clear error messages for invalid settings

### 7. ⚡ Performance & Extensibility
- [ ] Modules are stateless and avoid global state
- [ ] Shared utilities are used for common logic to prevent duplication
- [ ] New features are easily testable and maintainable

### 8. 🧹 Code Quality & Linting
- [ ] `npm run quality` passes before every commit
- [ ] All lint and formatting issues are fixed before submitting PRs
- [ ] No commented-out or dead code

### 9. 📝 Commit Message & PR Template Compliance
- [ ] Commit messages are descriptive and follow conventions
- [ ] PR descriptions are clear, link related issues, and summarize changes
- [ ] All automated checks pass before requesting review
- [ ] Updated documentation and tests are referenced in the PR

### 10. 🔄 Review Process
- [ ] All review comments are addressed or resolved
- [ ] No merge conflicts
- [ ] PR is only merged after all acceptance criteria are met

---

## 👥 Reviewer Responsibilities
- Be constructive and respectful
- Ask for clarification when needed
- Suggest improvements, not just point out problems
- Approve only when all checklist items are satisfied

## ✍️ Author Responsibilities
- Self-review using this checklist before requesting review
- Respond to all review comments
- Update code and documentation as needed
- Ensure all CI checks pass before merging

---

## 🔗 Cross-References
- [Architecture](ARCHITECTURE.md)
- [API Reference](API_REFERENCE.md)
- [User Guide](USER_GUIDE.md)
- [Configuration](CONFIGURATION.md)
- [Testing](TESTING.md)

---

_These guidelines help maintain the quality, reliability, and extensibility of the AI Watch extension._
