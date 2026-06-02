#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const packageRoot = path.join(repoRoot, "packages", "codex-project-local");
const packageSkillsRoot = path.join(packageRoot, ".codex", "skills");
const packageDiaynRoot = path.join(packageRoot, ".diayn");
const fixtureRoot = path.join(repoRoot, "validation", "tmp", "codex-install-fixture");
const codexHomeFixtureRoot = path.join(repoRoot, "validation", "tmp", "codex-home-install-fixture");
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
const legacyInternalSkillDirs = [
  "diayn-controller",
  "diayn-executor",
  "diayn-identity-guard",
  "diayn-integrator",
  "diayn-owner-ux",
  "diayn-reviewer",
  "diayn-skill-router",
  "update-diayn-scaffold",
];

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function hasArg(name) {
  return process.argv.includes(name);
}

function listSkillDirs(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort();
}

function listFiles(root) {
  const result = [];
  if (!fs.existsSync(root)) return result;
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

function relativeOrAbsolute(from, to) {
  const relative = path.relative(from, to).replace(/\\/g, "/");
  if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) return relative;
  return to.replace(/\\/g, "/");
}

function ensureSafeFixtureDelete(targetRoot, expectedFixtureRoot) {
  const resolved = path.resolve(targetRoot);
  if (resolved !== expectedFixtureRoot) {
    throw new Error(`refusing fixture cleanup outside ${expectedFixtureRoot}: ${resolved}`);
  }
}

function copyDir(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true, force: true });
}

function planDirectoryCopy(source, target, label, force) {
  if (!fs.existsSync(source)) {
    return { label, source, target, action: "missing_source", ok: false };
  }
  if (!fs.existsSync(target)) {
    return { label, source, target, action: "copy", ok: true };
  }
  const sourceHash = treeHash(source);
  const targetHash = treeHash(target);
  if (sourceHash === targetHash) {
    return { label, source, target, action: "skip_identical", ok: true, source_hash: sourceHash, target_hash: targetHash };
  }
  if (force) {
    return { label, source, target, action: "overwrite", ok: true, source_hash: sourceHash, target_hash: targetHash };
  }
  return { label, source, target, action: "conflict", ok: false, source_hash: sourceHash, target_hash: targetHash };
}

function main() {
  const outputPath = argValue("--json");
  if (hasArg("--json") && !outputPath) throw new Error("--json requires an output path");

  const projectFixtureMode = hasArg("--fixture");
  const codexHomeFixtureMode = hasArg("--codex-home-fixture");
  const execute = hasArg("--execute");
  const fixtureMode = projectFixtureMode || codexHomeFixtureMode;
  const force = hasArg("--force") || fixtureMode;
  const targetArg = argValue("--target-root");
  const targetCodexHomeArg = argValue("--target-codex-home");
  const selectedTargetModes = [projectFixtureMode, codexHomeFixtureMode, Boolean(targetArg), Boolean(targetCodexHomeArg)]
    .filter(Boolean).length;
  if (selectedTargetModes !== 1) {
    throw new Error("choose exactly one of --fixture, --codex-home-fixture, --target-root, or --target-codex-home");
  }
  const installSurface = codexHomeFixtureMode || targetCodexHomeArg ? "codex_home" : "project_local";
  const targetRoot = path.resolve(
    projectFixtureMode ? fixtureRoot : codexHomeFixtureMode ? codexHomeFixtureRoot : targetArg || targetCodexHomeArg,
  );
  if (targetRoot === path.parse(targetRoot).root) {
    throw new Error("refusing to install into a filesystem root");
  }

  if (fixtureMode) {
    ensureSafeFixtureDelete(targetRoot, projectFixtureMode ? fixtureRoot : codexHomeFixtureRoot);
    fs.rmSync(targetRoot, { recursive: true, force: true });
  }

  const targetSkillsRoot = installSurface === "codex_home"
    ? path.join(targetRoot, "skills")
    : path.join(targetRoot, ".codex", "skills");
  const targetDiaynRoot = installSurface === "codex_home"
    ? path.join(targetRoot, "diayn", "docs-is-all-you-need")
    : path.join(targetRoot, ".diayn");
  const targetSkillsLabel = installSurface === "codex_home" ? "skills" : ".codex/skills";
  const targetDiaynLabel = installSurface === "codex_home" ? "diayn/docs-is-all-you-need" : ".diayn";
  const packageSkills = listSkillDirs(packageSkillsRoot);
  const dependencySkills = packageSkills.filter((name) => !expectedWorkflowSkills.includes(name));
  const packageSkillSet = new Set(packageSkills);
  const legacyInternalSkillSet = new Set(legacyInternalSkillDirs);
  const preExistingSkills = listSkillDirs(targetSkillsRoot);
  const preExistingNonPackageSkills = preExistingSkills.filter((name) => !packageSkillSet.has(name));
  const preExistingLegacyInternalSkills = preExistingSkills.filter((name) => legacyInternalSkillSet.has(name));
  const actions = [];

  for (const name of packageSkills) {
    actions.push(planDirectoryCopy(
      path.join(packageSkillsRoot, name),
      path.join(targetSkillsRoot, name),
      `${targetSkillsLabel}/${name}`,
      force,
    ));
  }

  actions.push(planDirectoryCopy(packageDiaynRoot, targetDiaynRoot, targetDiaynLabel, force));

  const errors = actions.filter((action) => !action.ok).map((action) => `${action.label}: ${action.action}`);
  if (execute && errors.length === 0) {
    for (const action of actions) {
      if (action.action === "copy" || action.action === "overwrite") {
        copyDir(action.source, action.target);
      }
    }
  }

  const installedSkills = execute ? listSkillDirs(targetSkillsRoot) : [];
  const installedWorkflowSkills = expectedWorkflowSkills.filter((name) => installedSkills.includes(name));
  const installedDependencySkills = dependencySkills.filter((name) => installedSkills.includes(name));
  const installedWorkflowOpenAiYaml = expectedWorkflowSkills.filter((name) =>
    execute && fs.existsSync(path.join(targetSkillsRoot, name, "agents", "openai.yaml")),
  );
  const installedNonPackageSkills = execute ? installedSkills.filter((name) => !packageSkillSet.has(name)) : [];
  const installedLegacyInternalSkills = execute ? installedSkills.filter((name) => legacyInternalSkillSet.has(name)) : [];
  const warnings = [];
  if (preExistingLegacyInternalSkills.length > 0) {
    warnings.push(
      `target already contains legacy internal DIAYN skills: ${preExistingLegacyInternalSkills.join(", ")}`,
    );
  }
  if (preExistingNonPackageSkills.length > 0) {
    warnings.push(
      `target already contains ${preExistingNonPackageSkills.length} skills outside the DIAYN V1 package`,
    );
  }
  const result = {
    schema: installSurface === "codex_home"
      ? "diayn.phase9.codex_home_install.v1"
      : "diayn.phase9.codex_project_local_install.v1",
    ok: errors.length === 0,
    mode: execute ? "execute" : "dry_run",
    fixture_mode: fixtureMode,
    install_surface: installSurface,
    source_package_root: "packages/codex-project-local",
    target_root: relativeOrAbsolute(repoRoot, targetRoot) || ".",
    install_targets: {
      skills: path.relative(targetRoot, targetSkillsRoot).replace(/\\/g, "/"),
      metadata: path.relative(targetRoot, targetDiaynRoot).replace(/\\/g, "/"),
    },
    target_preflight: {
      existing_skill_count: preExistingSkills.length,
      existing_non_package_skill_count: preExistingNonPackageSkills.length,
      existing_non_package_skills: preExistingNonPackageSkills,
      existing_legacy_internal_skill_count: preExistingLegacyInternalSkills.length,
      existing_legacy_internal_skills: preExistingLegacyInternalSkills,
    },
    package_preflight: {
      workflow_skill_count: expectedWorkflowSkills.filter((name) => packageSkills.includes(name)).length,
      dependency_skill_count: dependencySkills.length,
      total_package_skill_count: packageSkills.length,
      codex_agents_openai_yaml_count: expectedWorkflowSkills.filter((name) =>
        fs.existsSync(path.join(packageSkillsRoot, name, "agents", "openai.yaml")),
      ).length,
    },
    installed_result: {
      installed_workflow_skill_count: installedWorkflowSkills.length,
      installed_dependency_skill_count: installedDependencySkills.length,
      total_installed_skill_count: installedSkills.length,
      codex_agents_openai_yaml_count: installedWorkflowOpenAiYaml.length,
      preserved_non_package_skill_count: installedNonPackageSkills.length,
      preserved_non_package_skills: installedNonPackageSkills,
      preserved_legacy_internal_skill_count: installedLegacyInternalSkills.length,
      preserved_legacy_internal_skills: installedLegacyInternalSkills,
      installed_package_visible: installedWorkflowSkills.length === expectedWorkflowSkills.length,
      metadata_present: execute && fs.existsSync(path.join(targetDiaynRoot, "dependency-skills-manifest.json")),
      routing_map_present: execute && fs.existsSync(path.join(targetDiaynRoot, "dependency-routing", "upstream-routing-map.md")),
    },
    actions: actions.map((action) => ({
      label: action.label,
      action: action.action,
      ok: action.ok,
      source: path.relative(repoRoot, action.source).replace(/\\/g, "/"),
      target: relativeOrAbsolute(repoRoot, action.target),
    })),
    warnings,
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
