#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const pluginRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need");
const packageRoot = path.join(repoRoot, "packages", "codex-project-local");
const expectedWorkflowSkills = [
  "diayn-init",
  "diayn-plan",
  "diayn-worktrees",
  "diayn-backend",
  "diayn-frontend",
  "diayn-review-backend",
  "diayn-review-frontend",
  "diayn-sync",
  "diayn-integration",
  "diayn-bug",
  "diayn-new",
  "diayn-html",
];
const workflowInterface = {
  "diayn-init": {
    displayName: "DIAYN Init",
    shortDescription: "Initialize or retrofit DIAYN harness",
    defaultPrompt: "Use $diayn-init to initialize or retrofit this project with the DIAYN harness.",
  },
  "diayn-plan": {
    displayName: "DIAYN Plan",
    shortDescription: "Plan DIAYN stages and lane slices",
    defaultPrompt: "Use $diayn-plan to turn accepted requirements into stages and lane task slices.",
  },
  "diayn-worktrees": {
    displayName: "DIAYN Worktrees",
    shortDescription: "Prepare DIAYN lane worktrees safely",
    defaultPrompt: "Use $diayn-worktrees to prepare backend and frontend worktree plans.",
  },
  "diayn-backend": {
    displayName: "DIAYN Backend",
    shortDescription: "Run one DIAYN backend lane slice",
    defaultPrompt: "Use $diayn-backend to work one backend lane task slice with evidence.",
  },
  "diayn-frontend": {
    displayName: "DIAYN Frontend",
    shortDescription: "Run one DIAYN frontend lane slice",
    defaultPrompt: "Use $diayn-frontend to work one frontend lane task slice with UI evidence.",
  },
  "diayn-review-backend": {
    displayName: "DIAYN Review Backend",
    shortDescription: "Review DIAYN backend lane work",
    defaultPrompt: "Use $diayn-review-backend to review backend lane work and update its status.",
  },
  "diayn-review-frontend": {
    displayName: "DIAYN Review Frontend",
    shortDescription: "Review DIAYN frontend lane work",
    defaultPrompt: "Use $diayn-review-frontend to review frontend lane work and UI evidence.",
  },
  "diayn-sync": {
    displayName: "DIAYN Sync",
    shortDescription: "Sync DIAYN docs and status only",
    defaultPrompt: "Use $diayn-sync to sync DIAYN documents and status without merging business code.",
  },
  "diayn-integration": {
    displayName: "DIAYN Integration",
    shortDescription: "Integrate reviewed DIAYN lane work",
    defaultPrompt: "Use $diayn-integration to integrate reviewed lane work and run checks.",
  },
  "diayn-bug": {
    displayName: "DIAYN Bug",
    shortDescription: "Triage DIAYN bugs and acceptance gaps",
    defaultPrompt: "Use $diayn-bug to triage an Owner bug report or acceptance failure.",
  },
  "diayn-new": {
    displayName: "DIAYN New",
    shortDescription: "Capture DIAYN requirement changes",
    defaultPrompt: "Use $diayn-new to capture a new or changed requirement without mutating old requirements silently.",
  },
  "diayn-html": {
    displayName: "DIAYN HTML",
    shortDescription: "Generate DIAYN Owner-facing HTML",
    defaultPrompt: "Use $diayn-html to generate an Owner-facing decision or acceptance HTML report.",
  },
};

function ensureInsideRepo(target) {
  const resolved = path.resolve(target);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`refusing to write outside repo: ${target}`);
  }
}

function copyDir(source, target) {
  ensureInsideRepo(target);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true, force: true });
}

function writeFile(target, text) {
  ensureInsideRepo(target);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text, "utf8");
}

function yamlQuote(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
}

function writeCodexOpenAiYaml(skillDir, name) {
  const metadata = workflowInterface[name];
  if (!metadata) throw new Error(`missing Codex interface metadata for ${name}`);
  const text = [
    "interface:",
    `  display_name: ${yamlQuote(metadata.displayName)}`,
    `  short_description: ${yamlQuote(metadata.shortDescription)}`,
    `  default_prompt: ${yamlQuote(metadata.defaultPrompt)}`,
    "",
  ].join("\n");
  writeFile(path.join(skillDir, "agents", "openai.yaml"), text);
}

function listSkillDirs(root) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort();
}

function main() {
  ensureInsideRepo(packageRoot);
  fs.rmSync(packageRoot, { recursive: true, force: true });

  const packageSkills = path.join(packageRoot, ".codex", "skills");

  for (const name of expectedWorkflowSkills) {
    const skillTarget = path.join(packageSkills, name);
    copyDir(path.join(pluginRoot, "skills", name), skillTarget);
    writeCodexOpenAiYaml(skillTarget, name);
  }

  const dependencySource = path.join(pluginRoot, "dependency-skills", "agent-skills", "skills");
  for (const name of listSkillDirs(dependencySource)) {
    copyDir(path.join(dependencySource, name), path.join(packageSkills, name));
  }

  const dependencyReferences = path.join(pluginRoot, "dependency-skills", "agent-skills", "references");
  if (fs.existsSync(dependencyReferences)) {
    copyDir(dependencyReferences, path.join(packageRoot, ".diayn", "dependency-references", "agent-skills"));
  }

  const internalRoleSkills = path.join(pluginRoot, "internal-role-skills");
  if (fs.existsSync(internalRoleSkills)) {
    copyDir(internalRoleSkills, path.join(packageRoot, ".diayn", "internal-role-skills"));
  }

  copyDir(
    path.join(pluginRoot, "internal-role-skills", "diayn-skill-router", "references", "upstream-routing-map.md"),
    path.join(packageRoot, ".diayn", "dependency-routing", "upstream-routing-map.md"),
  );
  copyDir(
    path.join(pluginRoot, "dependency-skills", "agent-skills", "LICENSE"),
    path.join(packageRoot, ".diayn", "licenses", "agent-skills-LICENSE"),
  );
  copyDir(
    path.join(pluginRoot, "dependency-skills", "manifest.json"),
    path.join(packageRoot, ".diayn", "dependency-skills-manifest.json"),
  );

  const manifest = {
    schema: "diayn.codex_project_local_package.v1",
    generated_from: "plugins/docs-is-all-you-need",
    command_surface: "bare /diayn-* project-local Codex skills",
    platform: "codex",
    entry_file: "AGENTS.md",
    workflow_skill_count: expectedWorkflowSkills.length,
    dependency_skill_count: listSkillDirs(dependencySource).length,
    workflow_skills: expectedWorkflowSkills,
    dependency_source: "plugins/docs-is-all-you-need/dependency-skills/agent-skills",
    dependency_routing: ".diayn/dependency-routing/upstream-routing-map.md",
    internal_role_references: ".diayn/internal-role-skills",
    install_target: {
      skills: ".codex/skills",
    },
    runtime_status: {
      codex_desktop_discovery: "not_attempted_current_scope",
      direct_diayn_invocation: "not_attempted_current_scope",
      dependency_skill_invocation: "not_attempted_current_scope",
    },
    notes: [
      "This package is the Codex project-local skills shape for the DDDV8 target.",
      "Dependency skills are platform-visible implementation dependencies, not public DIAYN slash commands.",
      "Static package validation and install inspection do not claim Codex Desktop app-session runtime discovery or /diayn-* invocation.",
    ],
  };
  writeFile(path.join(packageRoot, "diayn-package.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(JSON.stringify({ ok: true, packageRoot: path.relative(repoRoot, packageRoot), ...manifest }, null, 2));
}

main();
