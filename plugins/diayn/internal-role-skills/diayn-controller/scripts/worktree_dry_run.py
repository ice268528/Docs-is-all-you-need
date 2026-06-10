#!/usr/bin/env python3
"""Generate DIAYN worktree dry-run plans.

The helper never runs git worktree commands and never creates directories. It
prints proposed commands, path collision status, and local identity content.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import subprocess
from pathlib import Path
from typing import Any


ROLE_BY_LANE = {
    "backend": "Backend Session",
    "frontend": "Frontend Session",
}


COMMAND_BY_LANE = {
    "backend": "/diayn-backend",
    "frontend": "/diayn-frontend",
}


def safe_token(value: str, label: str) -> str:
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]*", value):
        raise ValueError(f"{label} must use letters, numbers, dot, underscore, or hyphen and start with a letter or number: {value!r}")
    return value


def quote_arg(value: str) -> str:
    return '"' + value.replace('"', '\\"') + '"'


def detect_base(repo_root: Path) -> tuple[str, str | None]:
    try:
        result = subprocess.run(
            ["git", "-C", str(repo_root), "rev-parse", "--abbrev-ref", "HEAD"],
            check=True,
            capture_output=True,
            text=True,
        )
        branch = result.stdout.strip()
        return branch or "HEAD", None
    except Exception as exc:
        return "HEAD", f"Could not inspect current git branch; using HEAD fallback. Reason: {exc}"


def branch_name(project_slug: str, lane: str, stage: str | None) -> str:
    parts = ["diayn", project_slug, lane]
    if stage:
        parts.append(re.sub(r"[^A-Za-z0-9_.-]+", "-", stage).strip("-") or "stage")
    return "/".join(parts)


def identity_content(project_slug: str, lane: str, rel_path: str, command: str) -> str:
    role = ROLE_BY_LANE.get(lane, f"{lane.title()} Session")
    now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()
    return f"""---
diayn_session_identity_version: 0.1
project_slug: "{project_slug}"
declared_role: "{role}"
current_lane: "{lane}"
expected_worktree_path: "{rel_path}"
allowed_command: "{command}"
allowed_workflow: "one lane-local task slice, then stop for review"
last_verified_time: "{now}"
---

# Local Session Identity

> Local-only file. Copy to `.diayn/local/session_identity.md` inside this worktree. Do not commit it.

## Identity

| Field | Value |
| --- | --- |
| Declared role | `{role}` |
| Current lane | `{lane}` |
| Expected worktree path | `{rel_path}` |
| Allowed command | `{command}` |
| Allowed workflow | `one lane-local task slice, then stop for review` |
| Last verified time | `{now}` |

This is a soft guard, not a security sandbox.
"""


def plan(args: argparse.Namespace) -> dict[str, Any]:
    project_slug = safe_token(args.project_slug, "project_slug")
    repo_root = Path(args.repo_root).resolve()
    warnings: list[str] = []
    if args.base:
        base = args.base
    else:
        base, warning = detect_base(repo_root)
        if warning:
            warnings.append(warning)
    stage = args.stage
    lanes = [safe_token(lane, "lane") for lane in args.lanes]
    root_template = args.worktree_root or f"../worktrees/{project_slug}"
    root_template = root_template.replace("<project_slug>", project_slug)

    entries = []
    for lane in lanes:
        rel_path = f"{root_template.rstrip('/')}/{lane}".replace("\\", "/")
        abs_path = (repo_root / rel_path).resolve()
        command = COMMAND_BY_LANE.get(lane, f"/diayn-{lane}")
        branch = branch_name(project_slug, lane, stage)
        git_command = " ".join(
            [
                "git",
                "-C",
                quote_arg(str(repo_root)),
                "worktree",
                "add",
                "-b",
                quote_arg(branch),
                quote_arg(rel_path),
                quote_arg(base),
            ]
        )
        entries.append(
            {
                "lane": lane,
                "role": ROLE_BY_LANE.get(lane, f"{lane.title()} Session"),
                "command": command,
                "relative_path": rel_path,
                "absolute_path": str(abs_path),
                "path_exists": abs_path.exists(),
                "branch": branch,
                "base": base,
                "dry_run_command": git_command,
                "local_identity": identity_content(project_slug, lane, rel_path, command),
            }
        )

    return {
        "result": "pass",
        "mode": "dry-run",
        "repo_root": str(repo_root),
        "project_slug": project_slug,
        "worktree_root": root_template,
        "lanes": entries,
        "warnings": warnings,
        "safety": "No git worktree command was executed and no directory was created.",
    }


def print_markdown(data: dict[str, Any]) -> None:
    print("# DIAYN Worktree Dry-Run")
    print()
    print("Dry run only: no git command was executed and no directory was created.")
    print()
    print(f"- Project slug: `{data['project_slug']}`")
    print(f"- Repo root: `{data['repo_root']}`")
    print(f"- Worktree root: `{data['worktree_root']}`")
    for warning in data.get("warnings", []):
        print(f"- Warning: {warning}")
    print()
    for entry in data["lanes"]:
        collision = "yes" if entry["path_exists"] else "no"
        print(f"## {entry['lane']}")
        print()
        print(f"- Role: `{entry['role']}`")
        print(f"- Command: `{entry['command']}`")
        print(f"- Expected path: `{entry['relative_path']}`")
        print(f"- Absolute path: `{entry['absolute_path']}`")
        print(f"- Path exists already: `{collision}`")
        print(f"- Proposed branch: `{entry['branch']}`")
        print()
        print("Generated command, not executed:")
        print()
        print("```text")
        print(entry["dry_run_command"])
        print("```")
        print()
        print("Generated `.diayn/local/session_identity.md` content:")
        print()
        print("```markdown")
        print(entry["local_identity"].rstrip())
        print("```")
        print()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate DIAYN worktree dry-run commands and local identity content.")
    parser.add_argument("--project-slug", required=True, help="Owner-confirmed project_slug.")
    parser.add_argument("--repo-root", default=".", help="Controller repository root.")
    parser.add_argument("--lanes", nargs="+", default=["backend", "frontend"], help="Lanes to plan; defaults to backend frontend.")
    parser.add_argument("--worktree-root", help="Root pattern; defaults to ../worktrees/<project_slug>.")
    parser.add_argument("--base", help="Base branch or commit; defaults to current git branch or HEAD.")
    parser.add_argument("--stage", help="Optional stage/batch identifier for branch names only, never path names.")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    data = plan(args)
    if args.format == "json":
        print(json.dumps(data, ensure_ascii=False, indent=2))
    else:
        print_markdown(data)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
