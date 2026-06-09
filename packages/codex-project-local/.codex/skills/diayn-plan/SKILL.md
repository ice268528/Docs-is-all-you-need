---
name: diayn-plan
description: Runs the DIAYN /diayn-plan workflow. Use when confirmed or draft requirements need to become stages, backend/frontend lane plans, task slices, acceptance criteria, and OwnerGate questions.
---

# DIAYN Plan

## Use When

Use this skill when the user invokes `/diayn-plan` or asks DIAYN to turn requirements into an executable multi-session plan.

## Command Arguments

```text
$ARGUMENTS
```

## Owner-Confirmed Command Facts

Treat explicit facts in the current command arguments or current user message as Owner-confirmed for this run unless they conflict with existing project evidence. For example, if project identity, stage id, lane applicability, language, or approval boundaries are stated in the command, use those values directly and record them in the generated docs instead of asking the same question again.

The literal phrase `Owner-confirmed project_slug = <value>` is a direct Owner answer. Use `<value>` as the project slug and do not ask for it again unless repository evidence contradicts it.

If command arguments explicitly resolve existing OwnerGate items, update the relevant planning documents and continue instead of stopping on stale open questions. Do not ask again for OwnerGate facts that the current command arguments answer directly unless repository evidence contradicts them.

If the command arguments say scaffold creation is approved, or say all OwnerGate choices needed for the automated fixture are approved, and the audit reports only missing DIAYN baseline files with no overwrite conflicts, create the missing baseline scaffold files in the same run instead of asking for another confirmation.

Ask only when the fact is absent, ambiguous, contradicted by repository evidence, or would cause existing user content to be overwritten without a preservation decision.

## Phase 11 Installed-Flow Fixture Mode

If command arguments contain `DIAYN_PHASE11_INSTALLED_FLOW_FIXTURE`, this is an automated validation fixture, not a normal ambiguous Owner conversation. Use explicit Owner-confirmed command facts as final for this run, resolve matching existing OwnerGate entries, and continue planning. Do not create open OwnerGate items for project slug, Owner name, stage goal, requirement source, fixture scope, or backend/frontend lane applicability when those facts are present in the command arguments.

In this mode, write only planning and shared-context artifacts, not business code. Use the requested stage id when it is explicit; if the workflow chooses a project-specific stage id, use it consistently in `TODO.md`, stage plans, lane boards, and handoffs. Create the canonical artifact types requested by the command arguments, initialize lane task statuses as `todo`, and do not mark lane work as `candidate_done`, `done`, or reviewed during planning.

This fixture marker means run the installed-flow workflow with tools and writes. It must not be answered with a probe-only `COMMAND` / `FIRST_STOP` response.

## Validation Probe Mode

If the command arguments above or current user message contain `Validation command sequence probe only`, Validation Probe Mode has priority over Progressive Startup, Identity Guard, helper scripts, project inspection, dependency-skill routing, and all normal workflow steps.

In this mode, do not use tools, read files, inspect project state, invoke helper scripts, invoke dependency skills, or write files. Answer exactly:

```text
COMMAND: /diayn-plan
FIRST_STOP: Requirements are too vague to plan without more Owner answers.
```

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Progressive Startup

1. Confirm the requested command is `/diayn-plan`.
2. Run the Identity Guard contract for a Controller workflow.
3. Read `AGENTS.md`, `TODO.md`, current project brief, and only the requirement/stage docs needed for planning.
4. Read `docs/meta/diayn_command_reference.md` and `docs/meta/diayn_commands/plan.md` when available.
5. Route to DIAYN-managed planning/specification dependency skills only when the plan needs that guidance.
   When routing is needed, read the installed routing map from `.diayn/dependency-routing/upstream-routing-map.md` if present; otherwise use `internal-role-skills/diayn-skill-router/references/upstream-routing-map.md` in the active DIAYN package. Resolve the platform-visible skill id before native Skill invocation.

## Workflow

1. Confirm the active requirement source and whether open `OwnerGate` questions block planning. Treat current command arguments as a valid OwnerGate resolution source before deciding that planning is blocked.
2. Split work into stages with clear Owner-facing outcomes.
3. Decide applicable lanes. Default to `backend` and `frontend`; record `not_applicable` when a lane is absent.
4. Create task slices small enough for one worker session to complete and hand off.
5. Define acceptance criteria and review evidence for each slice.
6. Record shared contract expectations under Controller-owned shared docs.
7. Use `assets/plan/` as structural templates for stage plans, lane boards, handoffs, and shared contract placeholders.
8. Prefer canonical planning paths unless the target project already has stronger local conventions: `docs/stages/<stage_id>/stage_plan.md`, `docs/lanes/backend/board.md`, `docs/lanes/backend/handoff.md`, `docs/lanes/frontend/board.md`, `docs/lanes/frontend/handoff.md`, and `docs/shared/<contract>.md`.
9. Keep the plan document-driven; do not start implementation.

## Allowed Writes

May write or update `TODO.md`, stage docs, lane boards, lane handoffs, OwnerGate records, shared contract notes, and Controller planning summaries.

When the plan establishes or updates an active stage, also keep the lane root indexes current and place detailed lane records under `docs/lanes/<lane>/stages/<stage-id>/`.

Do not edit lane implementation code or mark work as complete.

## Bundled Resources

- `assets/plan/stage_plan.md`: Controller-owned stage planning structure.
- `assets/plan/lane_board.md`: lane task-slice board with limited internal statuses and Owner-facing checkbox separation.
- `assets/plan/lane_handoff.md`: handoff structure for a single backend/frontend task slice.
- `assets/plan/shared_contract_placeholder.md`: Controller-owned shared contract placeholder for API/schema/event/interface work.

Use these templates progressively. Generate only the stage, lane, and shared artifacts that the target project analysis justifies; record `not_applicable` lanes instead of creating fake work.

## Stop Conditions

- Requirements are too vague to plan without more Owner answers.
- A lane, contract, or acceptance criterion is disputed.
- Planning would silently discard a previously accepted requirement.

## Output

Report planned stages, applicable lanes, `not_applicable` lanes, task slices, acceptance criteria, OwnerGate items, and the next command, usually `/diayn-worktrees`.
