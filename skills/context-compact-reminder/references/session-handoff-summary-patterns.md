# Session Handoff Summary Patterns

Use this when a conversation is long or a subtask is complete.

## Minimal Handoff Summary

```text
Handoff summary:
- Current role/session:
- Command or task completed:
- Files changed:
- Decisions made:
- Evidence/checks:
- Blockers or risks:
- Next recommended command:
```

## For Worker Sessions

Include:

- Lane.
- Task slice.
- Status proposed.
- Evidence path.
- Review command.

## For Controller Sessions

Include:

- Lane status snapshot.
- OwnerGate items.
- Sync or integration findings.
- Next lane or review prompt.

Keep it concise enough that a new session can start without re-reading the entire chat.
