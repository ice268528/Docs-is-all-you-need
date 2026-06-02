# Claude Code Install

Claude Code support should follow the plugin-first model used by `superpowers`
and `agent-skills`.

## Standard Target

The intended DIAYN install shape for Claude Code is marketplace/plugin install,
not asking end users to copy `.claude/commands`, `.claude/skills`, or `.diayn`
by hand.

After publication, the user-facing flow should be:

```text
/plugin marketplace add <diayn-marketplace-or-repo>
/plugin install docs-is-all-you-need@<marketplace-name>
```

The plugin manifest is:

```text
plugins/docs-is-all-you-need/.claude-plugin/plugin.json
```

It points Claude Code at:

```text
plugins/docs-is-all-you-need/.claude/commands
plugins/docs-is-all-you-need/skills
```

The public command surface remains exactly 12 workflow commands:

```text
/diayn-init
/diayn-plan
/diayn-worktrees
/diayn-backend
/diayn-frontend
/diayn-review-backend
/diayn-review-frontend
/diayn-sync
/diayn-integration
/diayn-bug
/diayn-new
/diayn-html
```

## Local Development

Before marketplace publication, use Claude Code's local plugin loading path:

```powershell
claude --plugin-dir E:\Allproject\VscodeProject\docs_is_all_you_need_for_AGENTS\Docs-is-all-you-need\plugins\docs-is-all-you-need
```

This is the Claude-Code-native development equivalent of the local/plugin-dir
flows shown by `agent-skills` and `superpowers`.

Current validation observed that local `--plugin-dir` exposes plugin commands
as namespaced commands, for example:

```text
/docs-is-all-you-need:diayn-init
```

That is useful plugin proof, but it does not by itself satisfy the DDDV8
user-facing requirement for bare `/diayn-*`.

## Project-Local Fallback

`packages/claude-project-local/` exists to prove and validate bare `/diayn-*`
behavior while the plugin/marketplace path is not yet proven to expose bare
commands.

It installs this shape into a target project:

```text
.claude/commands/diayn-*.md
.claude/skills/diayn-*/
.claude/skills/<agent-skills-name>/
.diayn/dependency-routing/upstream-routing-map.md
.diayn/internal-role-skills/
.diayn/dependency-skills-manifest.json
```

This fallback has completed the installed-flow fixture, but it is not the
preferred final user install model. It should not be documented as the primary
Claude Code install path.

## Third-Party Dependency Skills

DIAYN installs 23 locked third-party `agent-skills` as DIAYN-managed dependency
skills. They are implementation dependencies, not extra public DIAYN commands.

Normal routing:

1. A public `/diayn-*` workflow takes control.
2. DIAYN checks command identity, role/lane expectations, write boundary, and
   stop conditions.
3. DIAYN selects the smallest relevant dependency skill set from the routing
   map.
4. Claude Code invokes the selected DIAYN-managed dependency skill through the
   native `Skill` tool when relevant.

The routing map is:

```text
skills/diayn-skill-router/references/upstream-routing-map.md
plugins/docs-is-all-you-need/dependency-skills/
```

Reading a vendored `SKILL.md` directly is fallback/reference behavior and does
not count as native dependency-skill invocation evidence.

## Validation Evidence

Claude plugin validation:

```text
claude plugin validate plugins\docs-is-all-you-need
```

Project-local fallback validation:

```text
node maintainers\scripts\validate_diayn_claude_project_local_package.js --json validation\phase9_claude_project_local_package.json
```

Recorded project-local fallback evidence proves:

- bare `/diayn-init` can trigger the native `Skill` tool for `diayn-init`;
- all 12 bare `/diayn-*` commands are visible and enter workflow context;
- `idea-refine` can be loaded as a DIAYN-managed dependency skill through the
  native `Skill` tool;
- `/diayn-init` can route a vague idea workflow to `idea-refine`;
- the complete installed-flow fixture covers `/diayn-init -> /diayn-plan ->
  /diayn-worktrees -> /diayn-backend -> /diayn-frontend ->
  /diayn-review-backend -> /diayn-review-frontend -> /diayn-sync ->
  /diayn-integration -> /diayn-html -> /diayn-bug -> /diayn-new`.

Primary evidence files:

```text
validation/phase9_claude_project_local_package.json
validation/phase9_claude_project_local_probe.json
validation/phase9_claude_project_local_routed_dependency_probe.json
validation/phase9_claude_project_local_command_sequence.json
validation/phase11_installed_flow_fixture.json
validation/phase12_side_scenarios.json
```

## Skill Authoring Authority

DIAYN Claude Code skills should be evaluated against Claude Code skill
expectations, not Codex's `skill-creator`.

Local Claude reference used for this repository:

```text
E:\Allproject\VscodeProject\docs_is_all_you_need_for_AGENTS\claude_skills\skills\skill-creator
```

Key implications:

- each skill is a folder with `SKILL.md`;
- `name` and `description` frontmatter drive triggering;
- `SKILL.md` should progressively disclose references, scripts, and assets;
- plugin installation should make skills discoverable natively;
- test/eval evidence matters before claiming broad support.
