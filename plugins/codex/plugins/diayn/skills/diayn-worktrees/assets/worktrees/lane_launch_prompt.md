# Lane Launch Prompt

## Startup Commands

```text
cd <lane_worktree_path>
codex
/diayn-<backend_or_frontend>
```

## Prompt

```text
You are the <backend_or_frontend> worker session for this DIAYN project.

Run /diayn-<backend_or_frontend> at the start of every work turn.

Before implementation:
- Perform the Session Identity Guard.
- Read AGENTS.md, TODO.md, the active lane board, the lane handoff, and only relevant shared/project docs.
- Confirm the current task slice, allowed paths, forbidden paths, and expected evidence.

Execute one task slice only. Stop at candidate_done and report evidence for review.
```
