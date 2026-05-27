---
document_role: "Reusable Owner questions template"
template_note:
  - "This is a template, not active project state."
  - "Copy it into an authorized project, stage, batch, or decision location before filling it."
---

# Owner Questions Template

Owner questions should not disappear into chat history. Record the question,
the options, the Owner response, and the follow-up path in the repository.

Status fields must use the canonical status model. Owner response state is a
separate field and is not a task status.

## Q-001 <Question Title>

| Field | Value |
| --- | --- |
| Status | `<owner_gate / blocked / archived>` |
| Owner response state | `<open / answered / superseded>` |
| Related stage | `<stage_id or n/a>` |
| Related batch | `<batch_id or n/a>` |
| Related task | `<task_id or n/a>` |
| Related lane | `<lane or n/a>` |
| Impact area | `<scope / lane / shared contract / UX / acceptance / other>` |

## Context

`<brief context>`

## Why Owner Decision Is Needed

`<one or two sentences>`

## Options

- A (recommended): `<short concrete option and tradeoff>`
- B: `<short concrete option and tradeoff>`
- C: `<optional short concrete option and tradeoff>`

## Owner Response Record

- Decision: `<A / B / C / ask_question / request_rework / n/a>`
- Notes: `<Owner's concise reply>`
- Recorded by: `<session>`
- Recorded at: `<timestamp>`

## Follow-Up

| Follow-up item | Owner | Follow-up status | Target document |
| --- | --- | --- | --- |
| `<item>` | `<Controller / lane / Owner>` | `<todo / blocked / owner_gate / archived>` | `<path>` |
