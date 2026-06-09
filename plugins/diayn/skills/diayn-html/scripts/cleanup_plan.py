#!/usr/bin/env python3
"""Create a dry-run DIAYN cleanup/delete plan.

The script inventories likely DIAYN scaffold artifacts and reports what needs
Owner review. It never deletes files, worktrees, branches, logs, or evidence.
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


PRESERVE_BY_DEFAULT = [
    "AGENTS.md",
    "TODO.md",
]

REVIEW_PREFIXES = [
    ".diayn",
    "docs/project",
    "docs/lanes",
    "docs/shared",
    "docs/owner_decisions",
]


def inventory(root: Path) -> list[dict]:
    items: list[dict] = []
    for relative in PRESERVE_BY_DEFAULT:
        path = root / relative
        if path.exists():
            items.append({
                "path": relative,
                "exists": True,
                "classification": "preserve_by_default",
                "reason": "May contain project-owned content; never delete automatically.",
            })
    for relative in REVIEW_PREFIXES:
        path = root / relative
        if not path.exists():
            continue
        if path.is_file():
            paths = [path]
        else:
            paths = sorted(item for item in path.rglob("*") if item.is_file())
        for item in paths:
            rel = item.relative_to(root).as_posix()
            classification = "review_before_delete"
            if rel.startswith(".diayn/local/"):
                classification = "local_only_review"
            items.append({
                "path": rel,
                "exists": True,
                "classification": classification,
                "reason": "List in an Owner-approved delete plan before removal.",
            })
    return items


def main() -> None:
    parser = argparse.ArgumentParser(description="Dry-run DIAYN cleanup/delete plan")
    parser.add_argument("--project-root", default=".")
    parser.add_argument("--output")
    args = parser.parse_args()

    root = Path(args.project_root).resolve()
    if not root.exists():
        raise SystemExit(f"project root does not exist: {root}")

    result = {
        "schema": "diayn.cleanup_plan.v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "project_root": str(root),
        "mode": "dry-run",
        "automatic_delete": False,
        "items": inventory(root),
        "worktree_rule": "List worktrees and branches separately; do not remove them automatically.",
        "approval_rule": "Delete only files explicitly listed in an Owner-approved cleanup plan.",
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
