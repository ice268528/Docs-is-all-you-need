# Worktree Launch Examples

Use these as patterns for Controller launch material. Replace every placeholder with project facts.

## Worker Launch Prompt Shape

```text
You are the <lane> Session for this DIAYN project.

Run: /diayn-<lane>

Read first:
- .diayn/local/session_identity.md
- .diayn/worktree_manifest.md
- docs/lanes/<lane>/board.md
- docs/lanes/<lane>/handoff.md
- docs/shared/<relevant-doc>

Execute one task slice only. Stop after candidate_done, blocked, or owner_gate and report for review.
```

## Review Launch Prompt Shape

```text
You are the <lane> Review Session for this DIAYN project.

Run: /diayn-review-<lane>

The user will paste the latest worker report below the command.
Review the report against diff, evidence, tests/checks, acceptance criteria, and write boundaries.
Decide done or rejected. Do not merge or fix by default.
```

## Manifest Reminders

The Controller should ensure the manifest identifies:

- `project_slug`
- lane name
- worktree path
- expected branch
- required docs visible to each lane
- local identity expectations
- status of each lane worktree

The Controller should not expect uncommitted controller-only files to be visible in other worktrees unless the workflow explicitly copies or syncs them.
