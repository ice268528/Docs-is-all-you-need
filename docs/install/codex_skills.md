# Codex Skills Install

DDDV8 status: Codex package shape plus project-local and Codex-home install fixture evidence.

The Codex package artifact is:

```text
packages/codex-project-local/
```

It is shaped for project-local installation into:

```text
.codex/skills/
```

It also has a Codex-home install fixture for platforms or workflows that install
skills into `$CODEX_HOME/skills`:

```text
skills/
```

This package contains exactly the 12 public DIAYN workflow skills plus the
DIAYN-managed third-party `agent-skills` dependency skills. It does not expose
the internal role/reference skills as public `/diayn-*` commands.

## Skill Folders To Install

The public DIAYN workflow skill surface is:

```text
.codex/skills/diayn-init/
.codex/skills/diayn-plan/
.codex/skills/diayn-worktrees/
.codex/skills/diayn-backend/
.codex/skills/diayn-frontend/
.codex/skills/diayn-review-backend/
.codex/skills/diayn-review-frontend/
.codex/skills/diayn-sync/
.codex/skills/diayn-integration/
.codex/skills/diayn-bug/
.codex/skills/diayn-new/
.codex/skills/diayn-html/
```

The dependency-skill surface is also platform-visible under `.codex/skills/`
so DIAYN can use native nested skill invocation where Codex supports it.
Dependency skills are not public DIAYN commands and must not be presented as
additional `/diayn-*` workflows.

## Package And Install Fixture Validation

The package is built and checked with:

```text
node maintainers\scripts\build_codex_project_local_package.js
node maintainers\scripts\validate_diayn_codex_project_local_package.js --json validation\phase9_codex_project_local_package.json
node maintainers\scripts\install_codex_project_local_package.js --fixture --execute --json validation\phase9_codex_project_local_install_fixture.json
node maintainers\scripts\install_codex_project_local_package.js --codex-home-fixture --execute --json validation\phase9_codex_home_install_fixture.json
node maintainers\scripts\validate_codex_runtime_external_evidence.js --json validation\phase9_codex_runtime_external_evidence.json
node maintainers\scripts\validate_codex_runtime_external_evidence_selftest.js --json validation\phase9_codex_runtime_external_evidence_selftest.json
```

Current static result:

```text
workflow_skill_count: 12
dependency_skill_count: 23
total_project_local_skill_count: 35
```

Current install fixture result:

```text
installed_workflow_skill_count: 12
installed_dependency_skill_count: 23
installed_package_visible: true
metadata_present: true
routing_map_present: true
```

Real Codex Home file-install boundary:

```text
node maintainers\scripts\install_codex_project_local_package.js --target-codex-home <CODEX_HOME>
node maintainers\scripts\install_codex_project_local_package.js --target-codex-home <CODEX_HOME> --execute
```

Real Codex Home install records are local-only diagnostics by default. They may
confirm what was copied on one maintainer machine, but they are not tracked as
remote release evidence and they do not prove Codex Desktop app-session
runtime discovery. The installer reports pre-existing non-package folders in
`target_preflight` and `installed_result.preserved_*`; that residue accounting
is intentional so a global install never silently deletes user files or treats
historical internal skills as V1 public commands.

The project-local install fixture writes the package into a temporary target at
`validation/tmp/codex-install-fixture/` and records the result in
`validation/phase9_codex_project_local_install_fixture.json`. It proves the
copy/install shape for `.codex/skills/` and `.diayn/` metadata without touching
a user's real Codex home or a real target project.

The Codex-home install fixture writes the same skills into
`validation/tmp/codex-home-install-fixture/skills/` and package metadata into
`validation/tmp/codex-home-install-fixture/diayn/docs-is-all-you-need/`. It
records `validation/phase9_codex_home_install_fixture.json` and proves the
`$CODEX_HOME/skills` copy shape without touching the user's real Codex home.

For a real target project, run a dry-run first:

```text
node maintainers\scripts\install_codex_project_local_package.js --target-root <target-project>
```

Execute only after the target and conflicts are acceptable:

```text
node maintainers\scripts\install_codex_project_local_package.js --target-root <target-project> --execute
```

Use `--force` only when the maintainer or Owner has explicitly accepted the
overwrite plan for conflicting `.codex/skills/*` or `.diayn/*` files.

For a real Codex home, run a dry-run first:

```text
node maintainers\scripts\install_codex_project_local_package.js --target-codex-home <CODEX_HOME>
```

Execute only after the target and conflicts are acceptable:

```text
node maintainers\scripts\install_codex_project_local_package.js --target-codex-home <CODEX_HOME> --execute
```

Use this path only when the installing agent or maintainer has selected a
global Codex skills install. It copies skills into `<CODEX_HOME>/skills` and
metadata into `<CODEX_HOME>/diayn/docs-is-all-you-need`.

If the target already contains older DIAYN internal skills or other non-package
skills, the dry-run and execute reports warn about them but leave them in
place. Cleanup or quarantine of those folders requires a separate explicit
Owner/maintainer authorization.

## Runtime Boundary

Codex Desktop runtime discovery and direct `/diayn-*` invocation are still not
proven by file installation alone. The current repository has proof that the
right files can be packaged and copied into Codex-compatible shapes, but it
still needs evidence from the current or reloaded Codex app session that:

- all 12 public `/diayn-*` workflows are discovered as usable skills;
- direct `/diayn-*` invocation loads the matching workflow skill;
- a DIAYN workflow can use a DIAYN-managed dependency skill natively;
- the complete installed flow can run from the Codex app session.

Therefore this file documents a validated package shape, executed install
fixtures, and the local-only real-install boundary, not a proven Codex runtime
flow. Do not claim Codex alpha support until current/reloaded app-session
evidence proves installed discovery, direct `/diayn-*` invocation,
dependency-skill invocation, and the complete DIAYN flow.

The committed runtime-evidence validator records the blocker and the future
evidence required to clear it:

```text
validation/phase9_codex_runtime_external_evidence.json
validation/phase9_codex_runtime_external_evidence_selftest.json
```

Local executable probes and real Codex Home install outputs can be useful while
debugging, but they are not committed remote evidence by default and they do
not clear the runtime blocker by themselves.

When Codex Desktop can run in a suitable environment, copy
`docs/install/codex_runtime_external_evidence_template.json` to
`validation/codex_runtime_external_evidence.input.json`, replace every
placeholder with real logs, screenshots, transcripts, or generated fixture
paths, and run. Keep private local scratch evidence out of Git unless the
maintainer intentionally sanitizes and promotes it as release evidence. If
promoted, every `evidence_refs` entry must be a repo-relative path to an
existing committed evidence file. The validator rejects
`<...>` placeholder values, empty evidence references, absolute paths, URLs,
paths outside the repository, and repo-relative paths that do not exist, so
copying the template unchanged or inventing evidence references cannot clear
the blocker:

Do not launch a new Codex process from a shell to satisfy this gate. The
evidence input must include a structured `skill_discovery_snapshot` proving
that the current, reloaded, or new Codex Desktop app session discovered all 12
public workflow skills and at least one DIAYN-managed dependency skill before
command invocation evidence is accepted.

```text
node maintainers\scripts\validate_codex_runtime_external_evidence.js --evidence validation\codex_runtime_external_evidence.input.json --json validation\phase9_codex_runtime_external_evidence.json
```

The validator selftest should also remain green:

```text
node maintainers\scripts\validate_codex_runtime_external_evidence_selftest.js --json validation\phase9_codex_runtime_external_evidence_selftest.json
```

That evidence must prove package discovery, all 12 direct `/diayn-*`
invocations, routed dependency-skill invocation, progressive disclosure,
role/lane checks, review rejection, sync/integration separation, Owner
acceptance, closeout, next-stage refresh, and focused side scenarios before
the Codex runtime blocker can be cleared.

## First Use

After installation, open the target project in Codex and begin with:

```text
/diayn-init
```

If Codex does not select a DIAYN skill automatically, name the skill:

```text
Use diayn-init and follow /diayn-init.
```

Then continue with the canonical flow:

```text
/diayn-plan
/diayn-worktrees
/diayn-backend
/diayn-frontend
/diayn-review-backend
/diayn-review-frontend
/diayn-sync
/diayn-integration
```

The commands are workflow triggers inside chat. They are not shell commands and do not create a hidden agent runtime.

## Existing Project Upgrade

Existing project upgrade behavior is part of `/diayn-init`. Use `/diayn-init`
when a project already has README, AGENTS.md, CLAUDE.md, docs, or `.diayn/`
content and needs a safe DIAYN retrofit.

The bundled helper is local to the `diayn-init` skill folder:

```powershell
python .codex/skills/diayn-init/scripts/harness_audit.py --project-root <project>
```

It is a dry-run audit helper, not a global CLI. It outputs inventory,
conflicts, and OwnerGate items. It does not overwrite files, apply patches,
create worktrees, or commit unless the active DIAYN workflow has explicit Owner
approval for the relevant operation.
