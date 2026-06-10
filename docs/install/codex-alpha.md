# Codex Alpha Package

DDDV8 Codex pre-alpha package shape lives under:

```text
packages/codex-project-local/
plugins/codex/
plugins/codex/plugins/diayn/
```

Relevant package files:

```text
packages/codex-project-local/.codex/skills/
packages/codex-project-local/diayn-package.json
plugins/codex/marketplace.json
plugins/codex/plugins/diayn/.codex-plugin/plugin.json
plugins/codex/plugins/diayn/skills/
```

The isolated Codex plugin candidate manifest points its public skill surface at
`./skills/`, which contains the 12 DIAYN workflow skills plus the 23 locked
DIAYN-managed `agent-skills` dependency skills. This candidate lives under
`plugins/codex/plugins/diayn/` and is registered by
`plugins/codex/marketplace.json`. In Codex Desktop, `plugins/codex` is the
marketplace root and should be entered as the sparse path.

The project-local Codex package points at `.codex/skills/` and contains exactly 12 DIAYN workflow skills plus the 23 locked DIAYN-managed `agent-skills` dependency skills.

Validation performed in Phase 4:

```text
node maintainers\scripts\validate_diayn_alpha_package.js --json validation\phase4_alpha_package.json
node maintainers\scripts\validate_diayn_codex_project_local_package.js --json validation\phase9_codex_project_local_package.json
node maintainers\scripts\validate_diayn_codex_plugin_candidate.js
node maintainers\scripts\install_codex_project_local_package.js --fixture --execute --json validation\phase9_codex_project_local_install_fixture.json
node maintainers\scripts\install_codex_project_local_package.js --codex-home-fixture --execute --json validation\phase9_codex_home_install_fixture.json
node maintainers\scripts\validate_codex_runtime_external_evidence.js --json validation\phase9_codex_runtime_external_evidence.json
node maintainers\scripts\validate_codex_runtime_external_evidence_selftest.js --json validation\phase9_codex_runtime_external_evidence_selftest.json
```

The install fixture is intentionally project-local and temporary. It writes the
Codex package into `validation/tmp/codex-install-fixture/.codex/skills/` and
copies DIAYN metadata into `validation/tmp/codex-install-fixture/.diayn/`, then
records `validation/phase9_codex_project_local_install_fixture.json`. This
proves the install/copy shape for 12 workflow skills, 23 dependency skills, and
the routing metadata. It intentionally does not launch Codex Desktop or claim
Desktop app-session command execution.

The Codex-home fixture separately writes the same package into
`validation/tmp/codex-home-install-fixture/skills/` and metadata into
`validation/tmp/codex-home-install-fixture/diayn/docs-is-all-you-need/`,
recorded by `validation/phase9_codex_home_install_fixture.json`. This proves
the `$CODEX_HOME/skills` copy shape without touching the real user Codex home.

Real Codex Home installs are local-only diagnostics unless a maintainer
intentionally captures sanitized release evidence. The current Owner-approved
Codex alpha claim is package/install scope only: install commands and directory
inspection pass. Codex Desktop app-session discovery, direct `/diayn-*`
workflow invocation, and native dependency-skill invocation were not attempted
and must not be claimed.

The optional future runtime evidence path is
`docs/install/codex_runtime_external_evidence_template.json` plus
`validate_codex_runtime_external_evidence.js`. Maintainers may keep local
manual runbooks or scratch evidence while testing, but those local files are
not release evidence unless intentionally sanitized and promoted.

The evidence validator is covered by
`validation/phase9_codex_runtime_external_evidence_selftest.json`. That selftest
proves complete concrete evidence would clear the blocker, while the unchanged
template, missing evidence, and nonexistent evidence references still remain
blocked.
