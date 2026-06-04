#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const workspaceRoot = path.resolve(repoRoot, "..");
const dddv8Root = path.join(workspaceRoot, "DDDV8");
const superpowersRoot = path.join(workspaceRoot, "superpowers");
const agentSkillsRoot = path.join(workspaceRoot, "agent-skills");
const claudeSkillCreatorRoot = path.join(workspaceRoot, "claude_skills", "skills", "skill-creator");

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

function readText(file, errors, label = file) {
  if (!fs.existsSync(file)) {
    errors.push(`missing ${label}`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

function readJson(file, errors, label = file) {
  const text = readText(file, errors, label);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    errors.push(`invalid JSON in ${label}: ${error.message}`);
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

function listCommandNames(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.replace(/\.md$/, ""))
    .sort();
}

function hasAll(haystack, needles) {
  return needles.every((needle) => haystack.includes(needle));
}

function sameSorted(a, b) {
  return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const skillCreatorReport = readText(
    path.join(dddv8Root, "skill_creator_comparison_report.md"),
    errors,
    "DDDV8/skill_creator_comparison_report.md",
  );
  const referenceProjectReport = readText(
    path.join(dddv8Root, "reference_projects_multi_platform_adaptation_report.md"),
    errors,
    "DDDV8/reference_projects_multi_platform_adaptation_report.md",
  );

  const reportChecks = {
    skill_creator_platform_split: hasAll(skillCreatorReport, [
      "Claude Code 和 Codex 的安装、元数据、验证和运行时证明必须分别处理",
      "Codex 的 `agents/openai.yaml` 是 Codex 特有内容",
      "Claude 的 eval 闭环比 Codex 更重",
      "slash command 只是平台入口或 adapter",
    ]),
    reference_platform_split: hasAll(referenceProjectReport, [
      "共享核心 skills，然后按平台分别处理安装、命令、启动上下文、工具映射和验证",
      ".claude-plugin/",
      ".codex-plugin/",
      "不同 harness 要分别安装",
    ]),
  };

  for (const [key, ok] of Object.entries(reportChecks)) {
    if (!ok) errors.push(`report conclusion check failed: ${key}`);
  }

  const superpowersCodex = readJson(
    path.join(superpowersRoot, ".codex-plugin", "plugin.json"),
    errors,
    "superpowers/.codex-plugin/plugin.json",
  );
  const superpowersClaude = readJson(
    path.join(superpowersRoot, ".claude-plugin", "plugin.json"),
    errors,
    "superpowers/.claude-plugin/plugin.json",
  );
  const agentSkillsClaude = readJson(
    path.join(agentSkillsRoot, ".claude-plugin", "plugin.json"),
    errors,
    "agent-skills/.claude-plugin/plugin.json",
  );
  const claudeSkillCreator = readText(
    path.join(claudeSkillCreatorRoot, "SKILL.md"),
    errors,
    "claude_skills/skills/skill-creator/SKILL.md",
  );

  if (!superpowersCodex || superpowersCodex.skills !== "./skills/") {
    errors.push("superpowers Codex reference must expose ./skills/");
  }
  if (!superpowersClaude || superpowersClaude.name !== "superpowers") {
    errors.push("superpowers Claude plugin reference missing");
  }
  if (!agentSkillsClaude || agentSkillsClaude.commands !== "./.claude/commands" || agentSkillsClaude.skills !== "./skills") {
    errors.push("agent-skills Claude reference must expose ./.claude/commands and ./skills");
  }
  if (!hasAll(claudeSkillCreator, ["with-skill", "baseline", "generate_review.py", "run_eval.py"])) {
    errors.push("local Claude skill-creator reference must expose eval loop concepts");
  }

  const rootClaude = readJson(path.join(repoRoot, ".claude-plugin", "plugin.json"), errors, ".claude-plugin/plugin.json");
  const rootCodex = readJson(path.join(repoRoot, ".codex-plugin", "plugin.json"), errors, ".codex-plugin/plugin.json");
  const innerClaude = readJson(
    path.join(repoRoot, "plugins", "docs-is-all-you-need", ".claude-plugin", "plugin.json"),
    errors,
    "plugins/docs-is-all-you-need/.claude-plugin/plugin.json",
  );
  const innerCodex = readJson(
    path.join(repoRoot, "plugins", "docs-is-all-you-need", ".codex-plugin", "plugin.json"),
    errors,
    "plugins/docs-is-all-you-need/.codex-plugin/plugin.json",
  );

  const rootCommands = listCommandNames(path.join(repoRoot, ".claude", "commands"));
  const innerCommands = listCommandNames(path.join(repoRoot, "plugins", "docs-is-all-you-need", ".claude", "commands"));
  const pluginWorkflowSkills = listSkillDirs(path.join(repoRoot, "plugins", "docs-is-all-you-need", "skills"));
  const claudePackageSkills = listSkillDirs(path.join(repoRoot, "packages", "claude-project-local", ".claude", "skills"));
  const codexPackageSkills = listSkillDirs(path.join(repoRoot, "packages", "codex-project-local", ".codex", "skills"));

  if (!rootClaude || rootClaude.commands !== "./.claude/commands") {
    errors.push("target root Claude manifest must point at root ./.claude/commands");
  }
  if (!rootClaude || rootClaude.name !== "diayn") {
    errors.push("target root Claude manifest must use plugin namespace name diayn");
  }
  if (!rootClaude || rootClaude.skills !== "./packages/claude-project-local/.claude/skills") {
    errors.push("target root Claude manifest must point at generated Claude package skills");
  }
  if (!innerClaude || innerClaude.commands !== "./.claude/commands" || innerClaude.skills !== "./skills") {
    errors.push("target inner Claude candidate must follow agent-skills command/skills shape");
  }
  if (!innerClaude || innerClaude.name !== "diayn") {
    errors.push("target inner Claude candidate must use plugin namespace name diayn");
  }
  if (!sameSorted(rootCommands, expectedWorkflowSkills) || !sameSorted(innerCommands, expectedWorkflowSkills)) {
    errors.push("target Claude command adapters must be exactly the 12 DIAYN workflow commands");
  }
  for (const name of expectedWorkflowSkills) {
    const rootCommand = path.join(repoRoot, ".claude", "commands", `${name}.md`);
    const innerCommand = path.join(repoRoot, "plugins", "docs-is-all-you-need", ".claude", "commands", `${name}.md`);
    if (fs.existsSync(rootCommand) && fs.existsSync(innerCommand)) {
      const rootText = fs.readFileSync(rootCommand, "utf8");
      const innerText = fs.readFileSync(innerCommand, "utf8");
      if (rootText !== innerText) errors.push(`root and inner Claude command differ: ${name}`);
      if (!rootText.includes(`diayn:${name}`)) {
        errors.push(`Claude plugin command must invoke namespaced workflow skill: ${name}`);
      }
    }
  }

  if (!rootCodex || rootCodex.skills !== "./packages/codex-project-local/.codex/skills/") {
    errors.push("target root Codex manifest must point at generated Codex package skills");
  }
  if (!innerCodex || innerCodex.skills !== "./skills/") {
    errors.push("target inner Codex candidate must point at ./skills/");
  }
  for (const [label, manifest] of [
    ["root Codex", rootCodex],
    ["inner Codex", innerCodex],
  ]) {
    const iface = manifest && manifest.interface ? manifest.interface : {};
    const capabilities = Array.isArray(iface.capabilities) ? iface.capabilities : [];
    if (!manifest || !manifest.homepage || !manifest.repository || manifest.license !== "MIT") {
      errors.push(`${label} manifest must carry product source/license metadata`);
    }
    if (!capabilities.includes("Interactive") || !capabilities.includes("Read") || !capabilities.includes("Write")) {
      errors.push(`${label} manifest must include Interactive/Read/Write capabilities`);
    }
    if (!Array.isArray(iface.defaultPrompt) || !iface.defaultPrompt.includes("/diayn-init")) {
      errors.push(`${label} manifest must include DIAYN defaultPrompt examples`);
    }
    if (iface.composerIcon || iface.logo) {
      errors.push(`${label} manifest must not point to fake icon/logo assets`);
    }
  }

  if (!sameSorted(pluginWorkflowSkills, expectedWorkflowSkills)) {
    errors.push("target plugin public workflow skills must be exactly the 12 DIAYN skills");
  }
  if (claudePackageSkills.length !== 35 || codexPackageSkills.length !== 35) {
    errors.push("target generated Claude and Codex packages must each expose 35 platform-visible skills");
  }
  for (const name of expectedWorkflowSkills) {
    if (!fs.existsSync(path.join(repoRoot, "packages", "codex-project-local", ".codex", "skills", name, "agents", "openai.yaml"))) {
      errors.push(`Codex package workflow skill missing agents/openai.yaml: ${name}`);
    }
  }

  const claudeAlignment = readJson(
    path.join(repoRoot, "validation", "phase9_claude_skill_creator_alignment.json"),
    errors,
    "validation/phase9_claude_skill_creator_alignment.json",
  );
  if (
    !claudeAlignment ||
    claudeAlignment.trigger_eval_sets_ready !== true ||
    claudeAlignment.benchmark_complete !== false ||
    claudeAlignment.broad_auto_trigger_claim_allowed !== false
  ) {
    errors.push("Claude skill-creator alignment must be ready without claiming benchmark completion");
  }

  const releaseGate = readJson(path.join(repoRoot, "validation", "phase9_release_gate.json"), errors, "validation/phase9_release_gate.json");
  if (
    !releaseGate ||
    releaseGate.release_ready !== true ||
    !Array.isArray(releaseGate.supported_alpha_surfaces) ||
    !releaseGate.supported_alpha_surfaces.includes("claude_code_cli_project_local") ||
    !releaseGate.supported_alpha_surfaces.includes("codex_package_install") ||
    (Array.isArray(releaseGate.supported_alpha_surfaces) && releaseGate.supported_alpha_surfaces.includes("codex_desktop")) ||
    !Array.isArray(releaseGate.blocking_issue_ids) ||
    releaseGate.blocking_issue_ids.length !== 0 ||
    releaseGate.codex_package_install_scope_ok !== true ||
    releaseGate.codex_app_session_runtime_current_scope_boundary_ok !== true
  ) {
    errors.push("reference alignment must preserve the Codex package/install boundary without claiming Desktop app-session runtime");
  }

  const result = {
    schema: "diayn.reference_project_alignment.v1",
    ok: errors.length === 0,
    date: "2026-06-02",
    reports: {
      skill_creator_comparison_report: "DDDV8/skill_creator_comparison_report.md",
      reference_projects_multi_platform_adaptation_report: "DDDV8/reference_projects_multi_platform_adaptation_report.md",
      checks: reportChecks,
    },
    references: {
      superpowers: {
        claude_plugin_present: Boolean(superpowersClaude),
        codex_skills_path: superpowersCodex && superpowersCodex.skills,
      },
      agent_skills: {
        claude_commands: agentSkillsClaude && agentSkillsClaude.commands,
        claude_skills: agentSkillsClaude && agentSkillsClaude.skills,
      },
      claude_skill_creator: {
        eval_loop_terms_present: hasAll(claudeSkillCreator, ["with-skill", "baseline", "generate_review.py", "run_eval.py"]),
      },
    },
    target_alignment: {
      root_claude_commands: rootClaude && rootClaude.commands,
      root_claude_skills: rootClaude && rootClaude.skills,
      root_claude_command_count: rootCommands.length,
      inner_claude_command_count: innerCommands.length,
      root_codex_skills: rootCodex && rootCodex.skills,
      inner_codex_skills: innerCodex && innerCodex.skills,
      codex_capabilities: rootCodex && rootCodex.interface && rootCodex.interface.capabilities,
      plugin_workflow_skill_count: pluginWorkflowSkills.length,
      claude_package_skill_count: claudePackageSkills.length,
      codex_package_skill_count: codexPackageSkills.length,
      codex_agents_openai_yaml_count: expectedWorkflowSkills.filter((name) =>
        fs.existsSync(path.join(repoRoot, "packages", "codex-project-local", ".codex", "skills", name, "agents", "openai.yaml")),
      ).length,
      claude_skill_creator_alignment: claudeAlignment
        ? {
            trigger_eval_sets_ready: claudeAlignment.trigger_eval_sets_ready,
            benchmark_complete: claudeAlignment.benchmark_complete,
            broad_auto_trigger_claim_allowed: claudeAlignment.broad_auto_trigger_claim_allowed,
          }
        : null,
      release_ready: releaseGate && releaseGate.release_ready,
      blocking_issue_ids: releaseGate && releaseGate.blocking_issue_ids,
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
