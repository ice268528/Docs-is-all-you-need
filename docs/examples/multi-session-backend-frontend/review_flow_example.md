# Review Flow Example

This is an example only. Use `docs/templates/review_log_template.md` and the
command reference for real review records.

## User Prompt To Review Session

```text
/diayn-review-backend

<paste latest backend worker report here>
```

or:

```text
/diayn-review-frontend

<paste latest frontend worker report here>
```

## Review Inputs

The review session checks:

- The pasted worker report.
- Relevant diff or changed paths.
- Lane board status.
- Evidence and verification records.
- Acceptance criteria from handoff or shared docs.
- Write boundary compliance.

## Review Decision

| Decision | Meaning | Next action |
| --- | --- | --- |
| `done` | Evidence and scope support accepting the candidate work. | Controller may include it in sync or integration review. |
| `rejected` | Rework is required. | Send specific rework back to the lane board or handoff. |
| `blocked` | Required dependency or evidence is missing. | Controller or lane owner resolves dependency. |
| `owner_gate` | Owner decision is needed before judging. | Ask concise Owner question or offer `/diayn-html` for long decision. |

Review sessions do not mark `owner_accepted`, do not merge by default, and do
not silently fix the implementation while reviewing.

## Review Log Entry Shape

| Review ID | Task ID | Evidence | Decision | Rework |
| --- | --- | --- | --- | --- |
| `<review_id>` | `<task_id>` | `<evidence_links>` | `done` / `rejected` | `<notes_or_none>` |
