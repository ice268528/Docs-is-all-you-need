# Controller Workflows

This reference expands Controller-owned behavior. It is not a CLI implementation.

| Command | Main job | Required checks | Typical writes | Must not do |
| --- | --- | --- | --- | --- |
| `/diayn-init` | Start DIAYN control docs from a requirements source or fuzzy idea. | Confirm repo root, ask Owner to confirm `project_slug`, inspect requirement quality, find missing decisions. | Project docs, Owner questions, session registry, worktree manifest, initial plans. | Do not assume requirements are complete. Do not write business code. |
| `/diayn-plan` | Turn confirmed scope into lane-ready work. | Check scope, OwnerGate items, shared contracts, acceptance criteria, lane boundaries. | Planning docs, lane boards, handoff drafts, Controller summary. | Do not dispatch vague or cross-lane work as one task. |
| `/diayn-worktrees` | Prepare worktree metadata and launch guidance. | Check required docs are visible, `project_slug` is confirmed, paths do not conflict. | Worktree manifest, session registry, lane handoffs, launch prompts. | Do not create unmanaged worktrees or hidden agent subprocesses. |
| `/diayn-sync` | Summarize lane state. | Check lane boards, review logs, evidence, shared integration issues. | Sync log, Controller summary, authorized lane sync fields. | Do not mark missing review as passed. |
| `/diayn-integration` | Check cross-lane readiness. | Check reviewed lane work, shared contracts, build/smoke/E2E evidence when applicable. | Sync log, shared integration issues, responsible lane updates. | Do not mark `ready_for_e2e` without evidence. |
| `/diayn-bug` | Triage failed Owner business acceptance. | Compare user report with current scope and acceptance records. | Current-scope lane updates or future/backlog record. | Do not silently expand current scope. |
| `/diayn-new` | Triage a new requirement, dependency, or direction change. | Decide current-scope insertion vs future/backlog. | Current-scope lane updates or future/backlog record. | Do not rewrite confirmed goals without Owner authorization. |

## Intake Rules

For `/diayn-init`, always ask for `project_slug`. A repo folder name may be suggested, but it is not final truth until Owner-confirmed.

When the Owner provides an existing requirements document, inspect quality, completeness, decision gaps, lane split feasibility, and evidence paths before planning.

When the Owner provides a fuzzy idea, first summarize user-visible goals, non-goals, unknowns, risks, candidate lanes, and required Owner decisions.
