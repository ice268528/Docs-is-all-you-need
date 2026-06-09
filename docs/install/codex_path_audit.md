# Codex Path Audit

This audit separates confirmed Codex surfaces from DIAYN-owned candidate
packaging. Status values are limited to `verified`, `candidate`, `legacy`, and
`unknown`.

| Path | Exists | Platform | Role | Status |
| --- | --- | --- | --- | --- |
| `AGENTS.md` | yes | Codex / OpenCode / generic | Peer platform entry file for AGENTS.md-based agents. | `verified` |
| `.codex-plugin/` | yes | Codex | Repository-root historical Codex manifest pointing at the project-local package. | `legacy` |
| `plugins/docs-is-all-you-need/.codex-plugin/` | yes | Codex | Older inner Codex local candidate with `skills: ./skills/`. | `legacy` |
| `packages/codex-project-local/` | yes | Codex | Verified skills package for project-local or Codex Home installation. | `verified` |
| `.agents/` | yes | Codex | DIAYN-owned marketplace catalog candidate for Codex Desktop. | `candidate` |
| `plugins/diayn/` | yes | Codex | Isolated Codex plugin candidate with workflow and dependency skills. | `candidate` |
| `docs/install/codex_skills.md` | yes | Codex | Verified skills-package install documentation. | `verified` |
| `docs/install/codex_plugin_local_candidate.md` | yes | Codex | Candidate plugin marketplace documentation. | `candidate` |
| `docs/qa/codex-plugin-runtime-acceptance.md` | yes | Codex | Future runtime acceptance checklist. | `candidate` |
| `maintainers/scripts/install_codex_project_local_package.js` | yes | Codex | Skills-package installer and fixture generator. | `verified` |
| `maintainers/scripts/validate_diayn_codex_project_local_package.js` | yes | Codex | Skills-package validator. | `verified` |
| `maintainers/scripts/validate_diayn_codex_plugin_candidate.js` | yes | Codex | Static validator for the isolated Codex plugin candidate. | `candidate` |

## Confirmed vs Candidate

Confirmed Codex capability in this repository:

- `AGENTS.md` as the Codex/generic entry file.
- Codex skills packaged as `SKILL.md` directories under `.codex/skills/` or
  Codex Home skills.

DIAYN-owned candidate structure:

- `.agents/plugins/marketplace.json`
- `plugins/diayn/.codex-plugin/plugin.json`
- `plugins/diayn/skills/`

Unknown until runtime evidence exists:

- Codex Desktop marketplace install success for `diayn@diayn-local-alpha`.
- Codex Desktop app-session discovery of the plugin-installed skills.
- Direct `/diayn-*` slash behavior in Codex Desktop.
- Native dependency-skill invocation inside a DIAYN workflow after plugin
  install.
