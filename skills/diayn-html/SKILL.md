---
name: diayn-html
description: Runs the DIAYN /diayn-html workflow. Use when the Owner asks for a readable HTML decision aid, comparison, report, or acceptance summary while Markdown remains the durable authority.
user-invocable: false
---

# DIAYN HTML

## Use When

Use this skill when the user invokes `/diayn-html` or asks for an Owner-facing HTML aid for a complex decision, report, comparison, or acceptance summary.

## Command Arguments

```text
$ARGUMENTS
```

## Owner-Confirmed Command Facts

Treat explicit facts in the current command arguments or current user message as Owner-confirmed for this run unless they conflict with existing project evidence. For example, if project identity, stage id, lane applicability, language, or approval boundaries are stated in the command, use those values directly and record them in the generated docs instead of asking the same question again.

The literal phrase `Owner-confirmed project_slug = <value>` is a direct Owner answer. Use `<value>` as the project slug and do not ask for it again unless repository evidence contradicts it.

If the command arguments say scaffold creation is approved, or explicitly resolve all OwnerGate choices needed for this run, and the audit reports only missing DIAYN baseline files with no overwrite conflicts, create the missing baseline scaffold files in the same run instead of asking for another confirmation.

Ask only when the fact is absent, ambiguous, contradicted by repository evidence, or would cause existing user content to be overwritten without a preservation decision.

## Validation Probe Mode

If the command arguments above or current user message contain `Validation command sequence probe only`, Validation Probe Mode has priority over Progressive Startup, Identity Guard, helper scripts, project inspection, dependency-skill routing, and all normal workflow steps.

In this mode, do not use tools, read files, inspect project state, invoke helper scripts, invoke dependency skills, or write files. Answer exactly:

```text
COMMAND: /diayn-html
FIRST_STOP: The request is really for a durable requirement change and no Markdown record exists.
```

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Explicit Owner-Confirmed Execution Mode

If the command arguments or current user message include explicit Owner-confirmed project facts, use them when they match repository evidence and do not ask for already supplied project identity, stage, lane, integration, or acceptance facts.

In this mode, run from the Controller root after `/diayn-integration`. If the command states that the Owner accepts the current stage, read the integration summary and write the durable Markdown acceptance record at `docs/stages/<stage-id>/owner_acceptance_record.md`. The record must include the sentence: `This Markdown record is authoritative; any HTML is only a readable aid.` Optionally write `docs/stages/<stage-id>/owner_acceptance_summary.html` as a readable aid. Do not change implementation code, rewrite requirements, close the stage, delete worktrees, or start the next stage.

## Progressive Startup

1. Confirm the requested command is `/diayn-html`.
2. Run the Identity Guard contract for Owner UX or Controller report support.
3. Read only the source report, decision docs, acceptance criteria, or evidence needed for the requested HTML.
4. Read `docs/meta/diayn_command_reference.md` and `docs/meta/diayn_commands/html.md` when available.
5. Use `scripts/diayn_html_generator.py` only when a deterministic local decision aid or report explanation fits the requested output.
6. Use `scripts/cleanup_plan.py` only when the Owner asks for a scaffold cleanup/uninstall deletion plan. It is dry-run only.
7. Use `assets/owner/` when the target project needs a Markdown decision record, business-facing acceptance record, or cleanup plan.

## Workflow

1. Identify the Owner-facing question or report purpose.
2. Select the minimum source documents needed.
3. Generate an HTML aid that helps the Owner understand choices or acceptance status.
4. Keep final decisions in Markdown; HTML is not durable authority.
5. Avoid exposing secrets, private logs, raw prompts, or unnecessary implementation internals.
6. Keep cleanup/uninstall separate from report generation: list proposed deletions, worktrees, branches, logs, and evidence first; delete nothing automatically.

## Allowed Writes

May write HTML report files, HTML generation notes, and pointers from Controller/Owner decision records to the generated aid.

Do not treat HTML as the canonical decision record, and do not update implementation status without the corresponding Markdown record.

## Bundled Resources

- `scripts/diayn_html_generator.py`: deterministic Owner-facing decision/report HTML generator from explicit structured input.
- `scripts/cleanup_plan.py`: dry-run scaffold cleanup/delete-plan helper with no delete mode.
- `assets/owner/owner_decision_record.md`: durable Markdown decision record template.
- `assets/owner/owner_acceptance_record.md`: business-facing Owner acceptance template.
- `assets/owner/cleanup_delete_plan.md`: separate authorized cleanup plan template.

Example HTML generation:

```bash
python skills/diayn-html/scripts/diayn_html_generator.py --mode decision --data <decision.json> --output <decision.html>
```

Example cleanup dry run:

```bash
python skills/diayn-html/scripts/cleanup_plan.py --project-root <target-project> --output <cleanup-plan.json>
```

## Stop Conditions

- The request is really for a durable requirement change and no Markdown record exists.
- Source material contains secrets or private data that should not be copied into HTML.
- The Owner-facing question is unclear.

## Output

Report the HTML file produced, source documents used, privacy exclusions, any Markdown records updated, and the decision or acceptance action still needed.
