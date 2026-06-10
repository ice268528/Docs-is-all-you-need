# Codex Plugin Runtime Acceptance

This checklist is for a future Codex Desktop runtime claim. It is not required
for the current skills-package install claim.

## Scope

The candidate under test is:

```text
plugins/codex/marketplace.json
plugins/codex/plugins/diayn/
```

This checklist must not modify Claude Code plugin files, Claude command files,
or Claude project-local fallback packages.

## Preconditions

Run static validation first:

```text
node maintainers\scripts\validate_diayn_codex_plugin_candidate.js
node maintainers\scripts\validate_diayn_codex_project_local_package.js
```

## Marketplace Install Evidence

In Codex Desktop, open the "Add plugin marketplace" dialog and try the candidate
marketplace.

Record the exact fields used:

```text
Source:
Git ref:
Sparse path:
```

The expected candidate values are:

```text
Source: git@github.com:ice268528/Docs-is-all-you-need.git
Git ref: main
Sparse path: plugins/codex
```

HTTPS source is acceptable if SSH is unavailable:

```text
Source: https://github.com/ice268528/Docs-is-all-you-need.git
Git ref: main
Sparse path: plugins/codex
```

Do not use the repository root or the old `.agents/plugins` path for this
candidate. The Codex Desktop marketplace root must be `plugins/codex` so the
manifest and plugin payload are in the same sparse checkout. Record the exact
successful form. Do not claim runtime support until this succeeds in Codex
Desktop.

## Discovery Evidence

Start a new Codex Desktop thread after installation. Record whether the plugin
list shows:

```text
diayn
```

Then record whether the available skills include:

- all 12 DIAYN workflow skills;
- at least one DIAYN-managed dependency skill, such as `idea-refine` or
  `planning-and-task-breakdown`.

## Invocation Evidence

First test skill invocation, because Codex skills are the confirmed capability:

```text
$diayn-init Validation command sequence probe only
```

Expected:

```text
COMMAND: /diayn-init
FIRST_STOP: Existing content conflicts with DIAYN scaffold changes and no preservation decision exists.
```

Then test direct slash behavior only as an additional evidence item:

```text
/diayn-init Validation command sequence probe only
```

If direct slash behavior fails but `$diayn-init` works, record that result
honestly. It proves plugin-installed skills can be invoked, but it does not
prove Codex slash-command support.

## Dependency Skill Evidence

Run a DIAYN workflow that should route to a dependency skill, such as an
ambiguous `/diayn-init` requirement clarification. Evidence must show:

- the DIAYN workflow skill stayed in control;
- a DIAYN-managed dependency skill was natively selected or invoked;
- the dependency skill name is visible in the runtime trace or model report.

Reading a dependency `SKILL.md` as plain text is fallback/reference behavior and
does not count as native dependency-skill invocation.

## Completion Claim

Only after all required evidence exists may the project claim:

```text
Codex Desktop plugin runtime support is verified.
```

Until then, the correct claim remains:

```text
Codex skills package/install is verified; Codex plugin marketplace/runtime is a candidate.
```
