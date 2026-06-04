#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const pluginRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need");
const expected = [
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

function listDirs(root) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
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
  const rootCodexManifest = readJson(path.join(repoRoot, ".codex-plugin", "plugin.json"));
  const rootClaudeManifest = readJson(path.join(repoRoot, ".claude-plugin", "plugin.json"));
  const rootClaudeMarketplace = readJson(path.join(repoRoot, ".claude-plugin", "marketplace.json"));
  const codexManifest = readJson(path.join(pluginRoot, ".codex-plugin", "plugin.json"));
  const claudeManifest = readJson(path.join(pluginRoot, ".claude-plugin", "plugin.json"));
  const dependencyManifest = readJson(path.join(pluginRoot, "dependency-skills", "manifest.json"));
  const publicSkills = listDirs(path.join(pluginRoot, "skills"));
  const claudeCommands = listMarkdown(path.join(pluginRoot, ".claude", "commands"));
  const rootClaudeCommands = listMarkdown(path.join(repoRoot, ".claude", "commands"));
  const codexProjectLocalRoot = path.join(repoRoot, "packages", "codex-project-local");
  const codexProjectLocalSkillsRoot = path.join(codexProjectLocalRoot, ".codex", "skills");
  const codexProjectLocalManifestPath = path.join(codexProjectLocalRoot, "diayn-package.json");
  const codexProjectLocalManifest = fs.existsSync(codexProjectLocalManifestPath)
    ? readJson(codexProjectLocalManifestPath)
    : null;
  const codexProjectLocalSkills = fs.existsSync(codexProjectLocalSkillsRoot)
    ? listDirs(codexProjectLocalSkillsRoot)
    : [];
  const claudeProjectLocalSkillsRoot = path.join(repoRoot, "packages", "claude-project-local", ".claude", "skills");
  const claudeProjectLocalSkills = fs.existsSync(claudeProjectLocalSkillsRoot)
    ? listDirs(claudeProjectLocalSkillsRoot)
    : [];

  if (JSON.stringify(publicSkills) !== JSON.stringify([...expected].sort())) {
    errors.push("plugin public skills must be exactly the 12 DIAYN workflow skills");
  }
  if (JSON.stringify(claudeCommands) !== JSON.stringify([...expected].sort())) {
    errors.push("Claude command files must be exactly the 12 DIAYN workflow commands");
  }
  if (codexManifest.skills !== "./skills/") errors.push("Codex manifest must point skills to ./skills/");
  for (const [label, manifest] of [
    ["repository-root Codex manifest", rootCodexManifest],
    ["inner Codex manifest", codexManifest],
  ]) {
    if (manifest.homepage !== "https://github.com/ice268528/Docs-is-all-you-need") {
      errors.push(`${label} must include homepage metadata`);
    }
    if (manifest.repository !== "https://github.com/ice268528/Docs-is-all-you-need") {
      errors.push(`${label} must include repository metadata`);
    }
    if (manifest.license !== "MIT") {
      errors.push(`${label} must include MIT license metadata`);
    }
    if (!Array.isArray(manifest.keywords) || !manifest.keywords.includes("multi-session")) {
      errors.push(`${label} must include Codex plugin keywords`);
    }
    const iface = manifest.interface || {};
    const capabilities = Array.isArray(iface.capabilities) ? iface.capabilities : [];
    for (const capability of ["Interactive", "Read", "Write"]) {
      if (!capabilities.includes(capability)) {
        errors.push(`${label} must include ${capability} capability`);
      }
    }
    if (iface.websiteURL !== "https://github.com/ice268528/Docs-is-all-you-need") {
      errors.push(`${label} must include websiteURL metadata`);
    }
    if (!iface.privacyPolicyURL || !iface.termsOfServiceURL || !iface.brandColor || !Array.isArray(iface.screenshots)) {
      errors.push(`${label} must include Codex UI policy, brand, and screenshots metadata`);
    }
    if (iface.composerIcon || iface.logo) {
      errors.push(`${label} must not point to icon/logo assets until real assets are committed`);
    }
  }
  if (claudeManifest.skills !== "./skills") errors.push("Claude manifest must point skills to ./skills");
  if (claudeManifest.commands !== "./.claude/commands") errors.push("Claude manifest must point commands to ./.claude/commands");
  if (claudeManifest.name !== "diayn") errors.push("Claude manifest must use short namespace name diayn");
  if (rootCodexManifest.skills !== "./packages/codex-project-local/.codex/skills/") {
    errors.push("Repository-root Codex manifest must point to the platform-visible Codex package skills");
  }
  if (rootClaudeManifest.commands !== "./.claude/commands") {
    errors.push("Repository-root Claude manifest must point to root ./.claude/commands like the reference plugin shape");
  }
  if (rootClaudeManifest.skills !== "./packages/claude-project-local/.claude/skills") {
    errors.push("Repository-root Claude manifest must point to the platform-visible Claude package skills");
  }
  if (rootClaudeManifest.name !== "diayn") {
    errors.push("Repository-root Claude plugin manifest must use short namespace name diayn");
  }
  if (!rootClaudeMarketplace.plugins || !rootClaudeMarketplace.plugins.some((plugin) => plugin.name === "diayn")) {
    errors.push("Repository-root Claude marketplace manifest must publish diayn");
  }
  if (JSON.stringify(rootClaudeCommands) !== JSON.stringify([...expected].sort())) {
    errors.push("Repository-root Claude command files must be exactly the 12 DIAYN workflow commands");
  }
  if (dependencyManifest.public_diayn_command_surface !== false) {
    errors.push("Dependency payload must not be public DIAYN command surface");
  }
  if (!fs.existsSync(path.join(pluginRoot, "dependency-skills", "agent-skills", "skills"))) {
    errors.push("DIAYN-managed dependency skill payload is missing");
  }
  if (!codexProjectLocalManifest) {
    errors.push("Codex project-local package manifest is missing");
  } else {
    if (codexProjectLocalManifest.schema !== "diayn.codex_project_local_package.v1") {
      errors.push("Codex project-local package manifest schema mismatch");
    }
    if (!codexProjectLocalManifest.install_target || codexProjectLocalManifest.install_target.skills !== ".codex/skills") {
      errors.push("Codex project-local package must install to .codex/skills");
    }
    if (
      !codexProjectLocalManifest.runtime_status ||
      codexProjectLocalManifest.runtime_status.direct_diayn_invocation !== "not_attempted_current_scope"
    ) {
      errors.push("Codex project-local package must record Owner-instructed non-attempt for app-session /diayn-* invocation");
    }
  }
  for (const name of expected) {
    if (!codexProjectLocalSkills.includes(name)) {
      errors.push(`Codex project-local package missing workflow skill ${name}`);
    }
    if (!fs.existsSync(path.join(codexProjectLocalSkillsRoot, name, "agents", "openai.yaml"))) {
      errors.push(`Codex project-local workflow skill ${name} missing agents/openai.yaml`);
    }
    if (!claudeProjectLocalSkills.includes(name)) {
      errors.push(`Claude project-local package missing workflow skill ${name}`);
    }
  }
  for (const name of dependencyManifest.skills) {
    if (!codexProjectLocalSkills.includes(name)) {
      errors.push(`Codex project-local package missing dependency skill ${name}`);
    }
    if (!claudeProjectLocalSkills.includes(name)) {
      errors.push(`Claude project-local package missing dependency skill ${name}`);
    }
  }

  for (const name of expected) {
    const commandPath = path.join(pluginRoot, ".claude", "commands", `${name}.md`);
    const text = fs.readFileSync(commandPath, "utf8");
    const lowerText = text.toLowerCase();
    const expectedSkillLoad = `first action required: invoke the native skill tool with skill: "diayn:${name}"`;
    if (!lowerText.includes(expectedSkillLoad)) {
      errors.push(`${commandPath} does not force native Skill tool loading for the matching workflow skill`);
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
    const rootCommandPath = path.join(repoRoot, ".claude", "commands", `${name}.md`);
    if (!fs.existsSync(rootCommandPath)) {
      errors.push(`repository-root Claude command ${name}.md is missing`);
    } else if (fs.readFileSync(rootCommandPath, "utf8") !== text) {
      errors.push(`repository-root Claude command ${name}.md must match the inner plugin command adapter`);
    }
  }

  const installTruth = fs.readFileSync(path.join(repoRoot, "docs", "install", "README.md"), "utf8");
  if (!installTruth.includes("OpenCode CLI | Deferred")) errors.push("Install truth must keep OpenCode deferred for DDDV8");
  if (!installTruth.includes("No alpha claim for a surface until that surface's installed package completes")) {
    errors.push("Install truth must keep alpha validation gate");
  }
  if (!/Surface support is\s+evaluated independently/.test(installTruth)) {
    errors.push("Install truth must describe surface-specific alpha support");
  }

  const result = {
    ok: errors.length === 0,
    public_skill_count: publicSkills.length,
    claude_command_count: claudeCommands.length,
    repository_root_claude_command_count: rootClaudeCommands.length,
    codex_manifest: {
      skills: codexManifest.skills,
      defaultPrompt: codexManifest.interface && codexManifest.interface.defaultPrompt,
      capabilities: codexManifest.interface && codexManifest.interface.capabilities,
      websiteURL: codexManifest.interface && codexManifest.interface.websiteURL,
    },
    repository_root_manifests: {
      codex_skills: rootCodexManifest.skills,
      codex_capabilities: rootCodexManifest.interface && rootCodexManifest.interface.capabilities,
      claude_commands: rootClaudeManifest.commands,
      claude_skills: rootClaudeManifest.skills,
      claude_marketplace_plugins: (rootClaudeMarketplace.plugins || []).map((plugin) => plugin.name),
      claude_plugin_name: rootClaudeManifest.name,
    },
    codex_project_local: {
      install_target: ".codex/skills",
      workflow_skill_count: expected.filter((name) => codexProjectLocalSkills.includes(name)).length,
      dependency_skill_count: dependencyManifest.skills.filter((name) => codexProjectLocalSkills.includes(name)).length,
      total_skill_count: codexProjectLocalSkills.length,
      runtime_status: codexProjectLocalManifest && codexProjectLocalManifest.runtime_status,
      agents_openai_yaml_count: expected.filter((name) =>
        fs.existsSync(path.join(codexProjectLocalSkillsRoot, name, "agents", "openai.yaml")),
      ).length,
    },
    claude_project_local: {
      install_target: ".claude/skills",
      workflow_skill_count: expected.filter((name) => claudeProjectLocalSkills.includes(name)).length,
      dependency_skill_count: dependencyManifest.skills.filter((name) => claudeProjectLocalSkills.includes(name)).length,
      total_skill_count: claudeProjectLocalSkills.length,
    },
    claude_manifest: {
      name: claudeManifest.name,
      commands: claudeManifest.commands,
      skills: claudeManifest.skills,
    },
    dependency_payload_present: fs.existsSync(path.join(pluginRoot, "dependency-skills", "agent-skills", "skills")),
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
