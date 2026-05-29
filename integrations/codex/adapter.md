# Codex Adapter

## Status

Documented Codex adapter guidance plus a D6-09 local plugin candidate. The core
DIAYN workflow does not require installing a plugin.

## Entry Point

Codex should use `AGENTS.md` as the lightweight entry file, then follow links into:

- `docs/meta/cross_tool_adapter_policy.md`
- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`
- `skills/**`

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

Every command starts with `diayn-identity-guard`.

## Skill Handling

Codex should use DIAYN-owned skills under `skills/**` when available:

- `diayn-controller`
- `diayn-executor`
- `diayn-reviewer`
- `diayn-integrator`
- `diayn-skill-router`
- `diayn-identity-guard`
- `diayn-owner-ux`
- `update-diayn-scaffold`

The vendored `third_party/agent-skills/` content is reference material, not the Codex adapter. If upstream guidance conflicts with DIAYN role, status, or document authority, DIAYN wins.

## Owner Decision UX

For short Owner decisions, Codex may use a platform-supported decision UI when available. If no such UI is available, it must fall back to a concise Markdown choice.

For long decisions, Codex should give short options and tell the Owner they may run `/diayn-html`. It must not generate HTML unless the user explicitly runs `/diayn-html`.

Capability note: D6-09 created `plugins/docs-is-all-you-need/` using the
available local plugin convention, but Codex plugin discovery could not be
verified because harmless `codex` discovery commands returned access denied in
the current environment. Keep plugin support at `manual_fallback`, not
`working`.

## Worktree And Identity

Codex sessions should not rely on prompt identity alone. Before a lane or review command, inspect the current path, `.diayn/worktree_manifest.md`, `.diayn/session_registry.md`, and `.diayn/local/session_identity.md` when present.

If identity does not match, stop and show the corrective command and directory from `docs/meta/diayn_command_reference.md`.

## Limits

- This adapter does not publish a plugin or require plugin installation.
- This adapter does not implement a CLI or runtime.
- This adapter does not change `/diayn-*` command semantics.
- Core DIAYN document workflow must remain usable without Codex-specific features.
