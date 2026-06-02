# DIAYN V1 DDDV8 Implementation Plan

This file splits the DDDV8 requirements into checkpoint phases for implementing the real DIAYN skill pack inside this repository.

Authoritative requirement source:

```text
../DDDV8/diayn_v1_skill_pack_requirements.md
```

This plan does not replace the requirement source. It maps the requirement sections to implementation phases, expected artifacts, validation evidence, and checkpoint commits.

## 1. Phase Rules

- Complete one phase at a time.
- Validate the phase against current files, not intent.
- Commit a checkpoint after each completed phase.
- Do not mark a later phase complete because a historical D5/D6 artifact exists; each artifact must be checked against the DDDV8 requirement baseline.
- If a platform fact contradicts the requirement, stop and record the blocker instead of silently changing the requirement.
- Keep public DIAYN surface to exactly 12 workflow skills unless the Owner changes the requirement.

## 2. Phase Summary

| Phase | Goal | Primary output | Checkpoint evidence |
| --- | --- | --- | --- |
| 0 | Establish active requirements baseline and traceability | Updated entry docs plus this plan | README/install truth/TODO/traceability agree on DDDV8 |
| 1 | Prove platform mechanics and fixture readiness | Platform mechanics notes and fixture gap list | Evidence for Codex/Claude direct skill invocation feasibility or blockers |
| 2 | Build shared protocol and 12 public workflow skill skeletons | `skills/diayn-init` through `skills/diayn-html` | 12 valid `SKILL.md` entries with progressive disclosure |
| 3 | Vendor, register, and route third-party dependency skills | Locked DIAYN-managed dependency model | Routing map covers every vendored upstream skill |
| 4 | Make install real on alpha surfaces | Codex/Claude install package shape | Clean install/discovery evidence or explicit blocker |
| 5 | Implement Controller init and planning | `/diayn-init`, `/diayn-plan`, scaffold audit/planning behavior | Fixture init/plan run from vague idea and retrofit dry-run |
| 6 | Implement worktree and session entry control | `/diayn-worktrees`, identity/worktree checks | Worktree fixture evidence and fresh-session recovery |
| 7 | Implement lane worker execution | `/diayn-backend`, `/diayn-frontend` one-slice worker behavior | Worker evidence, boundaries, interruption recovery |
| 8 | Implement lane review and rejection loops | `/diayn-review-backend`, `/diayn-review-frontend` evidence review | Reviewer evidence and rejected-review fixture |
| 9 | Implement sync and integration | `/diayn-sync`, `/diayn-integration` | Document-only sync, reviewed-code integration, Owner acceptance handoff |
| 10 | Implement stage lifecycle, Owner UX, and public auxiliary commands | Owner acceptance, closeout, `/diayn-html`, `/diayn-bug`, `/diayn-new` | Owner-readable reports, bug/new routing, closeout, next baseline refresh |
| 11 | Implement maintainer utilities, operational boundaries, and release hygiene | scaffold/vendor/privacy/cleanup utilities and release text | Maintainer dry-runs, privacy defaults, package regressions, honest release claims |
| 12 | Prove installed full flow and focused side scenarios | final capability matrix and validation log | install-to-acceptance fixture run plus side-scenario gate |

## 3. Requirement Traceability

| Requirement section | Implementation phase | Required evidence |
| --- | --- | --- |
| 1. Core Positioning | Phases 0, 2, 4, 12 | README/install truth, 12 public skills, install validation |
| 2. Harness Principles | Phases 2, 5, 6, 7, 8, 9, 10 | scaffold templates, progressive disclosure, TODO model, stage-scoped logs |
| 3. Workflow Skill And Command Model | Phases 1, 2, 4, 12 | platform mechanics proof, 12 installed workflow skills, direct `/diayn-*` invocation evidence |
| 4. Product Surface | Phases 2, 4, 12 | exactly 12 public skills, no hidden extra public DIAYN commands |
| 5. Skills Architecture | Phases 2, 3, 4 | public workflow skills plus internal role references and dependency-skill packaging |
| 6. Complete Behavior Of The 12 Commands | Phases 5, 6, 7, 8, 9, 10, 12 | command-specific implementation and fixture workflow evidence |
| 7. Third-Party `agent-skills` Composition | Phases 1, 3, 4, 12 | vendored lock metadata, DIAYN-managed dependency registration, native routed invocation evidence |
| 8. Document Architecture | Phases 2, 5, 6, 7, 8, 9, 10 | AGENTS/TODO/.diayn/docs/stage/lane/shared templates and migration behavior |
| 9. Session Model And State Flow | Phases 2, 6, 7, 8, 9 | identity checks, same-lane WIP rule, reviewer same-worktree rule, sync/integration separation |
| 10. Helper Scripts | Phases 5, 6, 11 | deterministic helpers with dry-run/authorization boundaries |
| 11. Owner Experience And Validation Strategy | Phases 8, 9, 10, 12 | OwnerGate prompts, `/diayn-html`, acceptance records, fixture full flow |
| 12. Recommended V1 Implementation Order | All phases | this plan and checkpoint commits |

## 4. Phase 0 Exit Check

Phase 0 is complete when:

- `README.md` names DDDV8 as the active implementation baseline.
- `docs/install/README.md` stops claiming the old eight-role-skill install as the final target.
- `docs/meta/session_skill_mapping.md` maps the 12 public workflow skills and treats role skills as internal/shared references.
- `TODO.md` tracks the DDDV8 implementation phases with Owner-facing checkboxes.
- This plan maps every DDDV8 requirement section to an implementation phase and evidence type.
- A checkpoint commit records the phase.

## 5. Phase 1 Exit Check

Phase 1 is complete when:

- The local `superpowers` and `agent-skills` references have been inspected for real platform packaging patterns.
- Codex Desktop has either direct `/diayn-*` workflow-skill invocation evidence or a recorded blocker.
- Claude Code CLI has either direct `/diayn-*` workflow-skill invocation evidence or a recorded blocker.
- Native or equivalent dependency-skill invocation has either evidence or a recorded blocker.
- The controlled full-stack fixture has a DDDV8 gap list for backend, frontend, shared contracts, review rejection, integration, Owner acceptance, and next-stage refresh.

Phase 1 evidence:

- Platform mechanics audit: `docs/meta/diayn_v1_phase1_platform_mechanics.md`
- Fixture gap list: `validation/minimal-fullstack-fixture/diayn_v1_gap_list.md`
- Fixture E2E result: `validation/minimal-fullstack-fixture/validation/phase1_e2e_result.json`

## 6. Phase 2 Exit Check

Phase 2 is complete when:

- The repository has 12 public workflow skill folders named after the public commands.
- Each public `SKILL.md` has concise frontmatter, use conditions, startup read order, workflow steps, allowed writes, stop conditions, and output expectations.
- Role/reference material is reusable without being the main public install surface.
- The plugin/package candidate points at the 12 public workflow skills.
- Static validation confirms all 12 skills exist and old public eight-role-skill claims are gone from active install docs.

Phase 2 evidence:

- Public skill surface record: `docs/meta/diayn_v1_phase2_skill_surface.md`
- Static validator: `maintainers/scripts/validate_diayn_public_skill_surface.js`
- Validation output: `validation/phase2_public_skill_surface.json`

## 7. Phase 3 Exit Check

Phase 3 is complete when:

- The vendored upstream `agent-skills` snapshot has lock metadata.
- Each vendored skill has a routing rule or explicit not-used reason.
- The package model can expose DIAYN-managed dependency skills where native nested invocation requires it.
- Uncontrolled user-installed dependency copies are rejected or explicitly gated.
- Representative routing evidence exists.

Phase 3 evidence:

- Dependency model record: `docs/meta/diayn_v1_phase3_dependency_skills.md`
- Vendor dry-run report: `maintainers/upstream-agent-skills/latest_dry_run_report.md`
- Packaged dependency manifest: `plugins/docs-is-all-you-need/dependency-skills/manifest.json`
- Dependency validator: `maintainers/scripts/validate_diayn_dependency_skills.js`
- Validation output: `validation/phase3_dependency_skills.json`

## 8. Phase 4 Exit Check

Phase 4 is complete when:

- Codex Desktop package/install docs and files match the 12-workflow-skill model.
- Claude Code package/install docs and files match the 12-workflow-skill model.
- A clean install path does not require cloning this repository into the target project.
- OpenCode remains deferred unless direct invocation has been proven.
- Install validation evidence is recorded.

Phase 4 evidence:

- Alpha package record: `docs/meta/diayn_v1_phase4_alpha_package.md`
- Codex package note: `docs/install/codex-alpha.md`
- Codex project-local package: `packages/codex-project-local/`
- Codex project-local package validator: `maintainers/scripts/validate_diayn_codex_project_local_package.js`
- Codex project-local package output: `validation/phase9_codex_project_local_package.json`
- Codex project-local install fixture: `maintainers/scripts/install_codex_project_local_package.js`
- Codex project-local install fixture output: `validation/phase9_codex_project_local_install_fixture.json`
- Codex-home install fixture output: `validation/phase9_codex_home_install_fixture.json`
- Codex real-home installer: `maintainers/scripts/install_codex_project_local_package.js`
- Codex local-only executable probe: `maintainers/scripts/run_codex_project_local_probe.js`
- Codex runtime external evidence validator: `maintainers/scripts/validate_codex_runtime_external_evidence.js`
- Codex runtime external evidence validator selftest: `maintainers/scripts/validate_codex_runtime_external_evidence_selftest.js`
- Codex runtime external evidence template: `docs/install/codex_runtime_external_evidence_template.json`
- Codex runtime external evidence validator output: `validation/phase9_codex_runtime_external_evidence.json`
- Codex runtime external evidence validator selftest output: `validation/phase9_codex_runtime_external_evidence_selftest.json`
- Claude package note: `docs/install/claude-code-alpha.md`
- Package validator: `maintainers/scripts/validate_diayn_alpha_package.js`
- Validation output: `validation/phase4_alpha_package.json`

## 9. Phase 5 Exit Check

Phase 5 is complete when:

- `/diayn-init` can start from a vague idea or vague requirement document, interview the Owner, and produce draft docs with `Unknown` or `OwnerGate` where needed.
- `/diayn-init` can audit an existing project harness and produce a dry-run retrofit/conflict report before edits.
- `/diayn-plan` creates stages, applicable lane records, `not_applicable` lane records, task slices, and acceptance criteria.
- Baseline files include `AGENTS.md`, `TODO.md`, `.diayn/worktree_manifest.md`, `.diayn/scaffold_version.md`, and `docs/project/project_brief.md`.

Phase 5 evidence:

- Controller init/plan record: `docs/meta/diayn_v1_phase5_controller_init_plan.md`
- Init audit helper: `skills/diayn-init/scripts/harness_audit.py`
- Init scaffold templates: `skills/diayn-init/assets/scaffold/`
- Plan templates: `skills/diayn-plan/assets/plan/`
- Phase 5 validator: `maintainers/scripts/validate_diayn_phase5_controller_assets.js`
- Fixture audit output: `validation/phase5_fixture_harness_audit.json`
- Validation output: `validation/phase5_controller_assets.json`

## 10. Phase 6 Exit Check

Phase 6 is complete when:

- `/diayn-worktrees` handles Git/non-Git, dirty state, existing worktrees, branch choice, accepted baseline alignment, and authorization-first `git worktree add`.
- Fresh sessions and cleared contexts can re-enter through the same `/diayn-*` commands without loading every DIAYN rule.
- Wrong role, wrong worktree, missing handoff, and premature review stop conditions work.
- Worker and reviewer share a lane worktree in V1, with the worker stopped before review begins.

Phase 6 evidence:

- Worktree/session control record: `docs/meta/diayn_v1_phase6_worktree_session_control.md`
- Worktree planner: `skills/diayn-worktrees/scripts/worktree_plan.py`
- Session entry assets: `skills/diayn-worktrees/assets/worktrees/`
- Phase 6 validator: `maintainers/scripts/validate_diayn_phase6_worktrees.js`
- Worktree plan output: `validation/phase6_worktree_plan.json`
- `not_applicable` lane output: `validation/phase6_not_applicable_worktree_plan.json`
- Validation output: `validation/phase6_worktrees.json`

## 11. Phase 7 Exit Check

Phase 7 is complete when:

- Backend/frontend workers execute one task slice at a time and stop at `candidate_done`.
- Workers verify role, lane, worktree, handoff, applicable-lane status, and next task slice before editing.
- Lane write boundaries and shared-contract change proposals are enforced.
- Partial attempts, evidence capture, copyable commands, and dependency/dev-server/background-process authorization are recorded.

Phase 7 evidence:

- Lane/review/integration record: `docs/meta/diayn_v1_phase7_lane_review_integration.md`
- Workflow validator: `maintainers/scripts/validate_diayn_phase7_workflows.js`
- Fixture scenario: `validation/phase7_fixture_scenario.json`
- Fixture flow output: `validation/phase7_fixture_flow.json`
- Validation output: `validation/phase7_workflows.json`

## 12. Phase 8 Exit Check

Phase 8 is complete when:

- Backend/frontend reviewers independently approve or reject and can update TODO checkboxes when review fails.
- Reviewer tests may land in the repository, using the detected test directory or `tests/diayn/` fallback.
- Reviewer default behavior is review-only, with explicit temporary role switching only when the Owner asks for reviewer edits.
- Review failures are classified before routing back to a worker.
- The fixture proves a rejected-review loop.

Phase 8 evidence:

- Lane/review/integration record: `docs/meta/diayn_v1_phase7_lane_review_integration.md`
- Stage-flow validator: `skills/diayn-integration/scripts/validate_stage_flow.py`
- Workflow validator: `maintainers/scripts/validate_diayn_phase7_workflows.js`
- Fixture scenario: `validation/phase7_fixture_scenario.json`
- Fixture flow output: `validation/phase7_fixture_flow.json`
- Validation output: `validation/phase7_workflows.json`

## 13. Phase 9 Exit Check

Phase 9 is complete when:

- `/diayn-sync` synchronizes state/docs only and does not merge business code.
- `/diayn-integration` performs reviewed-code integration and integration checks.
- `/diayn-integration` records merge status, contract consistency, E2E/smoke/build/lint evidence, lane/shared issues, conflict ownership, and integration summary.
- The fixture proves document-only sync, reviewed-code integration, integration evidence, and an Owner acceptance handoff.

Phase 9 evidence:

- Lane/review/integration record: `docs/meta/diayn_v1_phase7_lane_review_integration.md`
- Stage-flow validator: `skills/diayn-integration/scripts/validate_stage_flow.py`
- Workflow validator: `maintainers/scripts/validate_diayn_phase7_workflows.js`
- Fixture scenario: `validation/phase7_fixture_scenario.json`
- Fixture flow output: `validation/phase7_fixture_flow.json`
- Validation output: `validation/phase7_workflows.json`

## 14. Phase 10 Exit Check

Phase 10 is complete when:

- Owner acceptance and accepted-baseline records exist and preserve Markdown as durable authority.
- Controller stage closeout updates TODO, links final evidence, records unresolved follow-ups, and records worktree/branch retention notes.
- Next-stage baseline refresh is recorded before `/diayn-new`, `/diayn-plan`, or `/diayn-worktrees` starts new work after Owner acceptance.
- `/diayn-html` produces Owner-facing decision/report aids while Markdown remains authoritative.
- `/diayn-bug` and `/diayn-new` route controlled intake, superseded requirements, and rollback decisions.
- OwnerGate prompts remain compact and decision-oriented.

Phase 10 evidence:

- Owner UX/maintainer record: `docs/meta/diayn_v1_phase8_owner_maintainer_utilities.md`
- Public HTML helper: `skills/diayn-html/scripts/diayn_html_generator.py`
- Phase 8 validator: `maintainers/scripts/validate_diayn_phase8_owner_utilities.js`
- Owner HTML aid: `validation/phase8_owner_decision_aid.html`
- Validation output: `validation/phase8_owner_utilities.json`

## 15. Phase 11 Exit Check

Phase 11 is complete when:

- Scaffold migration, vendor sync, privacy/network policy, and cleanup/delete-plan utilities are dry-run first and content-preserving.
- Mismatched pre-existing user-installed `agent-skills` copies are reported or blocked by the DIAYN-managed dependency policy.
- Package, command-entry, dependency-registration, routing, and smoke-test regressions still pass after the public workflow behavior has been added.
- Release and install text contain only proven capabilities.

Phase 11 evidence:

- Privacy/network policy: `docs/meta/diayn_privacy_network_policy.md`
- Cleanup dry-run helper: `skills/diayn-html/scripts/cleanup_plan.py`
- Existing-project migration helper: `skills/update-diayn-scaffold/scripts/scaffold_upgrade_audit.py`
- Cleanup plan: `validation/phase8_cleanup_plan.json`
- Scaffold migration audit: `validation/phase8_scaffold_upgrade_audit.json`
- Vendor sync report: `maintainers/upstream-agent-skills/latest_dry_run_report.md`
- Alpha/package validators: `maintainers/scripts/validate_diayn_alpha_package.js`, `maintainers/scripts/validate_diayn_claude_project_local_package.js`

## 16. Phase 12 Exit Check

Phase 12 is evaluated per supported surface. A surface can be recorded as an
alpha-supported surface only when that surface's clean installed package
completes:

```text
install -> /diayn-init -> /diayn-plan -> /diayn-worktrees
-> /diayn-backend and /diayn-frontend
-> /diayn-review-backend and /diayn-review-frontend
-> /diayn-sync -> /diayn-integration
-> Owner acceptance -> closeout -> next-stage baseline refresh
```

The final evidence must include direct `/diayn-*` invocation and native routed third-party dependency-skill invocation from the DIAYN-managed locked dependency copy for that surface.

The final proof must also include focused side-scenario coverage for non-Git targets, existing-project conflicts, dirty preflight, `not_applicable` lanes, interrupted recovery, scaffold migration dry-run, mismatched pre-existing `agent-skills`, privacy/network defaults, cleanup boundaries, `/diayn-bug`, and `/diayn-new` or next-stage baseline refresh.

Current installed-flow audit evidence is still stored under `phase9_*` and `phase11_*` filenames because those files were created before the DDDV8 Section 12 implementation order was refined into Phase 0 through Phase 12. They now correspond to the Phase 12 release gate until a later cleanup renames them:

- Installed-flow audit: `docs/meta/diayn_v1_phase9_installed_flow_audit.md`
- Capability matrix: `validation/phase9_capability_matrix.json`
- Codex project-local package validator: `maintainers/scripts/validate_diayn_codex_project_local_package.js`
- Codex project-local package output: `validation/phase9_codex_project_local_package.json`
- Codex project-local install fixture: `maintainers/scripts/install_codex_project_local_package.js`
- Codex project-local install fixture output: `validation/phase9_codex_project_local_install_fixture.json`
- Codex-home install fixture output: `validation/phase9_codex_home_install_fixture.json`
- Codex real-home installer: `maintainers/scripts/install_codex_project_local_package.js`
- Codex local-only executable probe: `maintainers/scripts/run_codex_project_local_probe.js`
- Codex runtime external evidence validator: `maintainers/scripts/validate_codex_runtime_external_evidence.js`
- Codex runtime external evidence validator selftest: `maintainers/scripts/validate_codex_runtime_external_evidence_selftest.js`
- Codex runtime external evidence template: `docs/install/codex_runtime_external_evidence_template.json`
- Codex runtime external evidence validator output: `validation/phase9_codex_runtime_external_evidence.json`
- Codex runtime external evidence validator selftest output: `validation/phase9_codex_runtime_external_evidence_selftest.json`
- Claude project-local package validator: `maintainers/scripts/validate_diayn_claude_project_local_package.js`
- Claude project-local package output: `validation/phase9_claude_project_local_package.json`
- Claude project-local runtime probe: `validation/phase9_claude_project_local_probe.json`
- Claude project-local routed dependency probe: `validation/phase9_claude_project_local_routed_dependency_probe.json`
- Claude project-local command sequence probe: `validation/phase9_claude_project_local_command_sequence.json`
- Installed-flow fixture: `validation/phase11_installed_flow_fixture.json`
- Phase 12 side-scenario validator: `maintainers/scripts/validate_diayn_phase12_side_scenarios.js`
- Phase 12 side-scenario output: `validation/phase12_side_scenarios.json`
- Release-gate validator: `maintainers/scripts/validate_diayn_phase9_release_gate.js`
- Release-gate output: `validation/phase9_release_gate.json`

Current status: Claude project-local is the only supported alpha surface recorded by the capability matrix. All-surface release readiness remains blocked because Codex Desktop app-session invocation is not yet proven. Codex project-local packaging now statically validates the `.codex/skills` shape with 12 workflow skills and 23 DIAYN-managed dependency skills, and `install_codex_project_local_package.js` proves the package can be copied into both a temporary project-local `.codex/skills` plus `.diayn` metadata shape and a temporary Codex-home `skills` plus `diayn/docs-is-all-you-need` metadata shape. Real Codex Home installs, executable probes, and maintainer manual runbooks are local-only diagnostics by default. `validate_codex_runtime_external_evidence.js` defines the strict evidence intake needed to clear the remaining app-session invocation blocker, and `validate_codex_runtime_external_evidence_selftest.js` proves that this intake gate clears the blocker for complete concrete evidence with existing repo-relative evidence files while keeping placeholder templates, missing inputs, and nonexistent evidence references blocked. Claude project-local packaging proves bare `/diayn-*` command-to-skill behavior, direct dependency-skill loading, routed `/diayn-init -> idea-refine` dependency-skill loading, all 12 bare `/diayn-*` commands entering workflow context, clean installed-flow completion, and focused Phase 12 side-scenario coverage. The Codex blocker record must not be interpreted as blocking the proven Claude project-local alpha surface, and the Claude proof must not be interpreted as Codex or all-surface release readiness.
