# DDDV8 Phase 2 Public Workflow Skill Surface

This file records the Phase 2 implementation of the DDDV8 public skill surface.

## 1. Public Surface Implemented

The repository now contains 12 public workflow skill skeletons:

```text
skills/diayn-init/
skills/diayn-plan/
skills/diayn-worktrees/
skills/diayn-backend/
skills/diayn-frontend/
skills/diayn-review-backend/
skills/diayn-review-frontend/
skills/diayn-sync/
skills/diayn-integration/
skills/diayn-bug/
skills/diayn-new/
skills/diayn-html/
```

Each public `SKILL.md` includes:

- frontmatter `name` matching its directory;
- a description that mentions the matching `/diayn-*` command;
- progressive startup rules;
- workflow steps;
- allowed writes;
- stop conditions;
- output expectations.

The repository root `skills/` directory is a source workspace, not the
install surface. It contains public workflow source plus internal
role/reference source. Historical D5/D6 skill sources are isolated under
`maintainers/legacy-skills/`; they are not extra public V1 commands.

Current root source inventory:

```text
public_workflow_skills: 12
internal_role_reference_skills: 8
legacy_in_root: 0
legacy_source_inventory: 7
unclassified: 0
```

## 2. Plugin Candidate Surface

The Codex plugin candidate now exposes only the 12 public workflow skills under:

```text
plugins/docs-is-all-you-need/skills/
```

Older role-oriented skill material has been moved out of the plugin public skill surface and retained as implementation reference material:

```text
plugins/docs-is-all-you-need/internal-role-skills/
```

This preserves the DDDV8 rule that Controller, Executor, Reviewer, Integrator, Identity Guard, Owner UX, and Skill Router are internal/shared concepts, not the public installed command surface.

## 3. Progressive Disclosure Contract

The workflow skill skeletons intentionally do not copy the full DIAYN protocol into every skill. Each starts by confirming command identity and then loads only the command-relevant target-project docs, lane docs, shared contracts, or DIAYN-managed third-party dependency skills needed for the current task.

Detailed behavior still needs later phases:

- Phase 3: DIAYN-managed third-party dependency registration and routing.
- Phase 4: alpha-surface install packaging.
- Phase 5: Controller init/plan behavior.
- Phase 6: worktree/session entry behavior.
- Phase 7: lane execution, review, sync, integration, and closeout behavior.
- Phase 8: Owner UX and maintainer utilities.

## 4. Validation

Static validator:

```text
node maintainers\scripts\validate_diayn_public_skill_surface.js --json validation\phase2_public_skill_surface.json
```

Result: `ok: true`.

Validation checks:

- all 12 expected root workflow skills exist;
- root `skills/` has a README explaining it is source material, not an install
  surface;
- all non-public root skill directories are classified as internal
  role/reference source;
- historical D5/D6 skill sources are isolated under
  `maintainers/legacy-skills/`;
- plugin public skill directory contains exactly the 12 expected workflow skills;
- each public skill has `SKILL.md` frontmatter;
- each public skill description mentions the matching `/diayn-*` command;
- each public skill has progressive startup, allowed writes, and stop conditions.

Evidence file:

```text
validation/phase2_public_skill_surface.json
```
