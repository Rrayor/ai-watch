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
5. **Debug**: Set breakpoints in `src/extension.ts` for debugging

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

- **Unit Tests**: Add tests for all new functions
- **Integration Tests**: Test VS Code command integration
- **Error Cases**: Test error conditions and edge cases
- **Documentation**: Test examples in documentation

**Running Specific Tests:**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --grep "test-name"
```

### Language Model Tools

When adding new Language Model Tools:

1. **Update package.json**: Add the tool definition
2. **Implement Handler**: Create the command handler in `src/extension.ts`
3. **Add Validation**: Validate all input parameters
4. **Error Handling**: Provide clear error messages
5. **Documentation**: Update API documentation and examples
6. **Testing**: Add comprehensive tests

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
└── CONFIGURATION.md   # Settings and configuration guide
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
