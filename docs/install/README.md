# DIAYN Install And Support Truth

This file describes what a new user can actually use today. It does not claim native command, plugin, or adapter support before a verified artifact exists.

## Current Best Path

Use DIAYN in Codex or another coding-agent chat as a manual document workflow:

```text
1. Open this repository in the coding-agent workspace.
2. Ask the agent to read `README.md`, `AGENTS.md`, and `docs/meta/diayn_command_reference.md`.
3. Type `/diayn-init` as the workflow trigger.
4. Continue with `/diayn-plan`, `/diayn-worktrees`, lane work, review, sync, and integration as the documents instruct.
```

`/diayn-*` entries are workflow triggers, not shell commands. If a tool does not provide native slash-command support, paste the command text into chat and ask the agent to follow the referenced DIAYN documents.

## Support Matrix

| Surface | Support level | What exists | What does not exist yet |
| --- | --- | --- | --- |
| Manual document workflow | `manual_fallback` | README, AGENTS, command docs, lane docs, templates, and DIAYN-owned skill source files. | Native automation, guaranteed platform command parsing, or runtime enforcement. |
| Codex Skills | `documented_only` | `skills/**/SKILL.md` source folders and protocol docs. | Verified Codex install path, packaged distribution, discovery instructions, or end-to-end validation. |
| Codex plugin | `draft_only` | Draft preparation docs under `integrations/codex/**`. | Installable, published, or supported plugin. |
| Claude Code CLI | `draft_only` | Adapter and command planning docs under `integrations/claude-code/**`. | `.claude/commands/*.md` files or verified Claude Code command behavior. |
| OpenCode CLI | `draft_only` | Adapter and rules planning docs under `integrations/opencode/**`. | `.opencode/**` DIAYN adapter artifacts or verified OpenCode behavior. |
| Cursor | out of V1 scope | Future planning notes may exist. | Active V1 support claim. |
| Copilot | out of V1 scope | Future planning notes may exist. | Active V1 support claim. |

## Canonical Commands

Use the one-segment command names:

```text
/diayn-init
/diayn-plan
/diayn-worktrees
/diayn-backend
/diayn-frontend
/diayn-review-backend
/diayn-review-frontend
/diayn-sync
/diayn-integration
/diayn-bug
/diayn-new
/diayn-html
```

Older two-segment names are migration or historical wording only.

## What To Avoid Claiming

Do not claim that this repository currently provides:

- a shell CLI;
- a native slash-command runtime;
- an installable Codex plugin;
- verified Codex skill installation;
- Claude Code `.claude/commands` support;
- OpenCode adapter support;
- Cursor or Copilot V1 support;
- hidden child-agent auto-launch;
- deterministic helper scripts for HTML generation, identity checking, or worktree dry-run.

Those claims require later implementation and validation stages.
