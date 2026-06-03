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
  const dirs = rootSkills.directories;
  const publicWorkflowSkills = dirs.filter((name) => publicSet.has(name));
  const unclassified = dirs.filter((name) => !publicSet.has(name));
  const errors = [];

  const readmePath = path.join(repoRoot, "skills", "README.md");
  if (!fs.existsSync(readmePath)) {
    errors.push("skills/README.md must explain that root skills/ contains only the public workflow source");
  } else {
    const readme = fs.readFileSync(readmePath, "utf8");
    for (const phrase of [
      "public workflow source",
      "exactly 12 public workflow skills",
      "12 public workflow skills",
      "Internal role/reference source lives in `maintainers/internal-skills/`",
    ]) {
      if (!readme.includes(phrase)) errors.push(`skills/README.md must mention "${phrase}"`);
    }
  }

  if (publicWorkflowSkills.length !== expected.length) {
    errors.push("root skills source inventory must classify exactly 12 public workflow skills");
  }
  if (unclassified.length > 0) {
    errors.push(`root skills source inventory must not contain non-public skill directories: ${unclassified.join(", ")}`);
  }

  return {
    root: "skills",
    purpose: "public_workflow_source_only",
    public_workflow_skills: publicWorkflowSkills,
    unclassified,
    readme: "skills/README.md",
    ok: errors.length === 0,
    errors,
  };
}

function validateInternalSourceInventory() {
  const internalRoot = path.join(repoRoot, "maintainers", "internal-skills");
  const errors = [];
  let dirs = [];
  if (!fs.existsSync(internalRoot)) {
    errors.push("maintainers/internal-skills must contain internal role/router/scaffold source");
  } else {
    dirs = fs
      .readdirSync(internalRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    for (const name of internalReferenceSkills) {
      if (!dirs.includes(name)) errors.push(`maintainers/internal-skills missing ${name}`);
    }
    const extra = dirs.filter((name) => !internalReferenceSkills.includes(name));
    if (extra.length > 0) errors.push(`maintainers/internal-skills has unclassified directories: ${extra.join(", ")}`);
  }

  const readmePath = path.join(internalRoot, "README.md");
  if (!fs.existsSync(readmePath)) {
    errors.push("maintainers/internal-skills/README.md must explain these folders are maintainer-only internal source");
  } else {
    const readme = fs.readFileSync(readmePath, "utf8");
    for (const phrase of ["internal role/reference source", "not installable", "not public DIAYN V1 skills"]) {
      if (!readme.includes(phrase)) errors.push(`maintainers/internal-skills/README.md must mention "${phrase}"`);
    }
  }

  return {
    root: "maintainers/internal-skills",
    purpose: "maintainer_only_internal_source",
    directories: dirs,
    expected: internalReferenceSkills,
    ok: errors.length === 0,
    errors,
  };
}

function validateLegacyDeleted() {
  const legacyRoot = path.join(repoRoot, "maintainers", "legacy-skills");
  const exists = fs.existsSync(legacyRoot);
  return {
    root: "maintainers/legacy-skills",
    purpose: "deleted_historical_source",
    exists,
    ok: !exists,
    errors: exists ? ["maintainers/legacy-skills must not be present in the public repository"] : [],
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
  const internalSourceInventory = validateInternalSourceInventory();
  const legacyDeleted = validateLegacyDeleted();
  const result = {
    ok: rootSkills.ok && pluginSkills.ok && rootSourceInventory.ok && internalSourceInventory.ok && legacyDeleted.ok,
    expected_public_skills: expected,
    root_skills: rootSkills,
    root_source_inventory: rootSourceInventory,
    internal_source_inventory: internalSourceInventory,
    legacy_deleted: legacyDeleted,
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
