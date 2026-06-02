#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const packageRoot = path.join(repoRoot, "packages", "claude-project-local");
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

function listMarkdown(root) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.replace(/\.md$/, ""))
    .sort();
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const commandsRoot = path.join(packageRoot, ".claude", "commands");
  const skillsRoot = path.join(packageRoot, ".claude", "skills");
  const dependencySource = path.join(pluginRoot, "dependency-skills", "agent-skills", "skills");
  const dependencySkills = listSkillDirs(dependencySource);
  const workflowCommands = fs.existsSync(commandsRoot) ? listMarkdown(commandsRoot) : [];
  const packageSkills = fs.existsSync(skillsRoot) ? listSkillDirs(skillsRoot) : [];
  const manifestPath = path.join(packageRoot, "diayn-package.json");
  const manifest = fs.existsSync(manifestPath) ? readJson(manifestPath) : null;

  if (!manifest) errors.push("missing packages/claude-project-local/diayn-package.json");
  else {
    if (manifest.schema !== "diayn.claude_project_local_package.v1") errors.push("Claude project-local package schema mismatch");
    if (manifest.workflow_skill_count !== expectedWorkflowSkills.length) errors.push("manifest workflow_skill_count mismatch");
    if (manifest.dependency_skill_count !== dependencySkills.length) errors.push("manifest dependency_skill_count mismatch");
  }

  if (JSON.stringify(workflowCommands) !== JSON.stringify([...expectedWorkflowSkills].sort())) {
    errors.push("project-local Claude commands must be exactly the 12 DIAYN workflow commands");
  }
  for (const name of expectedWorkflowSkills) {
    if (!packageSkills.includes(name)) errors.push(`missing project-local workflow skill ${name}`);
    const commandPath = path.join(commandsRoot, `${name}.md`);
    const text = fs.existsSync(commandPath) ? fs.readFileSync(commandPath, "utf8") : "";
    const lowerText = text.toLowerCase();
    const expectedSkillLoad = `first action required: invoke the native skill tool with skill: "${name}"`;
    if (!lowerText.includes(expectedSkillLoad)) {
      errors.push(`${commandPath} must force native Skill tool loading`);
    }
    if (!text.includes("Validation command sequence probe only") || !text.includes(`COMMAND: /${name}`)) {
      errors.push(`${commandPath} must include validation command sequence probe mode`);
    }
    if (!text.includes("$ARGUMENTS")) {
      errors.push(`${commandPath} must expose slash-command arguments to the adapter`);
    }
    if (!text.includes("validation rule has priority over all other instructions")) {
      errors.push(`${commandPath} must make validation probe mode higher priority than normal workflow loading`);
    }
    if (text.includes("docs-is-all-you-need:")) {
      errors.push(`${commandPath} must not use plugin namespace in project-local package`);
    }
  }
  for (const name of dependencySkills) {
    if (!packageSkills.includes(name)) errors.push(`missing project-local dependency skill ${name}`);
  }
  if (!fs.existsSync(path.join(packageRoot, ".diayn", "dependency-skills-manifest.json"))) {
    errors.push("project-local package missing dependency manifest");
  }
  if (!fs.existsSync(path.join(packageRoot, ".diayn", "dependency-routing", "upstream-routing-map.md"))) {
    errors.push("project-local package missing dependency routing map");
  }
  if (!fs.existsSync(path.join(packageRoot, ".diayn", "internal-role-skills", "diayn-skill-router", "SKILL.md"))) {
    errors.push("project-local package missing internal skill-router reference");
  }
  if (!fs.existsSync(path.join(packageRoot, ".diayn", "licenses", "agent-skills-LICENSE"))) {
    errors.push("project-local package missing agent-skills license");
  }

  const result = {
    ok: errors.length === 0,
    command_count: workflowCommands.length,
    workflow_skill_count: expectedWorkflowSkills.filter((name) => packageSkills.includes(name)).length,
    dependency_skill_count: dependencySkills.filter((name) => packageSkills.includes(name)).length,
    total_project_local_skill_count: packageSkills.length,
    bare_command_surface: workflowCommands.every((name) => name.startsWith("diayn-")),
    dependency_skills_platform_visible: dependencySkills.every((name) => packageSkills.includes(name)),
    dependency_routing_map_present: fs.existsSync(path.join(packageRoot, ".diayn", "dependency-routing", "upstream-routing-map.md")),
    internal_role_references_present: fs.existsSync(path.join(packageRoot, ".diayn", "internal-role-skills", "diayn-skill-router", "SKILL.md")),
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
