#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const sourceCommands = path.join(repoRoot, "plugins", "docs-is-all-you-need", ".claude", "commands");
const targetCommands = path.join(repoRoot, ".claude", "commands");

function ensureInsideRepo(target) {
  const resolved = path.resolve(target);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`refusing to write outside repo: ${target}`);
  }
}

function listCommandFiles(root) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.startsWith("diayn-") && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
}

function main() {
  ensureInsideRepo(targetCommands);
  if (!fs.existsSync(sourceCommands)) {
    throw new Error(`missing source commands: ${path.relative(repoRoot, sourceCommands)}`);
  }

  fs.rmSync(targetCommands, { recursive: true, force: true });
  fs.mkdirSync(targetCommands, { recursive: true });

  for (const file of listCommandFiles(sourceCommands)) {
    fs.copyFileSync(path.join(sourceCommands, file), path.join(targetCommands, file));
  }

  const copied = listCommandFiles(targetCommands);
  console.log(
    JSON.stringify(
      {
        ok: copied.length === 12,
        source: path.relative(repoRoot, sourceCommands).replace(/\\/g, "/"),
        target: path.relative(repoRoot, targetCommands).replace(/\\/g, "/"),
        command_count: copied.length,
        commands: copied,
      },
      null,
      2,
    ),
  );
  if (copied.length !== 12) process.exitCode = 1;
}

main();
