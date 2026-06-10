---
name: diayn-identity-guard
description: Use at the start of every DIAYN /diayn-* workflow or whenever requested command, role, lane, path, worktree manifest, session registry, local identity, or write-boundary consistency is uncertain; stops on mismatch and gives corrective guidance without silently editing identity files.
---

# DIAYN Identity Guard

## Use When

Use this skill before every `/diayn-*` workflow and whenever role, lane, directory, manifest, local identity, or write boundary may not match the requested action.

## Required Read Order

1. `docs/meta/session_identity_protocol.md`
2. `docs/meta/diayn_command_reference.md`
3. The relevant command detail file under `docs/meta/diayn_commands/`
4. `docs/meta/diayn_worktree_workflow.md`
5. `docs/meta/session_roles.md`
6. `docs/meta/agent_doc_permissions.md`
7. `.diayn/worktree_manifest.md` when available
8. `.diayn/session_registry.md` when available
9. `.diayn/local/session_identity.md` when available in the current worktree

Load `references/identity-check.md` only when mismatch handling detail is needed.

## Workflow

1. Identify the requested command.
2. Determine expected role and lane for that command.
3. Check current path, manifest, session registry, local identity, branch expectations when available, and allowed write paths.
4. Compare requested command, role, lane, path, manifest, registry, local identity, and write boundary. Use `scripts/identity_guard_check.py` for deterministic soft checks when local files are available.
5. Continue only when checks align.
6. If any check conflicts, stop and tell the user the detected identity, expected identity, correct directory, and correct command.

## Allowed Writes

Normally write nothing. Record a mismatch only when an authorized Controller or review workflow explicitly requires that record.

## Stop Conditions

- Requested command and detected role or lane do not match.
- Current path does not match manifest or local identity.
- Required local identity is missing.
- Write boundary would let the session touch another lane or Controller-owned files.
- Passing the check would require silently editing `.diayn/local/session_identity.md`, `.diayn/worktree_manifest.md`, or session registry.

## Expected Output

Keep mismatch output short and actionable. State requested command, detected role/lane/path, why execution is stopped, and the corrected command or directory. This is a soft guard, not a security sandbox.
