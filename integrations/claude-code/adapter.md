# Claude Code Adapter

## Status

D5-07 manual command adapter, smoke-tested in D6-04.

Support level: scoped `working` for local project-level manual copy install.

This repository provides a Claude Code command-file bundle under `integrations/claude-code/commands/`. The files are intended to be copied or linked into a target project's `.claude/commands/` directory. The command-file shape has been checked against available Claude Code slash-command documentation, including the current note that custom commands have moved into skills while existing `.claude/commands/` files keep working.

D6-04 smoke evidence supports scoped `working`: Claude Code `2.1.145` loaded the 12 project-level DIAYN command files from a temporary `.claude/commands/` directory, reported `legacy commands: 12`, and executed `/diayn-init` content through `claude --print`. See `DDDV6/stage_outputs/d6_04/d6_04_claude_discovery_evidence.md`.

This does not claim global installation, package-manager installation, Claude Code plugin packaging, guaranteed behavior in every environment, or full DIAYN project initialization.

## Entry Point

Claude Code should use `CLAUDE.md` as its lightweight entry file. `CLAUDE.md` should remain an index and must not contain the full DIAYN protocol.

Read first:

- `CLAUDE.md`
- `docs/meta/cross_tool_adapter_policy.md`
- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `skills/**`

## Command Handling

`/diayn-*` commands are canonical DIAYN workflow intents. Claude Code command files must point back to `docs/meta/diayn_command_reference.md`, the matching file under `docs/meta/diayn_commands/`, and the relevant `skills/` entry point instead of redefining command behavior.

Command files are stored in:

```text
integrations/claude-code/commands/
```

Install instructions live in `docs/install/claude-code.md`.

Fallback when command discovery does not work:

```text
Run /diayn-init using .claude/commands/diayn-init.md and the DIAYN docs it references.
Run Session Identity Guard first.
Do not change role, status, permission, or worktree rules for this tool.
```

## Skill Handling

Use DIAYN-owned `skills/**` as workflow guidance when the tool supports skills or equivalent prompt routing. If that capability is unavailable, reference the `SKILL.md` files manually through the command prompt.

The upstream `.claude/` and `.claude-plugin/` directories under `third_party/agent-skills/` are reference vendor content, not DIAYN Claude Code adapter implementations.

## Owner Decision UX

Short decisions should use any available compact choice UI if confirmed. If not confirmed, use concise Markdown choices. Long decisions only create HTML after the user runs `/diayn-html`.

## Limits

- Command files are adapter artifacts, not a Claude Code plugin or package.
- D6-04 proves local project-level manual copy discovery/execution only.
- This adapter does not publish a Claude Code plugin or package.
- This adapter does not alter core `/diayn-*` semantics.
- Unknown capabilities must remain marked `Unknown / To be confirmed`.
