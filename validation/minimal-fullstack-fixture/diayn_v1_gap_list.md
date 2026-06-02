# DDDV8 Fixture Gap List

This fixture currently proves a small backend/frontend/shared application can run an end-to-end register/login flow. It does not yet prove the full DDDV8 DIAYN workflow.

Latest fixture run:

```text
python validation\minimal-fullstack-fixture\validation\run_e2e.py --output validation\minimal-fullstack-fixture\validation\phase1_e2e_result.json
```

Result: `pass`.

## Covered Today

- Backend process starts on a local ephemeral port.
- `/api/health` returns healthy JSON.
- Frontend HTML is served.
- Frontend HTML references register and login APIs.
- User registration succeeds.
- User login succeeds.
- Duplicate registration returns the expected error.
- Bad login returns the expected error.
- SQLite persistence is verified.

## Missing For DDDV8 Full-Flow Proof

| Required DDDV8 proof | Current state | Required fixture addition |
| --- | --- | --- |
| Installed `/diayn-*` command invocation | Missing | Run the fixture through installed DIAYN workflow skills, not just a Python E2E script. |
| `/diayn-init` from vague idea | Missing | Add a fixture prompt/seed idea and expected generated scaffold docs. |
| `/diayn-plan` stage and lane planning | Missing | Add expected stage, backend/frontend lane records, acceptance criteria, and `not_applicable` example if needed. |
| `/diayn-worktrees` | Missing | Add a test repository harness where backend/frontend worktrees can be created or dry-run blocked with evidence. |
| Backend lane task slice | Partial app exists, no DIAYN lane evidence | Add backend task board, worklog, handoff, and evidence expectations. |
| Frontend lane task slice | Partial app exists, no DIAYN lane evidence | Add frontend task board, worklog, handoff, and evidence expectations. |
| Review rejection loop | Missing | Add an intentional failing slice or review fixture that must be rejected before correction. |
| Reviewer same-worktree rule | Missing | Add fixture instructions proving worker stops before reviewer runs in the same lane worktree. |
| `/diayn-sync` doc/state only | Missing | Add expected sync records and verify no business-code merge occurs during sync. |
| `/diayn-integration` reviewed-code integration | Missing | Add reviewed lane integration scenario, conflict classification, smoke/build/lint/E2E evidence. |
| Shared contract ownership | Partial `shared/api_contract.md` exists | Add Controller-coordinated contract change and lane consistency check. |
| Owner acceptance | Missing | Add Owner-facing acceptance record and business-flow checklist. |
| Stage closeout | Missing | Add closeout record, accepted baseline fields, unresolved follow-ups, and evidence links. |
| Next-stage baseline refresh | Missing | Add a second-stage entry check proving Controller and lane worktrees align to accepted baseline. |
| DIAYN-managed third-party skill routing | Missing | Add validation that a workflow routes to a locked dependency skill through native/equivalent skill invocation. |
| Progressive disclosure | Missing | Add logs or assertions showing workflows load only command-relevant references. |

## Fixture Direction

The fixture should remain small. It should not become a second DIAYN implementation. Its job is to provide a controlled repository where the installed skill pack can prove:

```text
install -> /diayn-init -> /diayn-plan -> /diayn-worktrees
-> /diayn-backend and /diayn-frontend
-> /diayn-review-backend and /diayn-review-frontend
-> /diayn-sync -> /diayn-integration
-> Owner acceptance -> closeout -> next-stage baseline refresh
```

Any fixture expansion should preserve deterministic, local-first validation and avoid network, real credentials, production services, or paid external APIs.
