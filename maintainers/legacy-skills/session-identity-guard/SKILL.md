---
name: session-identity-guard
description: "Use at the start of every DIAYN command workflow or whenever role, lane, path, manifest, session registry, local identity, or write-boundary consistency is uncertain. Stops on identity mismatch and explains the correct directory and command without silently editing identity files."
---

# Session Identity Guard

## Use When

Use this skill before every `/diayn-*` command and whenever the current session's role, lane, directory, manifest, local identity, or write boundary may not match the requested action.

## Read First

- `docs/meta/session_identity_protocol.md`
- `docs/meta/diayn_command_reference.md`
- The relevant command detail file under `docs/meta/diayn_commands/`.
- `docs/meta/diayn_worktree_workflow.md`
- `docs/meta/session_roles.md`
- `docs/meta/agent_doc_permissions.md`
- `.diayn/worktree_manifest.md` when available.
- `.diayn/session_registry.md` when available.
- `.diayn/local/session_identity.md` when available in the current worktree.
- `docs/templates/session_identity_template.md`

Load references only when needed:

- `references/identity-check-flow.md`
- `references/mismatch-message-examples.md`

## Workflow

1. Identify the requested command.
2. Determine the expected role and lane for that command.
3. Check current path, worktree manifest, session registry, local identity, branch expectations when available, and allowed write paths.
4. Compare requested command, role, lane, path, manifest, registry, local identity, and write boundary.
5. If all checks align, continue with the command-specific skill.
6. If any check conflicts, stop and tell the user the detected identity, expected identity, correct directory, and correct command.

## Allowed Writes

This guard normally writes nothing. It may record a mismatch only when an authorized Controller or review workflow explicitly requires that record.

## Stop Conditions

- Requested command and detected role or lane do not match.
- Current path does not match the manifest or local identity.
- Local identity is missing where the workflow requires it.
- Write boundary would allow the session to touch another lane or Controller-owned files.
- Passing the check would require silently editing `.diayn/local/session_identity.md`, `.diayn/worktree_manifest.md`, or the session registry.

## Output Expectations

Keep mismatch output short and actionable: state the requested command, detected role/lane/path, why execution is stopped, and the corrected command or directory. This is a soft guard, not a security sandbox or custom agent runtime.
