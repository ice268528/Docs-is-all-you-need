# Review Log Template

> Copy this template to `docs/lanes/<lane>/stages/<stage-id>/review_log.md`. The lane root `docs/lanes/<lane>/review_log.md` may keep the current review summary and index.

## Review Metadata

| Field | Value |
| --- | --- |
| Review ID | `<review_id>` |
| Reviewed lane | `<lane>` |
| Stage | `<stage_id>` |
| Review role | `<Backend Review Session / Frontend Review Session>` |
| Reviewed task(s) | `<task_id>` |
| Candidate source | `docs/lanes/<lane>/board.md` |
| Evidence source | `docs/lanes/<lane>/stages/<stage-id>/evidence.md` |
| Worklog source | `docs/lanes/<lane>/stages/<stage-id>/worklog.md` |
| Diff scope | `<paths, branch, or commit range>` |

## Checklist

| Check | Result | Notes |
| --- | --- | --- |
| Candidate work is marked `candidate_done` | `<pass/fail>` | `<notes>` |
| Diff stays inside authorized paths | `<pass/fail>` | `<notes>` |
| Required evidence exists | `<pass/fail>` | `<notes>` |
| Verification matches acceptance criteria | `<pass/fail>` | `<notes>` |
| Shared contracts were not silently changed | `<pass/fail/not-applicable>` | `<notes>` |
| Other lane docs were not modified by worker | `<pass/fail>` | `<notes>` |
| Global `TODO.md` was not modified by worker | `<pass/fail>` | `<notes>` |

## Findings

| Severity | File or area | Finding | Required action |
| --- | --- | --- | --- |
| `<P0/P1/P2/P3>` | `<path>` | `<finding>` | `<action>` |

## Decision

Decision must be one of:

- `done`
- `rejected`

| Decision | Rationale | Rework target |
| --- | --- | --- |
| `<done/rejected>` | `<rationale>` | `<task_id or n/a>` |

## Rework Requirements

| Task ID | Required rework | Return status |
| --- | --- | --- |
| `<task_id>` | `<rework>` | `todo` / `blocked` |
