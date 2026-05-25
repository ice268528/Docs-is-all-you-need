# DIAYN Command Reference

> `/diayn ...` commands are document-driven workflow triggers for existing coding agents. They are not a built-in CLI, plugin, shell command, or runtime.

Use this reference with:

- `docs/meta/session_identity_protocol.md`
- `docs/meta/diayn_worktree_workflow.md`
- `docs/meta/controller_sync_integration_protocol.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`

## 1. Command Rules

Every command must start with the Session Identity Guard.

The active session must confirm:

- The command that was requested.
- The intended role.
- The intended lane, if any.
- The current directory or worktree.
- The matching entry in `.diayn/worktree_manifest.md`, if present.
- The matching local identity file under `.diayn/local/`, if present.
- The documents the role may read and write.

If identity does not match, stop before reading task state deeply or editing files. Do not rewrite identity files to bypass the guard.

All commands must use repository documents as the system of record. Chat can clarify the immediate request, but durable facts, task state, evidence, review decisions, and Owner decisions must be written to the appropriate documents.

Worker commands execute one clear task slice at a time. After finishing one slice, the worker stops, reports, and waits for the user to send the work to review.

## 2. Common Identity Mismatch Output

Use this format when a command does not match the detected role, lane, path, or manifest.

```text
Detected a session identity mismatch.

Requested command: <requested_command>
Expected role: <expected_role>
Expected lane: <expected_lane_or_none>
Detected role: <detected_role_or_unknown>
Detected lane: <detected_lane_or_unknown>
Current path: <current_path>
Expected path: <expected_path>

I will not execute <requested_command> from this session.

To continue, open the expected location:
cd <expected_path>

Then run:
<correct_command>
```

Lane-specific example:

```text
Detected a session identity mismatch.

Requested command: /diayn backend
But the current directory is registered as: frontend lane
Current path: ../worktrees/<project_slug>/frontend

I will not execute the backend workflow.

To start the backend session, open:
cd ../worktrees/<project_slug>/backend

Then run:
/diayn backend
```

## 3. Common Success Output

Use `docs/templates/diayn_command_output_template.md` for the final response of each command.

The response must include:

- Command executed.
- Role and lane confirmed.
- Documents read.
- Files changed or explicitly not changed.
- Status changes.
- Evidence, worklog, review log, or sync log written.
- Blockers, OwnerGate items, or next command.
- Whether the session stayed inside its role and write boundary.

## 4. Required Record Mapping

| Command | Evidence | Worklog | Review log | Sync log or Controller record |
| --- | --- | --- | --- | --- |
| `/diayn init` | Source paths and quality findings when useful | Not required unless the project has a Controller worklog | Not applicable | Controller summary, Owner questions, draft project docs |
| `/diayn plan` | Planning rationale and acceptance criteria sources | Not required unless the project has a Controller worklog | Not applicable | Controller summary, lane boards, lane handoffs |
| `/diayn worktrees` | Visibility check results | Not required unless the project has a Controller worklog | Not applicable | `.diayn/worktree_manifest.md`, `.diayn/session_registry.md` |
| `/diayn backend` | `docs/lanes/backend/evidence.md` | `docs/lanes/backend/worklog.md` | Not written by worker | Backend board and handoff notes |
| `/diayn frontend` | `docs/lanes/frontend/evidence.md` | `docs/lanes/frontend/worklog.md` | Not written by worker | Frontend board and handoff notes |
| `/diayn review backend` | Evidence checked, recorded in review entry | Not required | `docs/lanes/backend/review_log.md` | Backend board review status |
| `/diayn review frontend` | Evidence checked, recorded in review entry | Not required | `docs/lanes/frontend/review_log.md` | Frontend board review status |
| `/diayn sync` | Source lane states and review records | Not required | Not written by Controller sync | `.diayn/sync_log.md`, Controller summary |
| `/diayn integration` | Build, lint, typecheck, smoke, E2E, contract, and lane evidence checked | Not required | Lane review logs are read, not overwritten | `.diayn/sync_log.md`, `docs/shared/integration_issues.md`, Controller summary |
| `/diayn bug` | Owner feedback and acceptance failure details | Not required unless routed to a lane | Not applicable | Controller triage record, lane board/handoff, backlog or future preparation |
| `/diayn new` | Owner request and scope impact details | Not required unless routed to a lane | Not applicable | Controller triage record, lane board/handoff, backlog or future preparation |
| `/diayn html` | Source report or decision docs used | Not required | Not applicable | HTML output pointer and any later Owner decision record |

## 5. `/diayn init`

### Role

Controller Session.

If no DIAYN identity exists yet, this command may establish the Controller identity after confirming the repository root and asking the Owner for `project_slug`. If an identity already exists and is not Controller-compatible, stop with the common identity mismatch output.

### User Input Scenarios

Existing requirement document:

```text
/diayn init "<requirements_doc_path>"
```

Fuzzy idea or fuzzy requirement:

```text
/diayn init
"<short idea, rough goal, or incomplete requirement>"
```

### Preconditions

- The user wants to initialize or refresh project documentation.
- The session is at the intended controller repository path.
- The Owner confirms `project_slug`; do not silently derive it from a directory name.
- The session can inspect existing `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/`, requirement docs, architecture docs, TODO, and similar sources when they exist.

### Required Reading

- Entry file, if present.
- `README.md`, if present.
- Existing requirement, architecture, TODO, project, stage, or report documents that are relevant.
- `docs/meta/agent_doc_permissions.md`
- `docs/meta/status_model.md`
- `docs/meta/progressive_disclosure_rules.md`

### Required Behavior

For an existing requirement document, do not assume it is complete. First assess:

- Source and intended authority.
- Completeness of goals, non-goals, users, workflows, acceptance criteria, risks, constraints, and dependencies.
- Contradictions or ambiguous terms.
- Missing decisions.
- Whether it can be split into later lane tasks.
- Whether shared contracts or cross-lane boundaries are implied.

For a fuzzy idea, first turn it into Owner-readable material:

- Functional points.
- Boundaries and non-goals.
- Known risks.
- Assumptions.
- Questions that need confirmation.
- Possible lane split only when there is enough information.

Use short decision options by default. When a decision would benefit from a visual explanation, offer this option without executing it automatically:

```text
Run /diayn html to generate a visual HTML decision aid.
```

### Allowed Writes

- Draft project documents.
- Draft stage, batch, or lane planning documents.
- Owner question records.
- `.diayn/session_registry.md` and `.diayn/worktree_manifest.md` when initializing shared control metadata.
- Controller summaries such as `TODO.md`, when the repository uses one.

Project document lifecycle:

```text
draft -> owner_confirmed -> controlled_changes_only
```

### Forbidden

- Do not write business code.
- Do not invent requirements, architecture facts, test commands, or dependencies.
- Do not mark draft requirements as confirmed without Owner confirmation.
- Do not create real worktrees or launch worker sessions.

### Status Changes

- New scope starts as `todo` or `owner_gate`.
- Confirmed project facts may move from `draft` to `owner_confirmed`.
- Nothing becomes `candidate_done`, `done`, `ready_for_e2e`, or `owner_accepted`.

### Required Records

- Owner questions or decision gaps.
- Planning summary.
- Draft evidence for discovered facts, such as source paths.

### Stop Conditions

- Required source documents are missing or contradictory and the contradiction affects scope.
- The Owner has not confirmed `project_slug`.
- The session would need to invent project facts.
- The next step would require implementation.

### Success Output

Report:

- Whether the input was an existing document or fuzzy idea.
- Quality and completeness findings.
- Draft documents created or updated.
- Open Owner decisions.
- Whether `/diayn plan` is ready.
- If not ready, the minimum questions needed.

Identity mismatch output: use the common format in section 2.

## 6. `/diayn plan`

### Role

Controller Session.

### User Input Scenario

The Owner has confirmed enough project facts to plan work.

```text
/diayn plan
```

### Preconditions

- Project goals, constraints, and current scope are confirmed enough to plan.
- Open OwnerGate items that affect scope are resolved or explicitly deferred.

### Required Reading

- Confirmed project brief and constraints.
- Current controller summary.
- Relevant stage or batch goals.
- Shared contracts, if any.
- Existing backend and frontend lane docs.
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`

### Allowed Writes

- Stage or batch planning documents.
- Backend and frontend lane boards.
- Lane handoff documents.
- Shared contract placeholders or issue notes when authorized.
- Controller summary and Owner question records.

### Forbidden

- Do not write code.
- Do not silently change confirmed requirements.
- Do not assign work based on documents the worker cannot see.
- Do not create worktrees or launch agents.

### Status Changes

- Planned tasks may be `todo`, `blocked`, or `owner_gate`.
- Do not mark worker progress statuses.

### Required Records

- Lane split rationale.
- Acceptance criteria.
- OwnerGate decisions or remaining questions.
- Shared contract and dependency notes.

### Stop Conditions

- Scope is not confirmed enough to create lane tasks.
- A lane task would depend on an undefined shared contract.
- The plan requires a project, architecture, provider, cost, or acceptance decision.

### Success Output

Report:

- Planned lanes and task slices.
- Shared contracts or dependencies.
- OwnerGate items.
- Whether `/diayn worktrees` is ready.

Identity mismatch output: use the common format in section 2.

## 7. `/diayn worktrees`

### Role

Controller Session.

### User Input Scenario

Stage, batch, or lane planning is confirmed enough to prepare separate lane sessions.

```text
/diayn worktrees
```

### Preconditions

- Lane boards and handoffs exist or can be generated.
- Required worker documents are visible or can be made visible.
- `project_slug` is confirmed.

### Required Reading

- `.diayn/worktree_manifest.md`
- `.diayn/session_registry.md`
- Backend and frontend lane boards and handoffs.
- Shared contracts and shared issue records.
- `docs/meta/diayn_worktree_workflow.md`
- `docs/meta/session_identity_protocol.md`

### Allowed Writes

- `.diayn/worktree_manifest.md`
- `.diayn/session_registry.md`
- Lane handoff documents.
- Launch prompt drafts using `docs/templates/lane_session_launch_prompt_template.md`
- Review launch prompt drafts using `docs/templates/review_session_launch_prompt_template.md`

### Forbidden

- Do not default to launching interactive agent subprocesses.
- Do not hide which session the user is controlling.
- Do not assume uncommitted controller-only files are visible in worker worktrees.
- Do not put stage identifiers into long-lived worktree directory names.

Actual `git worktree` commands require explicit user authorization in the active project environment. The default behavior is to output instructions and prompts.

### Status Changes

- Worktree entries may move among `planned`, `ready`, `blocked`, or `archived`.
- Lane task statuses do not become `doing` until a lane session starts.

### Required Records

- Worktree manifest updates.
- Session registry updates.
- Visibility check results.
- Startup commands and prompts.

### Stop Conditions

- Required documents are not visible to the worker worktree.
- A worktree path conflicts with another lane.
- The user expects the Controller to run hidden interactive agents.
- Worktree creation would require permission that has not been granted.

### Success Output

Use placeholder commands only:

```text
cd ../worktrees/<project_slug>/backend
codex
/diayn backend
```

```text
cd ../worktrees/<project_slug>/frontend
codex
/diayn frontend
```

Report which worktrees are planned, ready, or blocked.

Identity mismatch output: use the common format in section 2.

## 8. `/diayn backend`

### Role

Backend Session.

### User Input Scenario

The user has opened the backend worktree and started a new coding-agent session.

```text
/diayn backend
```

### Preconditions

- Current directory matches `../worktrees/<project_slug>/backend` or the manifest's backend path.
- Local identity, if present, allows `/diayn backend`.
- Backend board and handoff are visible.

### Required Reading

- Entry file.
- `.diayn/local/session_identity.md`, if present.
- `.diayn/worktree_manifest.md`, if visible.
- `docs/lanes/backend/board.md`
- `docs/lanes/backend/handoff.md`
- `docs/shared/**` relevant to the task.
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`

### Allowed Writes

- Backend implementation and tests authorized by the active task.
- `docs/lanes/backend/board.md`
- `docs/lanes/backend/evidence.md`
- `docs/lanes/backend/worklog.md`
- Backend handoff notes when needed.

### Forbidden

- Do not modify global `TODO.md`.
- Do not modify frontend lane documents or frontend code.
- Do not silently modify shared contracts.
- Do not merge branches.
- Do not mark `done`, `ready_for_e2e`, or `owner_accepted`.
- Do not continue through the whole lane automatically.

### Status Changes

- One backend task may move `todo -> doing -> candidate_done`.
- If not feasible, use `blocked` or `owner_gate` with a reason.
- Never convert `candidate_done` to `done`.

### Required Records

- Backend evidence.
- Backend worklog.
- Backend board status.
- Handoff note if the reviewer or Controller needs context.

### Stop Conditions

- Identity or lane mismatch.
- Required documents are invisible.
- The selected task is unreasonable, infeasible, too large, or missing dependencies.
- The task needs frontend, global, shared contract, architecture, scope, or Owner decision changes.
- One task slice is complete.

### Success Output

Report:

- Identity confirmed.
- Task slice selected and why it was reasonable.
- Files changed.
- Verification run or not run.
- Evidence and worklog written.
- Status, at most `candidate_done`.
- Ask the user to send the report to `/diayn review backend`.

Identity mismatch output: use the common format in section 2.

## 9. `/diayn frontend`

### Role

Frontend Session.

### User Input Scenario

The user has opened the frontend worktree and started a new coding-agent session.

```text
/diayn frontend
```

### Preconditions

- Current directory matches `../worktrees/<project_slug>/frontend` or the manifest's frontend path.
- Local identity, if present, allows `/diayn frontend`.
- Frontend board and handoff are visible.

### Required Reading

- Entry file.
- `.diayn/local/session_identity.md`, if present.
- `.diayn/worktree_manifest.md`, if visible.
- `docs/lanes/frontend/board.md`
- `docs/lanes/frontend/handoff.md`
- `docs/shared/**` relevant to the task.
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`

### Allowed Writes

- Frontend implementation and tests authorized by the active task.
- `docs/lanes/frontend/board.md`
- `docs/lanes/frontend/evidence.md`
- `docs/lanes/frontend/worklog.md`
- Frontend handoff notes when needed.

### Forbidden

- Do not modify global `TODO.md`.
- Do not modify backend lane documents or backend code.
- Do not silently modify shared contracts.
- Do not merge branches.
- Do not mark `done`, `ready_for_e2e`, or `owner_accepted`.
- Do not continue through the whole lane automatically.

### Status Changes

- One frontend task may move `todo -> doing -> candidate_done`.
- If not feasible, use `blocked` or `owner_gate` with a reason.
- Never convert `candidate_done` to `done`.

### Required Records

- Frontend evidence.
- Frontend worklog.
- Frontend board status.
- Handoff note if the reviewer or Controller needs context.

### Stop Conditions

- Identity or lane mismatch.
- Required documents are invisible.
- The selected task is unreasonable, infeasible, too large, or missing dependencies.
- The task needs backend, global, shared contract, architecture, scope, or Owner decision changes.
- One task slice is complete.

### Success Output

Report:

- Identity confirmed.
- Task slice selected and why it was reasonable.
- Files changed.
- Verification run or not run.
- Evidence and worklog written.
- Status, at most `candidate_done`.
- Ask the user to send the report to `/diayn review frontend`.

Identity mismatch output: use the common format in section 2.

## 10. `/diayn review backend`

### Role

Backend Review Session.

### User Input Scenario

The user pastes the latest backend worker report under the command.

```text
/diayn review backend
"<latest backend session report>"
```

### Preconditions

- Backend work is marked `candidate_done` or the review explains why no candidate exists.
- The worker report is supplied by the user.
- Diff, evidence, and acceptance criteria are available or their absence is treated as a finding.

### Required Reading

- User-pasted backend report.
- Backend board, evidence, worklog, handoff, and review log.
- Relevant diff or commit range.
- Relevant shared contracts.
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`

### Allowed Writes

- `docs/lanes/backend/review_log.md`
- Backend board review fields and status.

### Forbidden

- Do not directly merge.
- Do not implement fixes by default.
- Do not treat `candidate_done` as `done`.
- Do not mark `owner_accepted`.

### Status Changes

- Candidate backend work may move `candidate_done -> reviewing -> done`.
- If rejected, move to `rejected` and define rework.
- If evidence is missing, use `rejected`, `blocked`, or `owner_gate` as appropriate.

### Required Records

- Review log entry.
- Findings and rework requirements.
- Evidence checked.
- Permission boundary check.

### Stop Conditions

- No worker report is pasted.
- Diff or evidence cannot be inspected.
- The worker changed unauthorized files.
- Acceptance criteria are missing.
- A fix would be needed.

### Success Output

Report:

- Reviewed report source.
- Diff and evidence checked.
- Decision: `done` or `rejected`.
- Rework, if any.
- Whether the next backend task slice may start.

Identity mismatch output: use the common format in section 2.

## 11. `/diayn review frontend`

### Role

Frontend Review Session.

### User Input Scenario

The user pastes the latest frontend worker report under the command.

```text
/diayn review frontend
"<latest frontend session report>"
```

### Preconditions

- Frontend work is marked `candidate_done` or the review explains why no candidate exists.
- The worker report is supplied by the user.
- Diff, evidence, and acceptance criteria are available or their absence is treated as a finding.

### Required Reading

- User-pasted frontend report.
- Frontend board, evidence, worklog, handoff, and review log.
- Relevant diff or commit range.
- Relevant shared contracts.
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`

### Allowed Writes

- `docs/lanes/frontend/review_log.md`
- Frontend board review fields and status.

### Forbidden

- Do not directly merge.
- Do not implement fixes by default.
- Do not treat `candidate_done` as `done`.
- Do not mark `owner_accepted`.

### Status Changes

- Candidate frontend work may move `candidate_done -> reviewing -> done`.
- If rejected, move to `rejected` and define rework.
- If evidence is missing, use `rejected`, `blocked`, or `owner_gate` as appropriate.

### Required Records

- Review log entry.
- Findings and rework requirements.
- Evidence checked.
- Permission boundary check.

### Stop Conditions

- No worker report is pasted.
- Diff or evidence cannot be inspected.
- The worker changed unauthorized files.
- Acceptance criteria are missing.
- A fix would be needed.

### Success Output

Report:

- Reviewed report source.
- Diff and evidence checked.
- Decision: `done` or `rejected`.
- Rework, if any.
- Whether the next frontend task slice may start.

Identity mismatch output: use the common format in section 2.

## 12. `/diayn sync`

### Role

Controller Session.

### User Input Scenario

The Controller needs to summarize lane state after worker or review activity.

```text
/diayn sync
```

### Preconditions

- Lane boards and review logs exist or their absence is itself the sync finding.

### Required Reading

- Backend and frontend boards.
- Backend and frontend review logs.
- Shared integration issues.
- Global controller summary.
- `.diayn/sync_log.md`
- `docs/meta/controller_sync_integration_protocol.md`

### Allowed Writes

- `.diayn/sync_log.md`
- Global controller summary.
- Lane board sync fields when Controller authority applies.
- Owner question or blocker records.

### Forbidden

- Do not convert `blocked`, `rejected`, or `candidate_done` into `done`.
- Do not modify implementation code.
- Do not bypass review.
- Do not mark `owner_accepted`.

### Status Changes

- Controller may mark aggregate readiness as `blocked`, `owner_gate`, or `ready_for_e2e` only when supporting evidence exists.
- Lane statuses remain governed by lane and review authority.

### Required Records

- Sync event.
- Lane status snapshot.
- Open blockers and OwnerGate items.
- Next recommended command.

### Stop Conditions

- Lane documents conflict and the Controller cannot reconcile without guessing.
- Evidence needed for a readiness claim is missing.
- A lane review has not happened.

### Success Output

Report:

- Lane statuses.
- Review outcomes.
- Blockers and OwnerGate items.
- Whether the project is ready for `/diayn integration`.

Identity mismatch output: use the common format in section 2.

## 13. `/diayn integration`

### Role

Controller Integration Review.

### User Input Scenario

The Controller checks cross-lane integration after lane review has accepted enough work.

```text
/diayn integration
```

### Preconditions

- Relevant lane work is `done` by review, or the command explicitly records that it is not ready.
- Integration criteria are defined.

### Required Reading

- Lane review logs.
- Lane evidence.
- Shared contracts.
- Shared integration issues.
- Build, lint, typecheck, smoke, or E2E evidence.
- `.diayn/sync_log.md`
- `docs/meta/controller_sync_integration_protocol.md`

### Allowed Writes

- `.diayn/sync_log.md`
- `docs/shared/integration_issues.md`
- Responsible lane boards or handoffs when writing back integration issues.
- Controller summary.

### Forbidden

- Do not bypass lane review.
- Do not treat missing evidence as pass.
- Do not silently change shared contracts.
- Do not mark `owner_accepted`.
- Do not merge by default unless explicitly authorized by the project workflow.

### Status Changes

- Integrated work may become `ready_for_e2e` when evidence supports it.
- Integration problems become lane `todo`, `blocked`, or `rejected`, or shared integration issues.

### Required Records

- Integration event in sync log.
- Evidence checked.
- Issues written back.
- Readiness decision.

### Stop Conditions

- Lane review is missing.
- Shared contract consistency cannot be checked.
- Required build, smoke, or E2E evidence is missing and affects readiness.
- The next action requires Owner acceptance.

### Success Output

Report:

- Integration checks run or not run.
- Issues found and where written.
- Whether the result is `ready_for_e2e`, `blocked`, or `owner_gate`.
- Next Owner acceptance step, if ready.

Identity mismatch output: use the common format in section 2.

## 14. `/diayn bug`

### Role

Controller Session.

### User Input Scenario

The Owner reports that end-to-end business acceptance failed.

```text
/diayn bug
"<what failed, expected behavior, actual behavior, context>"
```

### Preconditions

- The feedback is from Owner acceptance, E2E testing, or user-facing validation.
- The Controller can compare the feedback against current scope and acceptance criteria.

### Required Reading

- User feedback.
- Current stage or batch scope.
- Owner acceptance records.
- Lane boards and review logs.
- Shared integration issues.
- Controller summary.
- `docs/meta/controller_sync_integration_protocol.md`

### Allowed Writes

If the bug belongs to current scope:

- Controller summary.
- Responsible lane board and handoff.
- Shared integration issue, when cross-lane.
- Owner question or blocker record.

If the bug is outside current scope:

- Backlog or future preparation document such as `<backlog_path>` or `<future_stage_preparation_doc>`.
- Owner-facing explanation.

### Forbidden

- Do not hide current-scope bugs as future work.
- Do not force out-of-scope work into the current lane.
- Do not directly fix the bug from the Controller by default.
- Do not mark acceptance as passed.

### Status Changes

- Current-scope bug: affected item becomes `todo`, `blocked`, or `rejected`.
- Out-of-scope bug: record as backlog or future preparation; current accepted work is not silently invalidated unless scope says so.

### Required Records

- Triage decision and scope rationale.
- Lane synchronization notes.
- Next command for the user.

### Stop Conditions

- The report lacks enough detail to identify expected and actual behavior.
- Scope ownership is unclear.
- A fix would require changing project goals, contracts, or acceptance criteria.

### Success Output

Report:

- Whether the bug is current scope or future scope.
- Documents updated.
- Responsible lane.
- Next command, for example `/diayn backend`, `/diayn frontend`, or `/diayn sync`.

Identity mismatch output: use the common format in section 2.

## 15. `/diayn new`

### Role

Controller Session.

### User Input Scenario

The Owner adds a requirement, dependency, direction change, or priority change.

```text
/diayn new
"<new requirement, dependency change, or direction change>"
```

### Preconditions

- The request can be compared against current scope, constraints, and lane state.

### Required Reading

- User request.
- Current project goals and constraints.
- Current stage or batch scope.
- Lane boards and shared contracts.
- Controller summary.
- Owner question records.
- `docs/meta/controller_sync_integration_protocol.md`

### Allowed Writes

If inserted into current scope:

- Controller summary.
- Responsible lane boards and handoffs.
- Shared contracts or issue notes only when authorized.
- Owner questions when a decision is needed.

If deferred:

- Backlog or future preparation document such as `<backlog_path>` or `<future_stage_preparation_doc>`.
- Owner-facing explanation.

### Forbidden

- Do not silently expand current scope.
- Do not change dependencies, contracts, architecture, or acceptance criteria without Owner authorization.
- Do not write implementation code.
- Do not launch worker sessions.

### Status Changes

- Current-scope insertion becomes `todo`, `blocked`, or `owner_gate`.
- Deferred work is recorded as future preparation or backlog.

### Required Records

- Triage decision.
- Scope impact.
- Lane synchronization notes.
- Next command for the user.

### Stop Conditions

- The request changes goals, constraints, dependencies, or acceptance criteria without explicit authorization.
- The correct lane or timing is unclear.
- The change conflicts with confirmed documents.

### Success Output

Report:

- Insert current scope or defer.
- Why.
- Documents updated.
- Next command.

Identity mismatch output: use the common format in section 2.

## 16. `/diayn html`

### Role

Controller Session or Owner-support session authorized by the Controller.

### User Input Scenarios

Decision aid:

```text
/diayn html
"<decision topic or options to explain>"
```

Report explanation:

```text
/diayn html
"<agent report to explain or source path>"
```

### Preconditions

- The user actively requested HTML.
- The source decision, report, or context is available.
- The output path or delivery format is clear enough.

### Required Reading

- User request.
- Source report, decision topic, Owner question, or relevant project docs.
- Current status and evidence documents needed to avoid misleading the Owner.

### Allowed Writes

- HTML aid or report explanation at an explicitly chosen path.
- A short pointer from the active Owner question or report record when appropriate.

### Forbidden

- Do not generate long decision HTML by default.
- Do not treat generated HTML as the decision authority.
- Do not replace Owner decisions with a visual artifact.
- Do not write project facts that were not in the source documents.

### Status Changes

- Usually none.
- If the HTML leads to an Owner decision, record that decision in the appropriate active document after the Owner replies.

### Required Records

- Source documents used.
- Output artifact path, if written.
- Follow-up choices or feedback prompt for the user.

### Stop Conditions

- The user did not request HTML.
- Source facts are missing or contradictory.
- The task would require designing the full Owner UX framework beyond command semantics.

### Success Output

Report:

- What the HTML explains.
- Source documents.
- Output path.
- Fast feedback options for the Owner.

Identity mismatch output: use the common format in section 2.
