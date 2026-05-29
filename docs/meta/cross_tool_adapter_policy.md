# Cross Tool Adapter Policy

DIAYN core protocol is tool-neutral. Tool-specific behavior belongs in `integrations/**`.

## Authority

Core authority remains in:

- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`
- `skills/**`

Adapters do not define new role authority, state transitions, worktree rules, or Owner acceptance semantics. If an adapter conflicts with a core protocol file, the core protocol wins.

## Adapter Responsibilities

Each adapter may explain:

- Which entry file the tool should read first.
- How the tool can carry `/diayn-*` command intent.
- How the tool can surface or approximate DIAYN skills.
- How short Owner decisions should use available interaction UI or fall back to Markdown.
- What the tool cannot reliably support yet.

Each adapter must avoid:

- Copying the full DIAYN protocol.
- Changing `/diayn-*` command semantics.
- Treating vendor `agent-skills` tool folders as DIAYN adapters.
- Requiring ordinary project users to understand maintainer vendor sync.
- Claiming tool capabilities that are not confirmed.

When a capability is unclear, write `Unknown / To be confirmed`.

## Tool Priority

D5 adapter priority:

1. Codex
2. Claude Code
3. OpenCode
4. Cursor and Copilot remain out of V1 active scope unless a later DDDV5 stage changes that decision.

## Current Adapter Support Summary

| Surface | Current level | Adapter location | Notes |
| --- | --- | --- | --- |
| Codex Skills | `manual_fallback` | `skills/**` | Manual copy install; no marketplace package or custom runtime. |
| Claude Code | `manual_fallback` | `integrations/claude-code/commands/` | Command files exist; no local Claude Code smoke test. |
| OpenCode | `manual_fallback` | `integrations/opencode/.opencode/` | Command files and skill wrappers exist; no local OpenCode smoke test. |

## Agent Skills Boundary

`third_party/agent-skills/` is an upstream method-library vendor copy. It can be cited as reference material through `vendor.lock.md` and maintainer docs, but it is not a DIAYN adapter layer.

DIAYN-owned adapters live under `integrations/**`. DIAYN-owned skills live under `skills/**`.

## Plugin Boundary

Codex plugin work remains preparation only:

- Draft manifest notes are allowed.
- Scaffold asset plans are allowed.
- Readiness and risk checklists are allowed.

Current DIAYN V1 documentation does not publish, install, or claim a working plugin. Core DIAYN document workflow must remain usable without any plugin.

## Lightweight Export Rule

Tools without confirmed skill or plugin support should receive only a short rules export that points back to canonical documents. Do not paste the full protocol into Cursor, Copilot, or similar rule files.
