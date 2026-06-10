# Lane Execution Reference

Use after DIAYN Identity Guard passes.

## Before Editing

- Confirm command, lane, role, path, manifest, registry, local identity, and write boundary.
- Read active lane board and handoff.
- Read required shared contracts and project docs.
- Identify exactly one task slice.
- Check the slice is feasible, bounded, and within lane write authority.
- Record blockers instead of guessing missing dependencies.

## During Execution

- Change only authorized lane files and lane-specific implementation or test files.
- Keep shared changes minimal and only when explicitly authorized.
- Write evidence as the work progresses.
- Keep worklog entries factual and reproducible.

## After Execution

- Update lane board status to at most `candidate_done`, `blocked`, or `owner_gate`.
- Link evidence and checks.
- Stop and report for review.
- Do not start another task slice unless the user starts a new worker cycle.

## Optional Upstream Routing

Use `diayn-skill-router` only after Identity Guard passes and the lane handoff is visible.

| Lane context | Consider upstream skills | DIAYN override |
| --- | --- | --- |
| Backend API or contract work | `api-and-interface-design`, `source-driven-development`, `test-driven-development` | Shared contract edits require explicit handoff authority. |
| Backend implementation slice | `incremental-implementation`, `debugging-and-error-recovery`, `security-and-hardening` | Execute one slice only and stop at `candidate_done`, `blocked`, or `owner_gate`. |
| Frontend UI work | `frontend-ui-engineering`, `browser-testing-with-devtools`, `performance-optimization` | Browser evidence must be honest; unavailable tools become evidence gaps. |
| Any lane code change | `incremental-implementation`, `test-driven-development`, `source-driven-development` | Worker cannot mark `done`, merge, or change another lane. |

Name any routed upstream skill in the worker report when it materially shaped the implementation or verification approach.
