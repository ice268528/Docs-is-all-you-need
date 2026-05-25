# Agent Skills Vendor Update Checklist

Use this checklist only for maintainer-side upstream sync.

1. Obtain the upstream snapshot.
   - Prefer a local `agent-skills/` directory.
   - If network is required, get explicit authorization and record the source.
2. Confirm provenance.
   - Record source URL, source commit, working tree state, and license status.
   - Write `Unknown / To be confirmed` for anything not proven.
3. Compare watched skills.
   - Review direct tracking skills.
   - Review adaptation-required skills.
   - Review reference-only areas for awareness.
4. Generate a difference report.
   - Summarize file additions, removals, and material behavior changes.
   - Keep the report maintainer-facing.
5. Classify each material change.
   - `direct_sync`
   - `needs_adaptation`
   - `not_absorbed`
   - `protocol_conflict_owner_gate`
6. Check DIAYN protocol conflicts.
   - Role authority.
   - Status semantics.
   - lane WIP and handoff.
   - session identity guard.
   - OwnerGate and Owner acceptance UX.
7. Update the vendor copy.
   - Use vendor copy.
   - Do not create submodules or subtrees.
   - Do not overwrite DIAYN protected paths.
8. Update `vendor.lock.md`.
   - Source URL and commit.
   - sync date and method.
   - included and excluded paths.
   - watched skills.
   - license and attribution result.
   - latest sync summary.
9. Update `docs/meta/session_skill_mapping.md`.
   - Add or refine only upstream skill mapping.
   - Do not change DIAYN role authority unless the stage explicitly authorizes it.
10. Run scaffold validation.
   - Check that `third_party/agent-skills/.git` does not exist.
   - Check DIAYN core skills are unchanged unless separately authorized.
   - Check no plugin, adapter, CLI, or runtime was introduced outside the current stage.
11. Write the sync report.
   - Use `sync_report_template.md`.
   - Include unresolved OwnerGate items.
   - State whether ordinary `/diayn` users are affected.

## Change Type Definitions

- `direct_sync`: upstream change can remain inside the vendor copy and may be referenced by DIAYN without altering protocol.
- `needs_adaptation`: upstream change is useful but must be translated into DIAYN role, status, lane, and document authority terms.
- `not_absorbed`: upstream change is not useful for DIAYN or is tool-specific beyond the current stage.
- `protocol_conflict_owner_gate`: upstream change conflicts with DIAYN multi-session protocol and requires Owner decision before absorption.
