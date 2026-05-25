# Tool Adapter Template

> Adapter documents explain how one tool carries DIAYN. They do not redefine DIAYN core protocol.

## Tool

- Tool name:
- Adapter path:
- Status: draft / active / deprecated
- Capability certainty: confirmed / partial / Unknown / To be confirmed

## Entry Point

- Primary entry file:
- Read first:
- Link to core protocol:

## Command Handling

- Supported DIAYN commands:
- How the user triggers them:
- How session identity guard runs first:
- Fallback when slash commands are not native:

## Skill Handling

- DIAYN skills available:
- How the tool discovers or is prompted to use skills:
- Upstream `agent-skills` reference boundary:

## Owner Decision UX

- Short decision path:
- Markdown fallback:
- `/diayn html` behavior:

## Known Limits

- Unsupported or unconfirmed capabilities:
- Required manual steps:
- Risks:

## Forbidden Adapter Behavior

- Do not change `/diayn` command semantics.
- Do not copy full `docs/meta/**` content into the adapter.
- Do not bypass role, status, permission, or worktree rules.
- Do not make the core document workflow depend on this adapter.
