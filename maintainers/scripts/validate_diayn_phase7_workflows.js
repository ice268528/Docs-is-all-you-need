#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const pluginRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need");

const required = {
  "diayn-backend": ["SKILL.md", "assets/lane/worklog.md", "assets/lane/evidence.md"],
  "diayn-frontend": ["SKILL.md", "assets/lane/worklog.md", "assets/lane/evidence.md"],
  "diayn-review-backend": ["SKILL.md", "assets/review/review_log.md"],
  "diayn-review-frontend": ["SKILL.md", "assets/review/review_log.md"],
  "diayn-sync": ["SKILL.md", "assets/sync/sync_log.md"],
  "diayn-integration": [
    "SKILL.md",
    "assets/integration/integration_summary.md",
    "assets/integration/stage_closeout.md",
    "assets/integration/failure_classification.md",
    "assets/integration/partial_attempt.md",
    "assets/integration/shared_issue.md",
    "assets/integration/authorized_command_record.md",
    "scripts/validate_stage_flow.py",
  ],
  "diayn-bug": ["SKILL.md", "assets/intake/bug_record.md"],
  "diayn-new": ["SKILL.md", "assets/intake/change_record.md", "assets/intake/superseded_requirement.md"],
};

function hash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function compare(errors, skill, relative) {
  const rootFile = path.join(repoRoot, "skills", skill, relative);
  const pluginFile = path.join(pluginRoot, "skills", skill, relative);
  if (!fs.existsSync(rootFile)) errors.push(`missing root ${skill}/${relative}`);
  if (!fs.existsSync(pluginFile)) errors.push(`missing plugin ${skill}/${relative}`);
  if (fs.existsSync(rootFile) && fs.existsSync(pluginFile) && hash(rootFile) !== hash(pluginFile)) {
    errors.push(`plugin copy differs for ${skill}/${relative}`);
  }
}

function readJson(errors, relative) {
  const file = path.join(repoRoot, relative);
  if (!fs.existsSync(file)) {
    errors.push(`missing ${relative}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  for (const [skill, files] of Object.entries(required)) {
    for (const relative of files) compare(errors, skill, relative);
  }

  const backend = fs.readFileSync(path.join(repoRoot, "skills", "diayn-backend", "SKILL.md"), "utf8");
  const frontend = fs.readFileSync(path.join(repoRoot, "skills", "diayn-frontend", "SKILL.md"), "utf8");
  const reviewBackend = fs.readFileSync(path.join(repoRoot, "skills", "diayn-review-backend", "SKILL.md"), "utf8");
  const sync = fs.readFileSync(path.join(repoRoot, "skills", "diayn-sync", "SKILL.md"), "utf8");
  const integration = fs.readFileSync(path.join(repoRoot, "skills", "diayn-integration", "SKILL.md"), "utf8");

  if (!backend.includes("candidate_done")) errors.push("backend skill must stop at candidate_done");
  if (!frontend.includes("candidate_done")) errors.push("frontend skill must stop at candidate_done");
  if (!reviewBackend.includes("tests/diayn/")) errors.push("review skill must allow tests/diayn fallback");
  if (!sync.includes("Do not merge business code") && !sync.includes("no business-code merge")) {
    errors.push("sync skill must preserve document-only sync boundary");
  }
  for (const needle of [
    "ready_for_e2e",
    "Owner acceptance",
    "stage closeout",
    "partial_attempt",
    "shared contracts",
    "OwnerGate",
    "shell/platform",
    "validate_stage_flow.py",
  ]) {
    if (!integration.includes(needle)) errors.push(`integration skill missing ${needle}`);
  }

  const scenario = readJson(errors, "validation/phase7_fixture_scenario.json");
  const flow = readJson(errors, "validation/phase7_fixture_flow.json");
  if (flow && flow.ok !== true) errors.push("phase7 fixture flow must pass");
  if (flow && flow.sync_no_business_code_merge !== true) errors.push("phase7 fixture must prove sync does not merge business code");
  if (flow && flow.integration_status !== "ready_for_e2e") errors.push("phase7 fixture must reach ready_for_e2e");
  if (flow && flow.owner_decision !== "accepted") errors.push("phase7 fixture must include Owner acceptance");
  if (flow && !flow.lanes.backend.review_decisions.includes("rejected")) {
    errors.push("phase7 fixture must include a rejection loop");
  }
  if (scenario && scenario.closeout && scenario.closeout.next_stage_baseline_refreshed !== true) {
    errors.push("phase7 scenario must include next-stage baseline refresh");
  }

  const result = {
    ok: errors.length === 0,
    skills_checked: Object.keys(required),
    fixture: flow
      ? {
          stage_id: flow.stage_id,
          integration_status: flow.integration_status,
          owner_decision: flow.owner_decision,
          sync_no_business_code_merge: flow.sync_no_business_code_merge,
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
