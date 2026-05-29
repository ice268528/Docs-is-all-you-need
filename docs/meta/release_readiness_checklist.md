# Release Readiness Checklist

This checklist is for preparing a DIAYN V1 scaffold release after the DDDV5
truth audit.
It does not publish a release by itself.

## Required Before Release Preparation

- [ ] D5-01 through D5-12 execution records exist.
- [ ] D5-01 through D5-11 review results are `PASS` or `PASS_WITH_RISK`.
- [ ] D5-12 review result exists and accepts the final truth audit.
- [ ] `git diff --check` passes.
- [ ] The final support matrix classifies every major capability as
      `working`, `manual_fallback`, `documented_only`, `draft_only`,
      `missing`, or `blocked_by_owner_decision`.
- [ ] The release truth audit has no blocking issue.
- [ ] Remaining risks are documented and accepted by the Owner or maintainer.
- [ ] Real-project validation status is explicit. If no Owner-approved real
      project evidence exists, release readiness does not exceed preview/beta.

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

## Tool Adapters

- [ ] Adapter docs live under `integrations/**`.
- [ ] Adapters do not redefine core status, command, role, permission, or
      worktree semantics.
- [ ] Unknown or unsmoke-tested tool capabilities remain at
      `manual_fallback`, `documented_only`, `draft_only`, `missing`, or
      `Unknown / To be confirmed`.
- [ ] Cursor and Copilot remain out of V1 active scope unless a later Owner
      decision changes that.
- [ ] Codex plugin material remains draft-only until official plugin packaging
      is implemented and validated.

## Examples

- [ ] `docs/examples/**` exists only as learning material.
- [ ] Each example directory says it is not core protocol.
- [ ] Examples use placeholders.
- [ ] Examples do not create real worktrees or imply command execution.

## Release Prep Recommendation

Release preparation may begin when all required items above are checked and the
D5-12 review result is available. Formal publishing, plugin release, native
command support, installer behavior, and real-project general availability
require separate maintainer or Owner authorization plus evidence.
