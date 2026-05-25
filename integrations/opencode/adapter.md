# OpenCode Adapter

## Status

Draft adapter for Stage 08. OpenCode capabilities are treated conservatively until confirmed.

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

OpenCode may carry DIAYN commands as natural-language or slash-like user prompts. Native slash command support for this scaffold is `Unknown / To be confirmed`.

Fallback prompt:

```text
Execute /diayn <command> as a DIAYN workflow.
Run session identity guard first.
Use AGENTS.md and docs/meta/diayn_command_reference.md as authority.
Stop if role, lane, path, or write boundary does not match.
```

## Skill Handling

If OpenCode can consume local skills, use DIAYN-owned `skills/**`. If not, the adapter should direct the agent to read the relevant `SKILL.md` and references manually.

The vendored `.opencode/` content under `third_party/agent-skills/` is upstream reference content only. It is not a DIAYN OpenCode adapter.

## Session Identity Guard

Every `/diayn ...` workflow must start with:

- requested command
- intended role
- intended lane
- current path
- `.diayn/worktree_manifest.md`, if present
- `.diayn/local/session_identity.md`, if present
- write boundary

Stop on mismatch. Do not silently edit identity files.

## Limits

- No OpenCode rule files are implemented in Stage 08.
- No runtime, plugin, or adapter package is created.
- Unknown capabilities remain `Unknown / To be confirmed`.
