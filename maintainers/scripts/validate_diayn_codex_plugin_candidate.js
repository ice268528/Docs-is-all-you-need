#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const marketplacePath = path.join(repoRoot, ".agents", "plugins", "marketplace.json");
const legacyRootMarketplacePath = path.join(repoRoot, "marketplace.json");
const rootPluginManifestPath = path.join(repoRoot, ".codex-plugin", "plugin.json");
const pluginRoot = path.join(repoRoot, "plugins", "diayn");
const pluginManifestPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");
const skillsRoot = path.join(pluginRoot, "skills");
const dependencySource = path.join(repoRoot, "plugins", "docs-is-all-you-need", "dependency-skills", "agent-skills", "skills");

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

function readJson(file, errors, label) {
  if (!fs.existsSync(file)) {
    errors.push(`missing ${label}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${label} must be valid JSON: ${error.message}`);
    return null;
  }
}

function listSkillDirs(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort();
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const marketplace = readJson(marketplacePath, errors, ".agents/plugins/marketplace.json");
  const rootPluginManifest = readJson(rootPluginManifestPath, errors, ".codex-plugin/plugin.json");
  const pluginManifest = readJson(pluginManifestPath, errors, "plugins/diayn/.codex-plugin/plugin.json");
  const candidateSkills = listSkillDirs(skillsRoot);
  const dependencySkills = listSkillDirs(dependencySource);

  if (fs.existsSync(legacyRootMarketplacePath)) {
    errors.push("legacy root marketplace.json must be removed; Codex marketplace manifest belongs at .agents/plugins/marketplace.json");
  }

  if (marketplace) {
    if (marketplace.name !== "diayn-local-alpha") errors.push("marketplace name must be diayn-local-alpha");
    const plugins = Array.isArray(marketplace.plugins) ? marketplace.plugins : [];
    const entry = plugins.find((item) => item && item.name === "diayn");
    if (!entry) errors.push("marketplace must contain a diayn plugin entry");
    else {
      if (!entry.source || entry.source.source !== "local") errors.push("diayn marketplace entry source.source must be local");
      if (!entry.source || entry.source.path !== "./plugins/diayn") errors.push("diayn marketplace entry source.path must be ./plugins/diayn");
      if (!entry.policy || entry.policy.installation !== "AVAILABLE") errors.push("diayn marketplace entry installation policy must be AVAILABLE");
      if (!entry.policy || entry.policy.authentication !== "ON_INSTALL") errors.push("diayn marketplace entry authentication policy must be ON_INSTALL");
      if (entry.category !== "Productivity") errors.push("diayn marketplace entry category must be Productivity");
    }
  }

  if (rootPluginManifest) {
    if (rootPluginManifest.id) errors.push("repository-root Codex plugin manifest must not use legacy id field");
    if (rootPluginManifest.name !== "diayn") errors.push("repository-root Codex plugin name must be diayn");
    if (rootPluginManifest.skills !== "./plugins/diayn/skills/") {
      errors.push("repository-root Codex plugin skills path must be ./plugins/diayn/skills/");
    }
    if (JSON.stringify(rootPluginManifest.interface && rootPluginManifest.interface.defaultPrompt || []).includes("/diayn")) {
      errors.push("repository-root Codex default prompts must not claim verified /diayn-* slash commands");
    }
  }

  if (pluginManifest) {
    if (pluginManifest.id) errors.push("Codex candidate plugin manifest must not use legacy id field");
    if (pluginManifest.name !== "diayn") errors.push("Codex candidate plugin name must be diayn");
    if (pluginManifest.skills !== "./skills/") errors.push("Codex candidate plugin skills path must be ./skills/");
    if (JSON.stringify(pluginManifest.interface && pluginManifest.interface.defaultPrompt || []).includes("/diayn")) {
      errors.push("Codex candidate default prompts must not claim verified /diayn-* slash commands");
    }
    const serialized = JSON.stringify(pluginManifest);
    for (const forbidden of [".claude", "packages/claude-project-local", "plugins/docs-is-all-you-need/.claude-plugin"]) {
      if (serialized.includes(forbidden)) errors.push(`Codex candidate manifest must not reference Claude path ${forbidden}`);
    }
  }

  for (const skill of expectedWorkflowSkills) {
    if (!candidateSkills.includes(skill)) errors.push(`missing Codex candidate workflow skill ${skill}`);
    const openAiYaml = path.join(skillsRoot, skill, "agents", "openai.yaml");
    if (!fs.existsSync(openAiYaml)) errors.push(`workflow skill ${skill} must include agents/openai.yaml metadata`);
  }

  for (const skill of dependencySkills) {
    if (!candidateSkills.includes(skill)) errors.push(`missing Codex candidate dependency skill ${skill}`);
  }

  for (const supportPath of [
    "dependency-routing/upstream-routing-map.md",
    "dependency-references/agent-skills/testing-patterns.md",
    "internal-role-skills/diayn-skill-router/SKILL.md",
    "licenses/agent-skills-LICENSE",
    "dependency-skills-manifest.json",
  ]) {
    if (!fs.existsSync(path.join(pluginRoot, supportPath))) {
      errors.push(`missing Codex candidate support path ${supportPath}`);
    }
  }

  const result = {
    ok: errors.length === 0,
    schema: "diayn.codex_plugin_candidate.v1",
    marketplace: ".agents/plugins/marketplace.json",
    marketplace_name: marketplace && marketplace.name,
    root_plugin_manifest: ".codex-plugin/plugin.json",
    root_plugin_skills: rootPluginManifest && rootPluginManifest.skills,
    plugin_root: "plugins/diayn",
    plugin_name: pluginManifest && pluginManifest.name,
    plugin_status: "candidate",
    runtime_validation: {
      codex_desktop_plugin_install: "not_attempted",
      codex_desktop_app_session_discovery: "not_attempted",
      direct_diayn_slash_invocation: "not_claimed",
      dependency_skill_native_invocation: "not_attempted",
    },
    workflow_skill_count: expectedWorkflowSkills.filter((skill) => candidateSkills.includes(skill)).length,
    dependency_skill_count: dependencySkills.filter((skill) => candidateSkills.includes(skill)).length,
    total_skill_count: candidateSkills.length,
    errors,
  };

  const payload = JSON.stringify(result, null, 2);
  if (outputPath) {
    const fullOutputPath = path.resolve(repoRoot, outputPath);
    fs.mkdirSync(path.dirname(fullOutputPath), { recursive: true });
    fs.writeFileSync(fullOutputPath, `${payload}\n`, "utf8");
  }
  console.log(payload);
  if (!result.ok) process.exitCode = 1;
}

main();
