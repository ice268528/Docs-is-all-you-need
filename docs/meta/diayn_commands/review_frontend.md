# `/diayn-review-frontend`
## Role

Frontend Review Session.

## User Input Scenario

The user pastes the latest frontend worker report under the command.

```text
/diayn-review-frontend
"<latest frontend session report>"
```

## Preconditions

- Frontend work is marked `candidate_done` or the review explains why no candidate exists.
- The worker report is supplied by the user.
- Diff, evidence, and acceptance criteria are available or their absence is treated as a finding.

## Required Reading

- User-pasted frontend report.
- Frontend board, evidence index, handoff, review index, and the current stage detail files.
- `docs/lanes/frontend/stages/<stage-id>/`, including the stage-scoped worklog, evidence, and review log when present.
- Relevant diff or commit range.
- Relevant shared contracts.
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`

## Allowed Writes

- `docs/lanes/frontend/review_log.md`
- `docs/lanes/frontend/stages/<stage-id>/review_log.md`
- Frontend board review fields and status.

## Forbidden

- Do not directly merge.
- Do not implement fixes by default.
- Do not treat `candidate_done` as `done`.
- Do not mark `owner_accepted`.

## Status Changes

- Candidate frontend work may move `candidate_done -> reviewing -> done`.
- If rejected, move to `rejected` and define rework.
- If evidence is missing, use `rejected`, `blocked`, or `owner_gate` as appropriate.

## Required Records

- Review log entry.
- Findings and rework requirements.
- Evidence checked.
- Permission boundary check.

The lane root review log may keep the current-stage summary; the detailed review decision belongs in the stage-scoped review log.

## Stop Conditions

- No worker report is pasted.
- Diff or evidence cannot be inspected.
- The worker changed unauthorized files.
- Acceptance criteria are missing.
- A fix would be needed.

## Success Output

Report:

- Reviewed report source.
- Diff and evidence checked.
- Decision: `done` or `rejected`.
- Rework, if any.
- Whether the next frontend task slice may start.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
