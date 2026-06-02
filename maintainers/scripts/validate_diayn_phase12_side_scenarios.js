#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

function readJson(errors, relative) {
  const file = path.join(repoRoot, relative);
  if (!fs.existsSync(file)) {
    errors.push(`missing ${relative}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`invalid JSON in ${relative}: ${error.message}`);
    return null;
  }
}

function readText(errors, relative) {
  const file = path.join(repoRoot, relative);
  if (!fs.existsSync(file)) {
    errors.push(`missing ${relative}`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

function run(command, args, options = {}) {
  return childProcess.spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    encoding: "utf8",
    shell: false,
    timeout: options.timeout || 30000,
  });
}

function runPython(args, options = {}) {
  const preferred = process.env.PYTHON || "python";
  let proc = run(preferred, args, options);
  if (proc.error && proc.error.code === "ENOENT" && !process.env.PYTHON) {
    proc = run("py", ["-3", ...args], options);
  }
  return proc;
}

function runHarnessAudit(projectRoot, errors, label) {
  const script = path.join(repoRoot, "skills", "diayn-init", "scripts", "harness_audit.py");
  const proc = runPython([script, "--project-root", projectRoot], { timeout: 30000 });
  if (proc.error) {
    errors.push(`${label}: harness audit failed to start: ${proc.error.message}`);
    return null;
  }
  if (proc.status !== 0) {
    errors.push(`${label}: harness audit exited ${proc.status}: ${proc.stderr || proc.stdout}`);
    return null;
  }
  try {
    return JSON.parse(proc.stdout);
  } catch (error) {
    errors.push(`${label}: harness audit output is not JSON: ${error.message}`);
    return null;
  }
}

function makeNonGitAudit(errors) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "diayn-phase12-nongit-"));
  fs.writeFileSync(path.join(root, "README.md"), "# Non-Git DIAYN Fixture\n", "utf8");
  return runHarnessAudit(root, errors, "non_git_target");
}

function makeConflictAudit(errors) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "diayn-phase12-conflict-"));
  const gitInit = run("git", ["init"], { cwd: root, timeout: 30000 });
  if (gitInit.error) {
    errors.push(`existing_project_conflict: git init failed to start: ${gitInit.error.message}`);
  } else if (gitInit.status !== 0) {
    errors.push(`existing_project_conflict: git init exited ${gitInit.status}: ${gitInit.stderr || gitInit.stdout}`);
  }
  fs.writeFileSync(
    path.join(root, "AGENTS.md"),
    "# Existing Project Agent Notes\n\nUser-owned startup notes for the existing project.\n",
    "utf8",
  );
  fs.writeFileSync(
    path.join(root, "TODO.md"),
    "# Existing Project TODO\n\n- [ ] User-owned work item that must not be overwritten.\n",
    "utf8",
  );
  return runHarnessAudit(root, errors, "existing_project_conflict");
}

function hasOwnerGate(audit, id) {
  return Boolean(audit && Array.isArray(audit.owner_gates) && audit.owner_gates.some((item) => item.id === id));
}

function validateTempAudits(errors) {
  const nonGit = makeNonGitAudit(errors);
  if (nonGit) {
    if (nonGit.schema !== "diayn.harness_audit.v1") errors.push("non_git_target: schema mismatch");
    if (!nonGit.git || nonGit.git.is_git_repository !== false) {
      errors.push("non_git_target: must prove the target is not inside a Git repository");
    }
    if (!hasOwnerGate(nonGit, "OG-git-001")) {
      errors.push("non_git_target: must ask whether to initialize Git or use document-only mode");
    }
  }

  const conflict = makeConflictAudit(errors);
  if (conflict) {
    if (conflict.schema !== "diayn.harness_audit.v1") errors.push("existing_project_conflict: schema mismatch");
    if (!conflict.git || conflict.git.is_git_repository !== true) {
      errors.push("existing_project_conflict: must run inside a Git repository");
    }
    if (!conflict.git || conflict.git.dirty !== true) {
      errors.push("existing_project_conflict: must expose dirty working tree state before scaffold edits");
    }
    const conflictPaths = Array.isArray(conflict.conflicts) ? conflict.conflicts.map((item) => item.path) : [];
    for (const required of ["AGENTS.md", "TODO.md"]) {
      if (!conflictPaths.includes(required)) {
        errors.push(`existing_project_conflict: conflict report must include ${required}`);
      }
    }
    if (!hasOwnerGate(conflict, "OG-git-003")) {
      errors.push("existing_project_conflict: must gate dirty tree preservation");
    }
    if (!hasOwnerGate(conflict, "OG-scaffold-001")) {
      errors.push("existing_project_conflict: must gate scaffold overwrite/preservation choices");
    }
  }

  return { nonGit, conflict };
}

function validateExistingEvidence(errors) {
  const phase5 = readJson(errors, "validation/phase5_fixture_harness_audit.json");
  if (phase5) {
    if (!phase5.git || phase5.git.dirty !== true) errors.push("phase5 fixture must preserve dirty-tree preflight evidence");
    if (!hasOwnerGate(phase5, "OG-git-003")) errors.push("phase5 fixture must contain dirty-tree OwnerGate");
  }

  const phase6NotApplicable = readJson(errors, "validation/phase6_not_applicable_worktree_plan.json");
  if (phase6NotApplicable) {
    const frontend = Array.isArray(phase6NotApplicable.lanes)
      ? phase6NotApplicable.lanes.find((lane) => lane.lane === "frontend")
      : null;
    if (!frontend || frontend.applicable !== "not_applicable" || frontend.worktree_path) {
      errors.push("phase6 not_applicable scenario must prove no fake frontend worktree is created");
    }
  }

  const migration = readJson(errors, "validation/phase8_scaffold_upgrade_audit.json");
  if (migration) {
    if (migration.mode !== "dry-run") errors.push("scaffold migration scenario must remain dry-run");
    if (!String(migration.safety || "").includes("no apply mode")) {
      errors.push("scaffold migration scenario must state no apply mode");
    }
    const hasPreserve = Array.isArray(migration.artifacts) &&
      migration.artifacts.some((item) => item.classification === "preserve");
    if (!hasPreserve) errors.push("scaffold migration scenario must preserve existing user content");
  }

  const cleanup = readJson(errors, "validation/phase8_cleanup_plan.json");
  if (cleanup) {
    if (cleanup.schema !== "diayn.cleanup_plan.v1") errors.push("cleanup scenario schema mismatch");
    if (cleanup.mode !== "dry-run" || cleanup.automatic_delete !== false) {
      errors.push("cleanup scenario must be dry-run with automatic_delete=false");
    }
    if (!String(cleanup.approval_rule || "").includes("Owner-approved cleanup plan")) {
      errors.push("cleanup scenario must require Owner approval before deletion");
    }
  }

  const dependency = readJson(errors, "validation/phase3_dependency_skills.json");
  const manifest = readJson(errors, "plugins/docs-is-all-you-need/dependency-skills/manifest.json");
  const dependencyDoc = readText(errors, "docs/meta/diayn_v1_phase3_dependency_skills.md");
  if (dependency) {
    if (dependency.ok !== true) errors.push("dependency skill validation must be ok");
    if (dependency.vendor_skill_count !== dependency.packaged_dependency_skill_count) {
      errors.push("dependency skill validation must prove packaged count matches vendor count");
    }
  }
  if (manifest) {
    if (!String(manifest.selection_rule || "").includes("Do not silently substitute")) {
      errors.push("dependency manifest must block silent user-installed agent-skills substitution");
    }
    if (!String(manifest.fallback_rule || "").includes("does not count as native third-party skill invocation")) {
      errors.push("dependency manifest must distinguish direct SKILL.md reading from native invocation");
    }
  }
  if (!dependencyDoc.includes("Uncontrolled user-installed `agent-skills` copies must not be selected silently")) {
    errors.push("dependency documentation must describe mismatched pre-existing agent-skills handling");
  }

  const networkPolicy = readText(errors, "skills/diayn-init/assets/scaffold/.diayn/network_policy.md");
  const pluginNetworkPolicy = readText(errors, "plugins/docs-is-all-you-need/skills/diayn-init/assets/scaffold/.diayn/network_policy.md");
  const privacyDoc = readText(errors, "docs/meta/diayn_privacy_network_policy.md");
  for (const [label, text] of [
    ["root network policy", networkPolicy],
    ["plugin network policy", pluginNetworkPolicy],
    ["privacy doc", privacyDoc],
  ]) {
    for (const needle of ["Do not upload", "OwnerGate"]) {
      if (!text.includes(needle)) errors.push(`${label} missing ${needle}`);
    }
  }

  const partialAttempt = readText(errors, "skills/diayn-integration/assets/integration/partial_attempt.md");
  const integrationSkill = readText(errors, "skills/diayn-integration/SKILL.md");
  const worktreeSkill = readText(errors, "skills/diayn-worktrees/SKILL.md");
  if (!partialAttempt.includes("partial_attempt")) errors.push("partial_attempt template must record interrupted state");
  if (!integrationSkill.includes("safe recovery path for a fresh session")) {
    errors.push("integration skill must describe interrupted-command recovery");
  }
  if (!worktreeSkill.includes("fresh-session recovery explicit")) {
    errors.push("worktree skill must describe fresh-session recovery");
  }

  const installedFlow = readJson(errors, "validation/phase11_installed_flow_fixture.json");
  if (installedFlow) {
    const commands = installedFlow.claude && Array.isArray(installedFlow.claude.commands_requested)
      ? installedFlow.claude.commands_requested
      : [];
    for (const command of ["/diayn-bug", "/diayn-new"]) {
      if (!commands.includes(command)) errors.push(`installed-flow fixture must include ${command}`);
    }
    const checkpoints = installedFlow.claude && Array.isArray(installedFlow.claude.command_checkpoints)
      ? installedFlow.claude.command_checkpoints.map((item) => item.command)
      : [];
    for (const command of ["/diayn-bug", "/diayn-new"]) {
      if (!checkpoints.includes(command)) errors.push(`installed-flow fixture must checkpoint ${command}`);
    }
    const artifacts = installedFlow.flow_artifacts || {};
    if (!artifacts.bug_triage || artifacts.bug_triage.classification_no_active_bug !== true) {
      errors.push("installed-flow fixture must prove /diayn-bug no-active-bug side scenario");
    }
    if (!artifacts.closeout || artifacts.closeout.next_stage_baseline_refresh !== true) {
      errors.push("installed-flow fixture must prove /diayn-new or next-stage baseline refresh");
    }
    if (Array.isArray(installedFlow.workflow_errors) && installedFlow.workflow_errors.length !== 0) {
      errors.push("installed-flow fixture must not contain workflow errors");
    }
  }

  return {
    phase5_dirty_tree: Boolean(phase5 && phase5.git && phase5.git.dirty === true && hasOwnerGate(phase5, "OG-git-003")),
    not_applicable_lane: Boolean(
      phase6NotApplicable &&
      Array.isArray(phase6NotApplicable.lanes) &&
      phase6NotApplicable.lanes.some((lane) => lane.lane === "frontend" && lane.applicable === "not_applicable" && !lane.worktree_path)
    ),
    scaffold_migration_dry_run: Boolean(migration && migration.mode === "dry-run"),
    cleanup_boundary: Boolean(cleanup && cleanup.mode === "dry-run" && cleanup.automatic_delete === false),
    dependency_policy: Boolean(dependency && dependency.ok === true && manifest),
    privacy_default: networkPolicy.includes("Do not upload") && privacyDoc.includes("Do not upload"),
    interrupted_recovery: partialAttempt.includes("partial_attempt") && integrationSkill.includes("safe recovery path for a fresh session"),
    installed_bug_and_new: Boolean(
      installedFlow &&
      installedFlow.flow_artifacts &&
      installedFlow.flow_artifacts.bug_triage &&
      installedFlow.flow_artifacts.bug_triage.classification_no_active_bug === true &&
      installedFlow.flow_artifacts.closeout &&
      installedFlow.flow_artifacts.closeout.next_stage_baseline_refresh === true
    ),
  };
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const tempAudits = validateTempAudits(errors);
  const existing = validateExistingEvidence(errors);

  const sideScenarios = {
    non_git_target: Boolean(
      tempAudits.nonGit &&
      tempAudits.nonGit.git &&
      tempAudits.nonGit.git.is_git_repository === false &&
      hasOwnerGate(tempAudits.nonGit, "OG-git-001")
    ),
    existing_project_conflict_report: Boolean(
      tempAudits.conflict &&
      Array.isArray(tempAudits.conflict.conflicts) &&
      tempAudits.conflict.conflicts.some((item) => item.path === "AGENTS.md") &&
      tempAudits.conflict.conflicts.some((item) => item.path === "TODO.md") &&
      hasOwnerGate(tempAudits.conflict, "OG-scaffold-001")
    ),
    dirty_working_tree_preflight: Boolean(existing.phase5_dirty_tree || (tempAudits.conflict && tempAudits.conflict.git.dirty === true)),
    not_applicable_lane: existing.not_applicable_lane,
    interrupted_command_recovery: existing.interrupted_recovery,
    scaffold_migration_dry_run: existing.scaffold_migration_dry_run,
    mismatched_pre_existing_agent_skills: existing.dependency_policy,
    privacy_network_default: existing.privacy_default,
    cleanup_plan_boundary: existing.cleanup_boundary,
    bug_triage_side_scenario: existing.installed_bug_and_new,
    additional_new_intake_or_next_stage_refresh: existing.installed_bug_and_new,
  };

  for (const [name, passed] of Object.entries(sideScenarios)) {
    if (passed !== true) errors.push(`side scenario not proven: ${name}`);
  }

  const result = {
    schema: "diayn.phase12.side_scenarios.v1",
    ok: errors.length === 0,
    side_scenarios: sideScenarios,
    evidence: {
      generated_non_git_audit: tempAudits.nonGit
        ? {
            is_git_repository: tempAudits.nonGit.git && tempAudits.nonGit.git.is_git_repository,
            owner_gate_ids: (tempAudits.nonGit.owner_gates || []).map((item) => item.id),
            recommended_action: tempAudits.nonGit.recommended_action,
          }
        : null,
      generated_existing_project_conflict_audit: tempAudits.conflict
        ? {
            is_git_repository: tempAudits.conflict.git && tempAudits.conflict.git.is_git_repository,
            dirty: tempAudits.conflict.git && tempAudits.conflict.git.dirty,
            conflict_paths: (tempAudits.conflict.conflicts || []).map((item) => item.path),
            owner_gate_ids: (tempAudits.conflict.owner_gates || []).map((item) => item.id),
            recommended_action: tempAudits.conflict.recommended_action,
          }
        : null,
      existing_outputs: {
        phase5_fixture_harness_audit: "validation/phase5_fixture_harness_audit.json",
        phase6_not_applicable_worktree_plan: "validation/phase6_not_applicable_worktree_plan.json",
        phase8_scaffold_upgrade_audit: "validation/phase8_scaffold_upgrade_audit.json",
        phase8_cleanup_plan: "validation/phase8_cleanup_plan.json",
        phase3_dependency_skills: "validation/phase3_dependency_skills.json",
        phase11_installed_flow_fixture: "validation/phase11_installed_flow_fixture.json",
      },
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
