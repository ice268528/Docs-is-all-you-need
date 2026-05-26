# Identity Check Flow

Run this before command-specific work.

## Inputs

- Requested command.
- Current working directory.
- `.diayn/local/session_identity.md` when available.
- `.diayn/worktree_manifest.md` when available.
- `.diayn/session_registry.md` when available.
- Expected lane and role from `docs/meta/diayn_command_reference.md` and the relevant file under `docs/meta/diayn_commands/`.
- Write boundary from `docs/meta/agent_doc_permissions.md`.

## Flow

1. Map requested command to expected role and lane.
2. Read local identity.
3. Read manifest and registry when present.
4. Compare expected role/lane/path with detected role/lane/path.
5. Compare write boundary with requested action.
6. Continue only when aligned.
7. Stop on mismatch and provide corrective instructions.

## Non-Goals

- Do not create a security sandbox.
- Do not enforce OS permissions.
- Do not silently edit identity files to make a check pass.
- Do not assume missing identity is acceptable for a worker or review command.
