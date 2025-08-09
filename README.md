![AI Watch Logo](icon.png)
# AI Watch

A VSCode extension that provides AI assistants and developers with comprehensive time and date tools for enhanced development workflows. Built with a modern, modular architecture for maintainability and extensibility.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/visual-studio-marketplace/v/rrayor.ai-watch)](https://marketplace.visualstudio.com/items?itemName=rrayor.ai-watch)
[![DeepSource](https://app.deepsource.com/gh/Rrayor/ai-watch.svg/?label=code+coverage&show_trend=true&token=O815bGyhxkzJ8iP3CzF__zVe)](https://app.deepsource.com/gh/Rrayor/ai-watch/)
[![DeepSource](https://app.deepsource.com/gh/Rrayor/ai-watch.svg/?label=active+issues&show_trend=true&token=O815bGyhxkzJ8iP3CzF__zVe)](https://app.deepsource.com/gh/Rrayor/ai-watch/)
[![DeepSource](https://app.deepsource.com/gh/Rrayor/ai-watch.svg/?label=resolved+issues&show_trend=true&token=O815bGyhxkzJ8iP3CzF__zVe)](https://app.deepsource.com/gh/Rrayor/ai-watch/)

## 🚀 Quick Start

AI Watch enables AI assistants, GitHub Copilot, and other development tools to access accurate time and date information directly within VS Code. Perfect for AI-assisted development, automated documentation, and global team coordination.

### Key Features

- **📅 Current Date & Time** - Get precise timestamps in multiple formats and timezones
- **🌍 Timezone Operations** - Convert between any IANA timezones with DST handling  
- **⏱️ Time Calculations** - Add/subtract durations, calculate differences between dates
- **💼 Business Day Support** - Handle workdays, weekends, and holiday exclusions
- **🔍 Advanced Date Queries** - Find next weekdays, period boundaries, and more
- **🎨 Human-Readable Formatting** - Convert durations to natural language

### Perfect For

- **AI Development Workflows** - Copilot and AI assistants get real-time date/time context
- **Global Team Coordination** - Schedule across timezones and calculate delivery dates  
- **Performance Analysis** - Measure build times and track development cycles
- **Documentation Generation** - Auto-generate timestamps and "last updated" dates
- **Project Planning** - Calculate deadlines considering business days and holidays

## 🏗️ Architecture

AI Watch uses a modular architecture organized into layers:

- **Types**: Shared TypeScript interfaces for commands and tools
- **Utils**: Core date/time utility functions
- **Commands**: VS Code command implementations
- **Tools**: Language Model Tool implementations  
- **Registration**: Extension activation and registration logic

For detailed architecture information, see [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 📖 Usage Examples

### For AI Assistants & Copilot

```javascript
// Get current time in multiple formats
const time = await vscode.commands.executeCommand('ai-watch.getCurrentDate');
// Result: { iso: "2025-08-09T13:37:01.000Z", utc: "2025-08-09 13:37:01", local: "2025-08-09 09:37:01" }

// Schedule deployment 4 hours from now in London time
const deployment = await vscode.commands.executeCommand('ai-watch.addTime', {
  hours: 4, timezone: 'Europe/London'
});

// Calculate build time duration
const buildTime = await vscode.commands.executeCommand('ai-watch.formatDuration', {
  from: '2025-08-09T12:00:00Z', to: '2025-08-09T12:47:33Z'
});
// Result: "47 minutes, 33 seconds"
```

### Natural Language Queries

AI assistants can handle conversational requests:
- *"What time will it be in 4 hours and 2 minutes?"*
- *"How many days until the sprint ends on August 20th?"*
- *"Convert this meeting time to Tokyo and Sydney timezones"*
- *"Is tomorrow a business day for deployment?"*

## 🛠️ Installation

1. **From VS Code Marketplace**: Search for "AI Watch" in the Extensions view
2. **Command Line**: `code --install-extension rrayor.ai-watch`
3. **Manual**: Download from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=rrayor.ai-watch)

No additional configuration required - works immediately after installation.

## 🤖 Language Model Integration

AI Watch automatically registers with VS Code's Language Model Tools, making it available to:
- **GitHub Copilot** - Enhanced time-aware code generation
- **AI Chat Extensions** - Contextual date/time assistance  
- **Custom AI Tools** - Direct API access for time operations

All 8 tools are automatically available: `getCurrentDate`, `addTime`, `subtractTime`, `calculateDifference`, `convertTimezone`, `formatDuration`, `businessDay`, and `dateQuery`.

## 📚 Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)** - Detailed architecture overview with diagrams
- **[User Guide](docs/USER_GUIDE.md)** - Comprehensive feature guide with examples
- **[API Reference](docs/API_REFERENCE.md)** - Complete API documentation for developers
- **[Configuration](docs/CONFIGURATION.md)** - Settings and customization options
- **[Testing Guide](docs/TESTING.md)** - Testing strategy and guidelines for contributors

## 🧪 Testing

AI Watch features a comprehensive test suite with **155 tests across 22 test files** covering all functionality layers. The modular architecture enables isolated testing of utilities, command integration, and end-to-end workflows.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

See the [Testing Guide](docs/TESTING.md) for detailed information about the testing strategy and contributing test cases.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=rrayor.ai-watch)
- [GitHub Repository](https://github.com/Rrayor/copilot-watch)
- [Report Issues](https://github.com/Rrayor/copilot-watch/issues)
- [Feature Requests](https://github.com/Rrayor/copilot-watch/issues/new?template=feature_request.md)