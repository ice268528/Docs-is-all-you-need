#!/usr/bin/env python3
"""Dry-run report helper for maintainer-side agent-skills vendor sync.

This script is intentionally read-only. It compares a local upstream
agent-skills snapshot with the vendored copy and reports what maintainers
need to review before any vendor copy or vendor.lock.md update.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable


EXPECTED_SKILLS = [
    "api-and-interface-design",
    "browser-testing-with-devtools",
    "ci-cd-and-automation",
    "code-review-and-quality",
    "code-simplification",
    "context-engineering",
    "debugging-and-error-recovery",
    "deprecation-and-migration",
    "documentation-and-adrs",
    "doubt-driven-development",
    "frontend-ui-engineering",
    "git-workflow-and-versioning",
    "idea-refine",
    "incremental-implementation",
    "interview-me",
    "performance-optimization",
    "planning-and-task-breakdown",
    "security-and-hardening",
    "shipping-and-launch",
    "source-driven-development",
    "spec-driven-development",
    "test-driven-development",
    "using-agent-skills",
]

PROTECTED_PATHS = [
    "skills/diayn-init/",
    "skills/diayn-plan/",
    "skills/diayn-worktrees/",
    "skills/diayn-backend/",
    "skills/diayn-frontend/",
    "skills/diayn-review-backend/",
    "skills/diayn-review-frontend/",
    "skills/diayn-sync/",
    "skills/diayn-integration/",
    "skills/diayn-bug/",
    "skills/diayn-new/",
    "skills/diayn-html/",
    "maintainers/internal-skills/diayn-controller/",
    "maintainers/internal-skills/diayn-executor/",
    "maintainers/internal-skills/diayn-reviewer/",
    "maintainers/internal-skills/diayn-integrator/",
    "maintainers/internal-skills/diayn-skill-router/",
    "maintainers/internal-skills/diayn-identity-guard/",
    "maintainers/internal-skills/diayn-owner-ux/",
    "maintainers/internal-skills/update-diayn-scaffold/",
    "docs/meta/",
    ".diayn/",
    "AGENTS.md",
    "CLAUDE.md",
    "README.md",
    "TODO.md",
]

WATCHED_SKILLS = [
    "test-driven-development",
    "incremental-implementation",
    "code-review-and-quality",
    "git-workflow-and-versioning",
    "planning-and-task-breakdown",
    "context-engineering",
    "documentation-and-adrs",
    "api-and-interface-design",
]

SKIP_DIRS = {".git", "__pycache__", ".pytest_cache", "node_modules"}


@dataclass(frozen=True)
class GitInfo:
    commit: str
    status: str
    error: str | None = None


def rel(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def run_git(path: Path, args: list[str]) -> tuple[str, str | None]:
    command = [
        "git",
        "-c",
        f"safe.directory={path.as_posix()}",
        "-C",
        str(path),
        *args,
    ]
    try:
        completed = subprocess.run(
            command,
            check=True,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except (OSError, subprocess.CalledProcessError) as exc:
        detail = str(exc)
        if isinstance(exc, subprocess.CalledProcessError):
            detail = (exc.stderr or exc.stdout or str(exc)).strip()
        return "Unknown / To be confirmed", detail
    return completed.stdout.strip(), None


def git_info(path: Path) -> GitInfo:
    if not path.exists():
        return GitInfo("missing", "missing", "path does not exist")
    commit, commit_error = run_git(path, ["rev-parse", "--short", "HEAD"])
    status, status_error = run_git(path, ["status", "--short"])
    return GitInfo(
        commit=commit,
        status=status or "clean",
        error=commit_error or status_error,
    )


def iter_files(root: Path) -> Iterable[Path]:
    if not root.exists():
        return
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        try:
            parts = path.relative_to(root).parts
        except ValueError:
            continue
        if any(part in SKIP_DIRS for part in parts):
            continue
        yield path


def file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def tree_hash(root: Path) -> str | None:
    if not root.exists():
        return None
    digest = hashlib.sha256()
    for path in iter_files(root):
        digest.update(rel(path, root).encode("utf-8"))
        digest.update(b"\0")
        digest.update(file_hash(path).encode("ascii"))
        digest.update(b"\0")
    return digest.hexdigest()


def skill_hashes(root: Path) -> dict[str, str]:
    skills_root = root / "skills"
    if not skills_root.exists():
        return {}
    result: dict[str, str] = {}
    for child in sorted(skills_root.iterdir()):
        if child.is_dir() and (child / "SKILL.md").exists():
            value = tree_hash(child)
            if value:
                result[child.name] = value
    return result


def tree_file_hashes(root: Path) -> dict[str, str]:
    if not root.exists():
        return {}
    return {rel(path, root): file_hash(path) for path in iter_files(root)}


def read_vendor_lock(repo_root: Path) -> dict[str, str]:
    lock_path = repo_root / "vendor.lock.md"
    fields = {
        "path": lock_path.as_posix(),
        "exists": str(lock_path.exists()).lower(),
        "source_url": "Unknown / To be confirmed",
        "source_commit": "Unknown / To be confirmed",
        "sync_method": "Unknown / To be confirmed",
        "synced_at": "Unknown / To be confirmed",
        "vendor_path": "Unknown / To be confirmed",
    }
    if not lock_path.exists():
        return fields
    for line in lock_path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        pairs = {
            "- Source URL:": "source_url",
            "- Source commit:": "source_commit",
            "- Sync method:": "sync_method",
            "- Synced at:": "synced_at",
            "- Vendor path:": "vendor_path",
        }
        for prefix, key in pairs.items():
            if stripped.startswith(prefix):
                fields[key] = stripped.removeprefix(prefix).strip().strip("`")
    return fields


def list_conflicting_source_paths(source_root: Path) -> list[str]:
    if not source_root.exists():
        return []
    source_paths = set(tree_file_hashes(source_root))
    conflicts: list[str] = []
    for protected in PROTECTED_PATHS:
        normalized = protected.rstrip("/")
        if protected.endswith("/"):
            if any(item == normalized or item.startswith(normalized + "/") for item in source_paths):
                conflicts.append(protected)
        elif normalized in source_paths:
            conflicts.append(protected)
    return conflicts


def build_report(args: argparse.Namespace) -> dict[str, object]:
    repo_root = Path(args.repo_root).resolve()
    vendor_root = (repo_root / args.vendor_path).resolve()
    source_root = Path(args.source_path).resolve() if args.source_path else (repo_root.parent / "agent-skills").resolve()
    vendor_lock = read_vendor_lock(repo_root)

    source_git = git_info(source_root)
    vendor_skills = skill_hashes(vendor_root)
    source_skills = skill_hashes(source_root) if source_root.exists() else {}

    vendor_files = tree_file_hashes(vendor_root)
    source_files = tree_file_hashes(source_root) if source_root.exists() else {}

    vendor_skill_names = sorted(vendor_skills)
    source_skill_names = sorted(source_skills)
    expected = sorted(EXPECTED_SKILLS)

    common_skills = sorted(set(vendor_skills) & set(source_skills))
    added_in_source = sorted(set(source_skills) - set(vendor_skills))
    removed_from_source = sorted(set(vendor_skills) - set(source_skills))
    changed_skills = sorted(
        name for name in common_skills if vendor_skills[name] != source_skills[name]
    )

    common_files = sorted(set(vendor_files) & set(source_files))
    added_files = sorted(set(source_files) - set(vendor_files))
    removed_files = sorted(set(vendor_files) - set(source_files))
    changed_files = sorted(
        name for name in common_files if vendor_files[name] != source_files[name]
    )

    watched_review = []
    for name in WATCHED_SKILLS:
        status = "unchanged"
        if name in added_in_source:
            status = "added_in_source"
        elif name in removed_from_source:
            status = "missing_from_source"
        elif name in changed_skills:
            status = "changed"
        elif name not in vendor_skills:
            status = "missing_from_vendor"
        elif name not in source_skills:
            status = "missing_from_source"
        watched_review.append(
            {
                "skill": name,
                "status": status,
                "requires_review": status != "unchanged",
            }
        )

    source_conflicts = list_conflicting_source_paths(source_root)
    license_checks = {
        "source_license_present": (source_root / "LICENSE").exists(),
        "vendor_license_present": (vendor_root / "LICENSE").exists(),
    }

    limitations: list[str] = []
    if not source_root.exists():
        limitations.append("Local upstream source path was not found; source comparison is blocked.")
    if source_git.error:
        limitations.append(f"Source git metadata limited: {source_git.error}")
    if args.network_check:
        limitations.append("Network fetching is intentionally not performed by this dry-run helper.")
    else:
        limitations.append("No network check requested; upstream freshness beyond the local snapshot is not verified.")

    known_non_material_file_diffs = {".opencode/skills"}
    material_changed_files = [name for name in changed_files if name not in known_non_material_file_diffs]
    changed_items = (
        added_in_source
        or removed_from_source
        or changed_skills
        or added_files
        or removed_files
        or material_changed_files
    )
    lock_commit_matches_source = vendor_lock["source_commit"] == source_git.commit
    update_allowed = (
        source_root.exists()
        and source_git.commit not in {"missing", "Unknown / To be confirmed"}
        and not source_git.status.startswith("missing")
    )
    update_recommended = bool(update_allowed and (changed_items or not lock_commit_matches_source))

    return {
        "generated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "mode": "dry-run/report-only",
        "repo_root": repo_root.as_posix(),
        "vendor_root": vendor_root.as_posix(),
        "source_root": source_root.as_posix(),
        "source_git": source_git.__dict__,
        "vendor_lock": vendor_lock,
        "license_checks": license_checks,
        "skill_counts": {
            "expected": len(expected),
            "vendor": len(vendor_skill_names),
            "source": len(source_skill_names),
        },
        "expected_map_check": {
            "vendor_missing_expected": sorted(set(expected) - set(vendor_skill_names)),
            "vendor_extra": sorted(set(vendor_skill_names) - set(expected)),
            "source_missing_expected": sorted(set(expected) - set(source_skill_names)),
            "source_extra": sorted(set(source_skill_names) - set(expected)),
        },
        "skill_diff": {
            "added_in_source": added_in_source,
            "removed_from_source": removed_from_source,
            "changed": changed_skills,
            "unchanged_count": len(common_skills) - len(changed_skills),
        },
        "file_diff_summary": {
            "added_files_count": len(added_files),
            "removed_files_count": len(removed_files),
            "changed_files_count": len(changed_files),
            "known_non_material_changed_files": sorted(
                name for name in changed_files if name in known_non_material_file_diffs
            ),
            "sample_added_files": added_files[:20],
            "sample_removed_files": removed_files[:20],
            "sample_changed_files": changed_files[:20],
        },
        "watched_skill_review": watched_review,
        "protected_path_check": {
            "dry_run_does_not_write_protected_paths": True,
            "protected_paths": PROTECTED_PATHS,
            "source_paths_matching_protected_names": source_conflicts,
            "vendor_copy_destination": "third_party/agent-skills/",
        },
        "vendor_lock_update_gate": {
            "may_update_vendor_lock_after_review": update_allowed,
            "update_recommended_for_this_dry_run": update_recommended,
            "reason": (
                "No vendor lock update is needed: source commit matches vendor.lock.md and no material source/vendor diff was detected."
                if not update_recommended and lock_commit_matches_source
                else "Update vendor.lock.md only after the reviewed vendor copy is changed or lock metadata is stale."
            ),
            "required_before_update": [
                "maintainer reviews changed skill list",
                "DIAYN protected paths remain untouched",
                "license and attribution remain present",
                "sync report records source path, URL, commit, and limitations",
                "OwnerGate handles any protocol conflict",
            ],
        },
        "ordinary_user_boundary": {
            "is_user_update_skill": False,
            "must_not_be_exposed_as_diayn_user_workflow": True,
            "notes": "This helper is for maintainers only and does not replace update-diayn-scaffold.",
        },
        "limitations": limitations,
        "blocking_questions": [],
    }


def md_list(items: list[str]) -> str:
    if not items:
        return "- None\n"
    return "".join(f"- `{item}`\n" for item in items)


def render_markdown(report: dict[str, object]) -> str:
    source_git = report["source_git"]  # type: ignore[index]
    vendor_lock = report["vendor_lock"]  # type: ignore[index]
    skill_diff = report["skill_diff"]  # type: ignore[index]
    expected = report["expected_map_check"]  # type: ignore[index]
    files = report["file_diff_summary"]  # type: ignore[index]
    protected = report["protected_path_check"]  # type: ignore[index]
    lock_gate = report["vendor_lock_update_gate"]  # type: ignore[index]
    watched = report["watched_skill_review"]  # type: ignore[index]
    license_checks = report["license_checks"]  # type: ignore[index]

    lines = [
        "# Agent Skills Vendor Sync Dry-Run Report",
        "",
        f"- Generated at: {report['generated_at']}",
        f"- Mode: `{report['mode']}`",
        f"- Source root: `{report['source_root']}`",
        f"- Vendor root: `{report['vendor_root']}`",
        f"- Source commit: `{source_git['commit']}`",
        f"- Source status: `{source_git['status']}`",
        f"- Vendor lock source commit: `{vendor_lock['source_commit']}`",
        f"- Vendor lock sync method: `{vendor_lock['sync_method']}`",
        "",
        "## Skill Count Check",
        "",
        f"- Expected skills: {report['skill_counts']['expected']}",  # type: ignore[index]
        f"- Vendor skills: {report['skill_counts']['vendor']}",  # type: ignore[index]
        f"- Source skills: {report['skill_counts']['source']}",  # type: ignore[index]
        "",
        "## Expected 23-Skill Map",
        "",
        "Vendor missing expected:",
        md_list(expected["vendor_missing_expected"]),
        "Vendor extra:",
        md_list(expected["vendor_extra"]),
        "Source missing expected:",
        md_list(expected["source_missing_expected"]),
        "Source extra:",
        md_list(expected["source_extra"]),
        "## Upstream Skill Diff",
        "",
        "Added in source:",
        md_list(skill_diff["added_in_source"]),
        "Removed from source:",
        md_list(skill_diff["removed_from_source"]),
        "Changed:",
        md_list(skill_diff["changed"]),
        f"- Unchanged common skills: {skill_diff['unchanged_count']}",
        "",
        "## Watched Skill Review",
        "",
        "| Skill | Status | Requires review |",
        "| --- | --- | --- |",
    ]

    for item in watched:
        lines.append(f"| `{item['skill']}` | `{item['status']}` | {str(item['requires_review']).lower()} |")

    lines.extend(
        [
            "",
            "## File Diff Summary",
            "",
            f"- Added files: {files['added_files_count']}",
            f"- Removed files: {files['removed_files_count']}",
            f"- Changed files: {files['changed_files_count']}",
            "Known non-material changed files:",
            md_list(files["known_non_material_changed_files"]),
            "",
            "Sample added files:",
            md_list(files["sample_added_files"]),
            "Sample removed files:",
            md_list(files["sample_removed_files"]),
            "Sample changed files:",
            md_list(files["sample_changed_files"]),
            "## Protected Path Check",
            "",
            f"- Dry-run writes protected paths: `false`",
            f"- Vendor copy destination: `{protected['vendor_copy_destination']}`",
            "- Source paths matching DIAYN protected names:",
            md_list(protected["source_paths_matching_protected_names"]),
            "Protected DIAYN paths:",
            md_list(protected["protected_paths"]),
            "## License And Attribution",
            "",
            f"- Source LICENSE present: {str(license_checks['source_license_present']).lower()}",
            f"- Vendor LICENSE present: {str(license_checks['vendor_license_present']).lower()}",
            "",
            "## Vendor Lock Update Gate",
            "",
            f"- May update vendor.lock.md after review: {str(lock_gate['may_update_vendor_lock_after_review']).lower()}",
            f"- Update recommended for this dry-run: {str(lock_gate['update_recommended_for_this_dry_run']).lower()}",
            f"- Reason: {lock_gate['reason']}",
            "- Required before update:",
            md_list(lock_gate["required_before_update"]),
            "## Maintainer/User Boundary",
            "",
            "- This report is maintainer-only.",
            "- It is not part of ordinary `/diayn-*` user workflows.",
            "- It does not replace `update-diayn-scaffold`.",
            "- It does not update `third_party/agent-skills/**` or `vendor.lock.md`.",
            "",
            "## Limitations",
            "",
            md_list(report["limitations"]),  # type: ignore[arg-type]
            "## Blocking Questions",
            "",
            md_list(report["blocking_questions"]),  # type: ignore[arg-type]
        ]
    )
    return "\n".join(lines).replace("\n\n\n", "\n\n") + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a read-only maintainer dry-run report for agent-skills vendor sync."
    )
    parser.add_argument("--repo-root", default=".", help="Docs-is-all-you-need repository root.")
    parser.add_argument(
        "--source-path",
        default=None,
        help="Local upstream agent-skills path. Defaults to ../agent-skills from repo root.",
    )
    parser.add_argument(
        "--vendor-path",
        default="third_party/agent-skills",
        help="Vendored agent-skills path relative to repo root.",
    )
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown")
    parser.add_argument("--output", help="Optional output file.")
    parser.add_argument(
        "--network-check",
        action="store_true",
        help="Record that network freshness was requested. This helper still does not fetch.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    report = build_report(args)
    if args.format == "json":
        content = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    else:
        content = render_markdown(report)

    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(content, encoding="utf-8")
    else:
        try:
            sys.stdout.write(content)
        except UnicodeEncodeError:
            sys.stdout.buffer.write(content.encode("utf-8"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
