---
document_role: "Batch authorization template"
template_status: "Generic template"
permission: "Owner controlled template"
---

# B-XX-YY: `<batch title>`

This template describes a bounded package of work. It does not override
`docs/meta/status_model.md`, `docs/meta/session_roles.md`, or
`docs/meta/agent_doc_permissions.md`.

## 1. Goal

`<Write the user-visible or project-visible goal of this batch.>`

## 2. Authority And Scope

- Controller owner: `<session or person>`
- Lanes involved: `<backend / frontend / other lanes>`
- Related stage or milestone: `<stage_id or n/a>`
- Related global summary: `TODO.md`
- Related lane boards:
  - `docs/lanes/<lane>/board.md`
- Related handoff packets:
  - `docs/lanes/<lane>/handoff.md`
- Related stage-scoped detail:
  - `docs/lanes/<lane>/stages/<stage-id>/`

## 3. Allowed Work

- `<Allowed implementation, documentation, verification, or review work.>`
- `<Allowed lane-local updates.>`
- `<Allowed evidence and worklog updates.>`

## 4. Forbidden Or Gated Work

- `<Scope changes requiring OwnerGate.>`
- `<Shared contract, schema, API, security, deployment, or cost-bearing changes requiring authorization.>`
- `<External services, credentials, destructive operations, or releases requiring explicit approval.>`

## 5. Verification And Evidence

- Agent Engineering Verification: `<commands, checks, or inspection steps>`
- Evidence location: `<docs/lanes/<lane>/stages/<stage-id>/evidence.md or equivalent>`
- Review evidence: `<docs/lanes/<lane>/stages/<stage-id>/review_log.md or equivalent>`
- Integration evidence: `<.diayn/sync_log.md / docs/shared/integration_issues.md / other>`

## 6. Status Boundary

- Worker sessions stop at `candidate_done`, `blocked`, or `owner_gate`.
- Review sessions decide `done` or `rejected`.
- Controller Integration Review may mark `ready_for_e2e` only with evidence.
- Owner Acceptance is required for `owner_accepted`.

## 7. Completion Checklist

- [ ] Lane board updated.
- [ ] Evidence recorded.
- [ ] Worklog updated when implementation or verification occurred.
- [ ] Handoff updated when a later session must continue.
- [ ] Review decision recorded for candidate work.
- [ ] Integration issues recorded when cross-lane problems exist.
- [ ] OwnerGate or Owner acceptance items recorded when needed.
