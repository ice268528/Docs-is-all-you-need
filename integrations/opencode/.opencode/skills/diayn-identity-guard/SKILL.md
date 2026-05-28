---
name: diayn-identity-guard
description: OpenCode wrapper for the DIAYN soft identity guard that checks requested command, role, lane, path, manifest, local identity, and write boundary.
---

# OpenCode Wrapper: DIAYN Identity Guard

This is a thin OpenCode adapter wrapper. Canonical behavior lives in `skills/diayn-identity-guard/SKILL.md`.

Read first:

- `docs/meta/session_identity_protocol.md`
- `docs/meta/diayn_command_reference.md`
- the matching `docs/meta/diayn_commands/*.md` file
- `skills/diayn-identity-guard/SKILL.md`
- `.diayn/worktree_manifest.md` and `.diayn/local/session_identity.md` when present

This guard is a soft checker, not a security sandbox. Stop on mismatch and tell the user the expected role, lane, path, and command.

Do not silently edit identity files, manifests, or registries to make a check pass.
