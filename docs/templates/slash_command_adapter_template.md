# Slash Command Adapter Template

> Use this template when a tool can expose command-like entries for DIAYN. If native slash commands are unavailable, use the fallback prompt shape.

## Command

- DIAYN command:
- Tool-specific trigger:
- Native slash support: confirmed / partial / Unknown / To be confirmed

## Canonical Source

- Command semantics: `docs/meta/diayn_command_reference.md`
- Required skill:
- Required role:

## Preflight

1. Run `diayn-identity-guard`.
2. Confirm role and lane.
3. Confirm current path and manifest or local identity when available.
4. Confirm allowed read and write boundaries.

## Tool Prompt Shape

```text
Execute <diayn_command> using DIAYN protocol.

Read first:
- <entry_file>
- docs/meta/diayn_command_reference.md
- docs/meta/session_roles.md
- docs/meta/status_model.md
- <lane_or_controller_docs>

Run session identity guard first.
Follow the canonical command semantics.
Do not change DIAYN status or permission rules for this tool.
```

## Output

- Use `docs/templates/diayn_command_output_template.md`.
- Record changed files, evidence, status changes, blockers, and next command.

## Stop Conditions

- Native command support is unconfirmed and the fallback prompt is insufficient.
- The tool would require changing DIAYN command semantics.
- The command would need unavailable documents or hidden state.
