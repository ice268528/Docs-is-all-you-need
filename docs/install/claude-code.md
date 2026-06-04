# Claude Code Install

DIAYN supports two separate Claude Code installation paths. Keep their design,
documentation, and validation evidence separate.

## Path A: Standard Claude Code Plugin / Marketplace

Use this path for standard Claude Code distribution and centralized plugin
management. It uses plugin-namespaced commands, not bare `/diayn-*` commands.

Current root plugin files:

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

The short plugin namespace is `diayn`. Root command adapters use short command
file names such as `init.md` and `plan.md`, so the expected user command shape
is `/diayn:init`, not `/diayn:diayn-init`. The root skills path contains the 12
DIAYN workflow skills plus 23 DIAYN-managed `agent-skills` dependency skills,
so native dependency routing can use platform-visible skills when Claude Code
supports them.

The root plugin manifest points at `packages/claude-project-local/.claude/skills`
to reuse the generated Claude-visible skills root; the project-local fallback
remains a separate installation path.

DIAYN does not claim Anthropic official marketplace listing. GitHub
marketplace-style install should use the actual repository:

```text
/plugin marketplace add ice268528/Docs-is-all-you-need
/plugin install diayn@diayn-local-alpha
```

For local plugin development before publication:

```powershell
claude --plugin-dir <path-to-this-repo>
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

Plugin mode does not promise bare `/diayn-*`. If a future Claude Code runtime
exposes bare commands from a plugin install, record it only as observed behavior
for that Claude Code version until broader support is proven.

## Command Naming Boundary

Plugin command adapters and project-local command adapters are intentionally
separate:

```text
Plugin command:        .claude/commands/init.md -> /diayn:init -> skill "diayn:diayn-init"
Project-local command: .claude/commands/diayn-init.md -> /diayn-init -> skill "diayn-init"
```

The workflow skill content remains shared; only the command adapter names differ.

## Inner Plugin Candidate

The inner candidate remains available for focused local plugin-dir debugging:

```text
plugins/docs-is-all-you-need/
plugins/docs-is-all-you-need/.claude-plugin/plugin.json
plugins/docs-is-all-you-need/.claude-plugin/marketplace.json
plugins/docs-is-all-you-need/.claude/commands/*.md
plugins/docs-is-all-you-need/skills/diayn-*/
plugins/docs-is-all-you-need/dependency-skills/
```

Load it with:

```powershell
claude --plugin-dir <path-to-this-repo>\plugins\docs-is-all-you-need
```

The inner manifest also uses `name: "diayn"`. It is a focused local candidate;
the root manifest is the closer marketplace-style entrypoint because it points
at the generated platform-visible skills package.

## Path B: Project-Local Fallback

Use this path when the target project needs bare `/diayn-*` short commands.
This is a local project install, not proof that the standard plugin path
supports bare commands.

Package source:

```text
packages/claude-project-local/
```

From a cloned DIAYN repository or release package, install it into a target
project with:

```powershell
$target = "E:\path\to\target-project"
Copy-Item -Path .\packages\claude-project-local\.claude -Destination $target -Recurse -Force
Copy-Item -Path .\packages\claude-project-local\.diayn -Destination $target -Recurse -Force
```

It installs this shape into a target project:

```text
.claude/commands/diayn-*.md
.claude/skills/diayn-*/
.claude/skills/<agent-skills-name>/
.diayn/dependency-routing/upstream-routing-map.md
.diayn/internal-role-skills/
.diayn/dependency-skills-manifest.json
```

Expected project-local commands:

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

Project-local command adapters invoke local skill ids such as `diayn-init`, not
plugin namespaced ids such as `diayn:diayn-init`.

## Third-Party Dependency Skills

DIAYN carries 23 locked third-party `agent-skills` as managed dependency skills.
They are implementation dependencies, not extra public DIAYN commands.

Normal routing:

1. A public DIAYN workflow skill takes control.
2. DIAYN checks command identity, role/lane expectations, write boundaries, and
   stop conditions.
3. DIAYN selects the smallest relevant dependency skill set from the routing
   map.
4. DIAYN resolves the skill id for the active surface:
   - project-local fallback uses names such as `idea-refine`;
   - plugin namespace mode may require names such as `diayn:idea-refine`;
   - Codex uses the id discovered from its installed skills root.
5. Claude Code invokes the selected DIAYN-managed dependency skill through the
   native `Skill` tool when relevant.

Routing map:

```text
maintainers/internal-skills/diayn-skill-router/references/upstream-routing-map.md
plugins/docs-is-all-you-need/dependency-skills/
```

Reading a vendored `SKILL.md` directly is fallback/reference behavior and does
not count as native dependency-skill invocation evidence.

## Comparison

| Topic | Plugin / marketplace | Project-local fallback |
| --- | --- | --- |
| Install location | Claude Code plugin system | Target project's `.claude/` and `.diayn/` |
| Command format | `/diayn:init` | `/diayn-init` |
| Distribution fit | Preferred standard distribution path | Local short-command fallback |
| Target project files | No direct `.claude/` scaffold required by the plugin itself | Writes `.claude/` and `.diayn/` into the target project |
| Bare `/diayn-*` | Not promised | Yes |
| GitHub marketplace | Yes, via repository marketplace source | No |
| Anthropic official marketplace | Not claimed | Not relevant |
| Codex / generic scaffold impact | Must remain separate | Must not require Claude plugin namespace |
| Validation method | `claude plugin validate` plus manual runtime command proof | Project-local package validator plus installed-flow runtime fixture |

## Validation Evidence

Static plugin validation:

```text
claude plugin validate .claude-plugin/plugin.json
claude plugin validate .claude-plugin/marketplace.json
claude plugin validate plugins\docs-is-all-you-need\.claude-plugin\plugin.json
claude plugin validate plugins\docs-is-all-you-need\.claude-plugin\marketplace.json
```

Project-local fallback validation:

```text
node maintainers\scripts\validate_diayn_claude_project_local_package.js
```

Other repository validators:

```text
node maintainers\scripts\validate_diayn_public_skill_surface.js
node maintainers\scripts\validate_diayn_dependency_skills.js
node maintainers\scripts\validate_diayn_alpha_package.js
git diff --check
```

Historical plugin-dir evidence from the old `docs-is-all-you-need` namespace is
not evidence for the new `diayn` namespace. After this namespace correction,
Owner runtime verification must confirm the actual visible command names.

Manual runtime verification steps live in:

```text
docs/qa/claude-plugin-runtime-acceptance.md
```

## Skill Authoring Authority

DIAYN Claude Code skills should be evaluated against Claude Code skill
expectations, not Codex's skill creator.

Claude skill-authoring reference used for this repository:

```text
git@github.com:anthropics/skills.git
```

Key implications:

- each skill is a folder with `SKILL.md`;
- `name` and `description` frontmatter drive triggering;
- `SKILL.md` should progressively disclose references, scripts, and assets;
- plugin installation should make skills discoverable natively;
- test/eval evidence matters before claiming broad support.
