# DDDV8 Phase 4 Package Artifacts

This file records the Phase 4 package artifacts for Codex Desktop and Claude Code CLI. The filename is historical; Phase 4 evidence is package and smoke-test evidence, not an alpha support claim by itself.

## 1. Claude Code Package

Added package files:

```text
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
.claude/commands/*.md
plugins/docs-is-all-you-need/.claude-plugin/plugin.json
plugins/docs-is-all-you-need/.claude-plugin/marketplace.json
plugins/docs-is-all-you-need/.claude/commands/*.md
```

The repository-root Claude package declares:

- `commands`: `./.claude/commands`
- `skills`: `./plugins/docs-is-all-you-need/dependency-skills/agent-skills/skills`

This root entrypoint follows the reference-project pattern where the repository
root can be the plugin source. Its root `.claude/commands` files are synchronized
from the inner plugin command adapters so the published root entrypoint does not
point through a nested plugin directory. Claude Code discovers the 12 DIAYN
workflow skills from repository-root `skills/`; the manifest explicitly
registers only the 23 DIAYN-managed dependency skills. This makes both workflow
and dependency skills platform-visible without re-registering the workflow
skills through the project-local package.

The inner local plugin candidate declares:

- `commands`: `./.claude/commands`
- `skills`: `./skills`

Each command file invokes the matching public workflow skill, for example:

```text
/diayn:init -> diayn:diayn-init
```

Validation:

```text
claude plugin validate .
claude plugin validate plugins\docs-is-all-you-need
```

Result: both repository-root and inner plugin validation passed.

## 2. Codex Package

The Codex package/install surface remains:

```text
packages/codex-project-local/
```

The historical repository-root Codex manifest points to the platform-visible
generated skills package:

```json
"skills": "./packages/codex-project-local/.codex/skills/"
```

That root manifest is legacy candidate material and is not the current isolated
Codex plugin marketplace surface.

The generated Codex package adds `agents/openai.yaml` to the 12 public DIAYN
workflow skills so Codex gets product-specific display/default-prompt metadata.
The locked third-party dependency skills remain upstream-compatible and are not
modified with DIAYN-authored Codex UI metadata.

The isolated Codex plugin marketplace candidate is:

```text
plugins/codex/marketplace.json
plugins/codex/plugins/diayn/
plugins/codex/plugins/diayn/.codex-plugin/plugin.json
plugins/codex/plugins/diayn/skills/
```

It points to the plugin skill surface with:

```json
"skills": "./skills/"
```

The isolated candidate skill directory contains the 12 workflow skills plus the
23 DIAYN-managed dependency skills. Codex direct discovery could not be tested
in this environment, so direct `/diayn-*` invocation and plugin-installed
dependency-skill invocation still require current or reloaded app-session
evidence.

The Codex project-local package candidate uses the target `.codex/skills` shape:

```text
packages/codex-project-local/.codex/skills/diayn-*
packages/codex-project-local/.codex/skills/<agent-skills-name>
packages/codex-project-local/.diayn/dependency-routing/upstream-routing-map.md
packages/codex-project-local/.diayn/internal-role-skills/
packages/codex-project-local/diayn-package.json
```

Static validation proves the package contains 12 public DIAYN workflow skills and 23 DIAYN-managed dependency skills. The install fixtures prove that package can be copied into a temporary project-local `.codex/skills` plus `.diayn` target and into a temporary Codex-home `skills` plus `diayn/docs-is-all-you-need` target. Neither result proves Codex Desktop runtime discovery or invocation.

## 3. Dependency Payload

The same package carries the DIAYN-managed dependency payload:

```text
plugins/docs-is-all-you-need/dependency-skills/
```

Phase 4 does not yet prove platform-native dependency registration. It ensures the package carries the locked payload and that later install validation has one controlled source to register.

## 4. Validation

Local package validator:

```text
node maintainers\scripts\validate_diayn_alpha_package.js --json validation\phase4_alpha_package.json
node maintainers\scripts\validate_diayn_codex_project_local_package.js --json validation\phase9_codex_project_local_package.json
node maintainers\scripts\validate_diayn_codex_plugin_candidate.js
node maintainers\scripts\install_codex_project_local_package.js --fixture --execute --json validation\phase9_codex_project_local_install_fixture.json
node maintainers\scripts\install_codex_project_local_package.js --codex-home-fixture --execute --json validation\phase9_codex_home_install_fixture.json
```

Result: `ok: true`.

Validation checks:

- plugin public skill surface has exactly 12 workflow skills;
- Claude plugin command directories have exactly 12 short command files;
- each Claude plugin command invokes the matching namespaced public workflow skill;
- repository-root Claude manifest points commands to root DIAYN command adapters and explicitly registers only the bundled dependency skills;
- legacy Codex manifests remain candidate material, not runtime proof;
- isolated Codex plugin candidate points at `plugins/codex/plugins/diayn/skills/`;
- isolated Codex plugin candidate contains the 12 workflow skills and 23 dependency skills;
- repository-root Codex manifest remains historical and points at the generated platform-visible Codex package;
- Codex project-local package points at `.codex/skills`;
- Codex project-local package contains the 12 workflow skills and 23 DIAYN-managed dependency skills;
- Codex project-local package contains `agents/openai.yaml` for all 12 public DIAYN workflow skills;
- Claude project-local package contains the 12 workflow skills and 23 DIAYN-managed dependency skills;
- Codex project-local install fixture copies those skills plus `.diayn` routing metadata into a temporary target;
- Codex-home install fixture copies those skills plus package metadata into temporary `skills/` and `diayn/docs-is-all-you-need/` targets;
- Claude manifest points at the command and public skill directories;
- dependency payload is present;
- OpenCode remains deferred in install truth.

## 5. Release Boundary

Phase 4 creates and validates package artifacts and repeatable install/copy smoke tests. It does not claim:

- published marketplace install;
- Codex app discovery;
- Codex `.codex/skills` runtime discovery;
- direct `/diayn-*` invocation in Codex;
- full installed flow;
- native dependency-skill invocation.

Those remain installed-flow release gates.

Phase 9 historical follow-up found that Claude Code loaded the old plugin namespace as namespaced commands and namespaced skills and could invoke `docs-is-all-you-need:diayn-init` through the native `Skill` tool. Bare `/diayn-init` returned `Unknown command` in that plugin-dir probe. Current DIAYN plugin command names are short namespaced commands such as `/diayn:init` and require current runtime verification.

Phase 9 also adds a separate Claude project-local package candidate at `packages/claude-project-local/`. That package proves bare `/diayn-init` command-to-skill smoke behavior, direct native loading of the DIAYN-managed `idea-refine` dependency skill, and routed `/diayn-init -> idea-refine` dependency loading. The Phase 4 plugin artifact still must not be described as satisfying the final DDDV8 bare `/diayn-*` entry requirement by itself.
