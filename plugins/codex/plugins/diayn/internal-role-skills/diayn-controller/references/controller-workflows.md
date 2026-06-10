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

## Optional Upstream Routing

Use `diayn-skill-router` only after Controller identity and write authority are confirmed.

| Controller context | Consider upstream skills | DIAYN override |
| --- | --- | --- |
| Fuzzy idea during `/diayn-init` | `interview-me`, `idea-refine`, `spec-driven-development` | Owner decisions, `project_slug`, and repository records remain Controller-owned. |
| `/diayn-plan` decomposition | `planning-and-task-breakdown`, `context-engineering`, `documentation-and-adrs` | Controller owns global task split and lane WIP=1. |
| `/diayn-sync` or `/diayn-integration` | `code-review-and-quality`, `api-and-interface-design`, `ci-cd-and-automation`, `git-workflow-and-versioning` | Missing lane review or evidence blocks readiness. |
| `/diayn-bug` or `/diayn-new` triage | `debugging-and-error-recovery`, `deprecation-and-migration`, `documentation-and-adrs` | Current-scope insertion vs backlog is a Controller/Owner decision. |

Do not claim upstream guidance was applied unless the local `third_party/agent-skills/skills/<name>/SKILL.md` file was read or intentionally skipped with a reason.

## Worktree Dry-Run Helper

Use the bundled helper for `/diayn-worktrees` when the Controller needs deterministic launch evidence:

```text
python .diayn/internal-role-skills/diayn-controller/scripts/worktree_dry_run.py --repo-root <repo> --project-slug <project_slug>
```

Pass `--base <branch-or-commit>` when the current git branch cannot be inspected in the active environment.

The helper prints proposed backend/frontend worktree paths, branch names, path-collision checks, generated `git worktree add` commands, and `.diayn/local/session_identity.md` content. It is dry-run only: it does not execute git commands, create directories, launch agents, or write identity files.
