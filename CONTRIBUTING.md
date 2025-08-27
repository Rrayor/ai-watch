# 🤝 Contributing to AI Watch

> **Purpose:** This guide provides actionable, up-to-date contribution guidelines for AI Watch, aligned with current architecture, documentation, and review standards.


---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- VS Code 1.103.0 or higher
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/ai-watch.git
   cd ai-watch
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Git Hooks**
   ```bash
   npm run prepare         # Installs Husky git hooks
   ```

4. **Verify Quality Setup**
   ```bash
   npm run quality         # Runs all quality checks
   ```

5. **Build the Extension**
   ```bash
   npm run compile
   ```

6. **Run Tests**
   ```bash
   npm test
   ```

7. **Start Development**
   ```bash
   npm run watch           # Auto-compile on changes
   ```

### Development Workflow

1. **Open in VS Code**: Open the project folder in VS Code
2. **Start Watch Mode**: Run `npm run watch` to automatically compile changes
3. **Launch Extension Host**: Press `F5` to open a new VS Code window with your extension loaded
4. **Test Changes**: Use the Command Palette (`Ctrl+Shift+P`) to test your changes
5. **Debug**: Set breakpoints in source files (commands, tools, utils) for debugging
6. **Quality Check**: Run `npm run quality` before committing
7. **Commit**: Pre-commit hooks automatically validate and fix code quality

---

## Architecture

AI Watch follows a modular architecture to enhance maintainability and scalability. The key components are:

- **Core**: Contains the main logic and APIs
- **UI**: Manages the user interface elements
- **Tests**: Holds all test cases and testing utilities

For further information on the architecture see the [relevant documentation](docs/ARCHITECTURE.md).

### Architectural Decision Records

AI Watch maintains a set of [Architectural Decision Records](docs/adr/adr-project-base-2025-08-16.md) (ADRs) to capture important decisions made during the development process. These records help ensure that the rationale behind architectural choices is documented and accessible.

---

## 📝 How to Contribute

### Reporting Issues

Before creating an issue, please:
- Check existing issues to avoid duplicates
- Use the issue templates when available
- Provide clear reproduction steps
- Include VS Code version and extension version

**Bug Reports Should Include:**
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Error messages or screenshots
- Environment details (OS, VS Code version, etc.)

### Feature Requests

Feature requests are welcome! Please:
- Explain the use case and benefit
- Provide examples of how it would work
- Consider if it fits the extension's scope
- Check if it can be implemented with existing tools

### Pull Requests

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the existing code style (enforced via ESLint + Prettier)
   - Add tests for new functionality
   - Update documentation if needed
   - Run `npm run quality` to ensure code quality
   - Ensure all tests pass with `npm test`

3. **Commit Your Changes**
   Use conventional commit messages! Pre-commit linting is set up to enforce the format. A copilot-commit-message.md instruction is also provided in the repository for automatic commit message generation OR developer reference.
   ```bash
   git commit -m "feat: add new time calculation feature"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **PR Requirements**
   - Clear description of changes
   - Link to related issues
   - All automated quality checks passing
   - All tests passing
   - Documentation updated
   - Pre-commit hooks configured and working


---

## 🏗️ Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Follow existing formatting (enforced via Prettier)
- **Naming**: Use descriptive names for functions and variables
- **Comments**: Add JSDoc comments for public APIs


---

## 🔧 Code Quality Tools

AI Watch uses a comprehensive code quality pipeline to ensure consistent, maintainable code:

### ESLint Configuration

- **Version**: ESLint 9.33.0 with flat configuration (`eslint.config.mjs`)
- **Target**: Prevents common issues flagged by DeepSource analysis
- **Dual Configuration**:
  - **Production Code**: Strict rules with type checking
  - **Test Code**: Relaxed rules for testing convenience

**Key Rules Enforced:**
- No `any` types (`@typescript-eslint/no-explicit-any`)
- No non-null assertions (`@typescript-eslint/no-non-null-assertion`)
- Mandatory template literals over string concatenation
- Complexity limits (max 10 cyclomatic complexity)
- Wildcard import restrictions

### TypeScript Configuration

**Dual Configuration Strategy:**
- `tsconfig.json`: Production code with strict type checking
- `tsconfig.test.json`: Test code with relaxed settings for convenience

**Strict Mode Features:**
- `noUncheckedIndexedAccess`: Include undefined in index signatures
- `exactOptionalPropertyTypes`: Differentiate undefined vs missing properties
- `noImplicitReturns`: Require explicit returns in all code paths
- `noUnusedLocals` & `noUnusedParameters`: Prevent dead code

### Prettier Configuration

**Formatting Standards** (`.prettierrc`):
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "endOfLine": "lf"
}
```

### Quality Scripts

```bash
# Run all quality checks (type checking + linting + formatting)
npm run quality

# Run quality checks with automatic fixes
npm run quality:fix

# Individual quality checks
npm run typecheck          # Type check production code
npm run typecheck:test     # Type check test code
npm run typecheck:all      # Type check everything
npm run lint               # Run ESLint
npm run lint:fix           # Run ESLint with auto-fix
npm run format:check       # Check Prettier formatting
npm run format             # Apply Prettier formatting

# Development compilation
npm run compile            # Compile production code
npm run compile:test       # Compile test code
npm run watch              # Watch production code
npm run watch:test         # Watch test code
```

### Pre-commit Automation

**Husky + lint-staged Integration:**
- **Trigger**: Every `git commit`
- **Validation**: Branch naming convention enforcement
- **Quality Gates**: TypeScript compilation, ESLint validation, Prettier formatting
- **Auto-fix**: Automatically fixes linting and formatting issues

**Branch Naming Convention:**
- `main`, `develop`: Primary branches
- `feature/*`: New features (e.g., `feature/new-timezone-tool`)
- `bugfix/*`: Bug fixes (e.g., `bugfix/timezone-calculation`)
- `hotfix/*`: Critical production fixes

**Pre-commit Process:**
1. Validates branch name matches convention
2. Runs `lint-staged` on changed files:
   - TypeScript files: ESLint fix + Prettier format
   - Other files: Prettier format only
3. Blocks commit if any step fails

### Development Configuration Files

| File | Purpose | Notes |
|------|---------|-------|
| `eslint.config.mjs` | ESLint 9.x flat configuration | Targets DeepSource issues |
| `.prettierrc` | Code formatting standards | Enforced in pre-commit |
| `lint-staged.config.json` | Pre-commit file processing | Auto-fixes on commit |
| `.editorconfig` | Cross-editor consistency | UTF-8, LF, 2-space indent |
| `tsconfig.json` | Production TypeScript config | Strict mode enabled |
| `tsconfig.test.json` | Test TypeScript config | Relaxed for test convenience |
| `.husky/pre-commit` | Git hook automation | Branch + quality validation |

### Architecture

- **Single Responsibility**: Each function should have one clear purpose
- **Error Handling**: Always handle errors gracefully with clear messages
- **Validation**: Validate all inputs, especially from external sources
- **Performance**: Consider performance impact of new features

### Testing

The modular architecture requires comprehensive testing across multiple layers:

#### Test Types by Layer

- **Utils Tests**: Test pure business logic functions in isolation
  - Location: `src/test/utils/`
  - Focus: Core calculations, parsing, formatting
  - Example: `dateUtils.test.ts`, `businessDayUtils.test.ts`

- **Command Tests**: Test VS Code command implementations
  - Location: `src/test/commands/`
  - Focus: Command integration, parameter validation, return formats
  - Example: `getCurrentDate.test.ts`, `addTime.test.ts`

- **Integration Tests**: Test end-to-end functionality
  - Location: `src/test/integration.test.ts`
  - Focus: Full workflow validation, VS Code API integration

- **Extension Tests**: Test tool registration and extension lifecycle
  - Location: `src/test/extension.test.ts`
  - Focus: Extension activation, tool availability

#### Test Guidelines

- **Document-Driven**: Tests validate documented API behavior, not implementation details
- **Timezone-Safe**: Use UTC methods (`getUTCHours()`) to prevent environment-specific failures
- **Error Coverage**: Test both success and error conditions with meaningful assertions
- **Format Validation**: Strictly validate return structures match documented formats

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run specific test file
npm test -- --grep "dateUtils"

# Run specific test by name
npm test -- --grep "should calculate basic time difference"

# Run tests for specific layer
npm test src/test/utils/        # Utils layer only
npm test src/test/commands/     # Command layer only
npm test src/test/integration/  # Integration tests only
```

#### Adding New Tests

When adding functionality (refer to [Testing Guidelines](docs/TESTING.md)):

1. **Utils Layer**: Add unit tests in appropriate `utils/*.test.ts` file
2. **Command Layer**: Add command tests in `commands/*.test.ts` file
3. **Documentation**: Ensure test examples match API documentation
4. **Coverage**: Aim for 100% coverage of new functionality including error cases

#### Manual Testing

A manual testing checklist is provided to validate the extension's functionality in a real VS Code environment. See [Manual Testing Checklist](docs/MANUAL_TESTING_SCRIPT.md).

### Language Model Tools

When adding new Language Model Tools:

1. **Update package.json**: Add the tool definition
2. **Implement Handler**: Create the command handler in the appropriate `src/commands/` file
3. **Create Tool**: Implement the Language Model Tool in the appropriate `src/tools/` file
4. **Register Tool**: Add registration calls in `src/registration/` files
5. **Add Validation**: Validate all input parameters
6. **Error Handling**: Provide clear error messages
7. **Documentation**: Update API documentation and examples
8. **Testing**: Add comprehensive tests

**Example Tool Definition:**
```json
{
  "name": "ai-watch_newTool",
  "tags": ["date", "time", "new"],
  "toolReferenceName": "newTool",
  "displayName": "New Tool",
  "modelDescription": "Description for AI assistants",
  "canBeReferencedInPrompt": true,
  "icon": "$(clock)",
  "inputSchema": {
    "type": "object",
    "properties": {
      "parameter": {
        "type": "string",
        "description": "Parameter description"
      }
    },
    "required": ["parameter"]
  }
}
```

---

## 📚 Documentation

### Documentation Guidelines

All contributors must follow these documentation update rules to maintain consistency and accuracy.

#### When to Update Each Documentation File

**Always Update:**
- **API_REFERENCE.md** - When adding/modifying any command, parameter, return format, or tool
- **TESTING.md** - When adding new test layers, changing test architecture, or updating testing guidelines
- **CONTRIBUTING.md** - When changing development workflow, review process, or project guidelines

**Update Based on Change Type:**

**User-Facing Features:**
- **USER_GUIDE.md** - New features, changed UI, modified workflows, examples updates
- **README.md** - Major features, installation changes, quick start modifications
- **CONFIGURATION.md** - New settings, changed defaults, configuration options

**Developer APIs:**
- **API_REFERENCE.md** - All parameter changes, return format updates, error condition changes
- **ARCHITECTURE.md** - Architecture changes, new layers, component modifications

**Project Changes:**
- **CHANGELOG.md** - All user-visible changes (features, fixes, breaking changes)
- **README.md** - Major version updates, significant architecture changes
- **CONTRIBUTING.md** - Process changes, new tools, updated requirements

#### Documentation Update Matrix

| Change Type | README | USER_GUIDE | API_REF | ARCHITECTURE | CONFIG | TESTING | CONTRIBUTING |
|-------------|---------|------------|---------|--------------|--------|---------|--------------|
| New Command | ✅ Major | ✅ Always | ✅ Always | ⚠️ If new layer | ⚠️ If settings | ⚠️ If test change | ❌ Rarely |
| API Change | ⚠️ Breaking | ⚠️ If user-facing | ✅ Always | ❌ Never | ❌ Never | ⚠️ If test change | ❌ Never |
| Architecture | ✅ Major | ❌ Never | ❌ Never | ✅ Always | ❌ Never | ⚠️ If test structure | ⚠️ If dev workflow |
| Settings | ⚠️ Major | ✅ Always | ❌ Never | ❌ Never | ✅ Always | ❌ Never | ❌ Never |
| Testing | ❌ Never | ❌ Never | ❌ Never | ⚠️ If strategy | ❌ Never | ✅ Always | ⚠️ If workflow |
| Process | ❌ Never | ❌ Never | ❌ Never | ❌ Never | ❌ Never | ⚠️ If test process | ✅ Always |

Legend: ✅ Always update | ⚠️ Update if applicable | ❌ Rarely/never update

#### Documentation Validation Checklist

Before submitting a PR, verify:

- [ ] **All affected docs updated** according to the matrix above
- [ ] **Examples tested** - All code examples work and match current API
- [ ] **Cross-references updated** - Links between docs are current
- [ ] **No hardcoded numbers** - Avoid specific test counts, line numbers, etc.
- [ ] **Consistent terminology** - Use same terms across all documentation
- [ ] **Complete coverage** - All new parameters/options are documented

#### Specific File Guidelines

**README.md**
- Update for: Major features, installation changes, architecture overhauls
- Keep concise: Focus on quick start and overview
- Test examples: Ensure all code examples work

**docs/USER_GUIDE.md**
- Update for: Any user-visible feature, UI change, or workflow modification
- Include examples: Provide practical, real-world use cases
- Step-by-step: Use clear numbered steps for procedures

**docs/API_REFERENCE.md**
- Update for: ANY API change, no matter how small
- Precision required: Exact parameter names, types, formats
- Complete coverage: Document all parameters, return values, errors

**docs/ARCHITECTURE.md**
- Update for: Structural changes, new components, layer modifications
- Technical focus: Detailed technical information for maintainers
- Diagrams: Update visual representations when structure changes

**docs/CONFIGURATION.md**
- Update for: New settings, changed defaults, configuration workflows
- Complete options: Document all possible values and effects
- Examples: Show real configuration scenarios

**docs/TESTING.md**
- Update for: Test architecture changes, new testing guidelines, coverage changes
- Process focus: How to run tests, add tests, debug issues
- Maintainer info: Information for contributors about testing strategy

**CONTRIBUTING.md**
- Update for: Process changes, tool updates, workflow modifications
- Contributor focus: Information needed by new and existing contributors
- Clear procedures: Step-by-step development and contribution workflows

### Documentation Requirements

- **User Guide**: Update for user-facing features
- **API Reference**: Update for developer APIs
- **Configuration**: Update for new settings
- **README**: Update for major features
- **Changelog**: Document all changes

### Writing Guidelines

- **Clear and Concise**: Use simple, direct language
- **Examples**: Provide practical examples
- **Complete**: Cover all parameters and return values
- **Accurate**: Test all examples before committing

### Documentation Structure

```
docs/
├── USER_GUIDE.md      # Comprehensive user documentation
├── API_REFERENCE.md   # Complete API documentation
├── ARCHITECTURE.md    # Technical architecture and design
├── CONFIGURATION.md   # Settings and configuration guide
└── TESTING.md         # Testing strategy and guidelines
```

---

## Code reviews

Refer to the [Code Review Checklist](docs/CODE_REVIEW.md) for guidelines on conducting effective code reviews.

---

## 🧪 Continuous Integration

### GitHub Actions Pipeline

**CI Workflow** (`.github/workflows/ci.yml`):
- **Triggers**: Push to `main`/`develop`, all pull requests
- **Matrix Testing**: Node.js 20.x and 22.x on Ubuntu
- **Quality Gates**: Linting, compilation, full test suite
- **Coverage**: Automated coverage reporting to DeepSource

**Release Workflow** (`.github/workflows/release.yml`):
- **Trigger**: Version tags (`v*`)
- **Process**: Build → Test → Package → GitHub Release → VS Code Marketplace
- **Automation**: Full release pipeline with artifact publishing

**Quality Integration:**
```bash
# CI runs these commands in sequence:
npm ci                    # Clean dependency install
npm run lint             # ESLint validation
npm run compile          # TypeScript compilation
npm test                 # Full test suite with coverage
```

### Pre-commit Quality Gates

**Automated via Husky + lint-staged:**
1. **Branch Validation**: Enforces naming convention
2. **TypeScript**: Compilation check for both production and test code
3. **ESLint**: Code quality validation with auto-fix
4. **Prettier**: Formatting consistency with auto-fix
5. **Tests**: Optional test run on commit (configurable)

**Failed Commit Recovery:**
```bash
# If pre-commit fails:
npm run quality:fix      # Fix most issues automatically
git add .               # Stage the fixes
git commit              # Retry commit
```


---

## 🚀 Release Process

### Version Management

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes to public API
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Release Checklist

1. **Update Version**: Bump version in `package.json`
2. **Update Changelog**: Document all changes
3. **Test Thoroughly**: Run all tests and manual testing
4. **Update Documentation**: Ensure docs are current
5. **Create Release**: Tag and create GitHub release
6. **Publish**: Publish to VS Code Marketplace


---


## 🎯 Areas for Contribution

> **Usage Tip:** Use this section as a checklist for onboarding, self-assessment, and PR review. When contributing, pick a focus area below, then consult the mapped documentation (see above) for relevant standards, examples, and requirements. Reviewers should reference these areas to ensure all critical aspects are covered in each PR.

### High Priority

- **Testing**: Increase test coverage, perform manual testing, and report bugs.
- **Behavior feedback**: Does the tool behave as you expect? If not, describe the steps, environment, and what you expected vs what happened; mention any confusing settings or defaults.

  Note: "Behavior feedback" is for usability and expectation gaps (surprising defaults, unclear settings, or workflows that don't match your mental model). If you can reproduce an error, include exact steps, input, and any error messages and file an issue as a bug report instead—bugs should contain reproduction steps and diagnostic details.
- **Bug fixing**: Address reported issues and improve stability.
- **Performance Optimizations**: Improve calculation efficiency. While no major performance issues are known, long-running tasks can cause AI agents to hang or behave unpredictably—proactively prevent this.
- **Error Handling**: Enhance error messages and recovery. Ensure AI agents and users are clearly notified of errors, especially in multi-step or automated processes.
- **Documentation**: Improve examples and guides for both users and developers.

### Medium Priority

- **New Features**: Add additional time/date operations.
- **Configuration**: Expand customization options.
- **Accessibility**: Improve accessibility features. If you identify areas for enhancement, propose and implement improvements.

### Good First Issues

- **Documentation**: Fix typos, clarify examples, and improve explanations.
- **Testing**: Add or improve tests for existing functionality; report bugs.
- **Bug Fixes**: Resolve minor bugs and edge cases.
- **Code Quality**: Refactor and improve code structure for maintainability.

---

## 💬 Community

### Communication

- **GitHub Issues**: For bugs, features, and questions
- **Discussions**: For general discussion and help
- **Pull Requests**: For code contributions

### Code of Conduct

We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). Please be respectful and inclusive in all interactions.

### Recognition

Contributors will be:
- Listed in release notes for significant contributions
- Credited in the README for ongoing contributions
- Invited to participate in project decisions

---

## 🔄 Development Workflow

### Branch Strategy

- **main**: Stable release branch
- **develop**: Integration branch for new features
- **feature/***: Feature development branches
- **bugfix/***: Bug fix branches
- **hotfix/***: Critical fixes for production

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(tools): add new timezone conversion tool
fix(business): correct business day calculation
docs(api): update API reference examples
test(unit): add tests for date calculations
```

### Review Process

1. **Automated Checks**: CI runs comprehensive quality validation
   - **TypeScript Compilation**: Both production and test code
   - **ESLint Validation**: Code quality and style enforcement
   - **Test Suite**: Full test coverage with multiple Node.js versions
   - **Coverage Reporting**: Automated coverage analysis
2. **Manual Review**: Maintainers review code, design, and documentation
3. **Testing**: Verify functionality works as expected in VS Code
4. **Documentation**: Ensure all affected documentation is updated
5. **Merge**: Maintainer merges after approval and quality gate passage

---

## 🙋‍♂️ Getting Help

If you need help:

1. **Check Documentation**: Review the user guide and API reference
2. **Search Issues**: Look for similar questions or problems
3. **Development Issues**: Check the troubleshooting section below
4. **Create Issue**: Ask specific questions with context
5. **Be Patient**: Maintainers will respond as soon as possible

### Development Troubleshooting

**Common Setup Issues:**

**ESLint Errors After Setup:**
```bash
# Fix: Ensure proper TypeScript configuration
npm run typecheck:all       # Verify TypeScript setup
npm run lint:fix           # Auto-fix ESLint issues
```

**Pre-commit Hook Failures:**
```bash
# Fix: Install hooks and validate setup
npm run prepare            # Reinstall Husky hooks
npm run quality:fix        # Fix quality issues
git add .                  # Stage fixes
git commit                 # Retry commit
```

**Test Compilation Errors:**
```bash
# Fix: Separate test compilation
npm run compile:test       # Check test TypeScript config
npm run typecheck:test     # Verify test types
```

**Extension Not Loading in Debug:**
```bash
# Fix: Ensure clean build
npm run compile            # Rebuild extension
# Press F5 in VS Code to launch debug session
```

**Coverage Reporting Issues:**
```bash
# Fix: Clean rebuild with coverage
rm -rf out/ coverage/      # Clean previous builds
npm run compile && npm run compile:test
npm test                   # Regenerate coverage
```


---

## 🔗 Cross-References
- [Architecture](ARCHITECTURE.md)
- [API Reference](API_REFERENCE.md)
- [User Guide](USER_GUIDE.md)
- [Configuration](CONFIGURATION.md)
- [Testing](TESTING.md)
- [Code Review Checklist](CODE_REVIEW.md)

Thank you for contributing to AI Watch! 🕐
