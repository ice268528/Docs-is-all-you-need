#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const fixtureSource = path.join(repoRoot, "validation", "minimal-fullstack-fixture");
const packageSource = path.join(repoRoot, "packages", "claude-project-local");
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

function hasArg(name) {
  return process.argv.includes(name);
}

function defaultTargetParent() {
  return path.resolve(repoRoot, "..", ".diayn_tmp");
}

function ensureInsideRepo(target) {
  const resolved = path.resolve(target);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`refusing to write repo output outside repo: ${target}`);
  }
}

function run(command, args, options = {}) {
  const child = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    encoding: "utf8",
    maxBuffer: 30 * 1024 * 1024,
    shell: options.shell || false,
  });
  return {
    command: [command, ...args].join(" "),
    cwd: options.cwd || repoRoot,
    exit_code: child.status,
    stdout: child.stdout || "",
    stderr: child.stderr || "",
    spawn_error: child.error ? child.error.message : null,
    ok: child.status === 0 && !child.error,
  };
}

function resolveClaudeExecutable() {
  const override = argValue("--claude-bin", null);
  if (override) return { command: path.resolve(override), shell: false };

  if (process.platform === "win32") {
    const where = spawnSync("where.exe", ["claude"], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
      shell: false,
    });
    const candidates = `${where.stdout || ""}\n${where.stderr || ""}`
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    for (const candidate of candidates) {
      if (candidate.toLowerCase().endsWith("claude.exe") && fs.existsSync(candidate)) {
        return { command: candidate, shell: false };
      }
      if (candidate.toLowerCase().endsWith("claude.cmd") && fs.existsSync(candidate)) {
        const text = fs.readFileSync(candidate, "utf8");
        const dir = path.dirname(candidate);
        const match = text.match(/"(%dp0%\\[^"]*claude\.exe)"/i);
        if (match) {
          const exe = match[1].replace(/%dp0%/i, dir);
          if (fs.existsSync(exe)) return { command: exe, shell: false };
        }
      }
    }
  }

  return { command: "claude", shell: true };
}

function checkpointCommandChanges(targetRoot, commandName) {
  const status = run("git", ["status", "--short"], { cwd: targetRoot });
  const result = {
    command: `/${commandName}`,
    changed: false,
    committed: false,
    cwd: targetRoot,
    status_before: status.stdout || "",
    commit_hash: null,
    error: null,
  };
  if (!status.ok) {
    result.error = status.stderr || status.spawn_error || status.stdout || "git status failed";
    return result;
  }
  if (!status.stdout.trim()) return result;

  result.changed = true;
  const add = run("git", ["add", "-A"], { cwd: targetRoot });
  if (!add.ok) {
    result.error = add.stderr || add.spawn_error || add.stdout || "git add failed";
    return result;
  }
  const commit = run(
    "git",
    [
      "-c",
      "user.name=DIAYN Fixture",
      "-c",
      "user.email=diayn@example.test",
      "commit",
      "-m",
      `DIAYN fixture checkpoint after /${commandName}`,
    ],
    { cwd: targetRoot },
  );
  if (!commit.ok) {
    result.error = commit.stderr || commit.spawn_error || commit.stdout || "git commit failed";
    return result;
  }
  const revParse = run("git", ["rev-parse", "--short", "HEAD"], { cwd: targetRoot });
  result.committed = true;
  result.commit_hash = revParse.ok ? revParse.stdout.trim() : null;
  return result;
}

function copyContents(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    fs.cpSync(path.join(source, entry.name), path.join(target, entry.name), {
      recursive: true,
      force: true,
    });
  }
}

function selectedCommands() {
  const value = argValue("--commands", "");
  if (!value.trim()) return workflowCommands;
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
      // Ignore non-JSON warning lines.
    }
  }
  return events;
}

function collectToolUses(events) {
  const uses = [];
  for (const event of events) {
    const content = event.message && Array.isArray(event.message.content) ? event.message.content : [];
    for (const item of content) {
      if (item && item.type === "tool_use") uses.push({ name: item.name, input: item.input || {} });
    }
  }
  return uses;
}

function promptFor(commandName, targetRoot) {
  const fixtureWorktreeRoot = `../diayn-worktrees/${path.basename(targetRoot)}`;
  const shared = [
    "DIAYN_PHASE11_INSTALLED_FLOW_FIXTURE.",
    "Owner-approved DIAYN installed-flow fixture run.",
    "Owner-confirmed project_slug = minimal-fullstack-fixture.",
    "Owner-confirmed owner_name = DIAYN Fixture Owner.",
    "Owner-confirmed requirement_source = README.md and diayn_v1_gap_list.md.",
    "Owner-confirmed stage_goal = prove the DDDV8 installed-flow gap list on the existing register/login fixture; do not add new fixture behavior beyond the existing backend/frontend/shared app.",
    "Owner-confirmed OG-001 = project_slug minimal-fullstack-fixture and Owner DIAYN Fixture Owner.",
    "Owner-confirmed OG-002 = prove the DDDV8 gap list workflow only; do not add new fixture behavior.",
    "This project_slug is already confirmed and must not be asked again unless repository evidence contradicts it.",
    "Preferred stage id: stage-1-auth-fixture. If the workflow chooses another concise stage id, use it consistently in TODO, stage plans, lane boards, and handoffs.",
    "Project language: English.",
    "Use backend and frontend lanes.",
    "The existing app is a tiny register/login full-stack fixture with backend/app.py, frontend/index.html, shared/api_contract.md, and validation/run_e2e.py.",
    `Authorized worktree root for this fixture: ${fixtureWorktreeRoot}.`,
    "All OwnerGate choices needed for this automated fixture are approved when they match these facts.",
    "Do not create or stop on open OwnerGate questions for facts resolved above.",
    "If the git working tree is clean, create required DIAYN scaffold files directly instead of asking about dirty-tree handling.",
    "If the scaffold audit finds only missing DIAYN baseline files and no overwrite conflicts, scaffold creation is approved for this fixture.",
    "Do not call AskUserQuestion for facts explicitly confirmed in this prompt.",
    "Do not access network services, secrets, real credentials, or external databases.",
    "Keep changes inside this fixture repository.",
  ].join(" ");
  const commandGuidance = {
    "diayn-init":
      "Initialize the minimal DIAYN harness documents for this existing fixture. Use the supplied facts as Owner-confirmed. Owner approval is granted to create missing DIAYN baseline scaffold files immediately when the audit reports no overwrite conflicts. Do not ask project_slug or scaffold-creation confirmation again.",
    "diayn-plan":
      "Plan one stage for the auth fixture with backend and frontend task slices, review expectations, sync, integration, Owner acceptance, closeout, and next-stage baseline refresh. Resolve any existing OG-001 or OG-002 entries using the Owner-confirmed facts in this prompt. Do not leave open OwnerGate items for project slug, Owner, scope, stage goal, or lane applicability. Do not mark lane tasks candidate_done or done during planning; every planned lane task status must be todo. Write only these planning artifact types: one docs/stages/<stage-id>/stage_plan.md, docs/lanes/backend/board.md, docs/lanes/backend/handoff.md, docs/lanes/frontend/board.md, docs/lanes/frontend/handoff.md, and one docs/shared/<contract>.md shared contract note. After writing those files and updating TODO.md pointers, stop with a concise report.",
    "diayn-worktrees":
      `Prepare backend and frontend lane worktrees for stage-1-auth-fixture. Worktree creation is Owner-authorized for this clean automated fixture. First verify the controller working tree is clean, then run python .claude/skills/diayn-worktrees/scripts/worktree_plan.py --project-root . --project-slug minimal-fullstack-fixture --stage-id stage-1-auth-fixture --worktree-root ${fixtureWorktreeRoot} --execute --output .diayn/worktree_plan.json. Update .diayn/worktree_manifest.md with the resulting backend/frontend worktree paths, branches, and ready status. Write .diayn/session_registry.md. Write docs/lanes/backend/launch_prompt.md and docs/lanes/frontend/launch_prompt.md. Do not implement business code or start hidden worker/reviewer sessions.`,
    "diayn-backend":
      "You are running from the registered backend lane worktree. Execute only backend task BE-001, the baseline evidence/worklog task. Do not introduce the intentional BE-002 defect yet. Do not change product behavior unless the existing verification requires a tiny backend-only fix. Run python validation/run_e2e.py --output docs/lanes/backend/stages/stage-1-auth-fixture/e2e_backend.json or an equivalent local fixture E2E command, create/update docs/lanes/backend/worklog.md and docs/lanes/backend/evidence.md, update docs/lanes/backend/board.md so BE-001 is candidate_done, leave BE-002 todo, and stop for /diayn-review-backend. Do not self-review, integrate, edit frontend files, or start hidden sessions.",
    "diayn-frontend":
      "You are running from the registered frontend lane worktree. Execute only frontend task FE-001, the baseline evidence/worklog task. Do not change product behavior unless the existing verification requires a tiny frontend-only fix. Run python validation/run_e2e.py --output docs/lanes/frontend/stages/stage-1-auth-fixture/e2e_frontend.json or an equivalent local fixture E2E command, create/update docs/lanes/frontend/worklog.md and docs/lanes/frontend/evidence.md, update docs/lanes/frontend/board.md so FE-001 is candidate_done, and stop for /diayn-review-frontend. Do not self-review, integrate, edit backend files, or start hidden sessions.",
    "diayn-review-backend":
      "You are running from the same registered backend lane worktree after backend worker activity has stopped. Review only backend-001 candidate_done evidence. Treat the backend board, worklog, evidence.md, and E2E JSON as the worker report for this fixture. Inspect the relevant diff and run python validation/run_e2e.py --output docs/lanes/backend/stages/stage-1-auth-fixture/review_e2e_backend.json or inspect equivalent local evidence. Write docs/lanes/backend/review_log.md with decision done or rejected, failure classification if relevant, tests/checks run, and next command. If evidence is credible, update docs/lanes/backend/board.md so backend-001 is done; keep backend-002 todo. Do not fix implementation, integrate, edit frontend files, or mark Owner acceptance.",
    "diayn-review-frontend":
      "You are running from the same registered frontend lane worktree after frontend worker activity has stopped. Review only frontend-001 candidate_done evidence. Treat the frontend board, worklog, evidence.md, and E2E JSON as the worker report for this fixture. Inspect the relevant diff and run python validation/run_e2e.py --output docs/lanes/frontend/stages/stage-1-auth-fixture/review_e2e_frontend.json or inspect equivalent local evidence. Write docs/lanes/frontend/review_log.md with decision done or rejected, failure classification if relevant, tests/checks run, and next command. If evidence is credible, update docs/lanes/frontend/board.md so frontend-001 is done. Do not fix implementation, integrate, edit backend files, or mark Owner acceptance.",
    "diayn-sync":
      "You are running from the Controller root after backend and frontend review have stopped. Read .diayn/worktree_plan.json, then read backend/frontend board, worklog, evidence.md, review_log.md, and review E2E JSON from the registered lane worktrees. Synchronize documents/state only into the Controller root: copy or update docs/lanes/backend/review_log.md, docs/lanes/frontend/review_log.md, and any needed lane evidence pointers, write docs/stages/stage-1-auth-fixture/sync_log.md, and update TODO.md lane snapshots if needed. Do not edit backend/, frontend/, shared/, or validation/. Do not merge branches, integrate business code, run /diayn-integration, mark Owner acceptance, or start hidden sessions.",
    "diayn-integration":
      "You are running from the Controller root after /diayn-sync. Confirm backend and frontend review logs are done. Since the baseline lane slices should not contain product-code changes, record merge status as no-op/already aligned when appropriate rather than inventing a merge. Run python validation/run_e2e.py --output docs/stages/stage-1-auth-fixture/integration_e2e.json. Write docs/stages/stage-1-auth-fixture/integration_summary.md with reviewed lane inputs, merge status, shared contract consistency, build/lint/smoke/E2E evidence, failure classification, and next action toward Owner acceptance. Do not mark Owner acceptance, create closeout, start a new stage, or edit lane worktrees.",
    "diayn-bug":
      "You are running from the Controller root after Owner acceptance has been recorded for stage-1-auth-fixture. This is a Phase 12 side scenario: no active defect is being filed. Write docs/stages/stage-1-auth-fixture/bug_triage_noop.md with classification no_active_bug, affected scope none, responsible owner none, no rollback, no lane reassignment, and next action proceed_to_closeout. Do not edit implementation code, rewrite requirements, uncheck accepted TODO items, close the stage, delete worktrees, or start the next stage.",
    "diayn-new":
      "You are running from the Controller root after Owner acceptance has been recorded for stage-1-auth-fixture. Treat the Owner-confirmed next-stage request as future preparation only: next stage id stage-2-follow-up, goal: keep a baseline refresh record for later validation without starting implementation. Write docs/stages/stage-1-auth-fixture/stage_closeout.md with accepted baseline, integration summary, Owner acceptance record, final evidence links, unresolved follow-ups, and worktree/branch retention notes. Write docs/stages/stage-2-follow-up/baseline_refresh.md showing that the next stage starts from the accepted baseline. Update TODO.md with closeout and next-stage pointers only. Do not implement code, re-plan lanes, delete worktrees, or alter accepted requirements.",
    "diayn-html":
      "You are running from the Controller root after /diayn-integration. Owner-confirmed acceptance: DIAYN Fixture Owner accepts stage-1-auth-fixture based on the integration summary and passing E2E. Read docs/stages/stage-1-auth-fixture/integration_summary.md and write docs/stages/stage-1-auth-fixture/owner_acceptance_record.md as the durable Markdown acceptance record. The Markdown record must include this exact sentence: This Markdown record is authoritative; any HTML is only a readable aid. Also write docs/stages/stage-1-auth-fixture/owner_acceptance_summary.html as a readable aid if practical. Do not change implementation code, rewrite requirements, close the stage, delete worktrees, or start the next stage.",
  };
  return `/${commandName} ${shared} ${commandGuidance[commandName] || ""}`;
}

function runClaudeCommand(targetRoot, commandName, options) {
  const prompt = promptFor(commandName, targetRoot);
  const claude = options.claudeExecutable || resolveClaudeExecutable();
  const args = [
    "--allowedTools",
    options.allowedTools,
    "--permission-mode",
    options.permissionMode,
    "--no-session-persistence",
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
  const child = spawnSync(claude.command, args, {
    cwd: targetRoot,
    encoding: "utf8",
    maxBuffer: 30 * 1024 * 1024,
    shell: claude.shell,
  });
  const events = parseJsonLines(child.stdout || "");
  const init = events.find((event) => event.type === "system" && event.subtype === "init") || {};
  const result = events.find((event) => event.type === "result") || {};
  const toolUses = collectToolUses(events);
  const finalText = typeof result.result === "string" ? result.result : "";
  const slashCommands = Array.isArray(init.slash_commands) ? init.slash_commands : [];
  const skills = Array.isArray(init.skills) ? init.skills : [];
  const permissionDenials = Array.isArray(result.permission_denials) ? result.permission_denials : [];
  const executionErrors = Array.isArray(result.errors) ? result.errors : [];
  const validationProbeShortCircuit =
    new RegExp(`COMMAND:\\s*/${commandName}\\b`).test(finalText) && /FIRST_STOP:/.test(finalText);
  const workflowEntryObserved =
    !validationProbeShortCircuit &&
    (toolUses.length > 0 || permissionDenials.length > 0 || result.stop_reason === "tool_use" || Boolean(finalText.trim()));
  return {
    command: `/${commandName}`,
    invocation: ["claude", ...args.map((arg) => (arg === prompt ? "<prompt>" : arg))].join(" "),
    cwd: targetRoot,
    exit_code: child.status,
    spawn_error: child.error ? child.error.message : null,
    stderr_tail: child.stderr ? child.stderr.slice(-2000) : "",
    terminal_reason: result.terminal_reason || null,
    stop_reason: result.stop_reason || null,
    slash_command_visible: slashCommands.includes(commandName),
    skill_visible: skills.includes(commandName),
    project_local_diayn_command_count: slashCommands.filter((item) => item.startsWith("diayn-")).length,
    project_local_diayn_skill_count: skills.filter((item) => item.startsWith("diayn-")).length,
    skill_tool_invocations: toolUses.filter((use) => use.name === "Skill").map((use) => use.input.skill || null),
    native_workflow_skill_entry_observed:
      !validationProbeShortCircuit &&
      slashCommands.includes(commandName) &&
      skills.includes(commandName) &&
      workflowEntryObserved,
    tool_uses: toolUses.map((use) => ({ name: use.name, input: use.input })),
    permission_denials: permissionDenials,
    execution_errors: executionErrors,
    cost_usd: typeof result.total_cost_usd === "number" ? result.total_cost_usd : null,
    final_result_excerpt: finalText ? finalText.slice(0, 1000) : "",
    validation_probe_short_circuit: validationProbeShortCircuit,
    workflow_entry_observed: workflowEntryObserved,
  };
}

function listRelativeFiles(root, maxFiles = 5000) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".git") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        files.push(path.relative(root, full).replace(/\\/g, "/"));
        if (files.length >= maxFiles) return;
      }
    }
  }
  walk(root);
  return files.sort();
}

function readRelativeFile(root, relative) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) return "";
  return fs.readFileSync(full, "utf8");
}

function parseGitWorktreePorcelain(text) {
  const entries = [];
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) {
      if (current) entries.push(current);
      current = null;
      continue;
    }
    const [key, ...rest] = line.split(" ");
    const value = rest.join(" ");
    if (key === "worktree") {
      if (current) entries.push(current);
      current = { path: value };
    } else if (current) {
      current[key] = value;
    }
  }
  if (current) entries.push(current);
  return entries;
}

function readWorktreePlan(targetRoot, workflowErrors = null) {
  const worktreePlanPath = path.join(targetRoot, ".diayn", "worktree_plan.json");
  if (!fs.existsSync(worktreePlanPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(worktreePlanPath, "utf8"));
  } catch (error) {
    if (workflowErrors) {
      workflowErrors.push(`/diayn-worktrees produced invalid .diayn/worktree_plan.json: ${error.message}`);
    }
    return null;
  }
}

function laneForCommand(commandName) {
  if (commandName === "diayn-backend" || commandName === "diayn-review-backend") return "backend";
  if (commandName === "diayn-frontend" || commandName === "diayn-review-frontend") return "frontend";
  return null;
}

function commandRootFor(targetRoot, commandName) {
  const laneName = laneForCommand(commandName);
  if (!laneName) return targetRoot;
  const worktreePlan = readWorktreePlan(targetRoot);
  const lane = worktreePlan && Array.isArray(worktreePlan.lanes)
    ? worktreePlan.lanes.find((item) => item.lane === laneName)
    : null;
  if (lane && lane.worktree_path && fs.existsSync(lane.worktree_path)) return lane.worktree_path;
  return targetRoot;
}

function markdownTableDataLines(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => {
      if (!line.startsWith("|") || !line.endsWith("|")) return false;
      if (/^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|$/.test(line)) return false;
      if (/^\|\s*(done|id|task|status|field|lane)\b/i.test(line)) return false;
      return true;
    });
}

function normalizeMarkdownCell(cell) {
  return String(cell || "")
    .trim()
    .replace(/^`+|`+$/g, "")
    .trim()
    .toLowerCase();
}

function boardHasStatus(boardText, status) {
  const expected = String(status || "").toLowerCase();
  return markdownTableDataLines(boardText).some((line) => {
    const cells = line.split("|").slice(1, -1).map(normalizeMarkdownCell);
    return cells.some((cell) => cell === expected);
  });
}

function reviewLogHasDecision(reviewLogText, decision) {
  const expected = String(decision || "").toLowerCase();
  const section = String(reviewLogText || "").match(/(?:^|\n)##\s*Decision\s*\r?\n([\s\S]*?)(?:\r?\n##\s+|$)/i);
  if (section) {
    const line = section[1]
      .split(/\r?\n/)
      .map(normalizeMarkdownCell)
      .find(Boolean);
    if (line === expected) return true;
  }
  return markdownTableDataLines(reviewLogText).some((line) => {
    const cells = line.split("|").slice(1, -1).map(normalizeMarkdownCell);
    const decisionIndex = cells.findIndex((cell) => cell === "decision");
    return decisionIndex >= 0 && cells[decisionIndex + 1] === expected;
  });
}

function textMarksOwnerAccepted(text) {
  return String(text || "")
    .split(/\r?\n/)
    .some((line) => {
      if (!/(owner_accepted|owner decision\s*:\s*`?accepted`?|owner acceptance\s*:\s*`?accepted`?)/i.test(line)) {
        return false;
      }
      return !/\b(no|not|does not|do not|without|must not|never)\b/i.test(line);
    });
}

function changedPathsFromStatus(statusText) {
  return String(statusText || "")
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const pathText = line.length > 3 ? line.slice(3).trim() : line.trim();
      const renameTarget = pathText.includes(" -> ") ? pathText.split(" -> ").pop() : pathText;
      return String(renameTarget || "").replace(/\\/g, "/");
    })
    .filter(Boolean);
}

function isBusinessCodePath(relative) {
  return /^(backend|frontend|shared|validation)\//.test(String(relative || "").replace(/\\/g, "/"));
}

function collectLaneWorkerArtifact(laneRoot, laneName) {
  const boardPath = `docs/lanes/${laneName}/board.md`;
  const worklogPath = `docs/lanes/${laneName}/worklog.md`;
  const evidencePath = `docs/lanes/${laneName}/evidence.md`;
  const lanePrefix = `docs/lanes/${laneName}/`;
  const laneFiles = laneRoot ? listRelativeFiles(laneRoot) : [];
  const worklogFiles = laneFiles.filter((relative) =>
    relative === worklogPath || (relative.startsWith(lanePrefix) && relative.endsWith("/worklog.md")),
  );
  const evidenceFiles = laneFiles.filter((relative) =>
    relative === evidencePath ||
    (relative.startsWith(`${lanePrefix}evidence/`) && !relative.endsWith("/")) ||
    (relative.startsWith(lanePrefix) && relative.endsWith("/evidence.md")),
  );
  const boardText = laneRoot ? readRelativeFile(laneRoot, boardPath) : "";
  const worklogText = laneRoot ? worklogFiles.map((relative) => readRelativeFile(laneRoot, relative)).join("\n") : "";
  const evidenceText = laneRoot ? evidenceFiles.map((relative) => readRelativeFile(laneRoot, relative)).join("\n") : "";
  const laneStatus = laneRoot ? run("git", ["status", "--short"], { cwd: laneRoot }) : null;
  return {
    worktree_path: laneRoot,
    required_files: [worklogPath, evidencePath],
    produced_required_files: [...worklogFiles, ...evidenceFiles],
    produced_worklog_files: worklogFiles,
    produced_evidence_files: evidenceFiles,
    has_worklog_artifact: worklogFiles.length > 0,
    has_evidence_artifact: evidenceFiles.length > 0,
    board_has_candidate_done: boardHasStatus(boardText, "candidate_done"),
    board_has_self_approved_done: boardHasStatus(boardText, "done") || boardHasStatus(boardText, "owner_accepted"),
    evidence_mentions_e2e: /validation\/run_e2e\.py|validation\\run_e2e\.py|E2E validation result|E2E output file|7\/7 checks|e2e_.*\.json/i.test(
      `${boardText}\n${worklogText}\n${evidenceText}`,
    ),
    git_status_after_command: laneStatus && laneStatus.ok ? laneStatus.stdout : null,
  };
}

function collectLaneReviewArtifact(laneRoot, laneName) {
  const boardPath = `docs/lanes/${laneName}/board.md`;
  const reviewLogPath = `docs/lanes/${laneName}/review_log.md`;
  const laneFiles = laneRoot ? listRelativeFiles(laneRoot) : [];
  const boardText = laneRoot ? readRelativeFile(laneRoot, boardPath) : "";
  const reviewLogText = laneRoot ? readRelativeFile(laneRoot, reviewLogPath) : "";
  const laneStatus = laneRoot ? run("git", ["status", "--short"], { cwd: laneRoot }) : null;
  return {
    worktree_path: laneRoot,
    required_files: [reviewLogPath],
    produced_required_files: [reviewLogPath].filter((relative) => laneFiles.includes(relative)),
    board_has_review_done: boardHasStatus(boardText, "done"),
    board_has_rejected: boardHasStatus(boardText, "rejected"),
    board_has_owner_accepted: boardHasStatus(boardText, "owner_accepted"),
    review_log_decision_done: reviewLogHasDecision(reviewLogText, "done"),
    review_log_decision_rejected: reviewLogHasDecision(reviewLogText, "rejected"),
    evidence_mentions_e2e: /validation\/run_e2e\.py|validation\\run_e2e\.py|review_e2e_/i.test(`${boardText}\n${reviewLogText}`),
    git_status_after_command: laneStatus && laneStatus.ok ? laneStatus.stdout : null,
  };
}

function collectSyncArtifact(controllerRoot, checkpoint) {
  const syncLogPath = "docs/stages/stage-1-auth-fixture/sync_log.md";
  const backendReviewLogPath = "docs/lanes/backend/review_log.md";
  const frontendReviewLogPath = "docs/lanes/frontend/review_log.md";
  const files = controllerRoot ? listRelativeFiles(controllerRoot) : [];
  const syncText = controllerRoot ? readRelativeFile(controllerRoot, syncLogPath) : "";
  const backendReviewLogText = controllerRoot ? readRelativeFile(controllerRoot, backendReviewLogPath) : "";
  const frontendReviewLogText = controllerRoot ? readRelativeFile(controllerRoot, frontendReviewLogPath) : "";
  const changedPaths = changedPathsFromStatus(checkpoint && checkpoint.status_before);
  return {
    worktree_path: controllerRoot,
    required_files: [syncLogPath, backendReviewLogPath, frontendReviewLogPath],
    produced_required_files: [syncLogPath, backendReviewLogPath, frontendReviewLogPath].filter((relative) =>
      files.includes(relative),
    ),
    backend_review_done_synced: reviewLogHasDecision(backendReviewLogText, "done") || /backend[\s\S]{0,120}\bdone\b/i.test(syncText),
    frontend_review_done_synced: reviewLogHasDecision(frontendReviewLogText, "done") || /frontend[\s\S]{0,120}\bdone\b/i.test(syncText),
    sync_log_says_no_business_code_merge: /no business[- ]code (?:merge|merged)|did not merge business code|document\/state sync only|document\/state only|documents\/state only/i.test(syncText),
    changed_paths: changedPaths,
    business_code_changed: changedPaths.some(isBusinessCodePath),
  };
}

function collectIntegrationArtifact(controllerRoot, checkpoint) {
  const summaryPath = "docs/stages/stage-1-auth-fixture/integration_summary.md";
  const e2ePath = "docs/stages/stage-1-auth-fixture/integration_e2e.json";
  const files = controllerRoot ? listRelativeFiles(controllerRoot) : [];
  const summaryText = controllerRoot ? readRelativeFile(controllerRoot, summaryPath) : "";
  const e2eText = controllerRoot ? readRelativeFile(controllerRoot, e2ePath) : "";
  const changedPaths = changedPathsFromStatus(checkpoint && checkpoint.status_before);
  return {
    worktree_path: controllerRoot,
    required_files: [summaryPath, e2ePath],
    produced_required_files: [summaryPath, e2ePath].filter((relative) => files.includes(relative)),
    reviewed_backend_done: /backend[\s\S]{0,160}\bdone\b/i.test(summaryText),
    reviewed_frontend_done: /frontend[\s\S]{0,160}\bdone\b/i.test(summaryText),
    mentions_merge_status: /merge status|no-op|already aligned|already-aligned/i.test(summaryText),
    mentions_contract_consistency: /contract consistency|shared contract|api_contract/i.test(summaryText),
    evidence_mentions_e2e: /integration_e2e\.json|validation\/run_e2e\.py|validation\\run_e2e\.py/i.test(summaryText) ||
      /"ok"\s*:\s*true|"failed_count"\s*:\s*0/i.test(e2eText),
    ready_for_owner_handoff: /ready_for_e2e|ready for owner acceptance|owner acceptance handoff|next action[\s\S]{0,120}owner/i.test(summaryText),
    marks_owner_accepted: textMarksOwnerAccepted(summaryText),
    changed_paths: changedPaths,
    business_code_changed: changedPaths.some(isBusinessCodePath),
  };
}

function collectOwnerAcceptanceArtifact(controllerRoot, checkpoint) {
  const recordPath = "docs/stages/stage-1-auth-fixture/owner_acceptance_record.md";
  const htmlPath = "docs/stages/stage-1-auth-fixture/owner_acceptance_summary.html";
  const files = controllerRoot ? listRelativeFiles(controllerRoot) : [];
  const recordText = controllerRoot ? readRelativeFile(controllerRoot, recordPath) : "";
  const changedPaths = changedPathsFromStatus(checkpoint && checkpoint.status_before);
  return {
    worktree_path: controllerRoot,
    required_files: [recordPath],
    optional_files: [htmlPath],
    produced_required_files: [recordPath].filter((relative) => files.includes(relative)),
    produced_optional_files: [htmlPath].filter((relative) => files.includes(relative)),
    owner_decision_accepted: /owner decision\s*:\s*`?accepted`?|accepted|accepts stage-1-auth-fixture/i.test(recordText),
    references_integration_summary: /integration_summary\.md|integration summary/i.test(recordText),
    markdown_is_authoritative: /markdown.*authoritative|durable markdown|record.*authoritative/i.test(recordText),
    changed_paths: changedPaths,
    business_code_changed: changedPaths.some(isBusinessCodePath),
  };
}

function collectBugArtifact(controllerRoot, checkpoint) {
  const recordPath = "docs/stages/stage-1-auth-fixture/bug_triage_noop.md";
  const files = controllerRoot ? listRelativeFiles(controllerRoot) : [];
  const recordText = controllerRoot ? readRelativeFile(controllerRoot, recordPath) : "";
  const changedPaths = changedPathsFromStatus(checkpoint && checkpoint.status_before);
  return {
    worktree_path: controllerRoot,
    required_files: [recordPath],
    produced_required_files: [recordPath].filter((relative) => files.includes(relative)),
    classification_no_active_bug: /no_active_bug|no active (?:defect|bug)|no bug intake/i.test(recordText),
    records_no_scope_or_lane_owner: /affected scope\s*:?\s*`?none`?|responsible owner\s*:?\s*`?none`?|no lane reassignment/i.test(recordText),
    next_action_closeout: /proceed_to_closeout|closeout/i.test(recordText),
    changed_paths: changedPaths,
    business_code_changed: changedPaths.some(isBusinessCodePath),
  };
}

function collectCloseoutArtifact(controllerRoot, checkpoint) {
  const closeoutPath = "docs/stages/stage-1-auth-fixture/stage_closeout.md";
  const baselineRefreshPath = "docs/stages/stage-2-follow-up/baseline_refresh.md";
  const files = controllerRoot ? listRelativeFiles(controllerRoot) : [];
  const closeoutText = controllerRoot ? readRelativeFile(controllerRoot, closeoutPath) : "";
  const baselineText = controllerRoot ? readRelativeFile(controllerRoot, baselineRefreshPath) : "";
  const changedPaths = changedPathsFromStatus(checkpoint && checkpoint.status_before);
  return {
    worktree_path: controllerRoot,
    required_files: [closeoutPath, baselineRefreshPath],
    produced_required_files: [closeoutPath, baselineRefreshPath].filter((relative) => files.includes(relative)),
    closeout_references_acceptance: /owner_acceptance_record\.md|owner acceptance|accepted/i.test(closeoutText),
    closeout_references_integration: /integration_summary\.md|integration summary/i.test(closeoutText),
    records_retention_notes: /worktree|branch|retention/i.test(closeoutText),
    next_stage_baseline_refresh: /accepted baseline|baseline refresh|stage-2-follow-up|next stage/i.test(baselineText),
    changed_paths: changedPaths,
    business_code_changed: changedPaths.some(isBusinessCodePath),
  };
}

function main() {
  const outputPath = argValue("--json", "validation/phase11_installed_flow_fixture.json");
  const runClaude = hasArg("--run-claude");
  const targetArg = argValue("--target-root", null);
  const targetParent = path.resolve(argValue("--target-parent", defaultTargetParent()));
  fs.mkdirSync(targetParent, { recursive: true });
  const targetRoot = targetArg
    ? path.resolve(targetArg)
    : fs.mkdtempSync(path.join(targetParent, "diayn-installed-flow-fixture-"));
  const commandBudget = argValue("--command-budget", "0.20");
  const maxTurns = argValue("--max-turns", "6");
  const allowedTools = argValue("--allowed-tools", "Skill,Read,Write,Edit,MultiEdit,Bash,Glob,Grep,LS");
  const permissionMode = argValue("--permission-mode", "acceptEdits");
  const commands = selectedCommands();
  const checkpointAfterCommands = !hasArg("--no-command-checkpoints");
  const claudeExecutable = resolveClaudeExecutable();
  const errors = [];
  const workflowErrors = [];

  fs.mkdirSync(targetRoot, { recursive: true });
  copyContents(fixtureSource, targetRoot);
  copyContents(packageSource, targetRoot);

  const e2eOutput = path.join(targetRoot, "validation", "phase11_e2e_result.json");
  const e2e = run("python", ["validation/run_e2e.py", "--output", e2eOutput], { cwd: targetRoot });
  if (!e2e.ok) errors.push(`fixture E2E failed: ${e2e.stderr || e2e.stdout}`);

  const gitInit = run("git", ["init", "-b", "main"], { cwd: targetRoot });
  const gitAdd = run("git", ["add", "-A"], { cwd: targetRoot });
  const gitCommit = run(
    "git",
    ["-c", "user.name=DIAYN Fixture", "-c", "user.email=diayn@example.test", "commit", "-m", "Initial fixture baseline"],
    { cwd: targetRoot },
  );

  for (const [name, result] of [
    ["git_init", gitInit],
    ["git_add", gitAdd],
    ["git_commit", gitCommit],
  ]) {
    if (!result.ok) errors.push(`${name} failed: ${result.stderr || result.spawn_error || result.stdout}`);
  }

  const gitStatusAfterBaseline = run("git", ["status", "--short"], { cwd: targetRoot });
  if (!gitStatusAfterBaseline.ok) {
    errors.push(`git_status_after_baseline failed: ${gitStatusAfterBaseline.stderr || gitStatusAfterBaseline.stdout}`);
  } else if (gitStatusAfterBaseline.stdout.trim()) {
    errors.push(`baseline working tree is dirty: ${gitStatusAfterBaseline.stdout.trim()}`);
  }

  const commandDir = path.join(targetRoot, ".claude", "commands");
  const skillDir = path.join(targetRoot, ".claude", "skills");
  const commandFiles = fs.existsSync(commandDir)
    ? fs.readdirSync(commandDir).filter((name) => name.endsWith(".md")).map((name) => name.replace(/\.md$/, "")).sort()
    : [];
  const skillDirs = fs.existsSync(skillDir)
    ? fs.readdirSync(skillDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
    : [];
  for (const name of workflowCommands) {
    if (!commandFiles.includes(name)) errors.push(`installed fixture missing command ${name}`);
    if (!skillDirs.includes(name)) errors.push(`installed fixture missing workflow skill ${name}`);
  }
  if (!skillDirs.includes("idea-refine")) errors.push("installed fixture missing DIAYN-managed dependency skill idea-refine");

  const claudeRuns = [];
  const commandCheckpoints = [];
  const laneWorkerSnapshots = {};
  const laneReviewSnapshots = {};
  let syncSnapshot = null;
  let integrationSnapshot = null;
  let ownerAcceptanceSnapshot = null;
  let bugSnapshot = null;
  let closeoutSnapshot = null;
  if (runClaude) {
    for (const commandName of commands) {
      const commandRoot = commandRootFor(targetRoot, commandName);
      const runResult = runClaudeCommand(commandRoot, commandName, {
        allowedTools,
        permissionMode,
        commandBudget,
        maxTurns,
        claudeExecutable,
      });
      claudeRuns.push(runResult);
      if (checkpointAfterCommands && runResult.exit_code === 0) {
        const checkpoint = checkpointCommandChanges(commandRoot, commandName);
        commandCheckpoints.push(checkpoint);
        if (checkpoint.error) workflowErrors.push(`${runResult.command} checkpoint failed: ${checkpoint.error}`);
        if (commandName === "diayn-backend") {
          laneWorkerSnapshots.backend = collectLaneWorkerArtifact(commandRoot, "backend");
        } else if (commandName === "diayn-frontend") {
          laneWorkerSnapshots.frontend = collectLaneWorkerArtifact(commandRoot, "frontend");
        } else if (commandName === "diayn-review-backend") {
          laneReviewSnapshots.backend = collectLaneReviewArtifact(commandRoot, "backend");
        } else if (commandName === "diayn-review-frontend") {
          laneReviewSnapshots.frontend = collectLaneReviewArtifact(commandRoot, "frontend");
        } else if (commandName === "diayn-sync") {
          syncSnapshot = collectSyncArtifact(commandRoot, checkpoint);
        } else if (commandName === "diayn-integration") {
          integrationSnapshot = collectIntegrationArtifact(commandRoot, checkpoint);
        } else if (commandName === "diayn-html") {
          ownerAcceptanceSnapshot = collectOwnerAcceptanceArtifact(commandRoot, checkpoint);
        } else if (commandName === "diayn-bug") {
          bugSnapshot = collectBugArtifact(commandRoot, checkpoint);
        } else if (commandName === "diayn-new") {
          closeoutSnapshot = collectCloseoutArtifact(commandRoot, checkpoint);
        }
      }
    }
    for (const runResult of claudeRuns) {
      if (runResult.exit_code !== 0) {
        const detail =
          runResult.execution_errors.join("; ") ||
          runResult.stderr_tail ||
          runResult.spawn_error ||
          "no Claude result detail captured";
        workflowErrors.push(`${runResult.command} failed to run through Claude CLI: ${detail}`);
      }
      if (!runResult.workflow_entry_observed) {
        workflowErrors.push(`${runResult.command} did not enter workflow context`);
      }
      if (!runResult.native_workflow_skill_entry_observed) {
        workflowErrors.push(`${runResult.command} did not enter the matching native workflow skill context`);
      }
    }
  }

  const filesAfter = listRelativeFiles(targetRoot);
  const requiredFlowFiles = [
    "AGENTS.md",
    "TODO.md",
    ".diayn/worktree_manifest.md",
    ".diayn/scaffold_version.md",
    "docs/project/project_brief.md",
  ];
  const requiredPlanPatterns = [
    {
      label: "stage_plan",
      display: "docs/stages/<stage-id>/stage_plan.md",
      match: (relative) => /^docs\/stages\/[^/]+\/stage_plan\.md$/.test(relative),
    },
    {
      label: "backend_board",
      display: "docs/lanes/backend/board.md",
      match: (relative) => relative === "docs/lanes/backend/board.md",
    },
    {
      label: "backend_handoff",
      display: "docs/lanes/backend/handoff.md",
      match: (relative) => relative === "docs/lanes/backend/handoff.md",
    },
    {
      label: "frontend_board",
      display: "docs/lanes/frontend/board.md",
      match: (relative) => relative === "docs/lanes/frontend/board.md",
    },
    {
      label: "frontend_handoff",
      display: "docs/lanes/frontend/handoff.md",
      match: (relative) => relative === "docs/lanes/frontend/handoff.md",
    },
    {
      label: "shared_contract",
      display: "docs/shared/<contract>.md",
      match: (relative) => /^docs\/shared\/[^/]+\.md$/.test(relative),
    },
  ];
  const requiredPlanFiles = requiredPlanPatterns.map((item) => item.display);
  const producedRequiredFlowFiles = requiredFlowFiles.filter((relative) => filesAfter.includes(relative));
  const producedRequiredPlanFiles = Array.from(
    new Set(requiredPlanPatterns.flatMap((item) => filesAfter.filter((relative) => item.match(relative)))),
  ).sort();
  const requiredWorktreeFiles = [
    ".diayn/worktree_plan.json",
    ".diayn/session_registry.md",
    "docs/lanes/backend/launch_prompt.md",
    "docs/lanes/frontend/launch_prompt.md",
  ];
  const producedRequiredWorktreeFiles = requiredWorktreeFiles.filter((relative) => filesAfter.includes(relative));
  const worktreePlan = readWorktreePlan(targetRoot, workflowErrors);
  const gitWorktreeList = run("git", ["worktree", "list", "--porcelain"], { cwd: targetRoot });
  const registeredWorktrees = gitWorktreeList.ok ? parseGitWorktreePorcelain(gitWorktreeList.stdout) : [];
  const laneWorkerArtifacts = {};
  const laneReviewArtifacts = {};
  for (const laneName of ["backend", "frontend"]) {
    const lane = worktreePlan && Array.isArray(worktreePlan.lanes)
      ? worktreePlan.lanes.find((item) => item.lane === laneName)
      : null;
    const laneRoot = lane && lane.worktree_path && fs.existsSync(lane.worktree_path) ? lane.worktree_path : null;
    laneWorkerArtifacts[laneName] = laneWorkerSnapshots[laneName] || collectLaneWorkerArtifact(laneRoot, laneName);
    laneReviewArtifacts[laneName] = laneReviewSnapshots[laneName] || collectLaneReviewArtifact(laneRoot, laneName);
  }
  const syncArtifact = syncSnapshot || collectSyncArtifact(targetRoot, null);
  const integrationArtifact = integrationSnapshot || collectIntegrationArtifact(targetRoot, null);
  const ownerAcceptanceArtifact = ownerAcceptanceSnapshot || collectOwnerAcceptanceArtifact(targetRoot, null);
  const bugArtifact = bugSnapshot || collectBugArtifact(targetRoot, null);
  const closeoutArtifact = closeoutSnapshot || collectCloseoutArtifact(targetRoot, null);
  if (runClaude && commands.includes("diayn-init")) {
    const missingInitFiles = requiredFlowFiles.filter((relative) => !filesAfter.includes(relative));
    if (missingInitFiles.length > 0) {
      workflowErrors.push(`/diayn-init did not produce required minimum scaffold files: ${missingInitFiles.join(", ")}`);
    }
  }
  if (runClaude && commands.includes("diayn-plan")) {
    const missingPlanArtifacts = requiredPlanPatterns
      .filter((item) => !filesAfter.some((relative) => item.match(relative)))
      .map((item) => item.display);
    if (missingPlanArtifacts.length > 0) {
      workflowErrors.push(`/diayn-plan did not produce required planning artifacts: ${missingPlanArtifacts.join(", ")}`);
    }
    for (const board of ["docs/lanes/backend/board.md", "docs/lanes/frontend/board.md"]) {
      const boardText = readRelativeFile(targetRoot, board);
      if (boardHasStatus(boardText, "candidate_done")) {
        workflowErrors.push(`/diayn-plan marked planned lane work complete-like in ${board}`);
      }
    }
    for (const relative of filesAfter.filter((item) => item.endsWith(".md") && !item.startsWith(".claude/"))) {
      const text = readRelativeFile(targetRoot, relative);
      if (/\|\s*open\s*\|/i.test(text)) {
        workflowErrors.push(`/diayn-plan left an open OwnerGate-style table entry in ${relative}`);
      }
    }
  }
  if (runClaude && commands.includes("diayn-worktrees")) {
    const missingWorktreeFiles = requiredWorktreeFiles.filter((relative) => !filesAfter.includes(relative));
    if (missingWorktreeFiles.length > 0) {
      workflowErrors.push(`/diayn-worktrees did not produce required worktree files: ${missingWorktreeFiles.join(", ")}`);
    }
    if (!worktreePlan) {
      workflowErrors.push("/diayn-worktrees did not produce parseable .diayn/worktree_plan.json");
    } else {
      if (worktreePlan.execute_requested !== true) {
        workflowErrors.push("/diayn-worktrees did not record authorized execute_requested=true");
      }
      const ownerGates = Array.isArray(worktreePlan.owner_gates) ? worktreePlan.owner_gates : [];
      if (ownerGates.length > 0) {
        workflowErrors.push(`/diayn-worktrees left OwnerGate items open: ${ownerGates.map((item) => item.id || item.question).join(", ")}`);
      }
      for (const laneName of ["backend", "frontend"]) {
        const lane = Array.isArray(worktreePlan.lanes)
          ? worktreePlan.lanes.find((item) => item.lane === laneName)
          : null;
        if (!lane) {
          workflowErrors.push(`/diayn-worktrees missing ${laneName} lane in worktree plan`);
          continue;
        }
        if (lane.applicable !== "yes") {
          workflowErrors.push(`/diayn-worktrees expected ${laneName} lane to be applicable`);
        }
        if (lane.status !== "ready") {
          workflowErrors.push(`/diayn-worktrees did not mark ${laneName} lane ready`);
        }
        if (!lane.worktree_path || !fs.existsSync(lane.worktree_path)) {
          workflowErrors.push(`/diayn-worktrees ${laneName} worktree path does not exist`);
        }
        if (!registeredWorktrees.some((item) => path.resolve(item.path) === path.resolve(lane.worktree_path || ""))) {
          workflowErrors.push(`/diayn-worktrees ${laneName} path is not registered in git worktree list`);
        }
      }
    }
  }
  for (const [commandName, laneName] of [
    ["diayn-backend", "backend"],
    ["diayn-frontend", "frontend"],
  ]) {
    if (!runClaude || !commands.includes(commandName)) continue;
    const artifacts = laneWorkerArtifacts[laneName];
    if (!artifacts || !artifacts.worktree_path) {
      workflowErrors.push(`/${commandName} did not run in a registered ${laneName} worktree`);
      continue;
    }
    const missingLaneArtifacts = [];
    if (!artifacts.has_worklog_artifact) missingLaneArtifacts.push("worklog.md");
    if (!artifacts.has_evidence_artifact) missingLaneArtifacts.push("evidence.md");
    if (missingLaneArtifacts.length > 0) {
      workflowErrors.push(`/${commandName} did not produce required ${laneName} lane artifacts: ${missingLaneArtifacts.join(", ")}`);
    }
    if (!artifacts.board_has_candidate_done) {
      workflowErrors.push(`/${commandName} did not leave a ${laneName} task slice at candidate_done`);
    }
    if (artifacts.board_has_self_approved_done) {
      workflowErrors.push(`/${commandName} self-approved ${laneName} lane work instead of stopping at candidate_done`);
    }
    if (!artifacts.evidence_mentions_e2e) {
      workflowErrors.push(`/${commandName} did not record local E2E evidence in ${laneName} worklog/evidence context`);
    }
  }
  for (const [commandName, laneName] of [
    ["diayn-review-backend", "backend"],
    ["diayn-review-frontend", "frontend"],
  ]) {
    if (!runClaude || !commands.includes(commandName)) continue;
    const artifacts = laneReviewArtifacts[laneName];
    if (!artifacts || !artifacts.worktree_path) {
      workflowErrors.push(`/${commandName} did not run in a registered ${laneName} worktree`);
      continue;
    }
    const missingReviewFiles = artifacts.required_files.filter((relative) => !artifacts.produced_required_files.includes(relative));
    if (missingReviewFiles.length > 0) {
      workflowErrors.push(`/${commandName} did not produce required ${laneName} review files: ${missingReviewFiles.join(", ")}`);
    }
    if (!artifacts.board_has_review_done && !artifacts.review_log_decision_done) {
      workflowErrors.push(`/${commandName} did not record a done review decision for ${laneName}`);
    }
    if (artifacts.board_has_rejected || artifacts.review_log_decision_rejected) {
      workflowErrors.push(`/${commandName} rejected ${laneName} baseline evidence in the happy-path fixture`);
    }
    if (artifacts.board_has_owner_accepted) {
      workflowErrors.push(`/${commandName} marked Owner acceptance, which belongs to the Owner workflow`);
    }
    if (!artifacts.evidence_mentions_e2e) {
      workflowErrors.push(`/${commandName} did not record local E2E review evidence for ${laneName}`);
    }
    if (artifacts.git_status_after_command !== "") {
      workflowErrors.push(`/${commandName} lane worktree was not checkpointed clean`);
    }
  }
  if (runClaude && commands.includes("diayn-sync")) {
    const missingSyncFiles = syncArtifact.required_files.filter((relative) => !syncArtifact.produced_required_files.includes(relative));
    if (missingSyncFiles.length > 0) {
      workflowErrors.push(`/diayn-sync did not produce required sync files: ${missingSyncFiles.join(", ")}`);
    }
    if (!syncArtifact.backend_review_done_synced || !syncArtifact.frontend_review_done_synced) {
      workflowErrors.push("/diayn-sync did not synchronize backend and frontend done review state");
    }
    if (!syncArtifact.sync_log_says_no_business_code_merge) {
      workflowErrors.push("/diayn-sync did not explicitly record that no business code was merged");
    }
    if (syncArtifact.business_code_changed) {
      workflowErrors.push(`/diayn-sync changed business-code paths: ${syncArtifact.changed_paths.filter(isBusinessCodePath).join(", ")}`);
    }
  }
  if (runClaude && commands.includes("diayn-integration")) {
    const missingIntegrationFiles = integrationArtifact.required_files.filter((relative) => !integrationArtifact.produced_required_files.includes(relative));
    if (missingIntegrationFiles.length > 0) {
      workflowErrors.push(`/diayn-integration did not produce required integration files: ${missingIntegrationFiles.join(", ")}`);
    }
    if (!integrationArtifact.reviewed_backend_done || !integrationArtifact.reviewed_frontend_done) {
      workflowErrors.push("/diayn-integration did not record both reviewed lanes as done");
    }
    if (!integrationArtifact.mentions_merge_status) {
      workflowErrors.push("/diayn-integration did not record merge status");
    }
    if (!integrationArtifact.mentions_contract_consistency) {
      workflowErrors.push("/diayn-integration did not record contract consistency");
    }
    if (!integrationArtifact.evidence_mentions_e2e) {
      workflowErrors.push("/diayn-integration did not record integration E2E evidence");
    }
    if (!integrationArtifact.ready_for_owner_handoff) {
      workflowErrors.push("/diayn-integration did not prepare an Owner acceptance handoff");
    }
    if (integrationArtifact.marks_owner_accepted) {
      workflowErrors.push("/diayn-integration marked Owner acceptance, which belongs to the Owner");
    }
    if (integrationArtifact.business_code_changed) {
      workflowErrors.push(`/diayn-integration changed business-code paths in this no-op baseline fixture: ${integrationArtifact.changed_paths.filter(isBusinessCodePath).join(", ")}`);
    }
  }
  if (runClaude && commands.includes("diayn-html")) {
    const missingOwnerFiles = ownerAcceptanceArtifact.required_files.filter((relative) => !ownerAcceptanceArtifact.produced_required_files.includes(relative));
    if (missingOwnerFiles.length > 0) {
      workflowErrors.push(`/diayn-html did not produce required Owner acceptance files: ${missingOwnerFiles.join(", ")}`);
    }
    if (!ownerAcceptanceArtifact.owner_decision_accepted) {
      workflowErrors.push("/diayn-html did not record the Owner acceptance decision");
    }
    if (!ownerAcceptanceArtifact.references_integration_summary) {
      workflowErrors.push("/diayn-html Owner acceptance record does not reference integration evidence");
    }
    if (!ownerAcceptanceArtifact.markdown_is_authoritative) {
      workflowErrors.push("/diayn-html did not keep Markdown as the authoritative acceptance record");
    }
    if (ownerAcceptanceArtifact.business_code_changed) {
      workflowErrors.push(`/diayn-html changed business-code paths: ${ownerAcceptanceArtifact.changed_paths.filter(isBusinessCodePath).join(", ")}`);
    }
  }
  if (runClaude && commands.includes("diayn-bug")) {
    const missingBugFiles = bugArtifact.required_files.filter((relative) => !bugArtifact.produced_required_files.includes(relative));
    if (missingBugFiles.length > 0) {
      workflowErrors.push(`/diayn-bug did not produce required bug side-scenario files: ${missingBugFiles.join(", ")}`);
    }
    if (!bugArtifact.classification_no_active_bug) {
      workflowErrors.push("/diayn-bug did not record no_active_bug classification");
    }
    if (!bugArtifact.records_no_scope_or_lane_owner) {
      workflowErrors.push("/diayn-bug did not record that no scope/lane owner is affected");
    }
    if (!bugArtifact.next_action_closeout) {
      workflowErrors.push("/diayn-bug did not route next action to closeout");
    }
    if (bugArtifact.business_code_changed) {
      workflowErrors.push(`/diayn-bug changed business-code paths: ${bugArtifact.changed_paths.filter(isBusinessCodePath).join(", ")}`);
    }
  }
  if (runClaude && commands.includes("diayn-new")) {
    const missingCloseoutFiles = closeoutArtifact.required_files.filter((relative) => !closeoutArtifact.produced_required_files.includes(relative));
    if (missingCloseoutFiles.length > 0) {
      workflowErrors.push(`/diayn-new did not produce required closeout/next-stage files: ${missingCloseoutFiles.join(", ")}`);
    }
    if (!closeoutArtifact.closeout_references_acceptance) {
      workflowErrors.push("/diayn-new closeout did not reference Owner acceptance");
    }
    if (!closeoutArtifact.closeout_references_integration) {
      workflowErrors.push("/diayn-new closeout did not reference integration evidence");
    }
    if (!closeoutArtifact.records_retention_notes) {
      workflowErrors.push("/diayn-new closeout did not record worktree/branch retention notes");
    }
    if (!closeoutArtifact.next_stage_baseline_refresh) {
      workflowErrors.push("/diayn-new did not record next-stage baseline refresh");
    }
    if (closeoutArtifact.business_code_changed) {
      workflowErrors.push(`/diayn-new changed business-code paths: ${closeoutArtifact.changed_paths.filter(isBusinessCodePath).join(", ")}`);
    }
  }
  const allSelectedCommandsEntered = claudeRuns.length > 0 && claudeRuns.every((item) => item.workflow_entry_observed);
  const allSelectedCommandsUsedNativeWorkflowSkill =
    claudeRuns.length > 0 &&
    claudeRuns.every((item) => item.native_workflow_skill_entry_observed);
  const requiredInstalledFlowCommands = [
    "diayn-init",
    "diayn-plan",
    "diayn-worktrees",
    "diayn-backend",
    "diayn-frontend",
    "diayn-review-backend",
    "diayn-review-frontend",
    "diayn-sync",
    "diayn-integration",
    "diayn-html",
    "diayn-bug",
    "diayn-new",
  ];
  const requiredInstalledFlowCommandsAttempted = runClaude &&
    requiredInstalledFlowCommands.every((name) => commands.includes(name));
  const fullInstalledFlowComplete = Boolean(
    runClaude &&
      requiredInstalledFlowCommandsAttempted &&
      allSelectedCommandsEntered &&
      allSelectedCommandsUsedNativeWorkflowSkill &&
      workflowErrors.length === 0 &&
      requiredFlowFiles.every((relative) => filesAfter.includes(relative)) &&
      ownerAcceptanceArtifact.owner_decision_accepted === true &&
      bugArtifact.classification_no_active_bug === true &&
      closeoutArtifact.closeout_references_acceptance === true &&
      closeoutArtifact.next_stage_baseline_refresh === true,
  );

  const payload = {
    schema: "diayn.phase11.installed_flow_fixture.v1",
    date: "2026-06-01",
    ok: errors.length === 0,
    installed_flow_complete: fullInstalledFlowComplete,
    target_root: targetRoot,
    source_fixture: path.relative(repoRoot, fixtureSource).replace(/\\/g, "/"),
    package_source: path.relative(repoRoot, packageSource).replace(/\\/g, "/"),
    install_checks: {
      command_count: commandFiles.filter((name) => name.startsWith("diayn-")).length,
      workflow_skill_count: workflowCommands.filter((name) => skillDirs.includes(name)).length,
      total_skill_count: skillDirs.length,
      dependency_skill_idea_refine_present: skillDirs.includes("idea-refine"),
    },
    git: {
      init_ok: gitInit.ok,
      add_ok: gitAdd.ok,
      commit_ok: gitCommit.ok,
      clean_after_baseline: gitStatusAfterBaseline.ok && !gitStatusAfterBaseline.stdout.trim(),
      status_after_baseline: gitStatusAfterBaseline.stdout,
    },
    local_e2e: {
      ok: e2e.ok,
      output: path.relative(targetRoot, e2eOutput).replace(/\\/g, "/"),
    },
    claude: {
      run_requested: runClaude,
      allowed_tools: allowedTools,
      permission_mode: permissionMode,
      max_turns: Number(maxTurns),
      command_budget_usd: Number(commandBudget),
      executable: claudeExecutable.command === "claude" ? "claude" : path.basename(claudeExecutable.command),
      executable_shell: claudeExecutable.shell,
      commands_requested: commands.map((name) => `/${name}`),
      all_selected_commands_entered_workflow: allSelectedCommandsEntered,
      all_selected_commands_used_native_workflow_skill: allSelectedCommandsUsedNativeWorkflowSkill,
      command_execution_ok: runClaude ? workflowErrors.length === 0 : null,
      checkpoint_after_commands: checkpointAfterCommands,
      command_checkpoints: commandCheckpoints,
      runs: claudeRuns,
    },
    flow_artifacts: {
      required_minimum_files: requiredFlowFiles,
      produced_required_minimum_files: producedRequiredFlowFiles,
      required_plan_files: requiredPlanFiles,
      produced_required_plan_files: producedRequiredPlanFiles,
      required_worktree_files: requiredWorktreeFiles,
      produced_required_worktree_files: producedRequiredWorktreeFiles,
      worktree_plan: worktreePlan
        ? {
            execute_requested: worktreePlan.execute_requested,
            next_action: worktreePlan.next_action,
            lanes: Array.isArray(worktreePlan.lanes)
              ? worktreePlan.lanes.map((lane) => ({
                  lane: lane.lane,
                  applicable: lane.applicable,
                  status: lane.status,
                  branch: lane.branch,
                  worktree_path: lane.worktree_path,
                }))
              : [],
            owner_gate_count: Array.isArray(worktreePlan.owner_gates) ? worktreePlan.owner_gates.length : null,
          }
        : null,
      lane_workers: laneWorkerArtifacts,
      lane_reviews: laneReviewArtifacts,
      sync: syncArtifact,
      integration: integrationArtifact,
      owner_acceptance: ownerAcceptanceArtifact,
      bug_triage: bugArtifact,
      closeout: closeoutArtifact,
      git_worktree_count: registeredWorktrees.length,
      file_count_after_run: filesAfter.length,
    },
    limits: {
      codex_desktop: "not_run_access_denied_in_current_environment",
      full_installed_flow_claim:
        fullInstalledFlowComplete === true
          ? "complete_for_claude_project_local_fixture"
          : "not_complete_do_not_claim_alpha",
    },
    errors,
    workflow_errors: workflowErrors,
  };

  const fullOutput = path.resolve(repoRoot, outputPath);
  ensureInsideRepo(fullOutput);
  fs.mkdirSync(path.dirname(fullOutput), { recursive: true });
  fs.writeFileSync(fullOutput, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(payload, null, 2));
  if (errors.length > 0) process.exitCode = 1;
}

main();
