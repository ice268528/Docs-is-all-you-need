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
  const codexManifest = readJson(path.join(pluginRoot, ".codex-plugin", "plugin.json"));
  const claudeManifest = readJson(path.join(pluginRoot, ".claude-plugin", "plugin.json"));
  const dependencyManifest = readJson(path.join(pluginRoot, "dependency-skills", "manifest.json"));
  const publicSkills = listDirs(path.join(pluginRoot, "skills"));
  const claudeCommands = listMarkdown(path.join(pluginRoot, ".claude", "commands"));
  const codexProjectLocalRoot = path.join(repoRoot, "packages", "codex-project-local");
  const codexProjectLocalSkillsRoot = path.join(codexProjectLocalRoot, ".codex", "skills");
  const codexProjectLocalManifestPath = path.join(codexProjectLocalRoot, "diayn-package.json");
  const codexProjectLocalManifest = fs.existsSync(codexProjectLocalManifestPath)
    ? readJson(codexProjectLocalManifestPath)
    : null;
  const codexProjectLocalSkills = fs.existsSync(codexProjectLocalSkillsRoot)
    ? listDirs(codexProjectLocalSkillsRoot)
    : [];

  if (JSON.stringify(publicSkills) !== JSON.stringify([...expected].sort())) {
    errors.push("plugin public skills must be exactly the 12 DIAYN workflow skills");
  }
  if (JSON.stringify(claudeCommands) !== JSON.stringify([...expected].sort())) {
    errors.push("Claude command files must be exactly the 12 DIAYN workflow commands");
  }
  if (codexManifest.skills !== "./skills/") errors.push("Codex manifest must point skills to ./skills/");
  if (claudeManifest.skills !== "./skills") errors.push("Claude manifest must point skills to ./skills");
  if (claudeManifest.commands !== "./.claude/commands") errors.push("Claude manifest must point commands to ./.claude/commands");
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
      codexProjectLocalManifest.runtime_status.direct_diayn_invocation !== "not_proven_access_denied_in_current_environment"
    ) {
      errors.push("Codex project-local package must not claim runtime /diayn-* invocation");
    }
  }
  for (const name of expected) {
    if (!codexProjectLocalSkills.includes(name)) {
      errors.push(`Codex project-local package missing workflow skill ${name}`);
    }
  }
  for (const name of dependencyManifest.skills) {
    if (!codexProjectLocalSkills.includes(name)) {
      errors.push(`Codex project-local package missing dependency skill ${name}`);
    }
  }

  for (const name of expected) {
    const commandPath = path.join(pluginRoot, ".claude", "commands", `${name}.md`);
    const text = fs.readFileSync(commandPath, "utf8");
    const lowerText = text.toLowerCase();
    const expectedSkillLoad = `first action required: invoke the native skill tool with skill: "docs-is-all-you-need:${name}"`;
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
  }

  const installTruth = fs.readFileSync(path.join(repoRoot, "docs", "install", "README.md"), "utf8");
  if (!installTruth.includes("OpenCode CLI | Deferred")) errors.push("Install truth must keep OpenCode deferred for DDDV8");
  if (!installTruth.includes("No alpha claim for a surface until that surface's installed package completes")) {
    errors.push("Install truth must keep alpha validation gate");
  }
  if (!installTruth.includes("Surface support is evaluated independently")) {
    errors.push("Install truth must describe surface-specific alpha support");
  }

  const result = {
    ok: errors.length === 0,
    public_skill_count: publicSkills.length,
    claude_command_count: claudeCommands.length,
    codex_manifest: {
      skills: codexManifest.skills,
      defaultPrompt: codexManifest.interface && codexManifest.interface.defaultPrompt,
    },
    codex_project_local: {
      install_target: ".codex/skills",
      workflow_skill_count: expected.filter((name) => codexProjectLocalSkills.includes(name)).length,
      dependency_skill_count: dependencyManifest.skills.filter((name) => codexProjectLocalSkills.includes(name)).length,
      total_skill_count: codexProjectLocalSkills.length,
      runtime_status: codexProjectLocalManifest && codexProjectLocalManifest.runtime_status,
    },
    claude_manifest: {
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
