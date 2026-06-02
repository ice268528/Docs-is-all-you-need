#!/usr/bin/env node
"use strict";

const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const packageRoot = path.join(repoRoot, "packages", "codex-project-local");
const packageSkillsRoot = path.join(packageRoot, ".codex", "skills");
const packageValidationPath = path.join(repoRoot, "validation", "phase9_codex_project_local_package.json");
const installFixturePath = path.join(repoRoot, "validation", "phase9_codex_project_local_install_fixture.json");
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

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listSkillDirs(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort();
}

function probeCommand(command, args) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, args, {
    encoding: "utf8",
    windowsHide: true,
  });
  return {
    command: [command, ...args].join(" "),
    started_at: startedAt,
    exit_code: typeof result.status === "number" ? result.status : null,
    signal: result.signal || null,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    error: result.error
      ? {
          name: result.error.name,
          code: result.error.code,
          message: result.error.message,
        }
      : null,
  };
}

function classifyCodexProbe(versionProbe) {
  const combined = `${versionProbe.stdout}\n${versionProbe.stderr}\n${versionProbe.error ? versionProbe.error.message : ""}`;
  if (versionProbe.exit_code === 0 && !versionProbe.error) return "available";
  if (
    /access is denied|拒绝访问/i.test(combined) ||
    versionProbe.error && ["EACCES", "EPERM"].includes(versionProbe.error.code)
  ) {
    return "blocked_access_denied";
  }
  if (versionProbe.error && versionProbe.error.code === "ENOENT") return "not_found";
  return "failed";
}

function defaultCodexHome() {
  if (process.env.CODEX_HOME) return process.env.CODEX_HOME;
  return path.join(os.homedir(), ".codex");
}

function main() {
  const outputPath = argValue("--json");
  if (process.argv.includes("--json") && !outputPath) throw new Error("--json requires an output path");

  const codexHome = path.resolve(argValue("--codex-home") || defaultCodexHome());
  const codexSkillsRoot = path.join(codexHome, "skills");
  const errors = [];

  const packageValidation = fs.existsSync(packageValidationPath) ? readJson(packageValidationPath) : null;
  const installFixture = fs.existsSync(installFixturePath) ? readJson(installFixturePath) : null;
  if (!packageValidation) errors.push("missing validation/phase9_codex_project_local_package.json");
  else if (packageValidation.ok !== true) errors.push("Codex project-local static package validation is not ok");
  if (!installFixture) errors.push("missing validation/phase9_codex_project_local_install_fixture.json");
  else if (installFixture.ok !== true) errors.push("Codex project-local install fixture is not ok");

  const packageSkills = listSkillDirs(packageSkillsRoot);
  const installedSkills = listSkillDirs(codexSkillsRoot);
  const packageWorkflowSkills = expectedWorkflowSkills.filter((name) => packageSkills.includes(name));
  const installedWorkflowSkills = expectedWorkflowSkills.filter((name) => installedSkills.includes(name));
  const dependencySkillCount = packageValidation ? packageValidation.dependency_skill_count : 0;

  const whereProbe = process.platform === "win32" ? probeCommand("where.exe", ["codex"]) : probeCommand("which", ["codex"]);
  const versionProbe = probeCommand("codex", ["--version"]);
  const codexExecutableStatus = classifyCodexProbe(versionProbe);
  const helpProbe = codexExecutableStatus === "available" ? probeCommand("codex", ["--help"]) : null;
  const runtimeBlocked = codexExecutableStatus !== "available";
  const installedPackageVisible = installedWorkflowSkills.length === expectedWorkflowSkills.length;

  const runtimeProven = false;
  const result = {
    schema: "diayn.phase9.codex_project_local_runtime_probe.v1",
    ok: errors.length === 0,
    runtime_proven: runtimeProven,
    blocker_id: runtimeBlocked || !installedPackageVisible ? "P9-CODEX-001" : null,
    package_preflight: {
      package_root: "packages/codex-project-local",
      static_validation_ok: packageValidation ? packageValidation.ok === true : false,
      workflow_skill_count: packageWorkflowSkills.length,
      dependency_skill_count: dependencySkillCount,
      total_package_skill_count: packageSkills.length,
    },
    install_fixture_preflight: {
      path: "validation/phase9_codex_project_local_install_fixture.json",
      ok: installFixture ? installFixture.ok === true : false,
      mode: installFixture ? installFixture.mode : null,
      fixture_mode: installFixture ? installFixture.fixture_mode : null,
      installed_workflow_skill_count: installFixture && installFixture.installed_result
        ? installFixture.installed_result.installed_workflow_skill_count
        : 0,
      installed_dependency_skill_count: installFixture && installFixture.installed_result
        ? installFixture.installed_result.installed_dependency_skill_count
        : 0,
      installed_package_visible: installFixture && installFixture.installed_result
        ? installFixture.installed_result.installed_package_visible === true
        : false,
      metadata_present: installFixture && installFixture.installed_result
        ? installFixture.installed_result.metadata_present === true
        : false,
      routing_map_present: installFixture && installFixture.installed_result
        ? installFixture.installed_result.routing_map_present === true
        : false,
    },
    codex_home_probe: {
      codex_home: codexHome,
      skills_root: codexSkillsRoot,
      skills_root_exists: fs.existsSync(codexSkillsRoot),
      installed_skill_count: installedSkills.length,
      installed_skill_names: installedSkills,
      installed_workflow_skill_count: installedWorkflowSkills.length,
      installed_expected_workflow_skills: installedWorkflowSkills,
      missing_workflow_skills: expectedWorkflowSkills.filter((name) => !installedSkills.includes(name)),
      installed_package_visible: installedPackageVisible,
    },
    executable_probe: {
      status: codexExecutableStatus,
      locator: whereProbe,
      version: versionProbe,
      help: helpProbe,
    },
    required_future_evidence: [
      "Codex Desktop or Codex runtime discovers the installed .codex/skills package.",
      "Bare /diayn-* invocation loads the matching public DIAYN workflow skill.",
      "A DIAYN workflow can invoke a DIAYN-managed dependency skill natively.",
      "The full installed flow completes with the same command sequence and evidence expectations as the Claude project-local fixture.",
    ],
    notes: runtimeBlocked
      ? "Current environment cannot prove Codex runtime support because codex executable probing is blocked."
      : installedPackageVisible
        ? "Codex executable is reachable and expected skills are installed, but no direct /diayn-* workflow invocation evidence has been recorded by this probe."
        : "Codex executable is reachable, but the current Codex skills home does not contain the full DIAYN project-local package.",
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
