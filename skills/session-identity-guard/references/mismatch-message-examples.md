# Mismatch Message Examples

Keep mismatch messages short and corrective.

## Wrong Lane Command

```text
Session identity mismatch.

Requested: /diayn <requested-lane>
Detected lane: <detected-lane>
Current path: <path>

I will not run the requested lane command here.
Use the <requested-lane> worktree and run:
/diayn <requested-lane>
```

## Controller Command In Worker

```text
Session identity mismatch.

Requested: <controller-command>
Detected role: <worker-role>

This command is Controller-owned. Open the Controller workspace and run:
<controller-command>
```

## Review Command Without Review Identity

```text
Session identity mismatch.

Requested: /diayn review <lane>
Detected role: <detected-role>

I will not perform review from this session. Start the <lane> Review Session and paste the worker report under the review command.
```

## Missing Local Identity

```text
Missing local session identity.

Expected: .diayn/local/session_identity.md
Current path: <path>

I will stop rather than guess this session's role. Ask the Controller to regenerate or confirm the worktree identity.
```
