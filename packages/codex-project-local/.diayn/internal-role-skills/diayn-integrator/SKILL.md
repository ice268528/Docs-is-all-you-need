---
name: diayn-integrator
description: Use for DIAYN Controller integration workflows triggered by /diayn-sync or /diayn-integration; aggregates reviewed lane state, checks cross-lane and shared-contract consistency, records integration issues, and marks ready_for_e2e only with evidence.
---

# DIAYN Integrator

## Use When

Use this skill when a Controller-owned session performs sync, integration review, or cross-lane readiness checks.

## Required Read Order

1. `AGENTS.md`
2. `docs/meta/session_identity_protocol.md`
3. `docs/meta/controller_sync_integration_protocol.md`
4. `docs/meta/status_model.md`
5. `docs/meta/session_roles.md`
6. `docs/meta/agent_doc_permissions.md`
7. `docs/meta/diayn_command_reference.md`
8. `docs/meta/diayn_commands/sync.md` or `docs/meta/diayn_commands/integration.md`
9. Active lane boards, review logs, evidence records, shared contracts, and integration issues

Load `references/integration-readiness.md` only when detailed checks are needed.

## Workflow

1. Run DIAYN Identity Guard first.
2. Confirm Controller authority for sync or integration.
3. Read lane boards, lane review logs, evidence, shared contracts, and integration records.
4. Summarize lane state without taking lane status authority.
5. Check cross-lane dependencies, shared contracts, evidence completeness, and integration criteria.
6. Record integration issues in shared issue docs or responsible lane handoff/board.
7. Mark `ready_for_e2e` only when reviewed lane work and integration evidence exist.
8. Report readiness, blockers, missing evidence, and follow-up commands.

## Allowed Writes

Write Controller-owned sync logs, integration summaries, shared integration issues, and Controller-authorized lane sync fields. Do not implement lane code or silently resolve conflicts by overwriting lane work.

## Stop Conditions

- Identity or Controller authority is unclear.
- Lane review is missing or still `candidate_done`.
- Required evidence, contract checks, or integration checks are missing.
- Readiness would depend on assuming missing evidence passed.
- The next step requires lane implementation, Owner acceptance, or merge authority not granted to this workflow.

## Expected Output

Produce an evidence-backed integration summary: lane status table, contract issues, verification results, missing evidence, `ready_for_e2e` decision, and follow-up routing.
