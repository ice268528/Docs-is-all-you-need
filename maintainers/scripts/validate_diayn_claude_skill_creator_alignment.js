#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
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

function readJson(relative, errors) {
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

function readText(relative, errors) {
  const file = path.join(repoRoot, relative);
  if (!fs.existsSync(file)) {
    errors.push(`missing ${relative}`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const doc = readText("docs/meta/claude_skill_creator_eval_alignment.md", errors);
  const triggerEvalSets = readJson("validation/claude_skill_creator_trigger_eval_sets.json", errors);
  const claudePackage = readJson("validation/phase9_claude_project_local_package.json", errors);
  const claudeProbe = readJson("validation/phase9_claude_project_local_probe.json", errors);
  const routedProbe = readJson("validation/phase9_claude_project_local_routed_dependency_probe.json", errors);
  const installedFlow = readJson("validation/phase11_installed_flow_fixture.json", errors);
  const sideScenarios = readJson("validation/phase12_side_scenarios.json", errors);

  const docRequiredPhrases = [
    "Claude Skill-Creator Eval Alignment",
    "with-skill",
    "baseline",
    "generate_review.py",
    "not recorded as executed benchmark results",
    "Codex Desktop app-session runtime claim",
    "package/install validation",
  ];
  for (const phrase of docRequiredPhrases) {
    if (!doc.includes(phrase)) errors.push(`alignment doc missing phrase: ${phrase}`);
  }

  const evalSets = triggerEvalSets && triggerEvalSets.eval_sets ? triggerEvalSets.eval_sets : {};
  const missingEvalSets = [];
  const incompleteEvalSets = [];
  for (const name of expectedWorkflowSkills) {
    const set = evalSets[name];
    if (!Array.isArray(set)) {
      missingEvalSets.push(name);
      continue;
    }
    const positives = set.filter((item) => item.should_trigger === true);
    const negatives = set.filter((item) => item.should_trigger === false);
    const positiveCommandOk = positives.some((item) => item.expected_command === `/${name}`);
    const negativeBoundaryOk = negatives.every((item) => item.expected_command !== `/${name}`);
    if (!positives.length || !negatives.length || !positiveCommandOk || !negativeBoundaryOk) {
      incompleteEvalSets.push(name);
    }
  }

  if (triggerEvalSets) {
    if (triggerEvalSets.schema !== "diayn.claude_skill_creator_trigger_eval_sets.v1") {
      errors.push("trigger eval set schema mismatch");
    }
    if (!String(triggerEvalSets.purpose || "").includes("not recorded as executed benchmark results")) {
      errors.push("trigger eval set must not claim executed benchmark results");
    }
  }
  if (missingEvalSets.length) errors.push(`missing trigger eval sets: ${missingEvalSets.join(", ")}`);
  if (incompleteEvalSets.length) errors.push(`incomplete trigger eval sets: ${incompleteEvalSets.join(", ")}`);

  const projectLocalRuntimeEvidenceComplete = Boolean(
    claudePackage &&
      claudePackage.ok === true &&
      claudePackage.command_count === 12 &&
      claudePackage.workflow_skill_count === 12 &&
      claudePackage.dependency_skill_count === 23 &&
      claudeProbe &&
      claudeProbe.ok === true &&
      claudeProbe.command_probe &&
      claudeProbe.command_probe.skill_tool_invocation &&
      claudeProbe.command_probe.skill_tool_invocation.observed === true &&
      claudeProbe.dependency_skill_probe &&
      claudeProbe.dependency_skill_probe.skill_tool_invocation &&
      claudeProbe.dependency_skill_probe.skill_tool_invocation.observed === true &&
      routedProbe &&
      routedProbe.ok === true &&
      Array.isArray(routedProbe.skill_tool_invocations) &&
      routedProbe.skill_tool_invocations.some((item) => item.skill === "diayn-init") &&
      routedProbe.skill_tool_invocations.some((item) => item.skill === "idea-refine") &&
      installedFlow &&
      installedFlow.ok === true &&
      installedFlow.installed_flow_complete === true &&
      sideScenarios &&
      sideScenarios.ok === true
  );

  const triggerEvalSetsReady =
    missingEvalSets.length === 0 && incompleteEvalSets.length === 0 && triggerEvalSets && triggerEvalSets.schema;
  const benchmarkPath = path.join(repoRoot, "validation", "claude_skill_creator_benchmark.json");
  const benchmarkComplete = fs.existsSync(benchmarkPath);
  if (benchmarkComplete) {
    errors.push("unexpected committed Claude skill-creator benchmark file; update validator before claiming it");
  }

  const result = {
    schema: "diayn.phase9.claude_skill_creator_alignment.v1",
    ok: errors.length === 0,
    date: "2026-06-02",
    surface: "claude_code_cli_project_local",
    reference: "<path-to-claude-skill-creator>",
    alignment_doc: "docs/meta/claude_skill_creator_eval_alignment.md",
    trigger_eval_sets: "validation/claude_skill_creator_trigger_eval_sets.json",
    expected_workflow_skill_count: expectedWorkflowSkills.length,
    trigger_eval_sets_ready: Boolean(triggerEvalSetsReady),
    project_local_runtime_evidence_complete: projectLocalRuntimeEvidenceComplete,
    benchmark_complete: false,
    broad_auto_trigger_claim_allowed: false,
    claude_project_local_alpha_claim_allowed: projectLocalRuntimeEvidenceComplete,
    evidence: [
      "validation/phase9_claude_project_local_package.json",
      "validation/phase9_claude_project_local_probe.json",
      "validation/phase9_claude_project_local_routed_dependency_probe.json",
      "validation/phase11_installed_flow_fixture.json",
      "validation/phase12_side_scenarios.json",
    ],
    limits: [
      "This is a Claude project-local package alignment record, not a marketplace/plugin bare-command proof.",
      "Trigger eval prompts are prepared but not executed as a Claude skill-creator benchmark.",
      "No with-skill vs baseline benchmark is committed.",
      "Codex Desktop app-session runtime is outside the current Codex package/install validation claim.",
    ],
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
