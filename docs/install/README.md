# DIAYN Install And Support Truth

This file describes what a new user can actually use today. It does not claim native command, plugin, or adapter support before a verified artifact exists.

## Current Best Path

Use DIAYN in Codex first by manually installing the canonical DIAYN skill folders, then run the `/diayn-*` workflows in Codex chat:

```text
1. Install the eight DIAYN Codex Skills from `skills/`.
2. Open the target project in Codex.
3. Type `/diayn-init` or explicitly ask Codex to use `diayn-controller` for `/diayn-init`.
4. Continue with `/diayn-plan`, `/diayn-worktrees`, lane work, review, sync, and integration as the skills and documents instruct.
```

`/diayn-*` entries are workflow triggers, not shell commands. If Codex does not auto-select the intended skill, name it explicitly in chat. If a non-Codex tool does not support skills, use the manual document workflow fallback.

Codex install details: `docs/install/codex_skills.md`.

## Support Matrix

| Surface | Support level | What exists | What does not exist yet |
| --- | --- | --- | --- |
| Codex Skills | `manual_fallback` | Eight canonical Codex Skill folders, concise `SKILL.md` files, references, and manual copy install instructions. | Automatic installer, marketplace package, or custom runtime enforcement. |
| Manual document workflow | `manual_fallback` | README, AGENTS, command docs, lane docs, and templates for tools without installed DIAYN skills. | Native automation, guaranteed platform command parsing, or runtime enforcement. |
| Codex plugin | `draft_only` | Draft preparation docs under `integrations/codex/**`. | Installable, published, or supported plugin. |
| Claude Code CLI | `manual_fallback` | Command-file bundle under `integrations/claude-code/commands/` and install instructions in `docs/install/claude-code.md`. | Packaged installer, local Claude Code smoke-test evidence, or guaranteed discovery in every environment. |
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
- automatically installed or locally smoke-tested Claude Code command support;
- OpenCode adapter support;
- Cursor or Copilot V1 support;
- hidden child-agent auto-launch;
- global shell commands for the deterministic helper scripts. The helpers exist only as local skill support scripts.

Those claims require later implementation and validation stages.
