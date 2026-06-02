# Claude Code CLI Project-Local Install

Claude Code project-local is the currently proven DIAYN alpha surface.

It satisfies the DDDV8 user-facing requirement for bare `/diayn-*` commands by
installing project-local Claude command files and project-local skills into the
target repository:

```text
.claude/commands/diayn-*.md
.claude/skills/diayn-*/
.claude/skills/<agent-skills-name>/
.diayn/dependency-routing/upstream-routing-map.md
.diayn/internal-role-skills/
.diayn/dependency-skills-manifest.json
```

The public command surface remains exactly 12 commands:

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

## Install

Run these commands from the `Docs-is-all-you-need` repository root:

```powershell
$diaynRepo = Resolve-Path "."
$targetProject = Resolve-Path "E:\path\to\your-project"

New-Item -ItemType Directory -Force (Join-Path $targetProject ".claude") | Out-Null
New-Item -ItemType Directory -Force (Join-Path $targetProject ".diayn") | Out-Null

Copy-Item -Recurse -Force (Join-Path $diaynRepo "packages\claude-project-local\.claude\commands") (Join-Path $targetProject ".claude")
Copy-Item -Recurse -Force (Join-Path $diaynRepo "packages\claude-project-local\.claude\skills") (Join-Path $targetProject ".claude")
Copy-Item -Recurse -Force (Join-Path $diaynRepo "packages\claude-project-local\.diayn\*") (Join-Path $targetProject ".diayn")
```

Then open Claude Code in the target project and start with:

```text
/diayn-init
```

If the target project already has `.claude/commands`, `.claude/skills`, or
`.diayn` content, review conflicts before copying. The command above overwrites
matching DIAYN package files by name, but it is not a general project migration
tool.

## Third-Party Dependency Skills

The package installs 23 DIAYN-managed third-party `agent-skills` dependency
skills under `.claude/skills`. These are platform-visible implementation
dependencies, not extra public DIAYN commands.

Normal flow:

1. A public `/diayn-*` workflow takes control.
2. DIAYN checks command identity, role/lane expectations, write boundary, and
   stop conditions.
3. The DIAYN router reads
   `.diayn/dependency-routing/upstream-routing-map.md`.
4. Claude Code invokes the selected DIAYN-managed dependency skill through the
   native `Skill` tool when that dependency is relevant.

Reading a vendored `SKILL.md` directly is fallback/reference behavior and does
not count as native dependency-skill invocation evidence.

## Validation Evidence

Package validation:

```text
node maintainers\scripts\validate_diayn_claude_project_local_package.js --json validation\phase9_claude_project_local_package.json
```

Recorded result:

```text
command_count: 12
workflow_skill_count: 12
dependency_skill_count: 23
total_project_local_skill_count: 35
bare_command_surface: true
dependency_skills_platform_visible: true
dependency_routing_map_present: true
```

Claude project-local evidence proves:

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

## Plugin Boundary

The Claude plugin package under `plugins/docs-is-all-you-need/` validates, but
plugin-dir commands are namespaced:

```text
/docs-is-all-you-need:diayn-init
```

That plugin-dir behavior does not satisfy the DDDV8 bare `/diayn-*` user-facing
requirement by itself. Use `packages/claude-project-local/` for the proven bare
command alpha path.

## Manual Fallback

If a local Claude Code setup does not discover the project-local command files,
ask Claude Code to follow the installed command file explicitly:

```text
Run /diayn-init using .claude/commands/diayn-init.md and the DIAYN docs it references.
```

The DIAYN documents remain the source of truth. Do not invent command behavior
when discovery fails.
