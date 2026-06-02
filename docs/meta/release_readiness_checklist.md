# Release Readiness Checklist

This checklist is for preparing a DIAYN V1 scaffold release candidate after the
DDDV6 validation pass. It does not publish a release by itself.

DDDV8 supersedes the DDDV6 release-candidate boundary for the active 12-command
skill-pack implementation. Current DDDV8 release truth is recorded in
`validation/phase9_release_gate.json` and
`validation/dddv8_requirement_completion_audit.json`.

## Required Before Release Preparation

- [x] D6-01 through D6-09 execution records exist.
- [x] D6-01 through D6-09 review results are `PASS` or `PASS_WITH_RISK`.
- [x] D6-10 review result exists and accepts the release packaging update.
- [x] D6-11 final truth audit exists and revises the release gate to
      `beta_only`.
- [x] D6-11 blocker repair review confirms Claude Code/OpenCode adapter docs
      are aligned with D6-04/D6-05 scoped smoke evidence.
- [x] `git diff --check` passed in recent D6 stages before checkpoint review;
      rerun before any publish action.
- [x] The support matrix classifies every major capability as
      `working`, `manual_fallback`, `documented_only`, `draft_only`,
      `missing`, `blocked_by_environment`, or `blocked_by_owner_decision`.
- [x] The D6-11 release truth audit has no unrepaired blocking issue.
      The D6-11 blocker repair was reviewed and closes the Claude/OpenCode
      adapter-doc consistency issue. Release-candidate readiness is still not
      claimed by this checklist.
- [x] Remaining risks are documented for D6-10 review.
- [x] Real-project validation status is explicit: D6-06 through D6-08 cover an
      Owner-approved validation project only, not an existing production
      project.

## Protocol And Templates

- [ ] Canonical status authority is `docs/meta/status_model.md`.
- [ ] `/diayn-*` command authority is `docs/meta/diayn_command_reference.md`.
- [ ] Worktree authority is `docs/meta/diayn_worktree_workflow.md`.
- [ ] Owner UX authority is `docs/meta/owner_decision_ux_protocol.md` and
      `docs/meta/owner_acceptance_protocol.md`.
- [ ] Active lane templates use multi-session statuses.
- [ ] Legacy templates are covered by `docs/meta/legacy_migration_guide.md`.

## Skills

- [ ] Required DIAYN core skills exist.
- [ ] `SKILL.md` files remain short.
- [ ] Longer procedures stay in `references/**`.
- [ ] Skills do not copy the full protocol.
- [ ] Skills do not promise runtime enforcement.
- [ ] Canonical Codex package shape is the DDDV8 project-local
      `.codex/skills` package in `packages/codex-project-local/`.
- [ ] Codex install fixture evidence exists at
      `validation/phase9_codex_project_local_install_fixture.json`, proving the
      package copy shape without proving runtime discovery.
- [ ] Codex-home install fixture evidence exists at
      `validation/phase9_codex_home_install_fixture.json`, proving the
      `$CODEX_HOME/skills` copy shape without proving runtime discovery.
- [ ] Real Codex Home installs, if performed, are treated as local-only
      diagnostics unless a maintainer intentionally sanitizes and promotes
      them as release evidence.
- [ ] Codex runtime external evidence validator exists at
      `maintainers/scripts/validate_codex_runtime_external_evidence.js`; its
      output remains blocked until current/reloaded/new Codex Desktop
      app-session evidence records a `skill_discovery_snapshot` and proves
      direct `/diayn-*` invocation plus native dependency-skill invocation.
- [ ] Codex Desktop runtime validation instructions explicitly forbid
      satisfying the gate with a shell-launched Codex process.
- [ ] Codex runtime external evidence validator selftest exists at
      `maintainers/scripts/validate_codex_runtime_external_evidence_selftest.js`
      and records that complete concrete evidence clears the blocker while
      placeholder templates, missing inputs, and nonexistent evidence references
      remain blocked.

## Vendor And Maintainer Sync

- [ ] `vendor.lock.md` records source, commit, sync method, included scope,
      excluded paths, license check, watched skills, protected paths, and sync
      summary.
- [ ] `third_party/agent-skills/**` is not treated as DIAYN-owned protocol.
- [ ] Maintainer sync docs are separate from ordinary user workflows.
- [ ] D6-10 upstream freshness result is reviewed: remote
      `agent-skills` HEAD `6ce029897d2b794940325fc7148774a6ec51111c` is newer
      than vendored `250ffaa`.
- [ ] Any future vendor update has a reviewed source snapshot, diff, protected
      path check, license check, and no overwrite of DIAYN-owned harness files.

## Tool Adapters

- [ ] Adapter docs live under `integrations/**`.
- [ ] Adapters do not redefine core status, command, role, permission, or
      worktree semantics.
- [ ] Unknown or unsmoke-tested tool capabilities remain at
      `manual_fallback`, `documented_only`, `draft_only`, `missing`, or
      `Unknown / To be confirmed`.
- [ ] Cursor and Copilot remain out of V1 active scope unless a later Owner
      decision changes that.
- [ ] Codex runtime support remains blocked until official/local validator plus
      current/reloaded Codex app-session discovery/execution evidence pass.

## D6-10 Release Candidate Boundary

- [x] Release candidate notes exist at `RELEASE_NOTES.md`.
- [x] No publish or push action was performed by D6-10.
- [x] No unsupported support level was upgraded by D6-10.
- [x] `third_party/agent-skills/**` was not modified by D6-10.
- [x] D6-11 decided the current package is `beta_only`, not
      release-candidate ready.
- [x] D6-11 blocker repair review decides whether the adapter-doc consistency
      issue is closed.

## Examples

- [ ] `docs/examples/**` exists only as learning material.
- [ ] Each example directory says it is not core protocol.
- [ ] Examples use placeholders.
- [ ] Examples do not create real worktrees or imply command execution.

## Release Prep Recommendation

Release-candidate preparation is not allowed from the current evidence without
a separate Owner or maintainer gate decision. The D6-11 blocker repair has been
reviewed and closes the adapter-doc consistency issue, but formal publishing,
plugin release, native command support, installer behavior, upstream vendor
refresh, and real-project general availability require separate authorization
plus evidence.
