#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const defaultEvidencePath = "validation/codex_runtime_external_evidence.input.json";
const expectedCommands = [
  "/diayn-init",
  "/diayn-plan",
  "/diayn-worktrees",
  "/diayn-backend",
  "/diayn-frontend",
  "/diayn-review-backend",
  "/diayn-review-frontend",
  "/diayn-sync",
  "/diayn-integration",
  "/diayn-bug",
  "/diayn-new",
  "/diayn-html",
];
const requiredChecks = [
  "codex_runtime_discovered_installed_package",
  "all_12_direct_diayn_invocations",
  "native_routed_dependency_skill_invocation",
  "progressive_disclosure_observed",
  "role_responsibility_checks_observed",
  "lane_boundaries_observed",
  "review_rejection_observed",
  "sync_integration_separation_observed",
  "owner_acceptance_recorded",
  "closeout_recorded",
  "next_stage_baseline_refresh_recorded",
  "focused_side_scenarios_covered",
];
const requiredSideScenarios = [
  "non_git_target",
  "existing_project_conflict_report",
  "dirty_working_tree_preflight",
  "not_applicable_lane",
  "interrupted_command_recovery",
  "scaffold_migration_dry_run",
  "mismatched_pre_existing_agent_skills",
  "privacy_network_default",
  "cleanup_plan_boundary",
  "bug_triage_side_scenario",
  "additional_new_intake_or_next_stage_refresh",
];

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function resolveInput(value) {
  const input = value || defaultEvidencePath;
  return path.isAbsolute(input) ? input : path.join(repoRoot, input);
}

function readJson(file, errors) {
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`invalid JSON in ${path.relative(repoRoot, file).replace(/\\/g, "/")}: ${error.message}`);
    return null;
  }
}

function isConcreteString(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && !trimmed.includes("<") && !trimmed.includes(">");
}

function hasEvidenceRefs(item) {
  return Boolean(
    item &&
      Array.isArray(item.evidence_refs) &&
      item.evidence_refs.length > 0 &&
      item.evidence_refs.every(isConcreteString)
  );
}

function evidenceRefPath(ref) {
  if (!isConcreteString(ref)) return null;
  if (/^[a-z]+:\/\//i.test(ref)) return null;
  if (path.isAbsolute(ref)) return null;
  const resolved = path.resolve(repoRoot, ref);
  if (!resolved.startsWith(repoRoot + path.sep)) return null;
  return resolved;
}

function validateEvidenceRefs(item, label, gaps) {
  if (!hasEvidenceRefs(item)) {
    gaps.push(`${label} must include concrete repo-relative evidence_refs`);
    return;
  }
  for (const ref of item.evidence_refs) {
    const resolved = evidenceRefPath(ref);
    if (!resolved) {
      gaps.push(`${label} evidence_ref must be a repo-relative file path: ${ref}`);
      continue;
    }
    if (!fs.existsSync(resolved)) {
      gaps.push(`${label} evidence_ref does not exist: ${ref}`);
    }
  }
}

function commandToSkill(command) {
  return command.replace(/^\//, "");
}

function checkItemMap(items, idField = "id") {
  const map = new Map();
  if (!Array.isArray(items)) return map;
  for (const item of items) {
    if (item && typeof item[idField] === "string") map.set(item[idField], item);
  }
  return map;
}

function main() {
  const evidenceArg = argValue("--evidence");
  const outputPath = argValue("--json");
  if (process.argv.includes("--json") && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const gaps = [];
  const evidenceFile = resolveInput(evidenceArg);
  const evidence = readJson(evidenceFile, errors);
  const evidenceStatus = evidence ? "provided" : "missing";

  if (!evidence) {
    gaps.push(`missing external Codex runtime evidence input: ${path.relative(repoRoot, evidenceFile).replace(/\\/g, "/")}`);
  }

  if (evidence && evidence.schema !== "diayn.codex_runtime_external_evidence_input.v1") {
    errors.push("external Codex runtime evidence input schema mismatch");
  }
  if (evidence && evidence.surface !== "Codex Desktop") {
    errors.push("external Codex runtime evidence surface must be Codex Desktop");
  }
  if (evidence) {
    const environment = evidence.environment || {};
    for (const field of ["tester", "tested_at", "codex_version", "codex_home", "package_source", "install_mode"]) {
      if (!isConcreteString(environment[field])) {
        gaps.push(`external evidence must record concrete environment.${field}`);
      }
    }
    if (!["project_local", "codex_home"].includes(environment.install_mode)) {
      gaps.push("external evidence install_mode must be project_local or codex_home");
    }
  }

  const discovery = evidence ? evidence.skill_discovery_snapshot : null;
  if (!discovery || discovery.observed !== true) {
    gaps.push("missing Codex app-session skill discovery snapshot");
  } else {
    if (!["current", "reloaded", "new_thread", "new_app_session"].includes(discovery.app_session)) {
      gaps.push("skill discovery snapshot app_session must be current, reloaded, new_thread, or new_app_session");
    }
    if (!Array.isArray(discovery.observed_workflow_skills)) {
      gaps.push("skill discovery snapshot must list observed_workflow_skills");
    } else {
      for (const command of expectedCommands) {
        const skillName = commandToSkill(command);
        if (!discovery.observed_workflow_skills.includes(skillName)) {
          gaps.push(`skill discovery snapshot missing workflow skill ${skillName}`);
        }
      }
    }
    if (!Array.isArray(discovery.observed_dependency_skills) || discovery.observed_dependency_skills.length === 0) {
      gaps.push("skill discovery snapshot must list at least one DIAYN-managed dependency skill");
    }
    if (discovery.observed_legacy_internal_skills && !Array.isArray(discovery.observed_legacy_internal_skills)) {
      gaps.push("skill discovery snapshot observed_legacy_internal_skills must be an array when present");
    }
    validateEvidenceRefs(discovery, "Codex app-session skill discovery snapshot", gaps);
  }

  const directCommands = checkItemMap(evidence ? evidence.direct_command_invocations : [], "command");
  for (const command of expectedCommands) {
    const item = directCommands.get(command);
    if (!item || item.observed !== true) {
      gaps.push(`missing observed direct invocation for ${command}`);
      continue;
    }
    if (item.matched_skill !== commandToSkill(command)) {
      gaps.push(`${command} must match skill ${commandToSkill(command)}`);
    }
    validateEvidenceRefs(item, `${command} direct invocation`, gaps);
  }

  const dependency = evidence ? evidence.dependency_skill_invocation : null;
  if (!dependency || dependency.observed !== true) {
    gaps.push("missing native routed dependency skill invocation evidence");
  } else {
    if (typeof dependency.skill !== "string" || dependency.skill.trim() === "") {
      gaps.push("dependency skill invocation must name the dependency skill");
    }
    if (typeof dependency.invoked_from !== "string" || !dependency.invoked_from.startsWith("/diayn-")) {
      gaps.push("dependency skill invocation must record the /diayn-* workflow that routed to it");
    }
    if (
      discovery &&
      Array.isArray(discovery.observed_dependency_skills) &&
      !discovery.observed_dependency_skills.includes(dependency.skill)
    ) {
      gaps.push(`dependency skill invocation ${dependency.skill} must appear in the app-session discovery snapshot`);
    }
    validateEvidenceRefs(dependency, "dependency skill invocation", gaps);
  }

  const checks = checkItemMap(evidence ? evidence.release_gate_checks : [], "id");
  for (const id of requiredChecks) {
    const item = checks.get(id);
    if (!item || item.passed !== true) {
      gaps.push(`missing passed release-gate check ${id}`);
      continue;
    }
    validateEvidenceRefs(item, `release-gate check ${id}`, gaps);
  }

  const flow = evidence ? evidence.installed_flow : null;
  if (!flow || flow.complete !== true) {
    gaps.push("missing complete Codex installed-flow evidence");
  } else {
    if (!Array.isArray(flow.commands) || !expectedCommands.every((command) => flow.commands.includes(command))) {
      gaps.push("Codex installed flow must include all 12 public commands");
    }
    if (!Array.isArray(flow.workflow_errors) || flow.workflow_errors.length !== 0) {
      gaps.push("Codex installed flow must record workflow_errors as an empty array");
    }
    for (const field of ["owner_acceptance_recorded", "closeout_recorded", "next_stage_baseline_refresh_recorded"]) {
      if (flow[field] !== true) gaps.push(`Codex installed flow must record ${field}`);
    }
    validateEvidenceRefs(flow, "Codex installed flow", gaps);
  }

  const sideScenarios = evidence ? evidence.side_scenarios : null;
  for (const id of requiredSideScenarios) {
    const item = sideScenarios ? sideScenarios[id] : null;
    if (!item || item.passed !== true) {
      gaps.push(`missing passed Codex side scenario ${id}`);
      continue;
    }
    validateEvidenceRefs(item, `Codex side scenario ${id}`, gaps);
  }

  const runtimeProven = Boolean(evidence && errors.length === 0 && gaps.length === 0);
  const result = {
    schema: "diayn.phase9.codex_runtime_external_evidence.v1",
    ok: errors.length === 0,
    evidence_status: evidenceStatus,
    evidence_input: path.relative(repoRoot, evidenceFile).replace(/\\/g, "/"),
    runtime_proven: runtimeProven,
    blocker_id: runtimeProven ? null : "P9-CODEX-001",
    expected_commands: expectedCommands,
    required_checks: requiredChecks,
    required_side_scenarios: requiredSideScenarios,
    gaps,
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
