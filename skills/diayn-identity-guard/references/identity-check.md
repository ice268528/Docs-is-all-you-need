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

## Optional Upstream Routing

Identity Guard normally does not need upstream `agent-skills` guidance. If the session context itself is confusing, `diayn-skill-router` may point to `context-engineering` only to help summarize visible context. DIAYN identity, lane, path, manifest, and write-boundary checks still decide whether the workflow may continue.
