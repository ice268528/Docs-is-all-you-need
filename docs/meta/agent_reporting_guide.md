# Agent Reporting Guide

This guide defines how DIAYN sessions report progress, evidence, stopping
points, and next actions without confusing worker verification, review,
integration, and Owner acceptance.

## 1. Status Language

Use the canonical status model from `docs/meta/status_model.md`.

| Situation | Correct status language |
| --- | --- |
| Worker finished its slice and recorded evidence | `candidate_done` |
| Review approved candidate work | `done` |
| Review found required rework | `rejected` |
| Controller found reviewed work ready for Owner-level checks | `ready_for_e2e` |
| Owner approved the business or experience result | `owner_accepted` |
| Missing dependency, permission, fact, or environment blocks progress | `blocked` |
| Human decision is needed | `owner_gate` |

Workers must not report lane work as `done`. Reviewers must not mark
`owner_accepted`. Controller sync must not convert missing evidence into a pass.

## 2. Evidence Before Claims

Do not say a task is complete unless the report states:

- what changed;
- what verification was performed;
- where evidence is recorded;
- what was not verified and why;
- what status is being claimed;
- what review, integration, or Owner action is needed next.

If verification could not run, say so directly and record the limitation.

## 3. Document Updates

Use the document permission model in `docs/meta/agent_doc_permissions.md`.

- Controller updates `TODO.md` as the global summary.
- Worker sessions update same-lane board, evidence, worklog, and handoff notes.
- Review sessions update same-lane review logs and review status.
- Controller Integration Review records cross-lane issues and readiness.
- Owner acceptance is recorded through Owner-facing acceptance or decision docs.

## 4. Stop Conditions

Stop and report instead of continuing when:

- the next step would change scope, acceptance criteria, architecture, shared
  contracts, provider choices, cost, security posture, or deployment behavior;
- required documents are not visible to the responsible session;
- evidence is missing for a status claim;
- a worker would need to mark `done`;
- a reviewer would need to implement fixes by default;
- Owner judgement is required.

## 5. Report Template

```markdown
# Task Report: <short title>

## 1. Role And Scope

- Session role: <Controller / Worker / Review / Integration / Owner support>
- Lane: <lane or n/a>
- Authorized task: <task id or summary>

## 2. Changes

| Type | Summary | Files or docs |
| --- | --- | --- |
| <code/docs/test/review> | <what changed> | <paths> |

## 3. Verification And Evidence

| Check | Result | Evidence |
| --- | --- | --- |
| <test/build/review/inspection> | <pass/fail/not run> | <path or reason> |

## 4. Status Claim

- Claimed status: <candidate_done / done / rejected / ready_for_e2e / owner_gate / blocked / owner_accepted>
- Authority for this claim: <worker / reviewer / Controller Integration Review / Owner>

## 5. Next Action

<one clear next action or command>
```

## 6. Clean State Checklist

- [ ] Verification run or limitation recorded.
- [ ] Evidence path recorded.
- [ ] Correct lane or Controller document updated.
- [ ] No unauthorized global TODO update by a worker.
- [ ] No review status claimed by a worker.
- [ ] No Owner acceptance claimed without Owner confirmation.
