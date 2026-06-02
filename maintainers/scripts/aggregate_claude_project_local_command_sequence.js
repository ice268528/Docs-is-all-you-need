#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
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

const defaultBatches = [
  "validation/phase9_claude_project_local_command_sequence_batch_controller.json",
  "validation/phase9_claude_project_local_command_sequence_batch_lanes.json",
  "validation/phase9_claude_project_local_command_sequence_batch_finish.json",
];

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relative), "utf8"));
}

function main() {
  const outputPath = argValue("--json", "validation/phase9_claude_project_local_command_sequence.json");
  const batchArg = argValue("--batches", null);
  const batchPaths = batchArg ? batchArg.split(",").map((item) => item.trim()).filter(Boolean) : defaultBatches;
  const batches = batchPaths.map((relative) => ({ relative, data: readJson(relative) }));
  const commands = batches.flatMap((batch) => batch.data.commands || []);
  const commandNames = commands.map((item) => item.command);
  const errors = [];

  for (const batch of batches) {
    if (batch.data.schema !== "diayn.phase9.claude_project_local_command_sequence.v1") {
      errors.push(`${batch.relative} schema mismatch`);
    }
    if (batch.data.ok !== true) errors.push(`${batch.relative} is not ok`);
  }
  for (const expected of expectedCommands) {
    if (!commandNames.includes(expected)) errors.push(`missing command evidence for ${expected}`);
  }
  for (const name of commandNames) {
    if (!expectedCommands.includes(name)) errors.push(`unexpected command evidence for ${name}`);
  }
  if (new Set(commandNames).size !== commandNames.length) errors.push("duplicate command evidence detected");

  const allBareCommandsVisible = commands.every((item) => item.slash_command_visible === true);
  const allWorkflowSkillsVisible = commands.every((item) => item.skill_visible === true);
  const allCommandsEnteredWorkflow = commands.every((item) => item.workflow_entry_observed === true);
  const allValidationProbeShortCircuits = commands.every((item) => item.validation_probe_short_circuit_ok === true);

  if (!allBareCommandsVisible) errors.push("not all commands were visible as bare slash commands");
  if (!allWorkflowSkillsVisible) errors.push("not all workflow skills were visible");
  if (!allCommandsEnteredWorkflow) errors.push("not all commands entered workflow context");

  const entryModes = Array.from(new Set(commands.map((item) => item.entry_mode))).sort();
  const totalCostUsd = commands.reduce((sum, item) => sum + (typeof item.cost_usd === "number" ? item.cost_usd : 0), 0);
  const commandsWithoutShortCircuit = commands
    .filter((item) => item.validation_probe_short_circuit_ok !== true)
    .map((item) => item.command);

  const payload = {
    schema: "diayn.phase9.claude_project_local_command_sequence.v1",
    date: "2026-06-01",
    ok: errors.length === 0,
    package_root: "packages/claude-project-local",
    source_batches: batchPaths,
    command_count: commands.length,
    commands,
    positive_evidence: {
      all_12_bare_commands_visible_in_claude_init: allBareCommandsVisible,
      all_12_workflow_skills_visible_in_claude_init: allWorkflowSkillsVisible,
      all_12_commands_entered_workflow: allCommandsEnteredWorkflow,
      entry_modes_observed: entryModes,
      commands_with_workflow_entry: commands.filter((item) => item.workflow_entry_observed).map((item) => item.command),
    },
    remaining_failures: {
      all_commands_identified_themselves: commands.every((item) => item.command_identity_line_observed === true),
      strict_sequence_probe_completed: allValidationProbeShortCircuits,
      commands_without_validation_short_circuit: commandsWithoutShortCircuit,
      note:
        "Claude project-local bare commands enter workflow context, but slash-command validation arguments are not reliably short-circuited before normal workflow startup.",
    },
    limits: {
      full_installed_flow: "not_run",
      owner_acceptance: "not_run",
      next_stage_baseline_refresh: "not_run",
    },
    total_cost_usd: Number(totalCostUsd.toFixed(6)),
    errors,
  };

  const fullOutput = path.resolve(repoRoot, outputPath);
  fs.mkdirSync(path.dirname(fullOutput), { recursive: true });
  fs.writeFileSync(fullOutput, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(payload, null, 2));
  if (!payload.ok) process.exitCode = 1;
}

main();
