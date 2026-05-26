# Owner Acceptance Protocol

> Owner acceptance is about whether the business or user experience works. It is not a request for the Owner to inspect test code.

Use this with:

- `docs/meta/status_model.md`
- `docs/meta/session_roles.md`
- `docs/meta/agent_execution_workflows.md`
- `docs/meta/owner_decision_ux_protocol.md`
- `docs/templates/owner_experience_acceptance_template.md`
- `docs/templates/agent_report_html_explanation_template.html`

## 1. Core Distinction

Keep these two layers separate:

| Layer | Owner needs to understand? | Responsible party | Records |
| --- | --- | --- | --- |
| Agent Engineering Verification | No | Worker, reviewer, Controller Integration Review | Lane evidence, review logs, sync logs, verification summaries |
| Owner Experience Acceptance | Yes | Owner, with Controller or acceptance support | Owner experience acceptance record, decision record, formal project docs |

Engineering verification supports acceptance. It does not replace acceptance.

Owner acceptance supports `owner_accepted`. It does not replace engineering verification.

## 2. Agent Engineering Verification

Agent-facing verification can include:

- Unit tests.
- Integration tests.
- Automated E2E tests.
- Lint.
- Typecheck.
- Build.
- Database checks.
- API checks.
- Logs.
- Evidence artifacts.

These details belong in evidence, worklog, review log, sync log, or engineering verification summaries.

Do not require the Owner to understand:

- Test code.
- Mock setup.
- Coverage metrics.
- Internal test architecture.
- Framework-specific test mechanics.

## 3. Owner Experience Acceptance

Owner-facing acceptance should answer:

```text
From a user's point of view, can the intended thing be done reliably enough?
```

Write checks as user-observable actions and outcomes:

- The Owner opens `<entry point>`.
- The Owner performs `<user action>`.
- The Owner sees `<expected result>`.
- The system preserves `<important state>` after refresh, navigation, or return.
- The system shows a clear message for `<error or empty state>`.
- The system can provide simple evidence that `<record or side effect>` exists.

Generic example pattern:

```text
For an account-style workflow, acceptance might ask whether a user can create an account, sign in, see the expected landing state, and confirm that the system has a corresponding saved record.
```

This is an example pattern only. It must not become a required feature for every project.

## 4. Owner-Facing Evidence

Owner-facing evidence should be short and understandable:

- A screenshot.
- A short screen recording.
- A simple record summary.
- A visible admin or dashboard entry.
- A short API response summary.
- A plain-language verification note.

Do not ask the Owner to inspect raw test files or internal logs unless the Owner explicitly asks.

## 5. Acceptance Checklist Rule

Use `docs/templates/owner_experience_acceptance_template.md` for an active Owner acceptance checklist.

The checklist should include:

- What the Owner is trying to confirm.
- Preconditions written in user terms.
- Steps written as user actions.
- Expected visible results.
- Simple supporting evidence.
- Known limitations.
- Feedback choices.

## 6. Canonical Status Rules

- `done` means independent review accepted the work.
- `ready_for_e2e` means the Controller Integration Review believes the work is ready for Owner-level acceptance.
- `owner_accepted` means the Owner accepted the business or experience result.
- `owner_gate` means the Owner needs to decide before acceptance can proceed.
- `blocked` means acceptance cannot proceed because an issue, dependency, environment gap, or missing fact blocks progress.

Never mark `owner_accepted` based only on agent tests.

## 7. Owner Feedback And Follow-up Routing

Owner feedback is separate from canonical status.

- Owner decision `accept` can support recording `owner_accepted`.
- Owner decision `request_rework` means the Owner wants changes before acceptance. It is not a status.
- When the Owner chooses `request_rework`, keep or set the status to `blocked` if acceptance cannot proceed, or `owner_gate` if a decision or clarification is needed before rework can be routed.
- Follow-up for `request_rework` should route through `/diayn bug` for failed business acceptance, or through Controller-managed rework when the issue is already inside current scope.

Do not introduce another status vocabulary for Owner feedback.

## 8. Explaining Agent Reports

When the Owner wants help understanding a report, `/diayn html` may create a report explanation page using `docs/templates/agent_report_html_explanation_template.html`.

The explanation should translate engineering status into Owner language:

- Completed: what the Owner can expect to be different.
- Not completed: what remains outside the current result.
- Risk: what might affect use, schedule, scope, or acceptance.
- Feedback needed: what the Owner can choose or test next.
- Next command: what the Owner can run or paste back.

## 9. Feedback Format

Owner-facing acceptance should end with a copyable response format:

```text
Owner acceptance feedback
Decision: accept | request_rework | ask_question
Notes: <short Owner note>
Observed issue, if any: <what happened from the user point of view>
```

If the feedback is a failed business acceptance, the Controller should route it through `/diayn bug`.

If the feedback is a new requirement or direction change, the Controller should route it through `/diayn new`.

## 10. Boundaries

Do not:

- Ask the Owner to read test code.
- Ask the Owner to understand unit tests, integration tests, mocks, or coverage.
- Present raw engineering logs as the acceptance experience.
- Treat a passing test suite as Owner acceptance.
- Use concrete project business flows as required generic scaffold behavior.
