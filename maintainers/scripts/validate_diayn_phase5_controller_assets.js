#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const pluginRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need");

const requiredInitAssets = [
  "assets/scaffold/AGENTS.md",
  "assets/scaffold/TODO.md",
  "assets/scaffold/.diayn/worktree_manifest.md",
  "assets/scaffold/.diayn/scaffold_version.md",
  "assets/scaffold/.diayn/network_policy.md",
  "assets/scaffold/docs/project/project_brief.md",
  "assets/scaffold/docs/project/harness_audit_report.md",
  "assets/scaffold/docs/project/owner_questions.md",
  "scripts/harness_audit.py",
];

const requiredPlanAssets = [
  "assets/plan/stage_plan.md",
  "assets/plan/lane_board.md",
  "assets/plan/lane_handoff.md",
  "assets/plan/shared_contract_placeholder.md",
];

function fileHash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function assertExists(errors, file) {
  if (!fs.existsSync(file)) errors.push(`missing ${path.relative(repoRoot, file).replace(/\\/g, "/")}`);
}

function compareFiles(errors, rootFile, pluginFile) {
  assertExists(errors, rootFile);
  assertExists(errors, pluginFile);
  if (fs.existsSync(rootFile) && fs.existsSync(pluginFile) && fileHash(rootFile) !== fileHash(pluginFile)) {
    errors.push(
      `plugin copy differs for ${path.relative(repoRoot, rootFile).replace(/\\/g, "/")}`,
    );
  }
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function findFiles(root, predicate, output = []) {
  if (!fs.existsSync(root)) return output;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) findFiles(full, predicate, output);
    else if (predicate(full)) output.push(full);
  }
  return output;
}

function validateAuditOutput(errors) {
  const auditPath = path.join(repoRoot, "validation", "phase5_fixture_harness_audit.json");
  assertExists(errors, auditPath);
  if (!fs.existsSync(auditPath)) return null;

  const audit = JSON.parse(readText(auditPath));
  if (audit.schema !== "diayn.harness_audit.v1") errors.push("phase5 audit schema mismatch");
  if (!Array.isArray(audit.expected_files) || audit.expected_files.length < 5) {
    errors.push("phase5 audit must include expected scaffold files");
  }
  for (const required of [
    "AGENTS.md",
    "TODO.md",
    ".diayn/worktree_manifest.md",
    ".diayn/scaffold_version.md",
    "docs/project/project_brief.md",
  ]) {
    if (!audit.expected_files.some((item) => item.path === required)) {
      errors.push(`phase5 audit missing expected file ${required}`);
    }
  }
  if (!audit.git || !Object.prototype.hasOwnProperty.call(audit.git, "dirty")) {
    errors.push("phase5 audit must include git dirty preflight");
  }
  if (!audit.language || !audit.language.inferred_language) {
    errors.push("phase5 audit must include document language inference");
  }
  if (!Array.isArray(audit.owner_gates)) errors.push("phase5 audit must include owner gates");
  return audit;
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const rootInit = path.join(repoRoot, "skills", "diayn-init");
  const rootPlan = path.join(repoRoot, "skills", "diayn-plan");
  const pluginInit = path.join(pluginRoot, "skills", "diayn-init");
  const pluginPlan = path.join(pluginRoot, "skills", "diayn-plan");

  for (const relative of requiredInitAssets) {
    compareFiles(errors, path.join(rootInit, relative), path.join(pluginInit, relative));
  }
  for (const relative of requiredPlanAssets) {
    compareFiles(errors, path.join(rootPlan, relative), path.join(pluginPlan, relative));
  }

  const initSkill = readText(path.join(rootInit, "SKILL.md"));
  const planSkill = readText(path.join(rootPlan, "SKILL.md"));
  if (!initSkill.includes("scripts/harness_audit.py")) errors.push("diayn-init must mention harness_audit.py");
  if (!initSkill.includes("assets/scaffold/")) errors.push("diayn-init must mention scaffold assets");
  if (!planSkill.includes("assets/plan/")) errors.push("diayn-plan must mention plan assets");
  if (!initSkill.includes("Unknown") || !initSkill.includes("OwnerGate")) {
    errors.push("diayn-init must preserve Unknown and OwnerGate behavior");
  }

  const progressFiles = findFiles(path.join(repoRoot, "skills"), (file) => path.basename(file).toLowerCase() === "progress.md");
  for (const file of progressFiles) {
    errors.push(`PROGRESS.md must not be a DIAYN scaffold asset: ${path.relative(repoRoot, file).replace(/\\/g, "/")}`);
  }

  const audit = validateAuditOutput(errors);
  const result = {
    ok: errors.length === 0,
    init_asset_count: requiredInitAssets.length,
    plan_asset_count: requiredPlanAssets.length,
    fixture_audit: audit
      ? {
          recommended_action: audit.recommended_action,
          missing_files: audit.missing_files,
          owner_gate_count: audit.owner_gates.length,
          inferred_language: audit.language.inferred_language,
        }
      : null,
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
