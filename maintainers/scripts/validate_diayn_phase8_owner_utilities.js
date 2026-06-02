#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const pluginRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need");

function hash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function compare(errors, rootFile, pluginFile, label) {
  if (!fs.existsSync(rootFile)) errors.push(`missing root ${label}`);
  if (!fs.existsSync(pluginFile)) errors.push(`missing plugin ${label}`);
  if (fs.existsSync(rootFile) && fs.existsSync(pluginFile) && hash(rootFile) !== hash(pluginFile)) {
    errors.push(`plugin copy differs for ${label}`);
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
  const htmlRoot = path.join(repoRoot, "skills", "diayn-html");
  const htmlPlugin = path.join(pluginRoot, "skills", "diayn-html");
  const initRoot = path.join(repoRoot, "skills", "diayn-init");
  const initPlugin = path.join(pluginRoot, "skills", "diayn-init");

  for (const relative of [
    "SKILL.md",
    "scripts/diayn_html_generator.py",
    "scripts/cleanup_plan.py",
    "assets/owner/owner_decision_record.md",
    "assets/owner/owner_acceptance_record.md",
    "assets/owner/cleanup_delete_plan.md",
  ]) {
    compare(errors, path.join(htmlRoot, relative), path.join(htmlPlugin, relative), `diayn-html/${relative}`);
  }
  compare(
    errors,
    path.join(initRoot, "assets", "scaffold", ".diayn", "network_policy.md"),
    path.join(initPlugin, "assets", "scaffold", ".diayn", "network_policy.md"),
    "diayn-init/assets/scaffold/.diayn/network_policy.md",
  );

  const htmlSkill = fs.readFileSync(path.join(htmlRoot, "SKILL.md"), "utf8");
  for (const needle of ["diayn_html_generator.py", "cleanup_plan.py", "Markdown", "dry-run"]) {
    if (!htmlSkill.includes(needle)) errors.push(`diayn-html SKILL.md missing ${needle}`);
  }
  const initSkill = fs.readFileSync(path.join(initRoot, "SKILL.md"), "utf8");
  if (!initSkill.includes(".diayn/network_policy.md")) errors.push("diayn-init must generate network_policy.md");

  const privacyPolicy = path.join(repoRoot, "docs", "meta", "diayn_privacy_network_policy.md");
  if (!fs.existsSync(privacyPolicy)) errors.push("missing docs/meta/diayn_privacy_network_policy.md");
  else {
    const privacy = fs.readFileSync(privacyPolicy, "utf8");
    for (const needle of ["Do not upload", "Do not write secrets", "OwnerGate", ".diayn/network_policy.md"]) {
      if (!privacy.includes(needle)) errors.push(`privacy policy missing ${needle}`);
    }
  }

  for (const relative of ["SKILL.md", "scripts/scaffold_upgrade_audit.py", "references/scaffold-upgrade-dry-run.md"]) {
    compare(
      errors,
      path.join(repoRoot, "skills", "update-diayn-scaffold", relative),
      path.join(pluginRoot, "internal-role-skills", "update-diayn-scaffold", relative),
      `internal-role-skills/update-diayn-scaffold/${relative}`,
    );
  }

  const htmlAid = path.join(repoRoot, "validation", "phase8_owner_decision_aid.html");
  if (!fs.existsSync(htmlAid)) errors.push("missing phase8 Owner HTML aid");
  else {
    const html = fs.readFileSync(htmlAid, "utf8");
    for (const needle of ["DIAYN Owner Decision Aid", "Should the next stage reuse clean lane worktrees", "Record Keeping"]) {
      if (!html.includes(needle)) errors.push(`phase8 Owner HTML aid missing ${needle}`);
    }
  }

  const cleanup = readJson(errors, "validation/phase8_cleanup_plan.json");
  if (cleanup && (cleanup.schema !== "diayn.cleanup_plan.v1" || cleanup.automatic_delete !== false)) {
    errors.push("cleanup plan must be dry-run with automatic_delete=false");
  }

  const migration = readJson(errors, "validation/phase8_scaffold_upgrade_audit.json");
  if (migration && migration.mode !== "dry-run") errors.push("scaffold upgrade audit must be dry-run");
  if (migration && !String(migration.safety).includes("no apply mode")) errors.push("scaffold upgrade audit must state no apply mode");

  const vendorReport = path.join(repoRoot, "maintainers", "upstream-agent-skills", "latest_dry_run_report.md");
  if (!fs.existsSync(vendorReport)) errors.push("missing vendored agent-skills upstream-sync report");

  const result = {
    ok: errors.length === 0,
    owner_html_aid: fs.existsSync(htmlAid),
    cleanup_plan_mode: cleanup && cleanup.mode,
    cleanup_automatic_delete: cleanup && cleanup.automatic_delete,
    scaffold_upgrade_mode: migration && migration.mode,
    vendor_report_present: fs.existsSync(vendorReport),
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
