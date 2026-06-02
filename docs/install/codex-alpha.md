# Codex Alpha Package

DDDV8 Codex pre-alpha package shape lives under:

```text
plugins/docs-is-all-you-need/
packages/codex-project-local/
```

Relevant package files:

```text
.codex-plugin/plugin.json
skills/diayn-*/
dependency-skills/
packages/codex-project-local/.codex/skills/
packages/codex-project-local/diayn-package.json
```

The Codex plugin manifest points its public skill surface at `./skills/`, which contains exactly the 12 DIAYN workflow skills. The dependency payload is packaged separately under `dependency-skills/` so later installation/registration logic can make it platform-visible where native nested skill invocation requires that.

The project-local Codex package points at `.codex/skills/` and contains exactly 12 DIAYN workflow skills plus the 23 locked DIAYN-managed `agent-skills` dependency skills.

Validation performed in Phase 4:

```text
node maintainers\scripts\validate_diayn_alpha_package.js --json validation\phase4_alpha_package.json
node maintainers\scripts\validate_diayn_codex_project_local_package.js --json validation\phase9_codex_project_local_package.json
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
the routing metadata, but it does not prove Codex Desktop discovery or command
execution.

The Codex-home fixture separately writes the same package into
`validation/tmp/codex-home-install-fixture/skills/` and metadata into
`validation/tmp/codex-home-install-fixture/diayn/docs-is-all-you-need/`,
recorded by `validation/phase9_codex_home_install_fixture.json`. This proves
the `$CODEX_HOME/skills` copy shape without touching the real user Codex home.

Real Codex Home installs are local-only diagnostics unless a maintainer
intentionally captures sanitized release evidence. A real file install can
confirm the package was copied into one machine's `$CODEX_HOME/skills`, but it
is still not app-session runtime proof and must not be treated as remote
release evidence by default.

Current blocker:

```text
current/reloaded Codex app session
```

must prove direct `/diayn-*` workflow discovery/invocation and native
dependency-skill invocation. File installation and command-line executable
probes are not enough. Do not claim Codex alpha support until a later
installed-flow validation records real discovery and invocation evidence from
the app session.

When a working Codex Desktop environment is available, use
`docs/install/codex_runtime_external_evidence_template.json` as the input shape
for `validate_codex_runtime_external_evidence.js`. Maintainers may keep local
manual runbooks or scratch evidence while testing, but those local files are
not remote release evidence. Replace every `<...>` placeholder with concrete
logs, screenshots, transcripts, or fixture output stored as files in this
repository. The input must include a
`skill_discovery_snapshot` from a current, reloaded, or new Codex Desktop app
session. Every `evidence_refs` entry must be a repo-relative path to an
existing evidence file; placeholders, empty evidence references, absolute
paths, URLs, paths outside the repository, and nonexistent repo-relative paths
are treated as gaps. The resulting
`validation/phase9_codex_runtime_external_evidence.json` must show
`runtime_proven: true` before this blocker can be removed from the release
gate.

The evidence validator is covered by
`validation/phase9_codex_runtime_external_evidence_selftest.json`. That selftest
proves complete concrete evidence would clear the blocker, while the unchanged
template, missing evidence, and nonexistent evidence references still remain
blocked.
