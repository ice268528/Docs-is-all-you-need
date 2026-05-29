# OpenCode Adapter

## Status

D5-08 manual OpenCode adapter, smoke-tested in D6-05.

Support level: scoped `working` for local project-level command and skill-wrapper discovery.

This repository provides an OpenCode adapter bundle under `integrations/opencode/.opencode/`:

- `commands/*.md`: one-segment `/diayn-*` command prompts.
- `skills/*/SKILL.md`: thin wrappers that route to canonical DIAYN skills under `skills/**`.

The bundle shape was checked against available OpenCode documentation for per-project `.opencode/commands/` and `.opencode/skills/<name>/SKILL.md`.

D6-05 smoke evidence supports scoped `working`: OpenCode `1.14.28` used workspace-local XDG paths, discovered all 12 DIAYN command files and all 8 skill-wrapper folders from a temporary project `.opencode/` directory, and recognized `--command diayn-init` before timing out without a final model-backed assistant response. See `DDDV6/stage_outputs/d6_05/d6_05_opencode_discovery_evidence.md`.

This does not claim full model-backed DIAYN workflow execution, global installation, package-manager installation, OpenCode agent support, Cursor/Copilot support, or guaranteed behavior in every environment.

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
- D6-05 proves local project-level command and skill-wrapper discovery only.
- Full model-backed DIAYN workflow execution has not been proven.
- The adapter does not alter core `/diayn-*` semantics.
- Unknown capabilities must remain marked `Unknown / To be confirmed`.
