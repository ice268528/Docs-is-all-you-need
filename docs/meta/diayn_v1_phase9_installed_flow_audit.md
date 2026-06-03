# DDDV8 Phase 9 Installed Flow Audit

This file records the current installed-flow release-gate audit. It now
includes the Claude project-local installed-flow completion record, the Codex
package/install validation boundary, and the Phase 12 focused side-scenario
gate. The filename still says `phase9` because this artifact was created
before the DDDV8 Section 12 implementation order was refined into Phase 0
through Phase 12.

## 1. Release Gate Result

The current release gate is complete for the validated surfaces: Claude
project-local installed flow and Codex package/install. Codex Desktop
app-session runtime discovery/invocation requires separate runtime evidence
and is not claimed.

The package has strong static evidence from Phases 2-8, and Claude Code now has a project-local package shape that satisfies three important smoke checks:

- bare `/diayn-init` can trigger the native `Skill` tool for `diayn-init`;
- a DIAYN-managed dependency skill, `idea-refine`, can be loaded through the native `Skill` tool from the project-local package.
- an active `/diayn-init` probe can route to and load `idea-refine` through the native `Skill` tool when the task is a vague idea requiring idea refinement.

The current release gate still keeps these boundaries explicit:

- Codex package/install validation proves package shape, install commands, and
  installed directory inspection only. It does not claim Codex Desktop
  app-session direct `/diayn-*` invocation or native dependency-skill
  invocation.
- Claude plugin-dir loading is namespaced; bare `/diayn-*` is handled by the separate project-local package.
- The Claude project-local 12-command sequence runner proves all 12 bare commands and workflow skills are visible and that every bare `/diayn-*` command enters workflow context. Validation short-circuit arguments are not reliable proof in this path, so the audit records that limit separately.
- The clean Claude project-local installed package has run all 12 public commands, `/diayn-init -> /diayn-plan -> /diayn-worktrees -> /diayn-backend -> /diayn-frontend -> /diayn-review-backend -> /diayn-review-frontend -> /diayn-sync -> /diayn-integration -> /diayn-html -> /diayn-bug -> /diayn-new`, with `workflow_errors: []`, proving native workflow entry, scaffold creation, stage/lane/shared planning artifacts, authorized worktrees, backend/frontend lane execution, same-worktree review, document-only sync, integration evidence, durable Markdown Owner acceptance, no-active-bug side-scenario triage, closeout, and next-stage baseline refresh.
- The Phase 12 side-scenario gate now separately validates non-Git handling, existing-project conflict reports, dirty preflight, `not_applicable` lanes, interrupted-command recovery, scaffold migration dry-run, mismatched pre-existing `agent-skills`, privacy/network defaults, cleanup boundaries, `/diayn-bug`, and `/diayn-new` or next-stage refresh coverage.

## 2. Claude Code Plugin-Dir Probe

Claude Code local version probe:

```text
claude --version
```

Result:

```text
2.1.150 (Claude Code)
```

Plugin validation:

```text
claude plugin validate plugins\docs-is-all-you-need
```

Result: validation passed.

Plugin-dir runtime probe:

```text
claude --plugin-dir plugins\docs-is-all-you-need ...
/docs-is-all-you-need:diayn-init
```

Observed in Claude's stream-json init payload:

- 12 `docs-is-all-you-need:diayn-*` slash commands were loaded.
- 12 `docs-is-all-you-need:diayn-*` skills were loaded.
- `/docs-is-all-you-need:diayn-init` triggered the native `Skill` tool with `skill: "docs-is-all-you-need:diayn-init"`.

Bare command probe against plugin-dir loading:

```text
claude --bare --plugin-dir plugins\docs-is-all-you-need ...
/diayn-init
```

Result:

```text
Unknown command: /diayn-init
```

Conclusion: the Claude plugin artifact proves namespaced native plugin command and skill loading. It does not satisfy the DDDV8 bare `/diayn-*` user-facing requirement by itself.

## 3. Claude Project-Local Package Probe

Claude project-local package:

```text
packages/claude-project-local/
```

Package shape:

```text
.claude/commands/diayn-*.md
.claude/skills/diayn-*/
.claude/skills/<agent-skills-name>/
.diayn/dependency-routing/upstream-routing-map.md
.diayn/internal-role-skills/
.diayn/dependency-skills-manifest.json
```

Package validation:

```text
node maintainers\scripts\validate_diayn_claude_project_local_package.js --json validation\phase9_claude_project_local_package.json
```

Result:

```text
ok: true
command_count: 12
workflow_skill_count: 12
dependency_skill_count: 23
total_project_local_skill_count: 35
```

Bare command runtime probe from `packages/claude-project-local`:

```text
claude --allowedTools Skill ... /diayn-init
```

Observed:

- 12 bare `diayn-*` slash commands were loaded.
- 35 project-local skills were loaded.
- The native `Skill` tool was invoked with `skill: "diayn-init"`.
- The tool result reported `success: true` and `commandName: "diayn-init"`.

Dependency-skill runtime probe from `packages/claude-project-local`:

```text
claude --allowedTools Skill ... idea-refine
```

Observed:

- The native `Skill` tool was invoked with `skill: "idea-refine"`.
- The tool result reported `success: true` and `commandName: "idea-refine"`.

Routed dependency runtime probe from `packages/claude-project-local`:

```text
claude --allowedTools Skill ... /diayn-init ... route to idea-refine
```

Observed:

- The native `Skill` tool was first invoked with `skill: "diayn-init"`.
- The active DIAYN init workflow treated the task as a vague idea requiring idea refinement.
- The native `Skill` tool was then invoked with `skill: "idea-refine"`.
- The final stop condition was: `The Owner has not confirmed project_slug.`

Conclusion: Claude Code CLI has a validated project-local package path for bare `/diayn-*` command-to-skill invocation, platform-visible DIAYN-managed dependency skills, and a routed `/diayn-init -> idea-refine` dependency-skill smoke probe. The installed workflow is now complete for the Claude project-local package; this still does not prove Codex Desktop support or exhaustive routed use of every vendored dependency skill.

12-command sequence runner:

```text
node maintainers\scripts\run_claude_project_local_command_sequence.js --json validation\phase9_claude_project_local_command_sequence.json --command-budget 0.12 --max-turns 3 --allowed-tools Skill,Read
```

Observed:

- all 12 bare `diayn-*` commands were visible in Claude init payloads;
- all 12 workflow skills were visible in Claude init payloads;
- all 12 bare `/diayn-*` commands entered workflow context;
- both entry modes appeared: direct command/skill context and explicit `Skill` tool invocation;
- the validation short-circuit identity probe did not complete for every command because some commands entered normal workflow startup before producing the requested identity line.

Conclusion: command discovery and workflow entry are proven for the full 12-command surface. This is not enough by itself for alpha claims; the clean installed-flow fixture and focused side-scenario gate are the stronger release-gate evidence.

Installed-flow fixture attempt:

```text
node maintainers\scripts\run_claude_installed_flow_fixture.js --json validation\phase11_installed_flow_fixture.json --run-claude --commands diayn-init,diayn-plan,diayn-worktrees,diayn-backend,diayn-frontend,diayn-review-backend,diayn-review-frontend,diayn-sync,diayn-integration,diayn-html,diayn-bug,diayn-new --command-budget 1.75 --max-turns 30
```

Observed:

- the runner installs the Claude project-local package into a clean controlled fixture outside the development repository;
- 12 bare commands, 12 workflow skills, 35 total project-local skills, and the DIAYN-managed `idea-refine` dependency are present;
- the fixture starts from a clean git baseline and the local E2E preflight passes;
- the runner resolves `claude.exe` directly on Windows instead of going through the shell shim, avoiding shell command-length failures for longer installed-flow prompts;
- `/diayn-init`, `/diayn-plan`, `/diayn-worktrees`, `/diayn-backend`, and `/diayn-frontend` are visible and enter native workflow skill context;
- `/diayn-init` creates the required minimum scaffold files: `AGENTS.md`, `TODO.md`, `.diayn/worktree_manifest.md`, `.diayn/scaffold_version.md`, and `docs/project/project_brief.md`;
- `.diayn/network_policy.md` is also created as part of the baseline scaffold;
- the runner checkpoints fixture changes after `/diayn-init`, `/diayn-plan`, `/diayn-worktrees`, `/diayn-backend`, and `/diayn-frontend`;
- `/diayn-plan` creates a stage plan under `docs/stages/<stage-id>/stage_plan.md`, backend/frontend lane boards, backend/frontend handoffs, and a shared contract note under `docs/shared/<contract>.md`;
- lane task rows created by `/diayn-plan` remain `todo`, not `candidate_done` or `done`.
- `/diayn-worktrees` creates `.diayn/worktree_plan.json`, `.diayn/session_registry.md`, `docs/lanes/backend/launch_prompt.md`, and `docs/lanes/frontend/launch_prompt.md`;
- `.diayn/worktree_plan.json` records `execute_requested: true`, no remaining OwnerGate items, and ready backend/frontend lanes;
- backend and frontend worktree paths exist and are registered in `git worktree list --porcelain`;
- no business code implementation or hidden worker/reviewer session is started by `/diayn-worktrees`.
- `/diayn-backend` runs from the backend lane worktree, creates backend worklog/evidence artifacts, records local `validation/run_e2e.py` evidence, checkpoints the lane branch, and leaves the backend task at `candidate_done`;
- `/diayn-frontend` runs from the frontend lane worktree, creates frontend worklog/evidence artifacts, records local `validation/run_e2e.py` evidence, checkpoints the lane branch, and leaves the frontend task at `candidate_done`;
- neither lane worker self-approves its work as `done` or Owner-accepted.
- `/diayn-review-backend` runs from the same backend lane worktree after backend worker activity stops, writes `docs/lanes/backend/review_log.md`, records independent review E2E evidence, checkpoints the lane branch, and marks the reviewed baseline task `done`;
- `/diayn-review-frontend` runs from the same frontend lane worktree after frontend worker activity stops, writes `docs/lanes/frontend/review_log.md`, records independent review E2E evidence, checkpoints the lane branch, and marks the reviewed baseline task `done`;
- reviewer workflows do not mark Owner acceptance and do not merge or integrate code.
- `/diayn-sync` runs from the Controller root after review, copies reviewed lane state and review logs into Controller docs, writes `docs/stages/stage-1-auth-fixture/sync_log.md`, updates TODO/lane snapshots, and records that no business code was merged;
- `/diayn-integration` runs from the Controller root after sync, confirms both reviewed lanes are `done`, records no-op/already-aligned merge status for the baseline fixture, checks shared contract consistency, runs `python validation/run_e2e.py --output docs/stages/stage-1-auth-fixture/integration_e2e.json`, writes `docs/stages/stage-1-auth-fixture/integration_summary.md`, and prepares Owner acceptance handoff without marking Owner acceptance.
- `/diayn-html` runs from the Controller root after integration, writes `docs/stages/stage-1-auth-fixture/owner_acceptance_record.md`, optionally writes `docs/stages/stage-1-auth-fixture/owner_acceptance_summary.html`, records the Owner decision as accepted, references integration evidence, and keeps Markdown authoritative.
- `/diayn-bug` runs from the Controller root as an installed-flow side scenario after Owner acceptance, writes `docs/stages/stage-1-auth-fixture/bug_triage_noop.md`, records `no_active_bug`, confirms no affected scope or lane owner, and routes the next action to closeout without changing code or accepted requirements.
- `/diayn-new` runs from the Controller root after Owner acceptance, writes `docs/stages/stage-1-auth-fixture/stage_closeout.md`, writes `docs/stages/stage-2-follow-up/baseline_refresh.md`, updates `TODO.md` pointers only, and does not implement code, re-plan lanes, delete worktrees, or alter accepted requirements.

Conclusion: the installed-flow runner now proves the Claude project-local primary flow through Owner acceptance, closeout, and next-stage baseline refresh. This evidence strengthens the release gate because it converts the former full-flow blocker into a completed surface-specific proof while still preventing unsupported Codex or all-surface claims.

## 4. Phase 12 Focused Side Scenarios

Side-scenario validator:

```text
node maintainers\scripts\validate_diayn_phase12_side_scenarios.js --json validation\phase12_side_scenarios.json
```

Current result:

```text
ok: true
non_git_target: true
existing_project_conflict_report: true
dirty_working_tree_preflight: true
not_applicable_lane: true
interrupted_command_recovery: true
scaffold_migration_dry_run: true
mismatched_pre_existing_agent_skills: true
privacy_network_default: true
cleanup_plan_boundary: true
bug_triage_side_scenario: true
additional_new_intake_or_next_stage_refresh: true
```

Evidence model:

- The validator creates temporary non-Git and existing-project conflict fixtures and runs `skills/diayn-init/scripts/harness_audit.py` against them.
- It reuses existing validation outputs for dirty-tree preflight, `not_applicable` lane behavior, scaffold migration dry-run, cleanup boundary, dependency provenance/substitution policy, privacy/network defaults, interrupted recovery, `/diayn-bug`, and `/diayn-new` or next-stage baseline refresh.
- This gate prevents the installed-flow release audit from relying only on the happy path.

## 5. Codex Probe

Codex package artifact:

```text
plugins/docs-is-all-you-need/.codex-plugin/plugin.json
packages/codex-project-local/
```

The package exists, static validation passes, and the project-local install
fixture copies 12 workflow skills, 23 dependency skills, and `.diayn` routing
metadata into a temporary target:

```text
node maintainers\scripts\install_codex_project_local_package.js --fixture --execute --json validation\phase9_codex_project_local_install_fixture.json
```

This proves the `.codex/skills` install shape without touching a real user
Codex home or claiming Desktop app-session runtime discovery.

The Codex-home install fixture also proves the global skills-home copy shape:

```text
node maintainers\scripts\install_codex_project_local_package.js --codex-home-fixture --execute --json validation\phase9_codex_home_install_fixture.json
```

It writes skills to `validation/tmp/codex-home-install-fixture/skills/` and
metadata to `validation/tmp/codex-home-install-fixture/diayn/docs-is-all-you-need/`.
This does not touch the real user Codex home and does not claim Desktop
app-session runtime discovery.

For a real Codex Home install, run a dry-run first and execute only after the
target and conflict report look correct:

```text
node maintainers\scripts\install_codex_project_local_package.js --target-codex-home <CODEX_HOME>
node maintainers\scripts\install_codex_project_local_package.js --target-codex-home <CODEX_HOME> --execute
```

Real Codex Home install records, executable probes, and manual testing notes are
local-only diagnostics by default. They are useful while debugging one machine,
but the committed release evidence uses install fixtures and directory
inspection.

The external runtime evidence validator remains available as optional future
tooling for a separate Desktop app-session claim:

```text
docs/install/codex_runtime_external_evidence_template.json
node maintainers\scripts\validate_codex_runtime_external_evidence.js --json validation\phase9_codex_runtime_external_evidence.json
```

Current result: `runtime_proven: false` because Desktop app-session evidence is
outside the current validation scope.

Conclusion: Codex package shape, project-local install/copy shape, and
Codex-home install/copy shape are proven. Codex Desktop app-session discovery,
direct `/diayn-*` invocation, native dependency-skill invocation, and full-flow
runtime validation were not attempted and are not claimed.

## 6. Dependency-Skill Probe

The locked `agent-skills` payload exists at:

```text
plugins/docs-is-all-you-need/dependency-skills/agent-skills/
```

Phase 3 validates:

- full vendored baseline;
- lock/provenance metadata;
- package payload hashes;
- routing coverage;
- the rule that reading vendored `SKILL.md` files directly is not real third-party skill invocation.

Phase 9 now adds Claude project-local evidence that:

- a DIAYN-managed dependency skill can be loaded directly through the native `Skill` tool;
- an active DIAYN workflow can route to and load a DIAYN-managed dependency skill through the native `Skill` tool.

The routed probe is currently limited to `/diayn-init -> idea-refine`. The full installed-flow fixture and Phase 12 side-scenario gate prove the DIAYN workflow from install through Owner acceptance and focused edge cases, but they do not exercise every vendored dependency skill in context.

Conclusion: dependency packaging, direct Claude project-local dependency loading, and a representative routed workflow dependency probe are validated.

## 7. Capability Matrix

Machine-readable evidence:

```text
validation/phase9_capability_matrix.json
```

Summary:

| Surface | Package artifact | Native command/skill evidence | Bare `/diayn-*` evidence | Dependency-skill evidence | Alpha claim |
| --- | --- | --- | --- | --- | --- |
| Codex package/install | Present; static package, project-local install fixture, and Codex-home install fixture pass | Package/install only; Desktop runtime not attempted | Package/install surface validated | Dependency skills copied and routed metadata present | Yes, for package/install scope |
| Claude Code CLI plugin-dir | Present, plugin validate passed | Namespaced command and skill invocation observed | Fails: `/diayn-init` unknown | Not applicable to bare command path | No |
| Claude Code CLI project-local | Present, package validator passed | Bare `diayn-init` Skill invocation observed; all 12 commands/skills visible and entering workflow context; installed fixture completes all 12 public commands from `/diayn-init` through `/diayn-new`, including `/diayn-bug` and Phase 12 side-scenario coverage | Proven for `/diayn-init` smoke, 12-command workflow entry, primary installed flow, and focused side scenarios | Direct `idea-refine` Skill invocation and routed `/diayn-init -> idea-refine` Skill invocation observed | Yes |
| OpenCode CLI | Deferred | Not implemented | Not proven | Not proven | No |

## 8. Remaining Future Work

The current release gate is complete for the stated surfaces. Future work can
still improve or broaden support:

1. Collect separate Codex Desktop app-session evidence before making a runtime
   claim.
2. Decide whether Claude release packaging should prefer plugin-dir namespaced
   commands, project-local bare commands, or both.
3. Convert local package proof into a published marketplace/plugin flow.
4. Decide whether final third-party composition evidence requires more than the
   representative routed `/diayn-init -> idea-refine` probe.

## 9. Validation

Release-gate validator:

```text
node maintainers\scripts\validate_diayn_phase9_release_gate.js --json validation\phase9_release_gate.json
```

Expected current result:

```text
ok: true
release_ready: true
phase9_complete: true
claude_project_local_bare_command_ok: true
claude_project_local_dependency_skill_ok: true
claude_project_local_routed_dependency_ok: true
claude_project_local_command_sequence_visible: true
claude_project_local_command_sequence_entry_ok: true
claude_project_local_command_sequence_ok: true
phase11_worktree_artifacts_ok: true
phase11_lane_worker_artifacts_ok: true
phase11_review_artifacts_ok: true
phase11_sync_artifacts_ok: true
phase11_integration_artifacts_ok: true
phase11_owner_acceptance_artifacts_ok: true
phase11_bug_artifacts_ok: true
phase11_closeout_artifacts_ok: true
phase11_installed_flow_complete: true
phase12_side_scenarios_ok: true
codex_package_install_scope_ok: true
codex_app_session_runtime_current_scope_boundary_ok: true
```

The validator should pass as an honest audit for the current release scope. It
must not be interpreted as Codex Desktop app-session runtime proof.
