# Identity Check Detail

Identity Guard is a soft preflight. It reduces wrong-session mistakes but does not enforce security.

## Check Fields

- Requested command.
- Expected role.
- Expected lane.
- Current directory.
- Worktree manifest entry.
- Session registry entry.
- Local `.diayn/local/session_identity.md` when present.
- Allowed write paths.

## Mismatch Output Shape

```text
Identity mismatch: stopped.
Requested command: /diayn-<command>
Detected role/lane/path: <role> / <lane> / <path>
Expected role/lane/path: <role> / <lane> / <path>
Reason: <short reason>
Next safe action: cd <correct path> and run /diayn-<command>, or ask Controller to update the manifest.
```

Never rewrite identity files just to make the check pass.

## Optional Helper Script

Run the bundled soft checker when the session needs deterministic local evidence:

```text
python skills/diayn-identity-guard/scripts/identity_guard_check.py --repo-root <repo> --cwd <current-path> --command /diayn-backend
```

Use `--format json` when the result needs to be copied into evidence. Use `--strict-exit` only when a caller wants non-zero exit codes for warn/fail results.

The script reads available local identity and manifest files and reports `pass`, `warn`, or `fail`. It never edits `.diayn/local/session_identity.md`, `.diayn/worktree_manifest.md`, or `.diayn/session_registry.md`.

## Optional Upstream Routing

Identity Guard normally does not need upstream `agent-skills` guidance. If the session context itself is confusing, `diayn-skill-router` may point to `context-engineering` only to help summarize visible context. DIAYN identity, lane, path, manifest, and write-boundary checks still decide whether the workflow may continue.
