# Claude Plugin Runtime Acceptance

This checklist verifies the standard Claude Code plugin / marketplace path
after the plugin namespace was shortened to `diayn`.

Do not use project-local `/diayn-*` success as evidence for plugin mode.

## Record Environment

Record:

```text
Claude Code version:
Docs-is-all-you-need commit:
OS:
Install path tested:
```

Get the Claude Code version:

```powershell
claude --version
```

## Static Validation

Run from the repository root:

```powershell
claude plugin validate .claude-plugin\plugin.json
claude plugin validate .claude-plugin\marketplace.json
claude plugin validate plugins\docs-is-all-you-need\.claude-plugin\plugin.json
claude plugin validate plugins\docs-is-all-you-need\.claude-plugin\marketplace.json
node maintainers\scripts\validate_diayn_public_skill_surface.js
node maintainers\scripts\validate_diayn_dependency_skills.js
node maintainers\scripts\validate_diayn_claude_project_local_package.js
node maintainers\scripts\validate_diayn_alpha_package.js
git diff --check
```

Expected static result:

```text
plugin.json name = diayn
plugin command adapters invoke diayn:diayn-*
project-local command adapters invoke local diayn-* skill ids
```

The root plugin manifest points at `packages/claude-project-local/.claude/skills`
to reuse the generated Claude-visible skills root; the project-local fallback
remains a separate installation path.

## Local Plugin-Dir Runtime Verification

Use a clean demo repository. Start Claude Code with the repository-root plugin:

```powershell
claude --plugin-dir <Docs-is-all-you-need repo path>
```

Verify what commands Claude Code actually exposes:

```text
/diayn:diayn-init
/diayn:diayn-plan
/diayn:diayn-backend
```

Check whether optional aliases are visible:

```text
/diayn:init
/diayn:plan
/diayn:backend
```

Expected current result:

```text
/diayn:diayn-* should be visible if Claude Code derives the namespace from plugin.json name.
/diayn:init is not expected because alias wrappers are not implemented.
/diayn-* bare commands are not claimed in plugin mode.
```

Invoke the first command with a vague idea:

```text
/diayn:diayn-init "I have a vague project idea; ask me the missing questions before changing files."
```

Acceptance checks:

```text
The command adapter invokes native Skill tool skill: "diayn:diayn-init".
The skill follows progressive disclosure.
The skill does not silently mutate Owner requirements.
OwnerGate / Unknown handling appears for unclear requirements.
Dependency routing uses DIAYN-managed dependency skills only when relevant.
```

If Claude exposes `/diayn-*` bare commands in plugin mode, record it only as
observed behavior for the tested Claude Code version. Do not treat it as a
cross-version guarantee.

## Inner Plugin Candidate Runtime Verification

Use only for focused plugin-dir debugging:

```powershell
claude --plugin-dir <Docs-is-all-you-need repo path>\plugins\docs-is-all-you-need
```

Repeat the same command visibility and `/diayn:diayn-init` invocation checks.

## Marketplace-Style Runtime Verification

If testing GitHub marketplace-style install:

```text
/plugin marketplace add ice268528/Docs-is-all-you-need
/plugin install diayn@diayn-local-alpha
```

Record:

```text
Whether install succeeds.
The actual marketplace name Claude Code assigns.
The actual visible command names.
Whether /diayn:diayn-init invokes skill: "diayn:diayn-init".
Whether dependency skills are native-visible.
Whether bare /diayn-* appears, if at all.
```

DIAYN does not claim Anthropic official marketplace listing unless that has
separately happened and been verified.

## Project-Local Fallback Verification

Project-local fallback is a separate path. It installs into a target project's
`.claude/` and `.diayn/` directories and should provide bare commands:

```text
/diayn-init
/diayn-plan
/diayn-backend
```

Static package validation:

```powershell
node maintainers\scripts\validate_diayn_claude_project_local_package.js
```

Acceptance checks:

```text
Project-local commands invoke local skill ids such as "diayn-init".
Project-local commands do not invoke plugin ids such as "diayn:diayn-init".
Project-local success is not described as plugin/marketplace success.
Codex and generic scaffold files are not changed by this verification.
```

## Agent-Skills Reference Check

DIAYN primarily follows the `agent-skills` pattern for Claude plugin structure:

```text
.claude-plugin/plugin.json declares commands and skills.
.claude/commands/*.md are thin command adapters.
skills/*/SKILL.md holds the real skill instructions.
```

Reference project runtime behavior can be compared separately, but do not copy
`superpowers` behavior mechanically because its current structure relies more on
default directory discovery and bootstrap behavior.
