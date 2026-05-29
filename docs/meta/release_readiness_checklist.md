# Release Readiness Checklist

This checklist is for preparing a DIAYN V1 scaffold release candidate after the
DDDV6 validation pass. It does not publish a release by itself.

## Required Before Release Preparation

- [x] D6-01 through D6-09 execution records exist.
- [x] D6-01 through D6-09 review results are `PASS` or `PASS_WITH_RISK`.
- [ ] D6-10 review result exists and accepts the release packaging update.
- [ ] D6-11 final truth audit exists and accepts or revises the release gate.
- [x] `git diff --check` passed in recent D6 stages before checkpoint review;
      rerun before any publish action.
- [x] The support matrix classifies every major capability as
      `working`, `manual_fallback`, `documented_only`, `draft_only`,
      `missing`, `blocked_by_environment`, or `blocked_by_owner_decision`.
- [ ] The D6-11 release truth audit has no blocking issue.
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
- [ ] Canonical Codex install set is the D5 skill set in
      `docs/install/codex_skills.md`.

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
- [ ] Codex plugin support remains `manual_fallback` until official/local
      validator and Codex plugin discovery/execution evidence pass.

## D6-10 Release Candidate Boundary

- [x] Release candidate notes exist at `RELEASE_NOTES.md`.
- [x] No publish or push action was performed by D6-10.
- [x] No unsupported support level was upgraded by D6-10.
- [x] `third_party/agent-skills/**` was not modified by D6-10.
- [ ] D6-11 must decide whether this is release-candidate ready, beta-only, or
      blocked.

## Examples

- [ ] `docs/examples/**` exists only as learning material.
- [ ] Each example directory says it is not core protocol.
- [ ] Examples use placeholders.
- [ ] Examples do not create real worktrees or imply command execution.

## Release Prep Recommendation

Release preparation may continue only after D6-10 review and D6-11 final truth
audit accept the evidence boundaries above. Formal publishing, plugin release,
native command support, installer behavior, upstream vendor refresh, and
real-project general availability require separate maintainer or Owner
authorization plus evidence.
