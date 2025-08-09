# Contributing to AI Watch

We welcome contributions to AI Watch! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- VS Code 1.103.0 or higher
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/copilot-watch.git
   cd copilot-watch
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run compile
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Start Development**
   ```bash
   npm run watch
   ```

### Development Workflow

1. **Open in VS Code**: Open the project folder in VS Code
2. **Start Watch Mode**: Run `npm run watch` to automatically compile changes
3. **Launch Extension Host**: Press `F5` to open a new VS Code window with your extension loaded
4. **Test Changes**: Use the Command Palette (`Ctrl+Shift+P`) to test your changes
5. **Debug**: Set breakpoints in source files (commands, tools, utils) for debugging

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
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation if needed
   - Ensure all tests pass

3. **Commit Your Changes**
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
   - All tests passing
   - Documentation updated

## 🏗️ Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Follow existing formatting (we recommend Prettier)
- **Naming**: Use descriptive names for functions and variables
- **Comments**: Add JSDoc comments for public APIs

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

When adding functionality:

1. **Utils Layer**: Add unit tests in appropriate `utils/*.test.ts` file
2. **Command Layer**: Add command tests in `commands/*.test.ts` file  
3. **Documentation**: Ensure test examples match API documentation
4. **Coverage**: Aim for 100% coverage of new functionality including error cases

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
| UI Feature | ✅ Major | ✅ Always | ❌ Never | ❌ Never | ⚠️ If settings | ❌ Never | ❌ Never |
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

## 🧪 Release Process

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

## 🎯 Areas for Contribution

### High Priority

- **Performance Optimizations**: Improve calculation efficiency
- **Error Handling**: Enhance error messages and recovery
- **Testing**: Increase test coverage
- **Documentation**: Improve examples and guides

### Medium Priority

- **New Features**: Additional time/date operations
- **Internationalization**: Support for more locales
- **Configuration**: Additional customization options
- **Accessibility**: Improve accessibility features

### Good First Issues

- **Documentation**: Fix typos, improve examples
- **Testing**: Add tests for existing functionality
- **Bug Fixes**: Fix minor bugs and edge cases
- **Code Quality**: Refactor and improve code structure

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

1. **Automated Checks**: CI runs tests and linting
2. **Manual Review**: Maintainers review code and design
3. **Testing**: Verify functionality works as expected
4. **Documentation**: Ensure documentation is updated
5. **Merge**: Maintainer merges after approval

## 🙋‍♂️ Getting Help

If you need help:

1. **Check Documentation**: Review the user guide and API reference
2. **Search Issues**: Look for similar questions or problems
3. **Create Issue**: Ask specific questions with context
4. **Be Patient**: Maintainers will respond as soon as possible

Thank you for contributing to AI Watch! 🕐
