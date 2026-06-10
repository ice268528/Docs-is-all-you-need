# Claude Code Install

DIAYN supports two Claude Code paths:

- plugin mode for the normal user-facing install;
- project-local fallback when a target project needs bare `/diayn-*` commands.

## Path A: Claude Code Plugin

Install from this repository:

```text
/plugin marketplace add ice268528/Docs-is-all-you-need
/plugin install diayn@diayn
```

Start with:

```text
/diayn:init
```

Expected plugin commands:

```text
/diayn:init
/diayn:plan
/diayn:worktrees
/diayn:backend
/diayn:frontend
/diayn:review-backend
/diayn:review-frontend
/diayn:sync
/diayn:integration
/diayn:bug
/diayn:new
/diayn:html
```

Plugin mode uses `CLAUDE.md` as the target project entry file. It should not
create `AGENTS.md` by default unless the Owner explicitly asks for a
cross-platform entry file.

## Plugin Package Shape

The public Claude plugin surface is:

```text
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
.claude/commands/*.md
packages/claude-project-local/.claude/skills/
```

The root plugin manifest uses:

```json
{
  "name": "diayn",
  "commands": "./.claude/commands",
  "skills": "./packages/claude-project-local/.claude/skills"
}
```

The command adapters call the DIAYN workflow skills in the background. The
registered skills root contains both the 12 DIAYN workflow skills and the
DIAYN-managed dependency skills, so the user does not need to install
`agent-skills` separately.

## Path B: Project-Local Fallback

Use this path only when a target project needs bare commands such as
`/diayn-init`.

Copy the fallback package into the target project:

```powershell
$target = "E:\path\to\target-project"
Copy-Item -Path .\packages\claude-project-local\.claude -Destination $target -Recurse -Force
Copy-Item -Path .\packages\claude-project-local\.diayn -Destination $target -Recurse -Force
```

Expected fallback commands:

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

The fallback package installs:

```text
.claude/commands/diayn-*.md
.claude/skills/diayn-*/
.claude/skills/<dependency-skill-name>/
.diayn/dependency-routing/upstream-routing-map.md
.diayn/dependency-skills-manifest.json
```

Do not install the plugin path and project-local fallback into the same Claude
Code runtime when judging command completion. The plugin path is the preferred
public install. The fallback path is for projects that intentionally want bare
`/diayn-*` commands.
