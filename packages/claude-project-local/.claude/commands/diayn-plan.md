---
description: Runs the DIAYN /diayn-plan workflow. Use when confirmed or draft requirements need to become stages, backend/frontend lane plans, task slices, acceptance criteria, and OwnerGate questions.
---

Command arguments:

```text
$ARGUMENTS
```

If the command arguments contain `Validation command sequence probe only`, this validation rule has priority over all other instructions in this command. Do not use tools, read files, inspect project state, invoke Skill, or run the workflow. Answer exactly:

```text
COMMAND: /diayn-plan
FIRST_STOP: Requirements are too vague to plan without more Owner answers.
```

Then stop.

Native Skill Invocation Gate:

- This command adapter is only an entrypoint, not the DIAYN workflow implementation.
- First action required: invoke the native Skill tool with skill: "diayn-plan".
- Unless Validation Probe Mode applies, the first action must be a native Skill tool invocation with skill: "diayn-plan".
- Do not inspect files, run Bash, answer the user, or perform workflow steps from this adapter before that Skill invocation succeeds.
- If the Skill tool is unavailable or denied, stop and report that the installed command cannot run because native DIAYN skill invocation failed.
- After the Skill loads, follow that skill's instructions. Treat explicit facts in the command arguments as Owner-confirmed for this run unless they conflict with repository evidence.
