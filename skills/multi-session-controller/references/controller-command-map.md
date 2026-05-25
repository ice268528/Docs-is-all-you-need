# Controller Command Map

This reference expands the Controller-owned command behavior. It is not a CLI implementation.

| Command | Main job | Required controller checks | Typical writes | Must not do |
| --- | --- | --- | --- | --- |
| `/diayn init` | Start DIAYN control docs from an existing requirements doc or fuzzy idea. | Confirm repository root, ask Owner to confirm `project_slug`, inspect requirement quality, find missing decisions. | Project docs, Owner questions, session registry, worktree manifest, initial plans. | Do not assume the requirements doc is complete. Do not write business code. |
| `/diayn plan` | Turn confirmed scope into lane-ready work. | Check scope, OwnerGate items, shared contracts, acceptance criteria, lane boundaries. | Planning docs, lane boards, handoff drafts, Controller summary. | Do not dispatch vague or cross-lane work as a single task. |
| `/diayn worktrees` | Prepare worktree metadata and launch guidance. | Check required docs are visible to target sessions, `project_slug` is confirmed, paths do not conflict. | Worktree manifest, session registry, lane handoffs, launch prompts. | Do not run hidden interactive agents or create unmanaged worktrees. |
| `/diayn sync` | Summarize lane state. | Check lane boards, review logs, evidence, shared integration issues. | Sync log, Controller summary, authorized lane sync fields. | Do not mark missing review as passed. |
| `/diayn integration` | Check cross-lane readiness. | Check reviewed lane work, shared contracts, build/smoke/E2E evidence when applicable. | Sync log, shared integration issues, responsible lane updates. | Do not mark `ready_for_e2e` without evidence. |
| `/diayn bug` | Triage failed Owner business acceptance. | Compare user report with current scope and acceptance records. | Current-scope lane updates or future/backlog record. | Do not silently expand current scope. |
| `/diayn new` | Triage new requirement, dependency, or direction change. | Decide current-scope insertion vs future/backlog. | Current-scope lane updates or future/backlog record. | Do not rewrite confirmed goals without Owner authorization. |

## `/diayn init` Project Slug Rule

Always ask for `project_slug`.

Good prompt:

```text
I can use `<repo-folder-name>` as a starting suggestion. Please confirm the project_slug for worktree paths and DIAYN documents.
```

Do not silently treat the folder name as final.

## Existing Requirements Doc Rule

When the Owner provides a requirements document, check:

- Quality: is it understandable and current?
- Completeness: are goals, non-goals, constraints, risks, and acceptance criteria present?
- Decision gaps: which items require Owner choice?
- Lane split: can the work be safely decomposed into lane tasks?
- Evidence path: can later sessions verify completion?

## Fuzzy Idea Rule

When the Owner only has a fuzzy idea, first produce a short structured understanding:

- User-visible goals.
- Non-goals and boundaries.
- Unknowns and risks.
- Candidate lanes.
- Owner decisions needed.

Then ask concise questions before writing durable plans.
