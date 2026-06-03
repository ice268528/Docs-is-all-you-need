# DDDV8 Phase 3 DIAYN-Managed Dependency Skills

This file records the Phase 3 implementation of the third-party `agent-skills` dependency model.

## 1. Vendor Audit

The maintainer dry-run helper compared:

```text
../agent-skills/
third_party/agent-skills/
```

Result:

- source commit: `250ffaa`;
- vendor lock source commit: `250ffaa`;
- source status: clean;
- expected skills: 23;
- vendored skills: 23;
- source skills: 23;
- changed skills: none;
- license present in source and vendor copy;
- one known non-material Windows representation difference: `.opencode/skills`.

Evidence:

```text
maintainers/upstream-agent-skills/latest_dry_run_report.md
```

## 2. Packaged Dependency Payload

The Codex plugin candidate now carries a DIAYN-managed dependency payload:

```text
plugins/docs-is-all-you-need/dependency-skills/agent-skills/
```

Payload metadata:

```text
plugins/docs-is-all-you-need/dependency-skills/manifest.json
```

The dependency payload includes all 23 vendored upstream skills, root upstream
`references/` files used by those skills, and the upstream MIT `LICENSE`.

These dependency skills are implementation dependencies. They are not additional public DIAYN commands. The public DIAYN surface remains exactly the 12 `/diayn-*` workflow skills.

## 3. Invocation Boundary

Normal DIAYN third-party composition requires:

```text
public /diayn-* workflow
-> DIAYN Skill Router selects locked dependency skill
-> platform-native nested skill invocation or equivalent native skill tool call
-> DIAYN workflow retains role/lane/state/review/integration/Owner authority
```

Direct reading of vendored upstream `SKILL.md` files is fallback/reference behavior only. It does not count as native third-party skill invocation evidence.

Uncontrolled user-installed `agent-skills` copies must not be selected silently. A substitution needs matching provenance/version/skill names/routing compatibility or explicit Owner/maintainer approval.

## 4. Routing Coverage

The routing map now covers:

- all 12 public DIAYN workflows;
- all 23 vendored upstream dependency skills;
- routing rationale;
- DIAYN overrides;
- low-noise reporting rules;
- invocation mode reporting when evidence matters.

Routing map:

```text
maintainers/internal-skills/diayn-skill-router/references/upstream-routing-map.md
```

## 5. Validation

Dependency validator:

```text
node maintainers\scripts\validate_diayn_dependency_skills.js --json validation\phase3_dependency_skills.json
```

Result: `ok: true`.

Validation checks:

- vendor, packaged dependency payload, and manifest each contain 23 skills;
- packaged dependency skill hashes match the vendored skill hashes;
- packaged dependency references match the vendored references;
- vendor and package license files exist;
- routing map has one full-coverage row for every dependency skill;
- router skill requires native/equivalent dependency-skill invocation;
- router skill states fallback direct reading is not real invocation;
- plugin internal router copy matches the repository router source.

Evidence file:

```text
validation/phase3_dependency_skills.json
```

## 6. Remaining Work

Phase 3 packages and validates the controlled dependency payload. Phase 4 still needs to implement alpha-surface installation/registration mechanics and prove actual platform-visible dependency resolution.
