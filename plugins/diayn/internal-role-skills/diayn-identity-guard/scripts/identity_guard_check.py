#!/usr/bin/env python3
"""Soft DIAYN session identity checker.

This script reports pass/warn/fail and corrective next steps. It is not a
security sandbox and never edits identity or manifest files.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any


COMMANDS: dict[str, dict[str, Any]] = {
    "/diayn-init": {"roles": ["Controller Session"], "lane": None, "location": "controller"},
    "/diayn-plan": {"roles": ["Controller Session"], "lane": None, "location": "controller"},
    "/diayn-worktrees": {"roles": ["Controller Session"], "lane": None, "location": "controller"},
    "/diayn-backend": {"roles": ["Backend Session"], "lane": "backend", "location": "lane"},
    "/diayn-frontend": {"roles": ["Frontend Session"], "lane": "frontend", "location": "lane"},
    "/diayn-review-backend": {"roles": ["Backend Review Session"], "lane": "backend", "location": "lane_or_review"},
    "/diayn-review-frontend": {"roles": ["Frontend Review Session"], "lane": "frontend", "location": "lane_or_review"},
    "/diayn-sync": {"roles": ["Controller Session"], "lane": None, "location": "controller"},
    "/diayn-integration": {"roles": ["Controller Integration Review"], "lane": None, "location": "controller"},
    "/diayn-bug": {"roles": ["Controller Session"], "lane": None, "location": "controller"},
    "/diayn-new": {"roles": ["Controller Session"], "lane": None, "location": "controller"},
    "/diayn-html": {"roles": ["Controller Session", "Owner-support session"], "lane": None, "location": "controller_or_approved"},
}


def normalize(value: str | None) -> str:
    return (value or "").strip().strip('"').strip("'")


def read_frontmatter(path: Path) -> dict[str, str]:
    if not path.exists() or not path.is_file():
        return {}
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        return {}
    result: dict[str, str] = {}
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        result[key.strip()] = normalize(value)
    return result


def parse_table_row(line: str) -> list[str]:
    return [cell.strip().strip("`") for cell in line.strip().strip("|").split("|")]


def read_manifest(path: Path) -> dict[str, dict[str, str]]:
    if not path.exists() or not path.is_file():
        return {}
    entries: dict[str, dict[str, str]] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.startswith("|"):
            continue
        cells = parse_table_row(line)
        if len(cells) < 7:
            continue
        lane = cells[0]
        if lane.lower() in {"lane", "---"} or lane.startswith("---"):
            continue
        if lane.startswith("<"):
            continue
        entries[lane] = {
            "expected_path": cells[1],
            "branch": cells[2],
            "baseline": cells[3],
            "stage": cells[4],
            "state": cells[5],
            "startup": cells[6],
        }
    return entries


def infer_lane_from_path(path: Path) -> str:
    parts = [part.lower() for part in path.parts]
    if "backend" in parts or path.name.lower() == "backend":
        return "backend"
    if "frontend" in parts or path.name.lower() == "frontend":
        return "frontend"
    return "unknown"


def choose_local_identity(repo_root: Path, cwd: Path, explicit: str | None) -> Path:
    if explicit:
        return Path(explicit)
    cwd_identity = cwd / ".diayn" / "local" / "session_identity.md"
    if cwd_identity.exists():
        return cwd_identity
    return repo_root / ".diayn" / "local" / "session_identity.md"


def resolve_expected_path(repo_root: Path, manifest: dict[str, dict[str, str]], lane: str | None) -> str:
    if not lane:
        return str(repo_root)
    if lane in manifest:
        return manifest[lane]["expected_path"]
    return f"../worktrees/<project_slug>/{lane}"


def path_matches(cwd: Path, repo_root: Path, expected_path: str) -> bool:
    if expected_path in {"Controller repository path", "controller"}:
        return cwd.resolve() == repo_root.resolve()
    if "<" in expected_path and ">" in expected_path:
        return False
    expected = Path(expected_path)
    if not expected.is_absolute():
        expected = repo_root / expected
    try:
        return cwd.resolve() == expected.resolve()
    except OSError:
        return False


def evaluate(args: argparse.Namespace) -> dict[str, Any]:
    command = args.command
    if command not in COMMANDS:
        return {
            "result": "fail",
            "requested_command": command,
            "reasons": [f"Unknown DIAYN command: {command}"],
            "next_step": "Use a canonical /diayn-* command from docs/meta/diayn_command_reference.md.",
            "sources_used": [],
        }

    repo_root = Path(args.repo_root).resolve()
    cwd = Path(args.cwd or os.getcwd()).resolve()
    local_identity_path = choose_local_identity(repo_root, cwd, args.local_identity)
    manifest_path = Path(args.manifest) if args.manifest else repo_root / ".diayn" / "worktree_manifest.md"
    local_identity = read_frontmatter(local_identity_path)
    manifest = read_manifest(manifest_path)
    expected = COMMANDS[command]
    expected_lane = expected["lane"]
    expected_roles = expected["roles"]
    expected_path = resolve_expected_path(repo_root, manifest, expected_lane)

    detected_role = normalize(args.role) or local_identity.get("declared_role") or "unknown"
    detected_lane = normalize(args.lane) or local_identity.get("current_lane") or infer_lane_from_path(cwd)
    detected_command = local_identity.get("allowed_command") or "unknown"

    reasons: list[str] = []
    warnings: list[str] = []
    sources = [
        f"requested command: {command}",
        f"cwd: {cwd}",
        f"repo root: {repo_root}",
    ]
    if manifest_path.exists():
        sources.append(f"manifest: {manifest_path}")
    else:
        warnings.append(f"Manifest not found: {manifest_path}")
    if local_identity_path.exists():
        sources.append(f"local identity: {local_identity_path}")
    else:
        sources.append(f"local identity: missing at {local_identity_path}")

    if command == "/diayn-init" and not local_identity_path.exists() and cwd == repo_root:
        warnings.append("No local identity file found; /diayn-init may be the first Controller initialization.")
    elif expected["location"] in {"lane", "lane_or_review"} and not local_identity_path.exists():
        reasons.append("Lane or review command requires a matching .diayn/local/session_identity.md.")

    if detected_role != "unknown" and detected_role not in expected_roles:
        reasons.append(f"Detected role '{detected_role}' does not match expected role(s): {', '.join(expected_roles)}.")
    elif detected_role == "unknown" and command != "/diayn-init":
        warnings.append("Detected role is unknown.")

    if expected_lane and detected_lane != expected_lane:
        reasons.append(f"Detected lane '{detected_lane}' does not match expected lane '{expected_lane}'.")

    if detected_command not in {"unknown", command}:
        reasons.append(f"Local identity allows '{detected_command}', not requested command '{command}'.")

    location = expected["location"]
    if location == "controller" and cwd != repo_root:
        reasons.append("Controller-owned command is not being run from the Controller repository root.")
    elif location == "lane" and not path_matches(cwd, repo_root, expected_path):
        reasons.append(f"Current path does not match expected lane path '{expected_path}'.")
    elif location == "lane_or_review" and not path_matches(cwd, repo_root, expected_path):
        warnings.append(f"Review path does not match manifest lane path '{expected_path}'; continue only if this is an authorized review path.")

    result = "fail" if reasons else ("warn" if warnings else "pass")
    next_step = "Continue with the requested DIAYN workflow."
    if result == "warn":
        next_step = "Proceed only if the command can stay inside safe write boundaries and assumptions are recorded."
    if result == "fail":
        if expected_lane:
            next_step = f"Open the expected lane location ({expected_path}) and run {command}, or ask the Controller to fix identity metadata."
        else:
            next_step = f"Open the Controller repository root ({repo_root}) and run {command}, or ask the Owner/Controller to confirm identity."

    return {
        "result": result,
        "requested_command": command,
        "expected_role": " or ".join(expected_roles),
        "expected_lane": expected_lane or "none",
        "detected_role": detected_role,
        "detected_lane": detected_lane,
        "current_path": str(cwd),
        "expected_path": expected_path,
        "reasons": reasons,
        "warnings": warnings,
        "next_step": next_step,
        "sources_used": sources,
        "boundary": "soft guard only; not a security sandbox; no files were edited",
    }


def print_text(result: dict[str, Any]) -> None:
    print(f"Identity check: {result['result']}")
    print(f"Requested command: {result['requested_command']}")
    print(f"Expected role: {result.get('expected_role', 'unknown')}")
    print(f"Expected lane: {result.get('expected_lane', 'unknown')}")
    print(f"Detected role: {result.get('detected_role', 'unknown')}")
    print(f"Detected lane: {result.get('detected_lane', 'unknown')}")
    print(f"Current path: {result.get('current_path', 'unknown')}")
    print(f"Expected path: {result.get('expected_path', 'unknown')}")
    for reason in result.get("reasons", []):
        print(f"Mismatch reason: {reason}")
    for warning in result.get("warnings", []):
        print(f"Warning: {warning}")
    print(f"Corrective next step: {result['next_step']}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Check DIAYN soft session identity.")
    parser.add_argument("--command", required=True, help="Canonical /diayn-* command.")
    parser.add_argument("--repo-root", default=".", help="Controller repository root.")
    parser.add_argument("--cwd", help="Directory to evaluate; defaults to current working directory.")
    parser.add_argument("--role", help="Detected role override.")
    parser.add_argument("--lane", help="Detected lane override.")
    parser.add_argument("--local-identity", help="Explicit .diayn/local/session_identity.md path.")
    parser.add_argument("--manifest", help="Explicit .diayn/worktree_manifest.md path.")
    parser.add_argument("--format", choices=["text", "json"], default="text")
    parser.add_argument("--strict-exit", action="store_true", help="Exit with code 2 on fail and 1 on warn.")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    result = evaluate(args)
    if args.format == "json":
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print_text(result)
    if args.strict_exit and result["result"] == "fail":
        return 2
    if args.strict_exit and result["result"] == "warn":
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
