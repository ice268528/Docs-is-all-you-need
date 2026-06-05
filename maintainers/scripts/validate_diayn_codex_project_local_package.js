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
    if (manifest.platform !== "codex") errors.push("Codex project-local package must record platform codex");
    if (manifest.entry_file !== "AGENTS.md") errors.push("Codex project-local package must record entry_file AGENTS.md");
    if (!manifest.install_target || manifest.install_target.skills !== ".codex/skills") {
      errors.push("manifest install target must be .codex/skills");
    }
    if (!manifest.runtime_status || manifest.runtime_status.codex_desktop_discovery !== "not_attempted_current_scope") {
      errors.push("manifest must record that Codex Desktop app-session discovery requires separate runtime evidence");
    }
    if (!manifest.runtime_status || manifest.runtime_status.direct_diayn_invocation !== "not_attempted_current_scope") {
      errors.push("manifest must not claim direct Codex app-session /diayn-* invocation");
    }
    if (!manifest.runtime_status || manifest.runtime_status.dependency_skill_invocation !== "not_attempted_current_scope") {
      errors.push("manifest must not claim Codex app-session dependency-skill invocation");
    }
  }

  for (const name of expectedWorkflowSkills) {
    if (!packageSkills.includes(name)) errors.push(`missing Codex project-local workflow skill ${name}`);
    const packagedPath = path.join(skillsRoot, name);
    const pluginPath = path.join(pluginRoot, "skills", name);
    const openAiYamlPath = path.join(packagedPath, "agents", "openai.yaml");
    if (fs.existsSync(packagedPath)) {
      const packagedFiles = listFiles(packagedPath)
        .filter((file) => path.relative(packagedPath, file).replace(/\\/g, "/") !== "agents/openai.yaml")
        .map((file) => path.relative(packagedPath, file).replace(/\\/g, "/"));
      const pluginFiles = listFiles(pluginPath).map((file) => path.relative(pluginPath, file).replace(/\\/g, "/"));
      if (JSON.stringify(packagedFiles.sort()) !== JSON.stringify(pluginFiles.sort())) {
        errors.push(`Codex project-local workflow skill ${name} differs from plugin source beyond Codex metadata`);
      }
      for (const relativeFile of pluginFiles) {
        const packagedFile = path.join(packagedPath, relativeFile);
        const sourceFile = path.join(pluginPath, relativeFile);
        if (fs.existsSync(packagedFile) && fs.readFileSync(packagedFile).compare(fs.readFileSync(sourceFile)) !== 0) {
          errors.push(`Codex project-local workflow skill ${name}/${relativeFile} differs from plugin source`);
        }
      }
    }
    if (!fs.existsSync(openAiYamlPath)) {
      errors.push(`${name} must include Codex agents/openai.yaml metadata`);
    } else {
      const openAiYaml = fs.readFileSync(openAiYamlPath, "utf8");
      const shortDescriptionMatch = openAiYaml.match(/short_description:\s*"([^"]+)"/);
      if (!openAiYaml.includes("interface:")) errors.push(`${name} agents/openai.yaml missing interface block`);
      if (!openAiYaml.includes("display_name:")) errors.push(`${name} agents/openai.yaml missing display_name`);
      if (!shortDescriptionMatch) {
        errors.push(`${name} agents/openai.yaml missing quoted short_description`);
      } else if (shortDescriptionMatch[1].length < 25 || shortDescriptionMatch[1].length > 64) {
        errors.push(`${name} agents/openai.yaml short_description must be 25-64 chars`);
      }
      if (!openAiYaml.includes(`$${name}`)) {
        errors.push(`${name} agents/openai.yaml default_prompt must mention $${name}`);
      }
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
    platform: manifest && manifest.platform,
    entry_file: manifest && manifest.entry_file,
    workflow_skill_count: expectedWorkflowSkills.filter((name) => packageSkills.includes(name)).length,
    dependency_skill_count: dependencySkills.filter((name) => packageSkills.includes(name)).length,
    total_project_local_skill_count: packageSkills.length,
    bare_diayn_skill_surface: expectedWorkflowSkills.every((name) => packageSkills.includes(name)),
    dependency_skills_platform_visible: dependencySkills.every((name) => packageSkills.includes(name)),
    dependency_routing_map_present: fs.existsSync(path.join(packageRoot, ".diayn", "dependency-routing", "upstream-routing-map.md")),
    internal_role_references_present: fs.existsSync(path.join(packageRoot, ".diayn", "internal-role-skills", "diayn-skill-router", "SKILL.md")),
    runtime_validation: {
      codex_desktop_discovery: "not_attempted_current_scope",
      direct_diayn_invocation: "not_attempted_current_scope",
      dependency_skill_invocation: "not_attempted_current_scope",
    },
    codex_agents_openai_yaml_count: expectedWorkflowSkills.filter((name) =>
      fs.existsSync(path.join(skillsRoot, name, "agents", "openai.yaml")),
    ).length,
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
