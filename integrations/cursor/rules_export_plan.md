# Cursor Rules Export Plan

## Status

Conservative export strategy. Cursor may not fully carry DIAYN multi-session workflows without manual discipline.

## Export Goal

Provide a short rules file that points Cursor to canonical DIAYN documents without copying the full protocol.

## Minimal Export Content

Recommended concise rules:

```text
This repository uses DIAYN multi-session workflow.

Read first:
- AGENTS.md
- docs/meta/diayn_command_reference.md
- docs/meta/multi_session_collaboration_protocol.md
- docs/meta/session_roles.md
- docs/meta/status_model.md

Treat /diayn commands as document-driven workflow triggers.
Run session identity guard before acting.
Worker sessions stop at candidate_done.
Review sessions decide done or rejected.
Do not change core command semantics for Cursor.
```

## What Not To Export

- Full `docs/meta/**` protocol text.
- Full skill references.
- Maintainer vendor sync details.
- Upstream `third_party/agent-skills` tool-specific setup.

## Limitations

- Cursor skill or plugin support for DIAYN is `Unknown / To be confirmed`.
- Multi-session worktree separation remains a user and document workflow responsibility.
- Use manual prompts when command routing is unavailable.
