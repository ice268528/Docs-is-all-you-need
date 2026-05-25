# Lane Execution Checklist

Use this after the session identity guard passes.

## Before Editing

- Confirm current command, lane, role, path, manifest, registry, and local identity.
- Read active lane board and handoff.
- Read required shared contracts and project docs.
- Identify exactly one task slice.
- Check the slice is feasible, bounded, and within lane write authority.
- Record blockers instead of guessing missing dependencies.

## During Execution

- Change only authorized lane files and lane-specific implementation/test files.
- Keep shared changes minimal and only when explicitly authorized.
- Write evidence as the work progresses.
- Keep worklog entries factual and reproducible.

## After Execution

- Update lane board status to at most `candidate_done`, `blocked`, or `owner_gate`.
- Link evidence and checks.
- Stop and report for review.
- Do not begin a second task slice unless the user explicitly starts a new worker cycle.
