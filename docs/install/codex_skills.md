# Codex Skills Install

DDDV8 status: Codex package shape plus project-local and Codex-home install fixture evidence.

The Codex package artifact is:

```text
packages/codex-project-local/
```

The repository-root Codex plugin entrypoint is:

```text
.codex-plugin/plugin.json
```

It points at:

```text
packages/codex-project-local/.codex/skills/
```

This root entrypoint mirrors the `superpowers` style of a repository-root
Codex manifest while keeping the app-session runtime boundary honest. It includes
repository/homepage/license/keyword metadata and Codex UI fields such as
`Read`/`Write` capabilities, website URL, policy URLs, brand color, and an
empty screenshots list. It intentionally does not point at `composerIcon` or
`logo` paths until real assets are committed.

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

The 12 public DIAYN workflow skills in the Codex package also include
Codex-specific `agents/openai.yaml` metadata. That metadata is generated into
the Codex package only; it is not required for Claude Code and is not added to
the locked third-party dependency skills.

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
codex_agents_openai_yaml_count: 12
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
confirm what was copied on one maintainer machine, but the committed release
evidence uses fixtures and directory inspection instead of private machine
state. The installer reports pre-existing non-package folders in
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

## Validation Boundary

Current Codex validation stops at the install
command and installed directory inspection. The current repository proves that
the right files can be packaged and copied into Codex-compatible shapes:

- all 12 public `/diayn-*` workflow skills are present;
- all 23 DIAYN-managed dependency skills are present;
- Codex `agents/openai.yaml` metadata exists for the 12 public workflow skills;
- `.diayn` routing and metadata are copied into the target shape;
- pre-existing non-package skills are reported and preserved.

This file documents a validated Codex package/install alpha surface, not a
Codex Desktop app-session runtime flow. Codex Desktop discovery, direct
`/diayn-*` invocation, native dependency-skill invocation, and complete flow
execution inside the Desktop app require separate runtime evidence before they
can be claimed.

The committed runtime-evidence validator remains as an optional future intake
for app-session evidence:

```text
validation/phase9_codex_runtime_external_evidence.json
validation/phase9_codex_runtime_external_evidence_selftest.json
```

Local executable probes and real Codex Home install outputs can be useful while
debugging, but they are not committed release evidence by default and they do
not create a Desktop app-session runtime claim.

Do not launch Codex Desktop or a new Codex process to satisfy the current
package/install gate. A future app-session claim may use
`docs/install/codex_runtime_external_evidence_template.json`, but that evidence
is outside the current validation scope.

```text
node maintainers\scripts\validate_codex_runtime_external_evidence.js --evidence validation\codex_runtime_external_evidence.input.json --json validation\phase9_codex_runtime_external_evidence.json
```

The validator selftest should also remain green:

```text
node maintainers\scripts\validate_codex_runtime_external_evidence_selftest.js --json validation\phase9_codex_runtime_external_evidence_selftest.json
```

That optional future evidence would need to prove package discovery, all 12
direct `/diayn-*` invocations, routed dependency-skill invocation, progressive
disclosure, role/lane checks, review rejection, sync/integration separation,
Owner acceptance, closeout, next-stage refresh, and focused side scenarios
before a Desktop app-session runtime claim could be made.

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
