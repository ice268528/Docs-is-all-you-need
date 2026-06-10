# Codex Skills Install

Codex support is available through the Codex plugin marketplace path and the
project-local/Home skills package.

For Codex Desktop plugin installation, prefer:

```text
Source: git@github.com:ice268528/Docs-is-all-you-need.git
Git ref: main
Sparse path:
.agents/plugins
plugins/diayn
```

See [codex_plugin.md](codex_plugin.md) for the
Codex Desktop plugin path.

## Skills Package Shape

The project-local/Home package lives at:

```text
packages/codex-project-local/
```

It contains:

```text
packages/codex-project-local/.codex/skills/diayn-init/
packages/codex-project-local/.codex/skills/diayn-plan/
packages/codex-project-local/.codex/skills/diayn-worktrees/
packages/codex-project-local/.codex/skills/diayn-backend/
packages/codex-project-local/.codex/skills/diayn-frontend/
packages/codex-project-local/.codex/skills/diayn-review-backend/
packages/codex-project-local/.codex/skills/diayn-review-frontend/
packages/codex-project-local/.codex/skills/diayn-sync/
packages/codex-project-local/.codex/skills/diayn-integration/
packages/codex-project-local/.codex/skills/diayn-bug/
packages/codex-project-local/.codex/skills/diayn-new/
packages/codex-project-local/.codex/skills/diayn-html/
```

The same skills root also includes DIAYN-managed dependency skills. Dependency
skills are implementation dependencies, not additional DIAYN workflow commands.

## Project-Local Install

To install into one target project, copy the package contents into the target
project:

```powershell
$target = "E:\path\to\target-project"
Copy-Item -Path .\packages\codex-project-local\.codex -Destination $target -Recurse -Force
Copy-Item -Path .\packages\codex-project-local\.diayn -Destination $target -Recurse -Force
```

Then open the target project in Codex and invoke the installed skills, for
example:

```text
$diayn-init initialize this project with DIAYN
$diayn-plan create the first stage plan
```

## Codex Home Install

When the Owner intentionally wants a global Codex skills install, copy the
skills into Codex Home:

```powershell
$codexHome = "$env:USERPROFILE\.codex"
Copy-Item -Path .\packages\codex-project-local\.codex\skills\* -Destination "$codexHome\skills" -Recurse -Force
Copy-Item -Path .\packages\codex-project-local\.diayn -Destination "$codexHome\diayn\docs-is-all-you-need" -Recurse -Force
```

Use the project-local install when you want DIAYN isolated to one target
project. Use the Codex Home install only when global DIAYN skills are intended.

## Runtime Notes

Codex uses `AGENTS.md` as the target project entry file. `/diayn-init` style
slash behavior may vary by Codex runtime; explicit skill invocation such as
`$diayn-init` is the safest first test.
