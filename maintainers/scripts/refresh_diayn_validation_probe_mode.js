#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const pluginRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need");
const workflowSkills = [
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

function readFile(file) {
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
}

function writeFile(file, text) {
  ensureInsideRepo(file);
  fs.writeFileSync(file, text, "utf8");
}

function readFirstStop(skillPath) {
  const text = readFile(skillPath);
  const match = text.match(/## Stop Conditions\r?\n\r?\n- ([^\r\n]+)/);
  if (!match) throw new Error(`missing first stop condition: ${skillPath}`);
  return match[1].replace(/`/g, "");
}

function replaceValidationBlock(skillPath, skillName, firstStop) {
  const text = readFile(skillPath);
  const block = `## Command Arguments

\`\`\`text
$ARGUMENTS
\`\`\`

## Owner-Confirmed Command Facts

Treat explicit facts in the current command arguments or current user message as Owner-confirmed for this run unless they conflict with existing project evidence. For example, if project identity, stage id, lane applicability, language, or approval boundaries are stated in the command, use those values directly and record them in the generated docs instead of asking the same question again.

The literal phrase \`Owner-confirmed project_slug = <value>\` is a direct Owner answer. Use \`<value>\` as the project slug and do not ask for it again unless repository evidence contradicts it.

If the command arguments say scaffold creation is approved, or say all OwnerGate choices needed for the automated fixture are approved, and the audit reports only missing DIAYN baseline files with no overwrite conflicts, create the missing baseline scaffold files in the same run instead of asking for another confirmation.

Ask only when the fact is absent, ambiguous, contradicted by repository evidence, or would cause existing user content to be overwritten without a preservation decision.

## Validation Probe Mode

If the command arguments above or current user message contain \`Validation command sequence probe only\`, Validation Probe Mode has priority over Progressive Startup, Identity Guard, helper scripts, project inspection, dependency-skill routing, and all normal workflow steps.

In this mode, do not use tools, read files, inspect project state, invoke helper scripts, invoke dependency skills, or write files. Answer exactly:

\`\`\`text
COMMAND: /${skillName}
FIRST_STOP: ${firstStop}
\`\`\`

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Progressive Startup`;
  const pattern = /(?:## Command Arguments[\s\S]*?\r?\n)?## Validation Probe Mode[\s\S]*?\r?\n## Progressive Startup/;
  if (!pattern.test(text)) throw new Error(`failed to find Validation Probe Mode: ${skillPath}`);
  const next = text.replace(pattern, block);
  writeFile(skillPath, next);
}

function readCommandDescription(commandPath) {
  const text = readFile(commandPath);
  const match = text.match(/^---\r?\ndescription: (.*?)\r?\n---/);
  if (!match) throw new Error(`missing command description: ${commandPath}`);
  return match[1];
}

function writePluginCommand(skillName, firstStop) {
  const commandPath = path.join(pluginRoot, ".claude", "commands", `${skillName}.md`);
  const description = readCommandDescription(commandPath);
  const text = `---
description: ${description}
---

Command arguments:

\`\`\`text
$ARGUMENTS
\`\`\`

If the command arguments contain \`Validation command sequence probe only\`, this validation rule has priority over all other instructions in this command. Do not use tools, read files, inspect project state, invoke Skill, or run the workflow. Answer exactly:

\`\`\`text
COMMAND: /${skillName}
FIRST_STOP: ${firstStop}
\`\`\`

Then stop.

Native Skill Invocation Gate:

- This command adapter is only an entrypoint, not the DIAYN workflow implementation.
- First action required: invoke the native Skill tool with skill: "docs-is-all-you-need:${skillName}".
- Unless Validation Probe Mode applies, the first action must be a native Skill tool invocation with skill: "docs-is-all-you-need:${skillName}".
- Do not inspect files, run Bash, answer the user, or perform workflow steps from this adapter before that Skill invocation succeeds.
- If the Skill tool is unavailable or denied, stop and report that the installed command cannot run because native DIAYN skill invocation failed.
- After the Skill loads, follow that skill's instructions. Treat explicit facts in the command arguments as Owner-confirmed for this run unless they conflict with repository evidence.
`;
  writeFile(commandPath, text);
}

function main() {
  for (const skillName of workflowSkills) {
    const pluginSkill = path.join(pluginRoot, "skills", skillName, "SKILL.md");
    const rootSkill = path.join(repoRoot, "skills", skillName, "SKILL.md");
    const firstStop = readFirstStop(pluginSkill);
    replaceValidationBlock(rootSkill, skillName, firstStop);
    replaceValidationBlock(pluginSkill, skillName, firstStop);
    writePluginCommand(skillName, firstStop);
  }
  console.log(JSON.stringify({ ok: true, refreshed_workflow_skills: workflowSkills.length }, null, 2));
}

main();
