# Release Readiness Checklist

This checklist is for preparing a DIAYN scaffold release after Stage 09 review.
It does not publish a release by itself.

## Required Before Release Preparation

- [ ] Stage 01 through Stage 09 execution records exist.
- [ ] Stage 01 through Stage 08 review results are `PASS` or `PASS_WITH_RISK`.
- [ ] Stage 09 review result exists and allows release preparation.
- [ ] `git diff --check` passes.
- [ ] The final consistency report has no blocking issue.
- [ ] Remaining risks are documented and accepted by the Owner or maintainer.

## Protocol And Templates

- [ ] Canonical status authority is `docs/meta/status_model.md`.
- [ ] `/diayn` command authority is `docs/meta/diayn_command_reference.md`.
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
- [ ] Unknown tool capabilities remain `Unknown / To be confirmed`.
- [ ] Cursor and Copilot rules are lightweight exports, not full protocol dumps.
- [ ] Codex plugin material remains draft-only unless a later release stage
      validates official plugin packaging.

## Examples

- [ ] `docs/examples/**` exists only as learning material.
- [ ] Each example directory says it is not core protocol.
- [ ] Examples use placeholders.
- [ ] Examples do not create real worktrees or imply command execution.

## Release Prep Recommendation

Release preparation may begin when all required items above are checked and the
Stage 09 review result is available. Formal publishing, plugin release, and
installer behavior require separate maintainer authorization.
