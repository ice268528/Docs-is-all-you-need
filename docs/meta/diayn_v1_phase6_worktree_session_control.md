# DIAYN V1 Phase 6 Worktree And Session Entry Control Record

Status: checkpoint evidence for DDDV8 Phase 6

Authoritative requirement source:

```text
../DDDV8/diayn_v1_skill_pack_requirements.md
```

## Scope

Phase 6 implements the `/diayn-worktrees` Controller workflow support needed before lane execution:

- Git and dirty-state preflight.
- Applicable backend/frontend lane handling.
- `not_applicable` lane handling without fake worktrees.
- Suggested branch and path planning.
- Copyable `git worktree add` commands.
- Optional authorized execution boundary.
- Session registry, local identity, worker launch, reviewer launch, and entry checklist templates.
- Fresh-session re-entry guidance for every `/diayn-*` work turn.

This phase does not implement backend/frontend lane work, review decisions, `/diayn-sync`, or `/diayn-integration`.

## Implemented Artifacts

- `/diayn-worktrees` now points to `scripts/worktree_plan.py`.
- `/diayn-worktrees` now points to `assets/worktrees/`.
- The plugin public `/diayn-worktrees` skill includes the same script and assets as the root skill.
- `docs/meta/diayn_commands/worktrees.md` records the dry-run-first and authorization boundary.
- `maintainers/scripts/validate_diayn_phase6_worktrees.js` validates root/plugin copies and fixture worktree-plan evidence.

## Worktree Script

`skills/diayn-worktrees/scripts/worktree_plan.py` emits a dry-run plan by default. It reports:

- project root, project slug, stage ID
- Git top-level, branch, head, dirty state, and worktree list errors
- lane applicability
- planned worktree path and suggested branch for applicable lanes
- copyable `git worktree add` commands
- worker startup commands
- reviewer startup commands using the same lane worktree
- OwnerGate items for dirty state, Git failure, or blocked target paths

Actual worktree creation requires the caller to pass `--execute`. The script refuses execution while OwnerGate items are open unless the authorized caller explicitly supplies an override such as `--allow-dirty`.

## Session Entry Assets

```text
skills/diayn-worktrees/assets/worktrees/
  session_registry.md
  local_session_identity.md
  lane_launch_prompt.md
  review_launch_prompt.md
  entry_checklist.md
```

These assets keep new sessions and cleared contexts recoverable without loading every DIAYN rule. Worker and reviewer sessions start with their matching `/diayn-*` command, identity check, lane board, handoff, and relevant shared docs.

## Validation Evidence

```text
validation/phase6_worktree_plan.json
validation/phase6_not_applicable_worktree_plan.json
validation/phase6_worktrees.json
```

The first plan proves backend/frontend copyable worktree and launch commands. The second plan proves a `not_applicable` frontend lane does not receive a fake worktree. The validator confirms root/plugin skill parity and dry-run-only evidence.
