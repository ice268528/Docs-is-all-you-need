#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const vendorRoot = path.join(repoRoot, "third_party", "agent-skills");
const dependencyRoot = path.join(repoRoot, "plugins", "docs-is-all-you-need", "dependency-skills", "agent-skills");
const manifestPath = path.join(repoRoot, "plugins", "docs-is-all-you-need", "dependency-skills", "manifest.json");
const routingMapPath = path.join(repoRoot, "skills", "diayn-skill-router", "references", "upstream-routing-map.md");
const routerSkillPath = path.join(repoRoot, "skills", "diayn-skill-router", "SKILL.md");
const pluginRouterSkillPath = path.join(
  repoRoot,
  "plugins",
  "docs-is-all-you-need",
  "internal-role-skills",
  "diayn-skill-router",
  "SKILL.md"
);
const pluginRoutingMapPath = path.join(
  repoRoot,
  "plugins",
  "docs-is-all-you-need",
  "internal-role-skills",
  "diayn-skill-router",
  "references",
  "upstream-routing-map.md"
);

function listSkillNames(root) {
  return fs
    .readdirSync(path.join(root, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, "skills", entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort();
}

function listFiles(root) {
  const result = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile()) result.push(full);
    }
  }
  visit(root);
  return result.sort();
}

function treeHash(root) {
  const hash = crypto.createHash("sha256");
  for (const file of listFiles(root)) {
    hash.update(path.relative(root, file).replace(/\\/g, "/"));
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function treeSizeBytes(root) {
  return listFiles(root).reduce((total, file) => total + fs.statSync(file).size, 0);
}

function sameFile(a, b) {
  return fs.readFileSync(a, "utf8") === fs.readFileSync(b, "utf8");
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const vendorSkills = listSkillNames(vendorRoot);
  const dependencySkills = listSkillNames(dependencyRoot);
  const manifestSkills = [...manifest.skills].sort();
  const routingMap = fs.readFileSync(routingMapPath, "utf8");
  const routerSkill = fs.readFileSync(routerSkillPath, "utf8");

  if (manifest.managed_by !== "DIAYN") errors.push("dependency manifest must be managed by DIAYN");
  if (manifest.public_diayn_command_surface !== false) errors.push("dependency skills must not be public DIAYN commands");
  if (manifest.source_commit !== "250ffaa") errors.push("dependency manifest source_commit must match locked snapshot 250ffaa");
  if (!manifest.packaged_references_path) errors.push("dependency manifest must include packaged_references_path");
  if (!fs.existsSync(path.join(vendorRoot, "LICENSE"))) errors.push("vendor LICENSE missing");
  if (!fs.existsSync(path.join(dependencyRoot, "LICENSE"))) errors.push("packaged dependency LICENSE missing");
  if (!fs.existsSync(path.join(vendorRoot, "references"))) errors.push("vendor references missing");
  if (!fs.existsSync(path.join(dependencyRoot, "references"))) errors.push("packaged dependency references missing");
  if (JSON.stringify(vendorSkills) !== JSON.stringify(dependencySkills)) errors.push("packaged dependency skill list differs from vendor skill list");
  if (JSON.stringify(vendorSkills) !== JSON.stringify(manifestSkills)) errors.push("dependency manifest skill list differs from vendor skill list");

  const referenceHashes = {
    vendor: fs.existsSync(path.join(vendorRoot, "references")) ? treeHash(path.join(vendorRoot, "references")) : null,
    packaged_dependency: fs.existsSync(path.join(dependencyRoot, "references")) ? treeHash(path.join(dependencyRoot, "references")) : null,
  };
  if (referenceHashes.vendor !== referenceHashes.packaged_dependency) {
    errors.push("packaged dependency references differ from vendor references");
  }

  const hashes = [];
  for (const name of vendorSkills) {
    const vendorHash = treeHash(path.join(vendorRoot, "skills", name));
    const dependencyHash = treeHash(path.join(dependencyRoot, "skills", name));
    hashes.push({ name, vendor_hash: vendorHash, packaged_hash: dependencyHash, match: vendorHash === dependencyHash });
    if (vendorHash !== dependencyHash) errors.push(`dependency payload differs from vendor skill ${name}`);
    if (!routingMap.includes(`| \`${name}\` |`)) errors.push(`routing map missing full coverage row for ${name}`);
  }

  if (!routerSkill.includes("platform-native nested skill invocation")) {
    errors.push("router skill must require platform-native nested skill invocation");
  }
  if (!routerSkill.includes("does not count as real third-party skill invocation")) {
    errors.push("router skill must distinguish fallback direct reading from real invocation");
  }
  if (!sameFile(routerSkillPath, pluginRouterSkillPath)) errors.push("plugin internal router skill copy is stale");
  if (!sameFile(routingMapPath, pluginRoutingMapPath)) errors.push("plugin internal routing map copy is stale");

  const vendorReportPath = path.join(repoRoot, "maintainers", "upstream-agent-skills", "latest_dry_run_report.md");
  if (!fs.existsSync(vendorReportPath)) {
    errors.push("manual upstream-sync dry-run report is missing");
  }

  const result = {
    ok: errors.length === 0,
    vendor_skill_count: vendorSkills.length,
    packaged_dependency_skill_count: dependencySkills.length,
    manifest_skill_count: manifestSkills.length,
    source_commit: manifest.source_commit,
    package_size_bytes: {
      vendor_skills: treeSizeBytes(path.join(vendorRoot, "skills")),
      vendor_references: treeSizeBytes(path.join(vendorRoot, "references")),
      packaged_dependency_skills: treeSizeBytes(path.join(dependencyRoot, "skills")),
      packaged_dependency_references: treeSizeBytes(path.join(dependencyRoot, "references")),
    },
    manual_upstream_update_report_present: fs.existsSync(vendorReportPath),
    license_present: {
      vendor: fs.existsSync(path.join(vendorRoot, "LICENSE")),
      packaged_dependency: fs.existsSync(path.join(dependencyRoot, "LICENSE")),
    },
    reference_hashes: referenceHashes,
    hashes,
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
