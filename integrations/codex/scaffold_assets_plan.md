# Codex Scaffold Assets Plan

## Purpose

This plan identifies which DIAYN scaffold assets may later be packaged for Codex. It does not package, install, or publish them.

## Candidate Asset Groups

### Entry And Core Docs

- `AGENTS.md`
- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/cross_tool_adapter_policy.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`
- `docs/meta/session_skill_mapping.md`

### Skills

- `skills/diayn-init/**`
- `skills/diayn-plan/**`
- `skills/diayn-worktrees/**`
- `skills/diayn-backend/**`
- `skills/diayn-frontend/**`
- `skills/diayn-review-backend/**`
- `skills/diayn-review-frontend/**`
- `skills/diayn-sync/**`
- `skills/diayn-integration/**`
- `skills/diayn-bug/**`
- `skills/diayn-new/**`
- `skills/diayn-html/**`

### Templates And Control Docs

- `docs/templates/**`
- `.diayn/session_registry.md`
- `.diayn/sync_log.md`
- `.diayn/worktree_manifest.md`

### Maintainer Reference

- `vendor.lock.md`
- `maintainers/upstream-agent-skills/**`
- `plugins/docs-is-all-you-need/internal-role-skills/**`
- `third_party/agent-skills/**`

Maintainer reference material should not be installed into ordinary user projects unless the future plugin explicitly supports maintainer mode.

## Installation Safety Requirements

- Never overwrite user project facts without explicit confirmation.
- Treat `docs/templates/**` as templates, not active project truth.
- Keep `.diayn/local/**` out of packaged assets.
- Preserve core protocol as Markdown documents.
- Do not require the plugin for normal `/diayn-*` operation.

## Current Codex Candidates

`plugins/docs-is-all-you-need/` is the local plugin candidate and
`packages/codex-project-local/` is the project-local `.codex/skills` package
candidate. They package the 12 DIAYN public workflow skills. The project-local
package also includes 23 DIAYN-managed dependency skills so native nested skill
invocation can be tested when Codex runtime access is available.

## Deferred Work

- Plugin discovery/execution: blocked in the current environment because
  Codex app-session discovery remains unproven in the current environment.
- Plugin installer behavior: `Unknown / To be confirmed`.
- Upgrade and migration behavior: future stage or future plugin implementation.
