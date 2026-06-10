# Codex Plugin Candidate

DIAYN has a Codex plugin candidate, but it is not yet a verified Codex Desktop
runtime surface.

## Current Truth

| Item | Status | Meaning |
| --- | --- | --- |
| Codex `AGENTS.md` entry file | `verified` | Codex/generic agents use `AGENTS.md` as the peer entry file. |
| Codex skills package install | `verified` | `packages/codex-project-local/` can install the 12 DIAYN workflow skills plus 23 dependency skills into `.codex/skills/` or Codex Home skills. |
| Codex plugin marketplace candidate | `candidate` | `.agents/plugins/marketplace.json` points at `plugins/diayn/`. This shape is intended for the Codex Desktop marketplace flow with the two-line sparse path `.agents/plugins` + `plugins/diayn`, but runtime evidence is still missing until a fresh Desktop install succeeds. |
| Direct Codex `/diayn-*` slash behavior | `unknown` | Do not claim this until Codex Desktop runtime evidence proves it. |
| Codex native dependency-skill invocation after plugin install | `unknown` | Do not claim this until runtime evidence proves it. |

## Candidate Layout

```text
.agents/plugins/marketplace.json
plugins/diayn/
plugins/diayn/.codex-plugin/plugin.json
plugins/diayn/skills/
plugins/diayn/dependency-routing/
plugins/diayn/dependency-references/
plugins/diayn/internal-role-skills/
plugins/diayn/licenses/
plugins/diayn/dependency-skills-manifest.json
```

The `.agents/plugins/` subtree is the Codex Desktop marketplace root. It
contains `.agents/plugins/marketplace.json`, and that manifest points at
`./plugins/diayn`. This follows the `plugin-creator` marketplace convention
where the marketplace root contains the manifest and plugin entries resolve
through `./plugins/<plugin-name>`.

The plugin manifest uses the Codex plugin shape:

```json
"skills": "./skills/"
```

The candidate `skills/` directory contains:

- the 12 public DIAYN workflow skills;
- the 23 DIAYN-managed dependency skills.

Dependency skills are installed as skills, not downgraded to plain text
references. The dependency routing and internal-role directories are supporting
material for DIAYN workflow routing; they are not public DIAYN commands.

## Legacy Codex Paths

The repository still contains older Codex candidate material:

```text
.codex-plugin/
plugins/docs-is-all-you-need/.codex-plugin/
plugins/docs-is-all-you-need/
```

These are kept for compatibility and history, but the isolated Codex candidate
surface is now:

```text
.agents/plugins/marketplace.json
plugins/diayn/
```

Do not use the older paths to claim Codex Desktop plugin runtime support.

Do not use the old repository-root `marketplace.json` candidate path for Codex
Desktop testing. It separated the marketplace manifest from the plugin payload
and could not be installed reliably from the Desktop "Add plugin marketplace"
dialog.

Add the repository source as the Codex Desktop marketplace candidate with the
two-line sparse path:

```text
.agents/plugins
plugins/diayn
```

Do not leave the sparse path field empty, because Codex Desktop may also scan
Claude marketplace files under `.claude-plugin/`. Do not use the previous
`plugins/codex` sparse-path candidate either; that shape leaves the Codex
marketplace manifest nested below the staging root.

## Candidate Install Attempt

In Codex Desktop, the "Add plugin marketplace" dialog can be used for future
runtime validation. The expected candidate fields are:

```text
Source: git@github.com:ice268528/Docs-is-all-you-need.git
Git ref: main
Sparse path:
.agents/plugins
plugins/diayn
```

HTTPS source is also acceptable if the environment cannot use SSH:

```text
Source: https://github.com/ice268528/Docs-is-all-you-need.git
Git ref: main
Sparse path:
.agents/plugins
plugins/diayn
```

If the marketplace name `diayn-local-alpha` is already added from an older
source, remove that marketplace first and clear any stale cache before adding it
again. Otherwise Codex Desktop may keep using an old checkout that does not
contain `.agents/plugins/marketplace.json`.

After the marketplace is visible, the expected candidate identity is:

```text
diayn@diayn-local-alpha
```

This is still a candidate install string. It is not a release claim until a new
Codex Desktop session proves install, discovery, and DIAYN workflow execution.

## Validation

Static candidate validation:

```text
node maintainers\scripts\validate_diayn_codex_plugin_candidate.js
```

Project-local skills package validation remains separate:

```text
node maintainers\scripts\validate_diayn_codex_project_local_package.js
```

Runtime acceptance is documented in:

```text
docs/qa/codex-plugin-runtime-acceptance.md
docs/install/codex_desktop_runtime_evidence_runbook.md
```

The current Codex Desktop marketplace layout repair is recorded in:

```text
docs/install/codex_desktop_marketplace_fix_report.md
```

## Claim Boundary

Current verified Codex claim:

```text
Codex skills package/install is validated by package shape, install fixtures,
and installed directory inspection.
```

Current unverified Codex plugin claims:

```text
Codex Desktop marketplace install
Codex Desktop plugin discovery
Direct /diayn-* slash invocation
Native dependency-skill invocation after plugin install
Complete DIAYN workflow execution in a Codex Desktop app session
```

Do not publish or advertise the Codex plugin path as complete until those
runtime claims have evidence.
