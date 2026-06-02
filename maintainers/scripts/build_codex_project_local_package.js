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
    copyDir(path.join(pluginRoot, "skills", name), path.join(packageSkills, name));
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
      codex_desktop_discovery: "not_proven_access_denied_in_current_environment",
      direct_diayn_invocation: "not_proven_access_denied_in_current_environment",
      dependency_skill_invocation: "not_proven_access_denied_in_current_environment",
    },
    notes: [
      "This package is the Codex project-local skills shape for the DDDV8 target.",
      "Dependency skills are platform-visible implementation dependencies, not public DIAYN slash commands.",
      "Static package validation does not prove Codex Desktop runtime discovery or /diayn-* invocation.",
    ],
  };
  writeFile(path.join(packageRoot, "diayn-package.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(JSON.stringify({ ok: true, packageRoot: path.relative(repoRoot, packageRoot), ...manifest }, null, 2));
}

main();
