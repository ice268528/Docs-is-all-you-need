# OpenCode Adapter Install

DIAYN provides an OpenCode command and skill-wrapper bundle at:

```text
integrations/opencode/.opencode/
```

This bundle is a manual adapter, not a package manager install, shell CLI, custom runtime, or plugin.

Support level: `manual_fallback`.

Why not `working`: available OpenCode documentation describes per-project `.opencode/commands/` and `.opencode/skills/<name>/SKILL.md`, and this repository now provides matching adapter files. This workspace has not run a local OpenCode discovery/execution smoke test that proves `/diayn-*` commands and DIAYN skill wrappers load in the user's environment.

## Install By Copy

From the parent directory that contains `Docs-is-all-you-need/`, copy the adapter bundle into the target project:

```powershell
$repo = Resolve-Path ".\Docs-is-all-you-need"
$targetProject = Resolve-Path ".\path\to\your\project"
$dest = Join-Path $targetProject ".opencode"

New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item -Recurse -Force (Join-Path $repo "integrations\opencode\.opencode\commands") $dest
Copy-Item -Recurse -Force (Join-Path $repo "integrations\opencode\.opencode\skills") $dest
```

If you are already inside the target project, set `$targetProject = Resolve-Path "."`.

## Install By Link

If your operating system and permissions allow symlinks, you may link the DIAYN adapter bundle instead of copying it:

```powershell
$repo = Resolve-Path ".\Docs-is-all-you-need"
$targetProject = Resolve-Path ".\path\to\your\project"
$destDir = Join-Path $targetProject ".opencode"

New-Item -ItemType Directory -Force $destDir | Out-Null
New-Item -ItemType SymbolicLink -Path (Join-Path $destDir "commands") -Target (Join-Path $repo "integrations\opencode\.opencode\commands")
New-Item -ItemType SymbolicLink -Path (Join-Path $destDir "skills") -Target (Join-Path $repo "integrations\opencode\.opencode\skills")
```

Use copy install if symlinks are unavailable.

## Files To Install

```text
.opencode/commands/diayn-init.md
.opencode/commands/diayn-plan.md
.opencode/commands/diayn-worktrees.md
.opencode/commands/diayn-backend.md
.opencode/commands/diayn-frontend.md
.opencode/commands/diayn-review-backend.md
.opencode/commands/diayn-review-frontend.md
.opencode/commands/diayn-sync.md
.opencode/commands/diayn-integration.md
.opencode/commands/diayn-bug.md
.opencode/commands/diayn-new.md
.opencode/commands/diayn-html.md

.opencode/skills/diayn-controller/SKILL.md
.opencode/skills/diayn-executor/SKILL.md
.opencode/skills/diayn-reviewer/SKILL.md
.opencode/skills/diayn-integrator/SKILL.md
.opencode/skills/diayn-skill-router/SKILL.md
.opencode/skills/diayn-identity-guard/SKILL.md
.opencode/skills/diayn-owner-ux/SKILL.md
.opencode/skills/update-diayn-scaffold/SKILL.md
```

After installation, open OpenCode in the target project and start with:

```text
/diayn-init
```

Each command file and skill wrapper is intentionally short. It routes OpenCode to `AGENTS.md`, `docs/meta/diayn_command_reference.md`, the matching `docs/meta/diayn_commands/*.md` detail file, and the relevant DIAYN skill folder. It does not copy the full DIAYN protocol.

## Manual Fallback

If OpenCode does not discover the command files or skill wrappers, paste the intended command as normal text and ask OpenCode to follow the corresponding file manually:

```text
Run /diayn-init using .opencode/commands/diayn-init.md and the DIAYN docs it references.
```

If OpenCode reports that its command or skill location has changed, keep support at `manual_fallback` or lower and update this adapter before claiming `working`.
