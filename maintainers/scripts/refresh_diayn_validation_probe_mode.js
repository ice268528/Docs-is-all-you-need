#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const pluginRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need");
const pluginNamespace = "diayn";
const workflowCommands = [
  ["init", "diayn-init"],
  ["plan", "diayn-plan"],
  ["worktrees", "diayn-worktrees"],
  ["backend", "diayn-backend"],
  ["frontend", "diayn-frontend"],
  ["review-backend", "diayn-review-backend"],
  ["review-frontend", "diayn-review-frontend"],
  ["sync", "diayn-sync"],
  ["integration", "diayn-integration"],
  ["bug", "diayn-bug"],
  ["new", "diayn-new"],
  ["html", "diayn-html"],
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

function readSkillDescription(skillPath) {
  const text = readFile(skillPath);
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`missing skill frontmatter: ${skillPath}`);
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx > 0 && line.slice(0, idx).trim() === "description") {
      return line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  throw new Error(`missing skill description: ${skillPath}`);
}

function writePluginCommand(commandName, skillName, firstStop) {
  const skillPath = path.join(pluginRoot, "skills", skillName, "SKILL.md");
  const commandPath = path.join(pluginRoot, ".claude", "commands", `${commandName}.md`);
  const description = readSkillDescription(skillPath);
  const text = `---
description: ${description}
---

Command arguments:

\`\`\`text
$ARGUMENTS
\`\`\`

If the command arguments contain \`Validation command sequence probe only\`, this validation rule has priority over all other instructions in this command. Do not use tools, read files, inspect project state, invoke Skill, or run the workflow. Answer exactly:

\`\`\`text
COMMAND: /${pluginNamespace}:${commandName}
FIRST_STOP: ${firstStop}
\`\`\`

Then stop.

Native Skill Invocation Gate:

- This command adapter is only an entrypoint, not the DIAYN workflow implementation.
- First action required: invoke the native Skill tool with skill: "${pluginNamespace}:${skillName}".
- Unless Validation Probe Mode applies, the first action must be a native Skill tool invocation with skill: "${pluginNamespace}:${skillName}".
- Do not inspect files, run Bash, answer the user, or perform workflow steps from this adapter before that Skill invocation succeeds.
- If the Skill tool is unavailable or denied, stop and report that the installed command cannot run because native DIAYN skill invocation failed.
- After the Skill loads, follow that skill's instructions. Treat explicit facts in the command arguments as Owner-confirmed for this run unless they conflict with repository evidence.
`;
  writeFile(commandPath, text);
}

function main() {
  const pluginCommandsRoot = path.join(pluginRoot, ".claude", "commands");
  ensureInsideRepo(pluginCommandsRoot);
  fs.rmSync(pluginCommandsRoot, { recursive: true, force: true });
  fs.mkdirSync(pluginCommandsRoot, { recursive: true });

  for (const [commandName, skillName] of workflowCommands) {
    const pluginSkill = path.join(pluginRoot, "skills", skillName, "SKILL.md");
    const firstStop = readFirstStop(pluginSkill);
    writePluginCommand(commandName, skillName, firstStop);
  }
  console.log(JSON.stringify({ ok: true, refreshed_plugin_commands: workflowCommands.length }, null, 2));
}

main();
