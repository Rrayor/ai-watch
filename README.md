![AI Watch Logo](icon.png)

# AI Watch

> ⌚ A VS Code extension providing AI assistants and developers with comprehensive time and date tools for enhanced workflows.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/visual-studio-marketplace/v/rrayor.ai-watch)](https://marketplace.visualstudio.com/items?itemName=rrayor.ai-watch)
[![CI](https://github.com/Rrayor/ai-watch/actions/workflows/ci.yml/badge.svg)](https://github.com/Rrayor/ai-watch/actions/workflows/ci.yml)
[![DeepSource](https://app.deepsource.com/gh/Rrayor/ai-watch.svg/?label=code+coverage&show_trend=true&token=O815bGyhxkzJ8iP3CzF__zVe)](https://app.deepsource.com/gh/Rrayor/ai-watch/)
[![DeepSource](https://app.deepsource.com/gh/Rrayor/ai-watch.svg/?label=active+issues&show_trend=true&token=O815bGyhxkzJ8iP3CzF__zVe)](https://app.deepsource.com/gh/Rrayor/ai-watch/)
[![DeepSource](https://app.deepsource.com/gh/Rrayor/ai-watch.svg/?label=resolved+issues&show_trend=true&token=O815bGyhxkzJ8iP3CzF__zVe)](https://app.deepsource.com/gh/Rrayor/ai-watch/)

> ⚠️ **Project Status:**
> AI Watch is in active development and believed to be stable, but has only limited testing. Please try it out and report any issues. Feedback and contributions are especially welcome!

---

## 🚀 Overview

AI Watch enables AI assistants, GitHub Copilot, and other development tools to access accurate time and date information directly within VS Code. Perfect for AI-assisted development, documentation, and global team coordination.

---

## ✨ Features

- 📅 Current Date & Time — Get precise timestamps in multiple formats and timezones
- 🌍 Timezone Operations — Convert between any IANA timezones with DST handling
- ⏱️ Time Calculations — Add/subtract durations, calculate differences between dates
- 💼 Business Day Support — Handle workdays, weekends, and holiday exclusions
- 🔍 Advanced Date Queries — Find next weekdays, period boundaries, and more
- 🎨 Human-Readable Formatting — Convert durations to natural language

---

## 🛠️ Installation

- **Marketplace:** [AI Watch on VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=rrayor.ai-watch)
- **Command Line:**
  ```bash
  code --install-extension rrayor.ai-watch
  ```
- **Manual:** Download from the Marketplace link above

No additional configuration required—works immediately after installation.

---

## 📖 Usage

### Quick Start

#### Natural Language Queries

- "What time will it be in 4 hours and 2 minutes?"
- "How many days until the sprint ends on August 20th?"
- "Convert this meeting time to Tokyo and Sydney timezones"
- "Is tomorrow a business day for deployment?"

#### Code Examples

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

---

## 🤖 Language Model & API Integration

AI Watch automatically registers with VS Code's Language Model Tools, making it available to:
- **GitHub Copilot** — Enhanced time-aware code generation
- **AI Chat Extensions** — Contextual date/time assistance
- **Custom AI Tools** — Direct API access for time operations

All 8 tools are available: `getCurrentDate`, `addTime`, `subtractTime`, `calculateDifference`, `convertTimezone`, `formatDuration`, `businessDay`, and `dateQuery`.

---

## 🏗️ Architecture & Documentation

> For contributors and advanced users

- [Architecture Guide](docs/ARCHITECTURE.md): Code structure and design
- [User Guide](docs/USER_GUIDE.md): Feature usage and examples
- [API Reference](docs/API_REFERENCE.md): Command and API documentation
- [Configuration](docs/CONFIGURATION.md): Settings and customization
- [Testing Guide](docs/TESTING.md): How to run and contribute tests

---

## 🧪 Testing

- **Run all tests:**
  ```bash
  npm test
  ```
- **Watch mode:**
  ```bash
  npm run test:watch
  ```
- **Run specific suite:**
  ```bash
  npm test -- --grep "Duration Utils Tests"
  ```

See the [Testing Guide](docs/TESTING.md) for more details.

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guidelines](CONTRIBUTING.md) to get started.

---

## 📄 License

MIT — see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=rrayor.ai-watch)
- [GitHub Repository](https://github.com/Rrayor/copilot-watch)
- [Report Issues](https://github.com/Rrayor/copilot-watch/issues)
- [Feature Requests](https://github.com/Rrayor/copilot-watch/issues/new?template=feature_request.md)
