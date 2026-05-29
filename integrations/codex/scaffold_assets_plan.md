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

- `skills/diayn-controller/**`
- `skills/diayn-executor/**`
- `skills/diayn-reviewer/**`
- `skills/diayn-integrator/**`
- `skills/diayn-skill-router/**`
- `skills/diayn-identity-guard/**`
- `skills/diayn-owner-ux/**`
- `skills/update-diayn-scaffold/**`

### Templates And Control Docs

- `docs/templates/**`
- `.diayn/session_registry.md`
- `.diayn/sync_log.md`
- `.diayn/worktree_manifest.md`

### Maintainer Reference

- `vendor.lock.md`
- `maintainers/upstream-agent-skills/**`
- `third_party/agent-skills/**`

Maintainer reference material should not be installed into ordinary user projects unless the future plugin explicitly supports maintainer mode.

## Installation Safety Requirements

- Never overwrite user project facts without explicit confirmation.
- Treat `docs/templates/**` as templates, not active project truth.
- Keep `.diayn/local/**` out of packaged assets.
- Preserve core protocol as Markdown documents.
- Do not require the plugin for normal `/diayn-*` operation.

## Deferred Work

- Asset packaging format: `Unknown / To be confirmed`.
- Plugin installer behavior: `Unknown / To be confirmed`.
- Upgrade and migration behavior: future stage or future plugin implementation.
