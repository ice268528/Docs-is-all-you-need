#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const pluginRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need");
const packageRoot = path.join(repoRoot, "packages", "claude-project-local");
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

function readSkillDescription(skillName) {
  const skillPath = path.join(pluginRoot, "skills", skillName, "SKILL.md");
  const text = fs.readFileSync(skillPath, "utf8").replace(/^\uFEFF/, "");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`missing skill frontmatter for ${skillName}`);
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx > 0 && line.slice(0, idx).trim() === "description") {
      return line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  throw new Error(`missing skill description for ${skillName}`);
}

function readFirstStop(skillName) {
  const skillPath = path.join(pluginRoot, "skills", skillName, "SKILL.md");
  const text = fs.readFileSync(skillPath, "utf8").replace(/^\uFEFF/, "");
  const match = text.match(/## Stop Conditions\r?\n\r?\n- ([^\r\n]+)/);
  if (!match) throw new Error(`missing first stop condition for ${skillName}`);
  return match[1].replace(/`/g, "");
}

function commandAdapter(skillName) {
  const description = readSkillDescription(skillName);
  const firstStop = readFirstStop(skillName);
  return `---\ndescription: ${description}\n---\n\nCommand arguments:\n\n\`\`\`text\n$ARGUMENTS\n\`\`\`\n\nIf the command arguments contain \`Validation command sequence probe only\`, this validation rule has priority over all other instructions in this command. Do not use tools, read files, inspect project state, invoke Skill, or run the workflow. Answer exactly:\n\n\`\`\`text\nCOMMAND: /${skillName}\nFIRST_STOP: ${firstStop}\n\`\`\`\n\nThen stop.\n\nNative Skill Invocation Gate:\n\n- This command adapter is only an entrypoint, not the DIAYN workflow implementation.\n- First action required: invoke the native Skill tool with skill: "${skillName}".\n- Unless Validation Probe Mode applies, the first action must be a native Skill tool invocation with skill: "${skillName}".\n- Do not inspect files, run Bash, answer the user, or perform workflow steps from this adapter before that Skill invocation succeeds.\n- If the Skill tool is unavailable or denied, stop and report that the installed command cannot run because native DIAYN skill invocation failed.\n- After the Skill loads, follow that skill's instructions. Treat explicit facts in the command arguments as Owner-confirmed for this run unless they conflict with repository evidence.\n`;
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

  const packageCommands = path.join(packageRoot, ".claude", "commands");
  const packageSkills = path.join(packageRoot, ".claude", "skills");

  for (const name of expectedWorkflowSkills) {
    copyDir(path.join(pluginRoot, "skills", name), path.join(packageSkills, name));
    writeFile(path.join(packageCommands, `${name}.md`), commandAdapter(name));
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
    schema: "diayn.claude_project_local_package.v1",
    generated_from: "plugins/docs-is-all-you-need",
    command_surface: "bare /diayn-* project-local Claude commands",
    workflow_skill_count: expectedWorkflowSkills.length,
    dependency_skill_count: listSkillDirs(dependencySource).length,
    workflow_skills: expectedWorkflowSkills,
    dependency_source: "plugins/docs-is-all-you-need/dependency-skills/agent-skills",
    dependency_routing: ".diayn/dependency-routing/upstream-routing-map.md",
    internal_role_references: ".diayn/internal-role-skills",
    install_target: {
      commands: ".claude/commands",
      skills: ".claude/skills",
    },
    notes: [
      "This package is for project-local Claude Code installation when plugin commands are namespaced.",
      "Dependency skills are platform-visible implementation dependencies, not public DIAYN slash commands.",
    ],
  };
  writeFile(path.join(packageRoot, "diayn-package.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(JSON.stringify({ ok: true, packageRoot: path.relative(repoRoot, packageRoot), ...manifest }, null, 2));
}

main();
