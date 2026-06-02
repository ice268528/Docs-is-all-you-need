#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const pluginRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need");

const requiredFiles = [
  "SKILL.md",
  "scripts/worktree_plan.py",
  "assets/worktrees/session_registry.md",
  "assets/worktrees/local_session_identity.md",
  "assets/worktrees/lane_launch_prompt.md",
  "assets/worktrees/review_launch_prompt.md",
  "assets/worktrees/entry_checklist.md",
];

function hash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function compare(errors, relative) {
  const rootFile = path.join(repoRoot, "skills", "diayn-worktrees", relative);
  const pluginFile = path.join(pluginRoot, "skills", "diayn-worktrees", relative);
  if (!fs.existsSync(rootFile)) errors.push(`missing root ${relative}`);
  if (!fs.existsSync(pluginFile)) errors.push(`missing plugin ${relative}`);
  if (fs.existsSync(rootFile) && fs.existsSync(pluginFile) && hash(rootFile) !== hash(pluginFile)) {
    errors.push(`plugin copy differs for ${relative}`);
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

function validatePlan(errors, plan, label) {
  if (!plan) return;
  if (plan.schema !== "diayn.worktree_plan.v1") errors.push(`${label}: schema mismatch`);
  if (!plan.git || !Object.prototype.hasOwnProperty.call(plan.git, "dirty")) {
    errors.push(`${label}: missing Git dirty preflight`);
  }
  if (!Array.isArray(plan.lanes)) errors.push(`${label}: lanes must be an array`);
  for (const lane of plan.lanes || []) {
    if (lane.applicable === "yes") {
      if (!lane.copyable_add_command || !lane.copyable_add_command.includes("git worktree add")) {
        errors.push(`${label}: applicable ${lane.lane} lane missing copyable add command`);
      }
      if (!Array.isArray(lane.worker_startup) || !lane.worker_startup.includes(`/diayn-${lane.lane}`)) {
        errors.push(`${label}: applicable ${lane.lane} lane missing worker startup`);
      }
      if (!Array.isArray(lane.review_startup) || !lane.review_startup.includes(`/diayn-review-${lane.lane}`)) {
        errors.push(`${label}: applicable ${lane.lane} lane missing review startup`);
      }
    }
    if (lane.applicable === "not_applicable" && lane.worktree_path) {
      errors.push(`${label}: not_applicable ${lane.lane} lane must not get a worktree path`);
    }
  }
  if (plan.execute_requested !== false) errors.push(`${label}: validation plans must be dry-run only`);
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  for (const relative of requiredFiles) compare(errors, relative);

  const skillText = fs.readFileSync(path.join(repoRoot, "skills", "diayn-worktrees", "SKILL.md"), "utf8");
  for (const needle of ["scripts/worktree_plan.py", "assets/worktrees/", "not_applicable", "same lane", "fresh-session"]) {
    if (!skillText.includes(needle)) errors.push(`diayn-worktrees SKILL.md missing ${needle}`);
  }

  const worktreePlan = readJson(errors, "validation/phase6_worktree_plan.json");
  const notApplicablePlan = readJson(errors, "validation/phase6_not_applicable_worktree_plan.json");
  validatePlan(errors, worktreePlan, "phase6_worktree_plan");
  validatePlan(errors, notApplicablePlan, "phase6_not_applicable_worktree_plan");
  if (notApplicablePlan && !notApplicablePlan.lanes.some((lane) => lane.lane === "frontend" && lane.applicable === "not_applicable")) {
    errors.push("phase6_not_applicable_worktree_plan must prove a not_applicable frontend lane");
  }

  const result = {
    ok: errors.length === 0,
    required_file_count: requiredFiles.length,
    worktree_plan_lanes: worktreePlan ? worktreePlan.lanes.map((lane) => ({ lane: lane.lane, applicable: lane.applicable, status: lane.status })) : [],
    not_applicable_lanes: notApplicablePlan
      ? notApplicablePlan.lanes.filter((lane) => lane.applicable === "not_applicable").map((lane) => lane.lane)
      : [],
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
