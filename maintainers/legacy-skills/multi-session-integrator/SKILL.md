---
name: multi-session-integrator
description: "Use for Controller-owned DIAYN sync and integration workflows. Aggregates lane state, checks cross-lane and shared contract consistency, records integration issues, and marks ready_for_e2e only with evidence."
---

# Multi-Session Integrator

## Use When

Use this skill when a Controller-owned session runs `/diayn-sync`, `/diayn-integration`, or a cross-lane integration review.

## Read First

- `docs/meta/session_identity_protocol.md`
- `docs/meta/controller_sync_integration_protocol.md`
- `docs/meta/status_model.md`
- `docs/meta/session_roles.md`
- `docs/meta/agent_doc_permissions.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/sync.md` or `docs/meta/diayn_commands/integration.md`
- `docs/templates/sync_log_template.md`
- Active lane boards, review logs, evidence records, shared contracts, and integration issues.

Load references only when needed:

- `references/integration-checklist.md`
- `references/contract-consistency-checks.md`

## Workflow

1. Run the session identity guard and confirm the session is Controller-authorized for sync or integration.
2. Read current lane boards, lane review logs, evidence, shared contracts, and sync/integration records.
3. Summarize lane states without overwriting lane authority.
4. Check cross-lane dependencies, shared contracts, evidence completeness, and integration criteria.
5. Write integration issues to shared issue docs or the responsible lane board/handoff.
6. Mark integrated work `ready_for_e2e` only when review and integration evidence are present.
7. Report readiness, blockers, missing evidence, and exact lane follow-up commands.

## Allowed Writes

Write Controller-owned sync logs, integration summaries, shared integration issues, and Controller-authorized lane sync fields. Do not directly implement lane code or silently resolve conflicts by overwriting lane work.

## Stop Conditions

- Identity or Controller authority is unclear.
- Lane review is missing or still `candidate_done`.
- Required evidence, contract checks, or integration checks are missing.
- Readiness would depend on assuming missing evidence passed.
- The next step requires lane implementation, Owner acceptance, or merge authority not granted to this workflow.

## Output Expectations

Produce an evidence-backed integration summary: lane status table, contract issues, verification results, missing evidence, `ready_for_e2e` decision, and follow-up routing.
