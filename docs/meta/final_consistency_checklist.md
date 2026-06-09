# Final Consistency Checklist

This checklist closes the multi-session DIAYN scaffold work. It checks whether
the protocol, templates, skills, vendor copy, and tool adapters agree without
turning any single tool or example into the source of truth.

## Authority Order

When files disagree, resolve them in this order:

1. `docs/meta/**` core protocol documents.
2. Active project control docs such as `.diayn/**`, `docs/shared/**`, and
   `docs/lanes/**`.
3. `skills/**` as progressive-disclosure workflow packaging for agents.
4. `integrations/**` as tool-specific adapter guidance.
5. `docs/templates/**` as copyable starting points.
6. `docs/examples/**` as examples only.
7. `third_party/agent-skills/**` as vendored upstream reference material only.

## Required Consistency Checks

| Area | Expected rule | Current result |
| --- | --- | --- |
| Status names | Canonical multi-session states come from `docs/meta/status_model.md`. | Pass. Legacy terms are migration inputs, not final multi-session states. |
| Worker authority | Worker sessions may mark at most `candidate_done`, `blocked`, or `owner_gate`. | Pass. Protocol, templates, skills, and adapters repeat this boundary. |
| Reviewer authority | Review sessions decide `done` or `rejected`; they do not mark `owner_accepted`. | Pass. |
| Candidate vs done | `candidate_done` is not final completion. | Pass. |
| Done vs Owner acceptance | `done` is independent review acceptance; `owner_accepted` is business acceptance by the Owner. | Pass. |
| Integration readiness | `ready_for_e2e` requires reviewed work and integration evidence. | Pass. |
| Worktree path | Default path is `../worktrees/<project_slug>/<lane>`. | Pass. No stage-bound backend/frontend worktree path is required. |
| Worker visibility | Worker launch and handoff docs require lane board, handoff, current stage detail, and shared docs to be visible. | Pass. |
| `.diayn/` boundary | Shared `.diayn/*.md` files may be project authority; `.diayn/local/**` is local-only. | Pass. |
| Entry files | `AGENTS.md`, `CLAUDE.md`, and `SKILL.md` stay short and link outward. | Pass. |
| Project neutrality | Core protocol uses placeholders and lanes, not a specific product or stack. | Pass. |
| Vendor boundary | `third_party/agent-skills/**` cannot overwrite DIAYN harness rules. | Pass. |
| Adapter boundary | `integrations/**` cannot redefine DIAYN command, role, status, or worktree semantics. | Pass. |
| Plugin status | Codex plugin material is draft preparation only, not installable release content. | Pass. |
| Examples | Examples must be isolated under `docs/examples/**` and marked non-core. | Pass after the example isolation policy and README are present. |

## Legacy Compatibility Notes

Some older scaffold files still contain single-session terms such as
`auto_verified` and `accepted`. These are not treated as blocking conflicts when:

- `docs/meta/status_model.md` defines canonical multi-session states.
- `docs/meta/legacy_migration_guide.md` explains how to migrate older state names.
- New lane work uses lane root indexes plus `docs/lanes/<lane>/stages/<stage-id>/**` and the lane board template.

Do not silently rewrite legacy project history. Migrate active work deliberately
and preserve evidence links.

## Final Pass Criteria

The scaffold is consistent enough for release preparation when:

- Every D5-01 through D5-11 review result is `PASS` or `PASS_WITH_RISK`.
- The D5-12 final support matrix, release truth audit, remaining risks, release
  gate, and review notes exist.
- D5-12 does not treat controlled fixture validation as real-project
  validation.
- No D5-12 edit touches `third_party/agent-skills/**`, publishes a plugin,
  creates real worktrees, or changes core `/diayn-*` semantics.
