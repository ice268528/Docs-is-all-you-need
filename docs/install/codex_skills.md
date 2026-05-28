# Codex Skills Install

DIAYN V1 supports Codex first through manual Codex Skill installation. This is not a Codex plugin, shell CLI, or custom runtime.

## Skill Folders To Install

Install exactly these folders from this repository:

```text
skills/diayn-controller/
skills/diayn-executor/
skills/diayn-reviewer/
skills/diayn-integrator/
skills/diayn-skill-router/
skills/diayn-identity-guard/
skills/diayn-owner-ux/
skills/update-diayn-scaffold/
```

Do not copy `third_party/agent-skills/**` into Codex as DIAYN skills. It is a vendored upstream method library. Older Stage 06 skill names may exist for historical source compatibility; do not install them for D5. The D5 canonical install set is the list above.

## Find The Codex Skills Directory

Use this order:

1. If `CODEX_HOME` is set, use `<CODEX_HOME>/skills`.
2. Otherwise use the normal user Codex home path:
   - Windows: `%USERPROFILE%\.codex\skills`
   - macOS/Linux: `~/.codex/skills`
3. If neither path is valid in your environment, use manual fallback: create or locate the Codex user skills directory from the Codex app/environment, then copy the eight folders there.

## PowerShell Copy Example

Run from the parent directory that contains `Docs-is-all-you-need/`:

```powershell
$repo = Resolve-Path ".\Docs-is-all-you-need"
$dest = if ($env:CODEX_HOME) {
  Join-Path $env:CODEX_HOME "skills"
} else {
  Join-Path $env:USERPROFILE ".codex\skills"
}

New-Item -ItemType Directory -Force $dest | Out-Null

$skills = @(
  "diayn-controller",
  "diayn-executor",
  "diayn-reviewer",
  "diayn-integrator",
  "diayn-skill-router",
  "diayn-identity-guard",
  "diayn-owner-ux",
  "update-diayn-scaffold"
)

foreach ($skill in $skills) {
  Copy-Item -Recurse -Force (Join-Path $repo "skills\$skill") $dest
}
```

## Manual Copy Fallback

If the path cannot be detected or shell copy commands are not appropriate:

1. Open the repository `skills/` folder.
2. Open your Codex skills directory.
3. Copy the eight listed folders into the Codex skills directory.
4. Restart Codex or open a new Codex session so skill metadata can be refreshed.
5. In the target project, ask Codex to use a DIAYN skill explicitly if auto-selection does not happen.

Example prompts:

```text
Use diayn-controller to run /diayn-init for this project.
Use diayn-executor to run /diayn-backend for this backend lane.
Use diayn-reviewer to run /diayn-review-frontend using the worker report below.
Use update-diayn-scaffold to dry-run a DIAYN migration plan for this existing project.
```

## First Use

After installation, open the target project in Codex and begin with:

```text
/diayn-init
```

If Codex does not select a DIAYN skill automatically, name the skill:

```text
Use diayn-controller and follow /diayn-init.
```

Then continue with the canonical flow:

```text
/diayn-plan
/diayn-worktrees
/diayn-backend
/diayn-frontend
/diayn-review-backend
/diayn-review-frontend
/diayn-sync
/diayn-integration
```

The commands are workflow triggers inside chat. They are not shell commands and do not create a hidden agent runtime.

## Existing Project Upgrade

`update-diayn-scaffold` is included in the Codex Skill install set. Use it when a project already has README, AGENTS.md, CLAUDE.md, docs, or `.diayn/` content and needs a safe DIAYN retrofit.

The skill's bundled helper is local to the skill folder:

```powershell
python skills/update-diayn-scaffold/scripts/scaffold_upgrade_audit.py --project-root <project>
```

It is a dry-run audit helper, not a global CLI. It outputs inventory, conflicts, a migration plan, and a patch proposal. It does not overwrite files, apply patches, create worktrees, or commit.
