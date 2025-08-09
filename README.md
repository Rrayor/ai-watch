# Copilot Watch

A VSCode extension to provide Github Copilot with a tool to request the current time.

## Programmatic Usage

Other extensions or tools can retrieve the current date/time by calling the command:

```typescript
const result = await vscode.commands.executeCommand('copilot-watch.getCurrentDate');
// result: { iso: string, utc: string }
```

## Before

```
I'm unable to retrieve the current date and time using the tool right now due to a technical issue. However, the current date is August 9, 2025, as shown in the context. If you need the exact time, you may need to check your system clock.
```