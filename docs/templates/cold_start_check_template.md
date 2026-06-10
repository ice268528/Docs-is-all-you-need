---
document_role: "Reusable cold-start check template"
template_note:
  - "This is a template, not active project state."
  - "Copy it into an authorized project, stage, batch, or handoff location before filling it."
---

# Cold Start Check Template

Use this template to answer the original five project-level cold-start questions.
Do not mix this with the DIAYN execution preflight. Cold start is for
understanding the project; execution preflight is for checking whether the
current session may act.

## 1. Five Cold-Start Questions

| Question | Answer | Evidence path |
| --- | --- | --- |
| What system is this? | `<short answer>` | `<README.md or docs/project/project_brief.md>` |
| How is it organized? | `<short answer>` | `<AGENTS.md, docs/project/file_index.md, docs/lanes/**, docs/shared/**>` |
| How do I run it? | `<short answer or Unknown>` | `<entry file or project docs>` |
| How do I verify it? | `<short answer or Unknown>` | `<install docs, evidence docs, acceptance docs>` |
| Where is the work now? | `<short answer>` | `<TODO.md, lane board, handoff, review log>` |

## 2. Missing Information

| Missing information | Impact | Blocks execution? | Where to record it |
| --- | --- | --- | --- |
| `<item>` | `<scope / run / verify / current work / other>` | `<yes/no>` | `<path>` |

## 3. Next Step

- Cold-start conclusion: `<ready / partial / blocked>`
- If ready, run the relevant DIAYN execution preflight before acting.
- If blocked, ask the Controller or Owner for the missing project fact.
