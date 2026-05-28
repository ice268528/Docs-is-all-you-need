# OpenCode Adapter

## Status

D5-08 manual OpenCode adapter.

Support level: `manual_fallback`.

This repository provides an OpenCode adapter bundle under `integrations/opencode/.opencode/`:

- `commands/*.md`: one-segment `/diayn-*` command prompts.
- `skills/*/SKILL.md`: thin wrappers that route to canonical DIAYN skills under `skills/**`.

The bundle shape was checked against available OpenCode documentation for per-project `.opencode/commands/` and `.opencode/skills/<name>/SKILL.md`. A local OpenCode discovery/execution smoke test has not been run, so this adapter is not classified as `working`.

## Entry Point

OpenCode should use `AGENTS.md` as its lightweight entry file, then follow the same DIAYN core documents used by other tools.

Read first:

- `AGENTS.md`
- `docs/meta/cross_tool_adapter_policy.md`
- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `skills/**`

## Command Handling

`/diayn-*` commands are canonical DIAYN workflow intents. OpenCode command files must point back to `docs/meta/diayn_command_reference.md`, the matching file under `docs/meta/diayn_commands/`, and the relevant `skills/` entry point instead of redefining command behavior.

Command files are stored in:

```text
integrations/opencode/.opencode/commands/
```

Install instructions live in `docs/install/opencode.md`.

Fallback prompt:

```text
Run /diayn-init using .opencode/commands/diayn-init.md and the DIAYN docs it references.
Run session identity guard first.
Use AGENTS.md and docs/meta/diayn_command_reference.md as authority.
Stop if role, lane, path, or write boundary does not match.
```

## Skill Handling

OpenCode skill wrappers are stored in:

```text
integrations/opencode/.opencode/skills/
```

They are thin pointers to DIAYN-owned `skills/**`, not copies of the full protocol. If OpenCode does not discover the skill wrappers, ask the agent to read the corresponding canonical `skills/<name>/SKILL.md` manually.

The vendored `.opencode/` content under `third_party/agent-skills/` is upstream reference content only. It is not a DIAYN OpenCode adapter.

## Session Identity Guard

Every `/diayn-*` workflow must start with:

- requested command
- intended role
- intended lane
- current path
- `.diayn/worktree_manifest.md`, if present
- `.diayn/local/session_identity.md`, if present
- write boundary

Stop on mismatch. Do not silently edit identity files.

## Limits

- The adapter bundle is not a package manager install, global CLI, custom runtime, or plugin.
- Local OpenCode command/skill discovery and execution have not been smoke-tested in this workspace.
- The adapter does not alter core `/diayn-*` semantics.
- Unknown capabilities must remain marked `Unknown / To be confirmed`.
