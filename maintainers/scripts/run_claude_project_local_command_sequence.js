#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const packageRoot = path.join(repoRoot, "packages", "claude-project-local");
const workflowCommands = [
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

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function selectedCommands() {
  const value = argValue("--commands", null);
  if (!value) return workflowCommands;
  const selected = value
    .split(",")
    .map((item) => item.trim().replace(/^\//, ""))
    .filter(Boolean);
  for (const name of selected) {
    if (!workflowCommands.includes(name)) throw new Error(`unknown DIAYN workflow command: ${name}`);
  }
  return selected;
}

function parseJsonLines(stdout) {
  const events = [];
  for (const line of stdout.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.startsWith("{")) continue;
    try {
      events.push(JSON.parse(trimmed));
    } catch {
      // Keep the probe resilient to non-JSON warning lines.
    }
  }
  return events;
}

function collectToolUses(events) {
  const uses = [];
  for (const event of events) {
    const content = event.message && Array.isArray(event.message.content) ? event.message.content : [];
    for (const item of content) {
      if (item && item.type === "tool_use") {
        uses.push({ name: item.name, input: item.input || {} });
      }
    }
  }
  return uses;
}

function runCommand(name, options) {
  const prompt = `/${name} Validation command sequence probe only. Use this workflow skill's Validation Probe Mode. Do not run Identity Guard, inspect files, run preflight checks, or edit files. Do not use tools except native command/skill loading if the platform requires it. Answer exactly in two lines:\nCOMMAND: /${name}\nFIRST_STOP: <first stop condition from this DIAYN workflow>`;
  const args = [
    "--allowedTools",
    options.allowedTools,
    "--max-budget-usd",
    options.commandBudget,
    "--max-turns",
    options.maxTurns,
    "--verbose",
    "--output-format",
    "stream-json",
    "-p",
    prompt,
  ];
  const child = spawnSync("claude", args, {
    cwd: packageRoot,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    shell: true,
  });
  const events = parseJsonLines(child.stdout || "");
  const init = events.find((event) => event.type === "system" && event.subtype === "init") || {};
  const result = events.find((event) => event.type === "result") || {};
  const toolUses = collectToolUses(events);
  const finalText = typeof result.result === "string" ? result.result : "";
  const slashCommands = Array.isArray(init.slash_commands) ? init.slash_commands : [];
  const skills = Array.isArray(init.skills) ? init.skills : [];
  const commandLineObserved = finalText.includes(`COMMAND: /${name}`);
  const permissionDenials = Array.isArray(result.permission_denials) ? result.permission_denials : [];
  const workflowEntryObserved = Boolean(
    toolUses.length > 0 ||
      permissionDenials.length > 0 ||
      result.stop_reason === "tool_use" ||
      result.terminal_reason === "completed" ||
      finalText.trim(),
  );
  const validationProbeShortCircuitOk = Boolean(
    child.status === 0 && commandLineObserved && toolUses.length === 0 && permissionDenials.length === 0,
  );
  const entryMode = toolUses.some((use) => use.name === "Skill")
    ? "explicit_skill_tool"
    : "native_direct_command_skill_context";

  return {
    command: `/${name}`,
    exit_code: child.status,
    spawn_error: child.error ? child.error.message : null,
    stderr_tail: child.stderr ? child.stderr.slice(-2000) : "",
    terminal_reason: result.terminal_reason || null,
    stop_reason: result.stop_reason || null,
    slash_command_visible: slashCommands.includes(name),
    skill_visible: skills.includes(name),
    project_local_diayn_command_count: slashCommands.filter((item) => item.startsWith("diayn-")).length,
    project_local_diayn_skill_count: skills.filter((item) => item.startsWith("diayn-")).length,
    entry_mode: entryMode,
    skill_tool_invocations: toolUses.filter((use) => use.name === "Skill").map((use) => use.input.skill || null),
    command_identity_line_observed: commandLineObserved,
    validation_probe_short_circuit_ok: validationProbeShortCircuitOk,
    workflow_entry_observed: workflowEntryObserved,
    permission_denials: permissionDenials,
    cost_usd: typeof result.total_cost_usd === "number" ? result.total_cost_usd : null,
    final_result_excerpt: finalText ? finalText.slice(0, 600) : "",
    ok:
      !child.error &&
      slashCommands.includes(name) &&
      skills.includes(name) &&
      workflowEntryObserved,
  };
}

function main() {
  const outputPath = argValue("--json", null);
  const commandBudget = argValue("--command-budget", "0.08");
  const maxTurns = argValue("--max-turns", "2");
  const allowedTools = argValue("--allowed-tools", "Skill");
  if (!outputPath) throw new Error("--json is required");

  const commands = selectedCommands();
  const results = commands.map((name) => runCommand(name, { commandBudget, maxTurns, allowedTools }));
  const totalCostUsd = results.reduce((sum, item) => sum + (item.cost_usd || 0), 0);
  const errors = [];
  for (const result of results) {
    if (!result.ok) {
      errors.push(
        `${result.command} failed command entry probe: exit=${result.exit_code}, slash=${result.slash_command_visible}, skill=${result.skill_visible}, workflow_entry=${result.workflow_entry_observed}`,
      );
    }
  }

  const payload = {
    schema: "diayn.phase9.claude_project_local_command_sequence.v1",
    date: "2026-06-01",
    ok: errors.length === 0,
    package_root: "packages/claude-project-local",
    allowed_tools: allowedTools,
    max_turns: Number(maxTurns),
    command_count: commands.length,
    requested_commands: commands.map((name) => `/${name}`),
    commands: results,
    all_bare_commands_visible: results.every((item) => item.slash_command_visible),
    all_workflow_skills_visible: results.every((item) => item.skill_visible),
    all_commands_identified_themselves: results.every((item) => item.command_identity_line_observed),
    all_requested_commands_entered_workflow: results.every((item) => item.workflow_entry_observed),
    all_validation_probe_short_circuits: results.every((item) => item.validation_probe_short_circuit_ok),
    entry_modes_observed: Array.from(new Set(results.map((item) => item.entry_mode))).sort(),
    positive_evidence: {
      all_12_bare_commands_visible_in_claude_init: results.every((item) => item.slash_command_visible),
      all_12_workflow_skills_visible_in_claude_init: results.every((item) => item.skill_visible),
      all_requested_commands_entered_workflow: results.every((item) => item.workflow_entry_observed),
      entry_modes_observed: Array.from(new Set(results.map((item) => item.entry_mode))).sort(),
      commands_with_workflow_entry: results.filter((item) => item.workflow_entry_observed).map((item) => item.command),
    },
    remaining_failures: {
      all_commands_identified_themselves: results.every((item) => item.command_identity_line_observed),
      strict_sequence_probe_completed: results.every((item) => item.validation_probe_short_circuit_ok),
      commands_without_validation_short_circuit: results
        .filter((item) => !item.validation_probe_short_circuit_ok)
        .map((item) => item.command),
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
