# Codex Adapter

## Status

Documented Codex adapter guidance plus the current local plugin and
project-local `.codex/skills` candidates. The core DIAYN workflow is a skill
pack workflow, not a custom CLI/runtime.

## Entry Point

Codex should use `AGENTS.md` as the lightweight entry file, then follow links into:

- `docs/meta/cross_tool_adapter_policy.md`
- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`
- `skills/diayn-init/` through `skills/diayn-html/`

## Command Handling

Codex carries `/diayn-*` commands as user-entered workflow triggers. They are not assumed to be shell commands or a built-in CLI.

Supported command intents are the canonical commands in `docs/meta/diayn_command_reference.md`:

- `/diayn-init`
- `/diayn-plan`
- `/diayn-worktrees`
- `/diayn-backend`
- `/diayn-frontend`
- `/diayn-review-backend`
- `/diayn-review-frontend`
- `/diayn-sync`
- `/diayn-integration`
- `/diayn-bug`
- `/diayn-new`
- `/diayn-html`

Each command skill starts with the appropriate DIAYN identity/path/lane checks
using progressive disclosure.

## Skill Handling

Codex should use the 12 DIAYN-owned workflow skills when available:

- `diayn-init`
- `diayn-plan`
- `diayn-worktrees`
- `diayn-backend`
- `diayn-frontend`
- `diayn-review-backend`
- `diayn-review-frontend`
- `diayn-sync`
- `diayn-integration`
- `diayn-bug`
- `diayn-new`
- `diayn-html`

The project-local Codex package shape is:

```text
packages/codex-project-local/.codex/skills/
```

It contains the 12 workflow skills plus the DIAYN-managed dependency skills.
Internal role skills remain reference material. If upstream guidance conflicts
with DIAYN role, status, or document authority, DIAYN wins.

## Owner Decision UX

For short Owner decisions, Codex may use a platform-supported decision UI when available. If no such UI is available, it must fall back to a concise Markdown choice.

For long decisions, Codex should give short options and tell the Owner they may run `/diayn-html`. It must not generate HTML unless the user explicitly runs `/diayn-html`.

Capability note: `plugins/docs-is-all-you-need/` and
`packages/codex-project-local/` pass static validation, but Codex plugin or
`.codex/skills` discovery could not be verified because harmless `codex`
app-session discovery has not been proven in the current environment. Keep
runtime support blocked, not `working`.

## Worktree And Identity

Codex sessions should not rely on prompt identity alone. Before a lane or review command, inspect the current path, `.diayn/worktree_manifest.md`, `.diayn/session_registry.md`, and `.diayn/local/session_identity.md` when present.

If identity does not match, stop and show the corrective command and directory from `docs/meta/diayn_command_reference.md`.

## Limits

- This adapter does not publish a plugin or marketplace package.
- This adapter does not implement a CLI or runtime.
- This adapter does not change `/diayn-*` command semantics.
- Core DIAYN document workflow must remain usable without Codex-specific features.
