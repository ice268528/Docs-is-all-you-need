# Context Compact Reminder Patterns

Use short reminders at natural boundaries.

## Best-Effort Reminder

```text
Before we start the next independent task, it may be worth preserving a short handoff summary: decisions, changed files, evidence, blockers, and next command.
```

## Platform-Specific Care

- Codex desktop: do not assume exact context percentage or an automatic compaction API unless the tool exposes one.
- Claude Code: it may be appropriate to tell the user they can consider `/compact`, but confirm the active adapter/tool behavior before depending on it.
- OpenCode: confirm capabilities during adapter work before making tool-specific promises.

## Never Say

- "We are at exactly <percent> context" without tool data.
- "I compressed the conversation" unless the user requested and the platform confirmed it.
- "All future tools support the same compaction behavior."
