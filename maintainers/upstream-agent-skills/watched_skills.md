# Watched Upstream Skills

This file tracks which upstream `agent-skills` content DIAYN maintainers should review during vendor updates.

## A. Direct Tracking

These skills can usually be absorbed as upstream reference material with minimal DIAYN-specific adaptation, as long as they do not conflict with multi-session role and status rules.

| Expected topic | Current upstream path | Notes |
| --- | --- | --- |
| test-driven-development | `skills/test-driven-development/` | Useful for executor and reviewer engineering verification. |
| incremental-implementation | `skills/incremental-implementation/` | Useful for one-slice execution discipline. |
| code-review-and-quality | `skills/code-review-and-quality/` | Useful for reviewer behavior, but DIAYN review authority still wins. |
| git-workflow-and-versioning | `skills/git-workflow-and-versioning/` | Useful for branch and diff hygiene, but worktree policy remains DIAYN-owned. |

## B. Needs DIAYN Adaptation

These skills may be valuable but must be adapted before influencing DIAYN docs or skills.

| Expected topic | Current upstream path | Adaptation concern |
| --- | --- | --- |
| planning-and-task-breakdown | `skills/planning-and-task-breakdown/` | Must map to Controller, lane board, handoff, and OwnerGate rules. |
| context-engineering | `skills/context-engineering/` | Must respect repository docs as system of record and progressive disclosure. |
| documentation-and-adrs | `skills/documentation-and-adrs/` | Must not bypass DIAYN decision records or owner acceptance docs. |
| api-and-interface-design | `skills/api-and-interface-design/` | Must route shared contract changes through lane and integration protocols. |

## C. Reference Only, Do Not Sync Into DIAYN Core

These upstream areas can inform maintainers but should not become DIAYN core behavior by default.

| Expected topic | Current upstream path | Reason |
| --- | --- | --- |
| orchestration-patterns | `references/orchestration-patterns.md` | Reference document, not a current `skills/orchestration-patterns/` directory. |
| tool-specific setup docs | `.claude/`, `.claude-plugin/`, `.gemini/`, `.opencode/`, `docs/*-setup.md` | Stage 08 handles adapter preparation separately. |
| slash command implementations | `.claude/commands/`, `.gemini/commands/` | DIAYN command semantics are defined in `docs/meta/diayn_command_reference.md`. |

## Review Notes

- If a future upstream snapshot renames a watched skill, record both the old expected topic and the new upstream path.
- Do not copy full upstream skill bodies into `docs/meta/**`.
- Do not update DIAYN core skills automatically. First decide whether the upstream change supports or conflicts with the multi-session harness.
