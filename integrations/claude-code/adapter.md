# Claude Code Adapter

## Status

Draft adapter for Stage 08. This adapter does not implement `.claude/commands/`; it records how Claude Code should carry DIAYN workflows.

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

`/diayn ...` commands are canonical DIAYN workflow intents. Claude Code command files, if added later, must point back to `docs/meta/diayn_command_reference.md` instead of redefining command behavior.

Fallback when native command support is unavailable or unconfirmed:

```text
Execute /diayn <command> using DIAYN protocol.
Run session identity guard first.
Read CLAUDE.md and the canonical command reference.
Do not change role, status, permission, or worktree rules for this tool.
```

Native Claude Code command capability for this scaffold is `Unknown / To be confirmed`.

## Skill Handling

Use DIAYN-owned `skills/**` as workflow guidance when the tool supports skills or equivalent prompt routing. If that capability is unavailable, reference the `SKILL.md` files manually through the command prompt.

The upstream `.claude/` and `.claude-plugin/` directories under `third_party/agent-skills/` are reference vendor content, not DIAYN Claude Code adapter implementations.

## Owner Decision UX

Short decisions should use any available compact choice UI if confirmed. If not confirmed, use concise Markdown choices. Long decisions only create HTML after the user runs `/diayn html`.

## Limits

- No `.claude/commands/` implementation is created in Stage 08.
- This adapter does not publish a Claude Code plugin or package.
- This adapter does not alter core `/diayn` semantics.
- Unknown capabilities must remain marked `Unknown / To be confirmed`.
