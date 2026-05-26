---
document_role: "Testing and acceptance strategy"
primary_writer: "Owner or Controller with authorization"
audience:
  - "Controller Session"
  - "Worker Session"
  - "Review Session"
  - "Owner"
permission: "Owner controlled"
---

# Test Strategy

This document defines the verification and acceptance layers used by the DIAYN
multi-session workflow.

## 1. Verification Layers

| Layer | Purpose | Typical owner | Status impact |
| --- | --- | --- | --- |
| Agent Engineering Verification | Check the worker's own changes with tests, builds, lint, typecheck, inspection, or documented manual observation. | Worker Session | Supports `candidate_done`. |
| Review Evidence | Independently check diff, evidence, scope, and acceptance criteria. | Review Session | Supports `done` or `rejected`. |
| Controller Integration Review | Check reviewed lanes together, including shared contracts and end-to-end readiness. | Controller Session | Supports `ready_for_e2e`. |
| Owner Experience Acceptance | Confirm the business or user-facing result from the Owner's point of view. | Owner, recorded by Controller or authorized session | Supports `owner_accepted`. |

## 2. Worker Verification

Workers should verify the task slice they actually changed. Appropriate checks
may include:

- unit or integration tests;
- lint, typecheck, build, or static checks;
- local smoke checks;
- schema or contract validation;
- focused manual observation when automated checks are not available.

Workers record factual evidence in the lane evidence or worklog file. Worker
verification does not by itself create `done`, `ready_for_e2e`, or
`owner_accepted`.

## 3. Review Evidence

Review sessions inspect:

- the worker's latest report;
- the relevant diff;
- evidence and worklog entries;
- acceptance criteria;
- permission boundaries;
- whether the work stayed inside the lane.

Review sessions decide `done` or `rejected`. They do not mark
`owner_accepted`.

## 4. Controller Integration Review

The Controller checks reviewed lane work together. This may include:

- cross-lane contract consistency;
- build, smoke, or end-to-end evidence when defined;
- shared issue status;
- lane board and review log consistency;
- missing evidence or unresolved blockers.

Only the Controller Integration Review may move integrated reviewed work toward
`ready_for_e2e`. Missing evidence is not a pass.

## 5. Owner Experience Acceptance

Owner acceptance is business-facing. The Owner should be asked whether the
intended user-visible outcome works, not whether internal tests were written in
a particular way.

Use `docs/templates/owner_experience_acceptance_template.md` for Owner-facing
acceptance records. Do not require the Owner to understand unit tests, mocks,
coverage, or implementation internals.

## 6. Reporting Minimums

Every report that claims progress should state:

- what changed;
- what was verified;
- where evidence is recorded;
- what was not verified and why;
- current status using the canonical status model;
- what review, integration, or Owner action is needed next.
