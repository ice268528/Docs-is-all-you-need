# Upstream Agent Skills Sync Policy

## Purpose

`agent-skills` is an upstream engineering method library. DIAYN is the multi-session collaboration control plane for Docs-is-all-you-need.

The upstream library can inform implementation, review, testing, planning, and documentation practices, but it must not replace DIAYN role authority, document authority, status transitions, handoff rules, or OwnerGate behavior.

## Current Strategy

- Sync method: vendor copy.
- Vendor path: `third_party/agent-skills/`.
- Lock file: `vendor.lock.md`.
- Packaged dependency payload: `plugins/docs-is-all-you-need/dependency-skills/agent-skills/`.
- Execution owner: project maintainers only.
- Dry-run report helper: `maintainers/scripts/agent_skills_vendor_sync_report.py`.
- User-facing `/diayn` workflows must not ask terminal users to understand or run vendor sync.

Submodule and subtree are not used in this stage. A future change to that strategy requires an explicit Owner decision.

## DDDV8 Dependency Invocation Boundary

- DIAYN vendors the full upstream baseline and packages a DIAYN-managed locked
  dependency payload.
- Normal users install DIAYN once. They do not install each upstream skill
  separately.
- Platforms that require platform-visible skills for nested invocation must
  install or register the DIAYN-managed dependency payload.
- Real composition evidence requires platform-native nested skill invocation or
  an equivalent native skill tool call against the locked DIAYN-managed copy.
- Reading vendored `SKILL.md` files directly is fallback/reference behavior and
  does not prove native dependency-skill composition.
- Do not silently select uncontrolled user-installed dependency copies.

## Non-Negotiable DIAYN Boundary

Upstream updates must never overwrite or weaken:

- DIAYN multi-session role separation.
- `candidate_done` versus `done` review semantics.
- lane-local WIP and handoff rules.
- session identity guard behavior.
- Owner decision and Owner experience acceptance UX.
- repository documents as system of record.

When upstream guidance conflicts with DIAYN control-plane rules, DIAYN wins. If the conflict changes the product direction or user experience, route it through OwnerGate before absorbing it.

## Protected Paths

Do not overwrite these paths from upstream:

- `skills/diayn-init/`
- `skills/diayn-plan/`
- `skills/diayn-worktrees/`
- `skills/diayn-backend/`
- `skills/diayn-frontend/`
- `skills/diayn-review-backend/`
- `skills/diayn-review-frontend/`
- `skills/diayn-sync/`
- `skills/diayn-integration/`
- `skills/diayn-bug/`
- `skills/diayn-new/`
- `skills/diayn-html/`
- `maintainers/internal-skills/diayn-controller/`
- `maintainers/internal-skills/diayn-executor/`
- `maintainers/internal-skills/diayn-reviewer/`
- `maintainers/internal-skills/diayn-integrator/`
- `maintainers/internal-skills/diayn-skill-router/`
- `maintainers/internal-skills/diayn-identity-guard/`
- `maintainers/internal-skills/diayn-owner-ux/`
- `maintainers/internal-skills/update-diayn-scaffold/`
- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `.diayn/`

## Source Truth Rules

- Use a local upstream snapshot when available.
- Record the local source path, source URL, source commit, sync method, and sync date in `vendor.lock.md`.
- If URL, commit, version, date, or license cannot be confirmed, write `Unknown / To be confirmed`.
- Do not invent upstream facts.
- Keep attribution and license files inside `third_party/agent-skills/`.

## Maintainer Flow

1. Inspect upstream source and confirm its provenance.
2. Run the dry-run report helper before copying any upstream file:

   ```powershell
   python maintainers/scripts/agent_skills_vendor_sync_report.py --repo-root . --source-path ../agent-skills --output maintainers/upstream-agent-skills/latest_dry_run_report.md
   ```

3. Compare watched skills and reference files.
4. Classify changes as direct sync, needs adaptation, not absorbed, or protocol conflict.
5. Update the vendor copy only after DIAYN protected paths are confirmed untouched.
6. Update `vendor.lock.md`, `docs/meta/session_skill_mapping.md`, and the sync report only after review.
7. Run scaffold validation appropriate to the current stage.

This is a maintainer workflow. It is not part of normal project Owner acceptance or lane execution.

## Dry-Run Helper Boundaries

`maintainers/scripts/agent_skills_vendor_sync_report.py` is a read-only reporting helper.

It may:

- identify the current local upstream commit when a local source path is available;
- compare upstream and vendored skill names and directory hashes;
- report added, removed, and changed upstream skills;
- check whether the expected 23-skill map changed;
- list DIAYN protected paths that must not be overwritten;
- summarize `vendor.lock.md` lock information and update prerequisites.

It must not:

- fetch from the network;
- update `third_party/agent-skills/**`;
- update `vendor.lock.md`;
- modify DIAYN-owned skills or protocol files;
- present maintainer sync as an ordinary `/diayn-*` user workflow.

If network access or local source provenance is unavailable, record the limitation in the report instead of claiming a verified upstream sync.
