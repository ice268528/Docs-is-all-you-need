#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const packageRoot = path.join(repoRoot, "packages", "codex-project-local");
const pluginRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need");
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

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listSkillDirs(root) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort();
}

function listFiles(root) {
  const result = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile()) result.push(full);
    }
  }
  visit(root);
  return result.sort();
}

function treeHash(root) {
  const hash = crypto.createHash("sha256");
  for (const file of listFiles(root)) {
    hash.update(path.relative(root, file).replace(/\\/g, "/"));
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const skillsRoot = path.join(packageRoot, ".codex", "skills");
  const dependencySource = path.join(pluginRoot, "dependency-skills", "agent-skills", "skills");
  const dependencySkills = listSkillDirs(dependencySource);
  const packageSkills = fs.existsSync(skillsRoot) ? listSkillDirs(skillsRoot) : [];
  const manifestPath = path.join(packageRoot, "diayn-package.json");
  const manifest = fs.existsSync(manifestPath) ? readJson(manifestPath) : null;

  if (!manifest) errors.push("missing packages/codex-project-local/diayn-package.json");
  else {
    if (manifest.schema !== "diayn.codex_project_local_package.v1") errors.push("Codex project-local package schema mismatch");
    if (manifest.workflow_skill_count !== expectedWorkflowSkills.length) errors.push("manifest workflow_skill_count mismatch");
    if (manifest.dependency_skill_count !== dependencySkills.length) errors.push("manifest dependency_skill_count mismatch");
    if (!manifest.install_target || manifest.install_target.skills !== ".codex/skills") {
      errors.push("manifest install target must be .codex/skills");
    }
    if (!manifest.runtime_status || manifest.runtime_status.codex_desktop_discovery !== "not_proven_access_denied_in_current_environment") {
      errors.push("manifest must keep Codex Desktop runtime discovery unproven");
    }
    if (!manifest.runtime_status || manifest.runtime_status.direct_diayn_invocation !== "not_proven_access_denied_in_current_environment") {
      errors.push("manifest must keep direct /diayn-* invocation unproven");
    }
  }

  for (const name of expectedWorkflowSkills) {
    if (!packageSkills.includes(name)) errors.push(`missing Codex project-local workflow skill ${name}`);
    const packagedPath = path.join(skillsRoot, name);
    const pluginPath = path.join(pluginRoot, "skills", name);
    if (fs.existsSync(packagedPath) && treeHash(packagedPath) !== treeHash(pluginPath)) {
      errors.push(`Codex project-local workflow skill ${name} differs from plugin source`);
    }
    const text = fs.existsSync(path.join(packagedPath, "SKILL.md"))
      ? fs.readFileSync(path.join(packagedPath, "SKILL.md"), "utf8")
      : "";
    if (!text.includes(`Use this skill when the user invokes \`/${name}\``)) {
      errors.push(`${name} must directly document its /${name} invocation trigger`);
    }
  }

  for (const name of dependencySkills) {
    if (!packageSkills.includes(name)) errors.push(`missing Codex project-local dependency skill ${name}`);
    const packagedPath = path.join(skillsRoot, name);
    const sourcePath = path.join(dependencySource, name);
    if (fs.existsSync(packagedPath) && treeHash(packagedPath) !== treeHash(sourcePath)) {
      errors.push(`Codex project-local dependency skill ${name} differs from locked dependency source`);
    }
  }

  if (!fs.existsSync(path.join(packageRoot, ".diayn", "dependency-skills-manifest.json"))) {
    errors.push("Codex project-local package missing dependency manifest");
  }
  if (!fs.existsSync(path.join(packageRoot, ".diayn", "dependency-routing", "upstream-routing-map.md"))) {
    errors.push("Codex project-local package missing dependency routing map");
  }
  if (!fs.existsSync(path.join(packageRoot, ".diayn", "internal-role-skills", "diayn-skill-router", "SKILL.md"))) {
    errors.push("Codex project-local package missing internal skill-router reference");
  }
  if (!fs.existsSync(path.join(packageRoot, ".diayn", "licenses", "agent-skills-LICENSE"))) {
    errors.push("Codex project-local package missing agent-skills license");
  }

  const result = {
    ok: errors.length === 0,
    schema: "diayn.phase9.codex_project_local_package.v1",
    package_root: "packages/codex-project-local",
    install_target: ".codex/skills",
    workflow_skill_count: expectedWorkflowSkills.filter((name) => packageSkills.includes(name)).length,
    dependency_skill_count: dependencySkills.filter((name) => packageSkills.includes(name)).length,
    total_project_local_skill_count: packageSkills.length,
    bare_diayn_skill_surface: expectedWorkflowSkills.every((name) => packageSkills.includes(name)),
    dependency_skills_platform_visible: dependencySkills.every((name) => packageSkills.includes(name)),
    dependency_routing_map_present: fs.existsSync(path.join(packageRoot, ".diayn", "dependency-routing", "upstream-routing-map.md")),
    internal_role_references_present: fs.existsSync(path.join(packageRoot, ".diayn", "internal-role-skills", "diayn-skill-router", "SKILL.md")),
    runtime_validation: {
      codex_desktop_discovery: "not_proven_access_denied_in_current_environment",
      direct_diayn_invocation: "not_proven_access_denied_in_current_environment",
      dependency_skill_invocation: "not_proven_access_denied_in_current_environment",
    },
    errors,
  };

  const payload = JSON.stringify(result, null, 2);
  if (outputPath) {
    const fullOutput = path.resolve(repoRoot, outputPath);
    fs.mkdirSync(path.dirname(fullOutput), { recursive: true });
    fs.writeFileSync(fullOutput, `${payload}\n`, "utf8");
  }
  console.log(payload);
  if (!result.ok) process.exitCode = 1;
}

main();
