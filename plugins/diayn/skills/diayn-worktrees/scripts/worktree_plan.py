#!/usr/bin/env python3
"""Plan DIAYN lane worktrees for /diayn-worktrees.

Default mode is dry-run. It inspects Git state, existing worktrees, lane
applicability, and emits copyable commands plus launch prompts. It only creates
worktrees when --execute is supplied by an already-authorized caller.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path


LANES = ("backend", "frontend")


def run_git(project_root: Path, args: list[str], safe_directory: Path | None) -> dict:
    command = ["git"]
    if safe_directory:
        command.extend(["-c", f"safe.directory={safe_directory}"])
    command.extend(["-C", str(project_root), *args])
    try:
        proc = subprocess.run(command, capture_output=True, text=True, timeout=15, check=False)
    except FileNotFoundError:
        return {"ok": False, "stdout": "", "stderr": "git executable not found"}
    except subprocess.TimeoutExpired:
        return {"ok": False, "stdout": "", "stderr": "git command timed out"}
    return {
        "ok": proc.returncode == 0,
        "stdout": proc.stdout.strip(),
        "stderr": proc.stderr.strip(),
        "returncode": proc.returncode,
    }


def shell_quote(value: str) -> str:
    if re.fullmatch(r"[A-Za-z0-9_./:\\-]+", value):
        return value
    return '"' + value.replace('"', '\\"') + '"'


def slugify_branch_part(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9._/-]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or "stage"


def parse_worktree_porcelain(text: str) -> list[dict]:
    entries: list[dict] = []
    current: dict | None = None
    for line in text.splitlines():
        if not line.strip():
            if current:
                entries.append(current)
                current = None
            continue
        key, _, value = line.partition(" ")
        if key == "worktree":
            if current:
                entries.append(current)
            current = {"path": value}
        elif current is not None:
            current[key] = value
    if current:
        entries.append(current)
    return entries


def lane_arg(value: str) -> str:
    normalized = value.strip().lower().replace("-", "_")
    allowed = {"yes", "no", "not_applicable"}
    if normalized not in allowed:
        raise argparse.ArgumentTypeError(f"lane applicability must be one of {sorted(allowed)}")
    return normalized


def plan_lane(
    project_root: Path,
    worktree_base: Path,
    project_slug: str,
    stage_id: str,
    lane: str,
    applicability: str,
    baseline: str,
    existing_worktrees: list[dict],
) -> dict:
    if applicability != "yes":
        return {
            "lane": lane,
            "applicable": applicability,
            "status": "not_applicable" if applicability == "not_applicable" else "blocked",
            "reason": "lane is not applicable to this stage",
        }

    target_path = (worktree_base / lane).resolve()
    suggested_branch = f"diayn/{slugify_branch_part(stage_id)}/{lane}"
    existing = next((item for item in existing_worktrees if Path(item["path"]).resolve() == target_path), None)
    path_exists = target_path.exists()

    status = "planned"
    reason = None
    if existing:
        status = "ready"
        reason = "target path is already registered as a Git worktree"
    elif path_exists:
        status = "blocked"
        reason = "target path exists but is not registered as a Git worktree"

    add_command = f"git worktree add {shell_quote(str(target_path))} -b {shell_quote(suggested_branch)} {shell_quote(baseline)}"
    return {
        "lane": lane,
        "applicable": "yes",
        "status": status,
        "reason": reason,
        "worktree_path": str(target_path),
        "branch": suggested_branch,
        "baseline": baseline,
        "copyable_add_command": add_command,
        "worker_startup": [
            f"cd {shell_quote(str(target_path))}",
            "codex",
            f"/diayn-{lane}",
        ],
        "review_startup": [
            f"cd {shell_quote(str(target_path))}",
            "codex",
            f"/diayn-review-{lane}",
            "\"<paste latest worker report here>\"",
        ],
        "wip_rule": "Only one worker or reviewer activity should be active for this lane at a time.",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Dry-run DIAYN worktree planning")
    parser.add_argument("--project-root", default=".", help="Controller repository root")
    parser.add_argument("--project-slug", required=True)
    parser.add_argument("--stage-id", default="stage-1")
    parser.add_argument("--backend", type=lane_arg, default="yes")
    parser.add_argument("--frontend", type=lane_arg, default="yes")
    parser.add_argument("--worktree-root", help="Defaults to ../worktrees/<project_slug>")
    parser.add_argument("--baseline", help="Baseline branch or commit; defaults to HEAD")
    parser.add_argument("--output")
    parser.add_argument("--execute", action="store_true", help="Actually run git worktree add for planned lanes")
    parser.add_argument("--allow-dirty", action="store_true", help="Allow --execute when controller tree is dirty")
    parser.add_argument("--git-safe-directory", help="Optional read-only git safe.directory value supplied by caller")
    args = parser.parse_args()

    project_root = Path(args.project_root).resolve()
    safe_directory = Path(args.git_safe_directory).resolve() if args.git_safe_directory else None
    worktree_base = Path(args.worktree_root).resolve() if args.worktree_root else (project_root.parent / "worktrees" / args.project_slug).resolve()

    git_top = run_git(project_root, ["rev-parse", "--show-toplevel"], safe_directory)
    git_head = run_git(project_root, ["rev-parse", "HEAD"], safe_directory)
    git_branch = run_git(project_root, ["branch", "--show-current"], safe_directory)
    git_status = run_git(project_root, ["status", "--porcelain=v1"], safe_directory)
    worktree_list = run_git(project_root, ["worktree", "list", "--porcelain"], safe_directory)

    existing_worktrees = parse_worktree_porcelain(worktree_list["stdout"]) if worktree_list["ok"] else []
    baseline = args.baseline or (git_head["stdout"] if git_head["ok"] else "HEAD")
    dirty = bool(git_status["stdout"]) if git_status["ok"] else "Unknown"

    lane_plan = [
        plan_lane(project_root, worktree_base, args.project_slug, args.stage_id, "backend", args.backend, baseline, existing_worktrees),
        plan_lane(project_root, worktree_base, args.project_slug, args.stage_id, "frontend", args.frontend, baseline, existing_worktrees),
    ]

    owner_gates = []
    if not git_top["ok"]:
        owner_gates.append({
            "id": "OG-worktree-git",
            "question": "Git repository preflight failed. Should DIAYN stop or should the Owner authorize Git setup/repair first?",
            "blocks": "worktree creation",
        })
    if dirty is True:
        owner_gates.append({
            "id": "OG-worktree-dirty",
            "question": "Controller working tree is dirty. Which changes must be committed, preserved, or excluded before worktree creation?",
            "blocks": "worktree creation",
        })
    for lane in lane_plan:
        if lane.get("status") == "blocked":
            owner_gates.append({
                "id": f"OG-worktree-{lane['lane']}",
                "question": f"{lane['lane']} worktree target is blocked: {lane.get('reason')}. What path or cleanup should be used?",
                "blocks": f"{lane['lane']} lane launch",
            })

    executed = []
    if args.execute:
        if owner_gates and not args.allow_dirty:
            raise SystemExit("refusing --execute while OwnerGate items are open; rerun without --execute or resolve gates")
        worktree_base.mkdir(parents=True, exist_ok=True)
        for lane in lane_plan:
            if lane.get("status") != "planned":
                continue
            proc = run_git(project_root, ["worktree", "add", lane["worktree_path"], "-b", lane["branch"], lane["baseline"]], safe_directory)
            executed.append({"lane": lane["lane"], "ok": proc["ok"], "stderr": proc["stderr"]})
            if proc["ok"]:
                lane["status"] = "ready"
                lane["reason"] = "created by authorized /diayn-worktrees execution"
            else:
                lane["status"] = "blocked"
                lane["reason"] = proc["stderr"] or "git worktree add failed"
                owner_gates.append({
                    "id": f"OG-worktree-{lane['lane']}-execute",
                    "question": f"{lane['lane']} worktree execution failed: {lane['reason']}. What path, branch, or cleanup should be used?",
                    "blocks": f"{lane['lane']} lane launch",
                })

    result = {
        "schema": "diayn.worktree_plan.v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "project_root": str(project_root),
        "project_slug": args.project_slug,
        "stage_id": args.stage_id,
        "git": {
            "ok": git_top["ok"],
            "toplevel": git_top["stdout"] if git_top["ok"] else None,
            "branch": git_branch["stdout"] if git_branch["ok"] else None,
            "head": git_head["stdout"] if git_head["ok"] else None,
            "dirty": dirty,
            "status_error": None if git_status["ok"] else git_status["stderr"],
            "worktree_list_error": None if worktree_list["ok"] else worktree_list["stderr"],
        },
        "worktree_root": str(worktree_base),
        "lanes": lane_plan,
        "owner_gates": owner_gates,
        "execute_requested": args.execute,
        "executed": executed,
        "next_action": "resolve_owner_gates" if owner_gates else ("launch_lane_sessions" if args.execute else "request_authorization_or_run_copyable_commands"),
    }

    payload = json.dumps(result, indent=2, ensure_ascii=False)
    if args.output:
        output = Path(args.output)
        if not output.is_absolute():
            output = Path.cwd() / output
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(payload + "\n", encoding="utf-8")
    print(payload)


if __name__ == "__main__":
    main()
