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

DDDV8 adapter priority:

1. Codex
2. Claude Code
3. OpenCode remains deferred until direct `/diayn-*` invocation is proven.
4. Cursor and Copilot remain out of V1 active scope unless a later Owner decision changes that.

## Current Adapter Support Summary

| Surface | Current level | Adapter location | Notes |
| --- | --- | --- | --- |
| Codex skills package/install | `package_install_validated_app_session_runtime_not_attempted` | `packages/codex-project-local/`, `validation/phase9_codex_project_local_install_fixture.json`, `validation/phase9_codex_home_install_fixture.json` | 12 workflow skills plus DIAYN-managed dependency skills are statically packaged; the project-local and Codex-home install fixtures pass. Desktop app-session runtime is intentionally not attempted and not claimed. |
| Codex plugin marketplace candidate | `candidate_runtime_not_verified` | `plugins/codex/marketplace.json`, `plugins/codex/plugins/diayn/`, `docs/install/codex_plugin_local_candidate.md`, `docs/qa/codex-plugin-runtime-acceptance.md` | Isolated Codex plugin candidate with `skills: ./skills/`, 12 workflow skills, and 23 dependency skills. It must not be claimed as working until Codex Desktop marketplace install and runtime evidence exists. |
| Claude Code | `project_local_installed_flow_proven` | `.claude-plugin/`, `.claude/commands/`, `skills/`, `plugins/docs-is-all-you-need/`, `packages/claude-project-local/` | Repository-root Claude manifest points commands to root DIAYN adapters and explicitly registers bundled dependency skills; Claude Code discovers the 12 workflow skills from root `skills/`. Project-local package proves all 12 public commands through the installed-flow fixture. |
| OpenCode | `deferred` | `integrations/opencode/.opencode/` | Historical adapter evidence only; not a DDDV8 alpha surface until direct `/diayn-*` skill invocation is proven. |

## Agent Skills Boundary

`third_party/agent-skills/` is an upstream method-library vendor copy. It can be cited as reference material through `vendor.lock.md` and maintainer docs, but it is not a DIAYN adapter layer.

DIAYN-owned adapters live under `integrations/**`. DIAYN-owned skills live under `skills/**`.

## Plugin Boundary

Codex package/install work is validated for the current package/install scope:

- Draft manifest notes are allowed.
- Static package and scaffold asset plans are allowed.
- Real Codex Home file-install diagnostics are allowed locally.
- Isolated Codex plugin marketplace candidate material is allowed when it is
  clearly marked `candidate` and does not reuse or modify Claude Code plugin
  paths.
- Desktop app-session runtime claims require separate future evidence.
- Readiness and risk checklists are allowed.

Current DIAYN V1 documentation claims Codex package/install support, not
Codex Desktop app-session runtime support. The isolated Codex plugin candidate
does not upgrade that claim. Core DIAYN document workflow must remain usable
without Codex-specific features.

## Lightweight Export Rule

Tools without confirmed skill or plugin support should receive only a short rules export that points back to canonical documents. Do not paste the full protocol into Cursor, Copilot, or similar rule files.
