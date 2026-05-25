# Session Roles

> This document defines the standard multi-session roles, their write boundaries, and the status decisions each role may or may not make.

## 1. Role Summary

| Role | Primary responsibility | Highest normal status authority |
| --- | --- | --- |
| Controller Session | Plan, dispatch, synchronize, maintain global summaries and shared facts | `ready_for_e2e`, after review and integration checks |
| Backend Session | Execute backend lane work | `candidate_done` |
| Frontend Session | Execute frontend lane work | `candidate_done` |
| Backend Review Session | Review backend candidate work | `done` or `rejected` |
| Frontend Review Session | Review frontend candidate work | `done` or `rejected` |
| Controller Integration Review | Check reviewed lanes together and write integration issues | `ready_for_e2e` or lane issue status updates |
| Owner Acceptance | Business and experience acceptance | `owner_accepted` |

Status definitions are authoritative in `docs/meta/status_model.md`.

## 2. Controller Session

### Responsibilities

- Read project facts, stage goals, existing TODO summaries, shared contracts, and lane state.
- Clarify missing requirements and OwnerGate items.
- Plan stage / batch / lane work.
- Maintain global `TODO.md` as a summary, not as every lane's detailed workspace.
- Maintain shared docs, stage docs, and lane handoff packets when authorized.
- Ensure required documents are visible to the sessions that must use them.
- Synchronize lane board state back into global summaries.
- Prepare integration review after lane review passes.

### Default Allowed Modification Scope

- `TODO.md`, as controller-owned global summary.
- `docs/stages/**`, when Owner has authorized planning or updates.
- `docs/shared/**`, when creating or maintaining shared contracts and integration issues.
- `docs/lanes/<lane>/handoff.md`, when preparing or updating dispatch context.
- `.diayn/worktree_manifest.md`, `.diayn/session_registry.md`, and `.diayn/sync_log.md` when those control files exist.

### Default Forbidden Actions

- Directly implement backend or frontend lane code by default.
- Treat `candidate_done` as `done`.
- Mark `owner_accepted`.
- Hide dispatch requirements in chat or invisible local files.
- Change project goals, stage scope, or confirmed constraints without Owner authorization.

### Documents This Role Can Write

- Global summary and planning documents listed above.
- Same-lane handoff updates needed for dispatch.
- Integration issues and synchronization notes.

### Statuses This Role Cannot Mark

- `done` for lane work unless acting in an explicit Controller Integration Review role over already reviewed work.
- `rejected` as a lane review result unless acting through the defined review workflow.
- `owner_accepted`.

### Stop And Ask When

- Required worker or reviewer documents are not visible in the target worktree.
- Shared contracts or stage boundaries need to change.
- Multiple reasonable plans would materially change cost, scope, architecture, or Owner experience.
- A worker lane asks the Controller to approve unreviewed work as complete.

## 3. Backend Session

### Responsibilities

- Confirm the session identity is the backend lane.
- Read backend lane board, backend handoff, relevant shared contracts, stage goal, and verification instructions.
- Implement backend-authorized tasks.
- Update backend lane board, evidence, worklog, and handoff notes.
- Record verification evidence for the backend lane.
- Mark completed backend work at most as `candidate_done`.

### Default Allowed Modification Scope

- Backend implementation and tests within the authorized task.
- `docs/lanes/backend/board.md`.
- `docs/lanes/backend/evidence.md`.
- `docs/lanes/backend/worklog.md`.
- `docs/lanes/backend/handoff.md`.

### Default Forbidden Actions

- Modify frontend implementation or frontend lane documents.
- Modify global `TODO.md`.
- Modify shared contracts without Controller or Owner authorization.
- Merge branches or perform integration review.
- Mark `done`, `rejected`, `ready_for_e2e`, or `owner_accepted`.

### Documents This Role Can Write

- Backend lane board, evidence, worklog, and handoff updates.
- Backend code and tests inside the authorized implementation scope.

### Statuses This Role Cannot Mark

- `done`
- `rejected`
- `ready_for_e2e`
- `owner_accepted`
- `archived`, unless the Controller explicitly delegates a lane-local cleanup action.

### Stop And Ask When

- The task requires frontend changes.
- The task requires a shared contract, schema, API, or architecture change.
- The backend session identity cannot be confirmed.
- The lane board asks for work not covered by the handoff or stage scope.
- Verification requires credentials, real external calls, destructive operations, or Owner judgement.

## 4. Frontend Session

### Responsibilities

- Confirm the session identity is the frontend lane.
- Read frontend lane board, frontend handoff, relevant shared contracts, stage goal, and verification instructions.
- Implement frontend-authorized tasks.
- Update frontend lane board, evidence, worklog, and handoff notes.
- Record verification evidence for the frontend lane.
- Mark completed frontend work at most as `candidate_done`.

### Default Allowed Modification Scope

- Frontend implementation and tests within the authorized task.
- `docs/lanes/frontend/board.md`.
- `docs/lanes/frontend/evidence.md`.
- `docs/lanes/frontend/worklog.md`.
- `docs/lanes/frontend/handoff.md`.

### Default Forbidden Actions

- Modify backend implementation or backend lane documents.
- Modify global `TODO.md`.
- Modify shared contracts without Controller or Owner authorization.
- Merge branches or perform integration review.
- Mark `done`, `rejected`, `ready_for_e2e`, or `owner_accepted`.

### Documents This Role Can Write

- Frontend lane board, evidence, worklog, and handoff updates.
- Frontend code and tests inside the authorized implementation scope.

### Statuses This Role Cannot Mark

- `done`
- `rejected`
- `ready_for_e2e`
- `owner_accepted`
- `archived`, unless the Controller explicitly delegates a lane-local cleanup action.

### Stop And Ask When

- The task requires backend changes.
- The task requires a shared contract, schema, API, or architecture change.
- The frontend session identity cannot be confirmed.
- The lane board asks for work not covered by the handoff or stage scope.
- Verification requires credentials, real external calls, destructive operations, or Owner judgement.

## 5. Backend Review Session

### Responsibilities

- Confirm the session identity is backend review.
- Read backend lane board, backend evidence, backend worklog, backend handoff, diff, tests, and acceptance criteria.
- Check whether the backend lane stayed inside its permitted scope.
- Write backend review log.
- Mark backend `candidate_done` work as `done` or `rejected`.

### Default Allowed Modification Scope

- `docs/lanes/backend/review_log.md`.
- Backend lane board status and review notes.
- Small documentation notes needed to explain the review decision.

### Default Forbidden Actions

- Implement backend fixes by default.
- Modify frontend lane documents.
- Modify global `TODO.md`.
- Change stage scope or shared contracts.
- Mark `owner_accepted` or `ready_for_e2e`.

### Documents This Role Can Write

- Backend review log.
- Backend lane board review status and rejection reasons.

### Statuses This Role Cannot Mark

- `candidate_done`, except when correcting an obvious review bookkeeping error.
- `ready_for_e2e`
- `owner_accepted`
- Global `archived`

### Stop And Ask When

- The review would require implementation fixes.
- Evidence is missing or unverifiable.
- The worker changed files outside backend authority.
- Review criteria conflict with stage scope or shared contracts.

## 6. Frontend Review Session

### Responsibilities

- Confirm the session identity is frontend review.
- Read frontend lane board, frontend evidence, frontend worklog, frontend handoff, diff, tests, and acceptance criteria.
- Check whether the frontend lane stayed inside its permitted scope.
- Write frontend review log.
- Mark frontend `candidate_done` work as `done` or `rejected`.

### Default Allowed Modification Scope

- `docs/lanes/frontend/review_log.md`.
- Frontend lane board status and review notes.
- Small documentation notes needed to explain the review decision.

### Default Forbidden Actions

- Implement frontend fixes by default.
- Modify backend lane documents.
- Modify global `TODO.md`.
- Change stage scope or shared contracts.
- Mark `owner_accepted` or `ready_for_e2e`.

### Documents This Role Can Write

- Frontend review log.
- Frontend lane board review status and rejection reasons.

### Statuses This Role Cannot Mark

- `candidate_done`, except when correcting an obvious review bookkeeping error.
- `ready_for_e2e`
- `owner_accepted`
- Global `archived`

### Stop And Ask When

- The review would require implementation fixes.
- Evidence is missing or unverifiable.
- The worker changed files outside frontend authority.
- Review criteria conflict with stage scope or shared contracts.

## 7. Controller Integration Review

### Responsibilities

- Read reviewed backend and frontend lane state.
- Check shared contract consistency.
- Check merge readiness and integration evidence.
- Run or review end-to-end, smoke, build, lint, or typecheck evidence when defined.
- Write integration issues back to the responsible lane or shared issue location.
- Move reviewed and integrated work toward `ready_for_e2e` when appropriate.

### Default Allowed Modification Scope

- `TODO.md` global integration summary.
- `docs/shared/integration_issues.md`, when present.
- Relevant lane board entries for integration issues.
- Controller sync and integration summaries.

### Default Forbidden Actions

- Silently fix backend or frontend implementation issues.
- Bypass lane review.
- Mark `owner_accepted`.
- Treat missing evidence as passing.
- Change Owner acceptance criteria.

### Documents This Role Can Write

- Integration issue records.
- Global TODO summary.
- Lane board issue entries needed for rework.
- Integration evidence summaries.

### Statuses This Role Cannot Mark

- `owner_accepted`
- Lane `done` without prior review evidence.

### Stop And Ask When

- Integration requires scope, contract, schema, or UX decisions.
- Lane review logs are missing or contradictory.
- The Controller cannot see the same artifacts that worker and reviewer relied on.
- Integration requires destructive operations, release, deployment, or real external calls.

## 8. Owner Acceptance

### Responsibilities

- Decide whether the reviewed and integrated result satisfies business and experience expectations.
- Choose among OwnerGate options when product, scope, or architecture judgement is needed.
- Confirm `owner_accepted` only after a business-level acceptance path is satisfied.

### Default Allowed Modification Scope

Owner decisions should be recorded by the Controller or appropriate session in the agreed decision or acceptance document. The Owner is not expected to edit every project document directly.

### Default Forbidden Expectations

- The Owner should not be forced to read implementation diffs or test internals to make a business acceptance decision.
- The Owner does not replace backend, frontend, review, or integration verification.
- The Owner should not be asked to approve vague statements without evidence or acceptance context.

### Documents This Role Can Write

- Owner responses in the current session.
- Decision records or acceptance records, if the project workflow has the Owner edit documents directly.

### Statuses This Role Cannot Mark

The Owner can authorize `owner_accepted`, but should not be used as a substitute for `done` review decisions or engineering verification.

### Stop And Ask When

- Acceptance evidence is missing.
- The requested decision is actually an engineering review responsibility.
- The outcome would change project scope, long-term constraints, cost, provider choice, release behavior, or safety posture.

