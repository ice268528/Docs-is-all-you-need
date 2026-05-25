# Upstream Agent Skills Sync Policy

## Purpose

`agent-skills` is an upstream engineering method library. DIAYN is the multi-session collaboration control plane for Docs-is-all-you-need.

The upstream library can inform implementation, review, testing, planning, and documentation practices, but it must not replace DIAYN role authority, document authority, status transitions, handoff rules, or OwnerGate behavior.

## Current Strategy

- Sync method: vendor copy.
- Vendor path: `third_party/agent-skills/`.
- Lock file: `vendor.lock.md`.
- Execution owner: project maintainers only.
- User-facing `/diayn` workflows must not ask terminal users to understand or run vendor sync.

Submodule and subtree are not used in this stage. A future change to that strategy requires an explicit Owner decision.

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

- `skills/multi-session-controller/`
- `skills/multi-session-executor/`
- `skills/multi-session-reviewer/`
- `skills/multi-session-integrator/`
- `skills/session-identity-guard/`
- `skills/owner-decision-ux/`
- `skills/context-compact-reminder/`
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
2. Compare watched skills and reference files.
3. Classify changes as direct sync, needs adaptation, not absorbed, or protocol conflict.
4. Update the vendor copy only after DIAYN protected paths are confirmed untouched.
5. Update `vendor.lock.md`, `docs/meta/session_skill_mapping.md`, and the sync report.
6. Run scaffold validation appropriate to the current stage.

This is a maintainer workflow. It is not part of normal project Owner acceptance or lane execution.
