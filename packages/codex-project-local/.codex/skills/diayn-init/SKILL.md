---
name: diayn-init
description: Runs the DIAYN /diayn-init workflow. Use when the Owner has a vague idea, draft requirement, or existing project that needs DIAYN harness initialization, requirement clarification, scaffold audit, or dry-run retrofit planning.
---

# DIAYN Init

## Use When

Use this skill when the user invokes `/diayn-init` or asks DIAYN to initialize a project from an idea, draft requirements, or an existing repository.

## Command Arguments

```text
$ARGUMENTS
```

## Owner-Confirmed Command Facts

Treat explicit facts in the current command arguments or current user message as Owner-confirmed for this run unless they conflict with existing project evidence. For example, if project identity, stage id, lane applicability, language, or approval boundaries are stated in the command, use those values directly and record them in the generated docs instead of asking the same question again.

The literal phrase `Owner-confirmed project_slug = <value>` is a direct Owner answer. Use `<value>` as the project slug and do not ask for it again unless repository evidence contradicts it.

If command arguments explicitly resolve a known OwnerGate item, such as Owner name, stage goal, lane applicability, requirement source, or fixture scope, update the generated project documents with that resolution and do not recreate the same OwnerGate as open. If the arguments say all OwnerGate choices needed for an automated fixture are approved and list the resolved facts, treat matching scaffold identity and scope questions as resolved for that run.

If the command arguments say scaffold creation is approved, or say all OwnerGate choices needed for the automated fixture are approved, and the audit reports only missing DIAYN baseline files with no overwrite conflicts, create the missing baseline scaffold files in the same run instead of asking for another confirmation.

Ask only when the fact is absent, ambiguous, contradicted by repository evidence, or would cause existing user content to be overwritten without a preservation decision.

## Phase 11 Installed-Flow Fixture Mode

If command arguments contain `DIAYN_PHASE11_INSTALLED_FLOW_FIXTURE`, this is an automated validation fixture, not a normal ambiguous Owner conversation. Use explicit Owner-confirmed command facts as final for this run. Do not create open OwnerGate items for project slug, Owner name, stage goal, requirement source, fixture scope, or backend/frontend lane applicability when those facts are present in the command arguments. It is acceptable to record an OwnerGate table with `none` or `resolved` entries, but the next command must not be blocked by questions already answered in the arguments.

This fixture marker means run the installed-flow workflow with tools and writes. It must not be answered with a probe-only `COMMAND` / `FIRST_STOP` response.

## Validation Probe Mode

If the command arguments above or current user message contain `Validation command sequence probe only`, Validation Probe Mode has priority over Progressive Startup, Identity Guard, helper scripts, project inspection, dependency-skill routing, and all normal workflow steps.

In this mode, do not use tools, read files, inspect project state, invoke helper scripts, invoke dependency skills, or write files. Answer exactly:

```text
COMMAND: /diayn-init
FIRST_STOP: Existing content conflicts with DIAYN scaffold changes and no preservation decision exists.
```

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Progressive Startup

1. Confirm the requested command maps to DIAYN Init: `/diayn-init` for project-local/Codex-style surfaces or `/diayn:init` for the Claude Code plugin surface.
2. Resolve the explicit adapter platform before scaffold generation. Claude Code plugin and Claude Code project-local adapters use `platform = claude-code` and `entry_file = CLAUDE.md`; Codex uses `platform = codex` and `entry_file = AGENTS.md`; OpenCode uses `platform = opencode` and `entry_file = AGENTS.md`; generic adapters use `platform = generic` and `entry_file = AGENTS.md`.
3. Apply the Identity Guard contract lightly: current path, project identity, existing `.diayn/` files, and whether this is a Controller workflow.
4. Read only the platform entry docs needed to answer the cold-start questions. Do not load both `CLAUDE.md` and `AGENTS.md` by default; inspect the peer entry file only when it already exists and matters to a conflict or cross-platform boundary.
5. Read the active command reference only if present in the target project: `docs/meta/diayn_command_reference.md` and `docs/meta/diayn_commands/init.md`.
6. Run or inspect `scripts/harness_audit.py` when the current task needs repository/scaffold preflight, dry-run migration, conflict reporting, language inference, Git/dirty-state evidence, or platform entry-file evidence.
7. Use `assets/scaffold/` only as target-project templates after the Owner approves scaffold creation or preservation decisions.
8. Load third-party dependency skills only through the DIAYN Skill Router when the current task needs requirement interview, idea refinement, specification, documentation, or migration guidance.
   When routing is needed before a target-project map exists, read the bundled scaffold map at `assets/scaffold/.diayn/dependency-routing/upstream-routing-map.md`. After scaffold creation, prefer the target-project map at `.diayn/dependency-routing/upstream-routing-map.md`. Resolve the platform-visible skill id before native Skill invocation.

## Workflow

1. Resolve `project_slug` from Owner-confirmed command arguments, the current user message, existing DIAYN project docs, README/project evidence, or a conservative draft derived from the repository name. Do not silently treat the folder name as final truth: if the slug is inferred, record it as draft and keep an OwnerGate note, but do not block scaffold creation only because the final slug is not confirmed.
2. Inspect the provided idea, requirement docs, and current repository structure.
3. If requirements are vague, interview the Owner one question at a time until the next draft is useful.
4. Mark unresolved facts as `Unknown` or `OwnerGate`; do not mark facts as unresolved when they were explicitly answered by the current command arguments.
5. Audit whether the project already follows the DIAYN harness structure.
6. If files may be overwritten or changed, produce a conflict/retrofit report first and ask what must be preserved.
7. Use the audit output and `assets/scaffold/docs/project/harness_audit_report.md` to summarize the selected platform, selected entry file, why the other entry file was not generated by default, missing files, conflicts, generated-content boundaries, nested repositories, submodules, possible secret files without values, document language, and OwnerGate items.
8. After Owner approval, or when command arguments already approve creating missing baseline scaffold files and the audit reports no overwrite conflicts, create or update the minimal baseline docs the project actually needs from `assets/scaffold/`: the selected platform entry file (`CLAUDE.md` for Claude Code; `AGENTS.md` for Codex/OpenCode/generic), `TODO.md`, `.diayn/worktree_manifest.md`, `.diayn/scaffold_version.md`, `.diayn/network_policy.md`, `.diayn/dependency-routing/upstream-routing-map.md`, `docs/project/project_brief.md`, and optional Owner question/audit documents.
9. Do not default-generate both entry files. If the peer entry file already exists, preserve it and record it as an existing peer entry file in the harness audit instead of updating it.
10. Keep generated project docs in the target project's existing documentation language when clear; otherwise follow the Owner conversation language and record `Unknown` when not clear.

## Allowed Writes

May write Controller-owned scaffold and planning files such as the selected platform entry file (`CLAUDE.md` or `AGENTS.md`), `TODO.md`, `.diayn/worktree_manifest.md`, `.diayn/scaffold_version.md`, `.diayn/dependency-routing/upstream-routing-map.md`, `docs/project/project_brief.md`, Owner questions, conflict reports, and scaffold audit outputs.

Do not implement business code, create worktrees, merge code, or overwrite user content without Owner approval.

## Bundled Resources

- `scripts/harness_audit.py`: dry-run audit helper. It writes no target project files unless `--output` is explicitly supplied. Prefer JSON output for deterministic validation.
- `assets/scaffold/`: minimal target-project scaffold templates. These are not DIAYN manuals; adapt them to the target project's facts and preserve existing content.

Example dry run:

```bash
python skills/diayn-init/scripts/harness_audit.py --project-root <target-project> --platform <claude-code/codex/opencode/generic> --output <target-project>/docs/project/harness_audit_report.json
```

## Stop Conditions

- Existing content conflicts with DIAYN scaffold changes and no preservation decision exists.
- The current environment is not a Git repository and the next step assumes Git.
- The next action would silently change requirements instead of advising the Owner.

## Output

Report the command, confirmed project identity, documents inspected, questions asked, files changed or proposed, unresolved `Unknown`/`OwnerGate` items, and the next command, usually `/diayn-plan`.
