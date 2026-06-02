#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
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
const internalReferenceSkills = [
  "diayn-controller",
  "diayn-executor",
  "diayn-identity-guard",
  "diayn-integrator",
  "diayn-owner-ux",
  "diayn-reviewer",
  "diayn-skill-router",
  "update-diayn-scaffold",
];
const historicalSourceSkills = [
  "context-compact-reminder",
  "multi-session-controller",
  "multi-session-executor",
  "multi-session-integrator",
  "multi-session-reviewer",
  "owner-decision-ux",
  "session-identity-guard",
];

function readSkill(skillDir) {
  const skillPath = path.join(skillDir, "SKILL.md");
  const text = fs.readFileSync(skillPath, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    throw new Error(`${skillPath} is missing YAML frontmatter`);
  }
  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      frontmatter[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return { skillPath, text, frontmatter };
}

function validateSkillSet(root, requireExact) {
  const dirs = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const missing = expected.filter((name) => !dirs.includes(name));
  const extra = requireExact ? dirs.filter((name) => !expected.includes(name)) : [];
  const skillResults = [];
  const errors = [];

  for (const name of expected) {
    const dir = path.join(root, name);
    if (!fs.existsSync(dir)) continue;
    try {
      const skill = readSkill(dir);
      if (skill.frontmatter.name !== name) {
        errors.push(`${skill.skillPath}: frontmatter name must be ${name}`);
      }
      if (!skill.frontmatter.description || !skill.frontmatter.description.includes(`/${name}`)) {
        errors.push(`${skill.skillPath}: description must mention /${name}`);
      }
      if (!skill.text.includes("Progressive Startup")) {
        errors.push(`${skill.skillPath}: missing Progressive Startup section`);
      }
      if (!skill.text.includes("Validation Probe Mode")) {
        errors.push(`${skill.skillPath}: missing Validation Probe Mode section`);
      }
      if (!skill.text.includes("$ARGUMENTS")) {
        errors.push(`${skill.skillPath}: must expose slash-command arguments to the skill`);
      }
      if (!skill.text.includes("Validation Probe Mode has priority over Progressive Startup")) {
        errors.push(`${skill.skillPath}: Validation Probe Mode must explicitly override Progressive Startup`);
      }
      if (!skill.text.includes(`COMMAND: /${name}`)) {
        errors.push(`${skill.skillPath}: Validation Probe Mode must include COMMAND: /${name}`);
      }
      if (!skill.text.includes("FIRST_STOP:")) {
        errors.push(`${skill.skillPath}: Validation Probe Mode must include FIRST_STOP`);
      }
      if (!skill.text.includes("Allowed Writes")) {
        errors.push(`${skill.skillPath}: missing Allowed Writes section`);
      }
      if (!skill.text.includes("Stop Conditions")) {
        errors.push(`${skill.skillPath}: missing Stop Conditions section`);
      }
      skillResults.push({ name, path: path.relative(repoRoot, skill.skillPath).replace(/\\/g, "/") });
    } catch (error) {
      errors.push(String(error.message || error));
    }
  }

  for (const item of missing) errors.push(`${root}: missing ${item}`);
  for (const item of extra) errors.push(`${root}: extra public skill ${item}`);

  return {
    root: path.relative(repoRoot, root).replace(/\\/g, "/"),
    requireExact,
    directories: dirs,
    expected,
    missing,
    extra,
    skills: skillResults,
    ok: errors.length === 0,
    errors,
  };
}

function validateRootSourceInventory(rootSkills) {
  const publicSet = new Set(expected);
  const internalSet = new Set(internalReferenceSkills);
  const historicalSet = new Set(historicalSourceSkills);
  const dirs = rootSkills.directories;
  const publicWorkflowSkills = dirs.filter((name) => publicSet.has(name));
  const internalRoleReferenceSkills = dirs.filter((name) => internalSet.has(name));
  const historicalImplementationSource = dirs.filter((name) => historicalSet.has(name));
  const classified = new Set([
    ...publicWorkflowSkills,
    ...internalRoleReferenceSkills,
    ...historicalImplementationSource,
  ]);
  const unclassified = dirs.filter((name) => !classified.has(name));
  const errors = [];

  const readmePath = path.join(repoRoot, "skills", "README.md");
  if (!fs.existsSync(readmePath)) {
    errors.push("skills/README.md must explain that root skills/ is source material, not an install surface");
  } else {
    const readme = fs.readFileSync(readmePath, "utf8");
    for (const phrase of [
      "source workspace",
      "not the install surface",
      "12 public workflow skills",
      "internal role/reference",
      "historical implementation source",
    ]) {
      if (!readme.includes(phrase)) errors.push(`skills/README.md must mention "${phrase}"`);
    }
  }

  if (publicWorkflowSkills.length !== expected.length) {
    errors.push("root skills source inventory must classify exactly 12 public workflow skills");
  }
  if (unclassified.length > 0) {
    errors.push(`root skills source inventory has unclassified directories: ${unclassified.join(", ")}`);
  }

  return {
    root: "skills",
    purpose: "source_workspace_not_install_surface",
    public_workflow_skills: publicWorkflowSkills,
    internal_role_reference_skills: internalRoleReferenceSkills,
    historical_implementation_source: historicalImplementationSource,
    unclassified,
    readme: "skills/README.md",
    ok: errors.length === 0,
    errors,
  };
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) {
    throw new Error("--json requires an output path");
  }

  const rootSkills = validateSkillSet(path.join(repoRoot, "skills"), false);
  const pluginSkills = validateSkillSet(path.join(repoRoot, "plugins", "docs-is-all-you-need", "skills"), true);
  const rootSourceInventory = validateRootSourceInventory(rootSkills);
  const result = {
    ok: rootSkills.ok && pluginSkills.ok && rootSourceInventory.ok,
    expected_public_skills: expected,
    root_skills: rootSkills,
    root_source_inventory: rootSourceInventory,
    plugin_public_skills: pluginSkills,
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
