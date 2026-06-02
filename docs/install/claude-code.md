# Claude Code Command Adapter Install

DDDV8 status: historical D6 manual-adapter note. It remains useful platform
evidence, but it is not the final DDDV8 Claude Code install contract until
Phase 1 and Phase 4 prove the 12 workflow skills and any required
DIAYN-managed dependency skills can be installed and invoked through the target
Claude Code mechanism.

DIAYN provides a Claude Code command-file bundle at:

```text
integrations/claude-code/commands/
```

This bundle is a manual adapter, not a package manager install, plugin, shell CLI, or custom runtime. It uses one-segment command file names such as `diayn-init.md`, which are intended to become `/diayn-init` when copied into a Claude Code command directory.

Support level: `working` for manual project-level copy install in the D6-04
local smoke environment.

D6-04 evidence: `claude --version` returned `2.1.145 (Claude Code)`, the
12 `diayn-*.md` files were copied into a temporary project's
`.claude/commands/` directory, Claude Code debug output reported `legacy
commands: 12`, and `claude --print "/diayn-init ..."` executed the DIAYN Init
command content. See
`DDDV6/stage_outputs/d6_04/d6_04_claude_discovery_evidence.md`.

Boundary: this does not provide a package manager install, a plugin, a shell
CLI, global auto-installation, or a guarantee that every Claude Code
environment discovers project commands identically. Use the manual fallback
below if a local Claude Code setup does not discover the files.

## Install By Copy

From the parent directory that contains `Docs-is-all-you-need/`, copy the command files into the target project's Claude Code commands directory:

```powershell
$repo = Resolve-Path ".\Docs-is-all-you-need"
$targetProject = Resolve-Path ".\path\to\your\project"
$dest = Join-Path $targetProject ".claude\commands"

New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item -Force (Join-Path $repo "integrations\claude-code\commands\*.md") $dest
```

If you are already inside the target project, set `$targetProject = Resolve-Path "."`.

## Install By Link

If your operating system and permissions allow symlinks, you may link the DIAYN command bundle instead of copying it:

```powershell
$repo = Resolve-Path ".\Docs-is-all-you-need"
$targetProject = Resolve-Path ".\path\to\your\project"
$destDir = Join-Path $targetProject ".claude"

New-Item -ItemType Directory -Force $destDir | Out-Null
New-Item -ItemType SymbolicLink -Path (Join-Path $destDir "commands") -Target (Join-Path $repo "integrations\claude-code\commands")
```

Use copy install if symlinks are unavailable.

## Files To Install

```text
diayn-init.md
diayn-plan.md
diayn-worktrees.md
diayn-backend.md
diayn-frontend.md
diayn-review-backend.md
diayn-review-frontend.md
diayn-sync.md
diayn-integration.md
diayn-bug.md
diayn-new.md
diayn-html.md
```

After installation, open Claude Code in the target project and start with:

```text
/diayn-init
```

Each command file is intentionally short. It routes Claude Code to `CLAUDE.md`, `docs/meta/diayn_command_reference.md`, the matching `docs/meta/diayn_commands/*.md` detail file, and the relevant DIAYN skill folder. It does not copy the full DIAYN protocol.

## Manual Fallback

If Claude Code does not discover the command files, paste the intended command as normal text and ask Claude Code to follow the corresponding file manually:

```text
Run /diayn-init using .claude/commands/diayn-init.md and the DIAYN docs it references.
```

When in doubt, keep the DIAYN documents as the source of truth and do not invent command behavior.
