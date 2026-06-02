#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const validatorPath = path.join(repoRoot, "maintainers", "scripts", "validate_codex_runtime_external_evidence.js");
const tmpRoot = path.join(repoRoot, "validation", "tmp", "codex-runtime-external-evidence-selftest");
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

function assertInsideRepo(target) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(repoRoot + path.sep)) {
    throw new Error(`refusing to operate outside repo: ${resolved}`);
  }
  return resolved;
}

function writeJson(file, value) {
  const resolved = assertInsideRepo(file);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function evidenceRef(name) {
  const relative = `validation/tmp/codex-runtime-external-evidence-selftest/${name}.txt`;
  const full = path.join(repoRoot, relative);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `synthetic self-test evidence for ${name}\n`, "utf8");
  return relative;
}

function commandToSkill(command) {
  return command.replace(/^\//, "");
}

function completeEvidence() {
  const sideScenarios = {};
  for (const id of requiredSideScenarios) {
    sideScenarios[id] = { passed: true, evidence_refs: [evidenceRef(`side-${id}`)] };
  }
  return {
    schema: "diayn.codex_runtime_external_evidence_input.v1",
    surface: "Codex Desktop",
    environment: {
      tester: "DIAYN validator selftest",
      tested_at: "2026-06-02T00:00:00.000Z",
      codex_version: "Codex Desktop self-test runtime",
      codex_home: "C:/tmp/diayn-codex-selftest-home",
      package_source: "packages/codex-project-local",
      install_mode: "project_local",
    },
    skill_discovery_snapshot: {
      observed: true,
      app_session: "new_app_session",
      observed_workflow_skills: expectedCommands.map(commandToSkill),
      observed_dependency_skills: ["idea-refine"],
      observed_legacy_internal_skills: [],
      evidence_refs: [evidenceRef("skill-discovery-snapshot")],
    },
    direct_command_invocations: expectedCommands.map((command) => ({
      command,
      observed: true,
      matched_skill: commandToSkill(command),
      evidence_refs: [evidenceRef(`cmd-${commandToSkill(command)}`)],
    })),
    dependency_skill_invocation: {
      observed: true,
      skill: "idea-refine",
      invoked_from: "/diayn-init",
      evidence_refs: [evidenceRef("dependency-idea-refine")],
    },
    release_gate_checks: requiredChecks.map((id) => ({
      id,
      passed: true,
      evidence_refs: [evidenceRef(`check-${id}`)],
    })),
    installed_flow: {
      complete: true,
      commands: expectedCommands,
      workflow_errors: [],
      owner_acceptance_recorded: true,
      closeout_recorded: true,
      next_stage_baseline_refresh_recorded: true,
      evidence_refs: [evidenceRef("installed-flow")],
    },
    side_scenarios: sideScenarios,
  };
}

function runValidator(evidencePath) {
  const args = [validatorPath, "--evidence", evidencePath];
  const run = spawnSync(process.execPath, args, { cwd: repoRoot, encoding: "utf8" });
  let parsed = null;
  try {
    parsed = JSON.parse(run.stdout);
  } catch (error) {
    return {
      exit_code: run.status,
      stdout: run.stdout,
      stderr: run.stderr,
      error: `validator output was not JSON: ${error.message}`,
    };
  }
  return {
    exit_code: run.status,
    stdout: run.stdout,
    stderr: run.stderr,
    result: parsed,
  };
}

function main() {
  const outputPath = argValue("--json");
  if (process.argv.includes("--json") && !outputPath) throw new Error("--json requires an output path");

  const tmp = assertInsideRepo(tmpRoot);
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });

  const completeInputPath = path.join(tmp, "complete-evidence.json");
  writeJson(completeInputPath, completeEvidence());

  const nonexistentRefsInputPath = path.join(tmp, "nonexistent-evidence-ref.json");
  const nonexistentRefsEvidence = completeEvidence();
  nonexistentRefsEvidence.direct_command_invocations[0].evidence_refs = [
    "validation/tmp/codex-runtime-external-evidence-selftest/does-not-exist.txt",
  ];
  writeJson(nonexistentRefsInputPath, nonexistentRefsEvidence);

  const complete = runValidator(completeInputPath);
  const nonexistentRefs = runValidator(nonexistentRefsInputPath);
  const template = runValidator(path.join(repoRoot, "docs", "install", "codex_runtime_external_evidence_template.json"));
  const missing = runValidator(path.join(tmp, "missing-evidence.json"));

  const errors = [];
  if (
    !complete.result ||
    complete.result.ok !== true ||
    complete.result.runtime_proven !== true ||
    complete.result.blocker_id !== null ||
    complete.result.gaps.length !== 0 ||
    complete.exit_code !== 0
  ) {
    errors.push("complete concrete evidence should clear the Codex runtime blocker");
  }
  if (
    !nonexistentRefs.result ||
    nonexistentRefs.result.ok !== true ||
    nonexistentRefs.result.runtime_proven !== false ||
    nonexistentRefs.result.blocker_id !== "P9-CODEX-001" ||
    !nonexistentRefs.result.gaps.some((gap) => gap.includes("evidence_ref does not exist")) ||
    nonexistentRefs.exit_code !== 0
  ) {
    errors.push("nonexistent evidence_refs should remain blocked with a concrete missing-file gap");
  }
  if (
    !template.result ||
    template.result.ok !== true ||
    template.result.runtime_proven !== false ||
    template.result.blocker_id !== "P9-CODEX-001" ||
    template.result.gaps.length === 0 ||
    template.exit_code !== 0
  ) {
    errors.push("placeholder template should remain blocked with gaps");
  }
  if (
    !missing.result ||
    missing.result.ok !== true ||
    missing.result.evidence_status !== "missing" ||
    missing.result.runtime_proven !== false ||
    missing.result.blocker_id !== "P9-CODEX-001" ||
    missing.result.gaps.length === 0 ||
    missing.exit_code !== 0
  ) {
    errors.push("missing external evidence should remain blocked with gaps");
  }

  const result = {
    schema: "diayn.phase9.codex_runtime_external_evidence_selftest.v1",
    ok: errors.length === 0,
    validator: "maintainers/scripts/validate_codex_runtime_external_evidence.js",
    cases: {
      complete_concrete_evidence_clears_blocker: Boolean(
        complete.result && complete.result.runtime_proven === true && complete.result.blocker_id === null
      ),
      placeholder_template_remains_blocked: Boolean(
        template.result && template.result.runtime_proven === false && template.result.blocker_id === "P9-CODEX-001"
      ),
      nonexistent_evidence_refs_remain_blocked: Boolean(
        nonexistentRefs.result &&
          nonexistentRefs.result.runtime_proven === false &&
          nonexistentRefs.result.blocker_id === "P9-CODEX-001" &&
          nonexistentRefs.result.gaps.some((gap) => gap.includes("evidence_ref does not exist"))
      ),
      missing_input_remains_blocked: Boolean(
        missing.result && missing.result.runtime_proven === false && missing.result.blocker_id === "P9-CODEX-001"
      ),
    },
    gaps_observed: {
      nonexistent_refs: nonexistentRefs.result ? nonexistentRefs.result.gaps.length : null,
      template: template.result ? template.result.gaps.length : null,
      missing: missing.result ? missing.result.gaps.length : null,
    },
    errors,
  };

  const payload = JSON.stringify(result, null, 2);
  if (outputPath) {
    const fullOutput = path.resolve(repoRoot, outputPath);
    assertInsideRepo(fullOutput);
    fs.mkdirSync(path.dirname(fullOutput), { recursive: true });
    fs.writeFileSync(fullOutput, `${payload}\n`, "utf8");
  }
  console.log(payload);
  if (!result.ok) process.exitCode = 1;
}

main();
