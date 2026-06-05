#!/usr/bin/env python3
"""Dry-run DIAYN scaffold audit for /diayn-init.

The script inspects a target project and reports whether the minimum DIAYN
harness files are present, missing, or require Owner review before edits.
It does not modify the target project unless --output is used to write the
audit result outside or inside an explicitly chosen path.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path


ENTRY_FILE_BY_PLATFORM = {
    "claude-code": "CLAUDE.md",
    "codex": "AGENTS.md",
    "opencode": "AGENTS.md",
    "generic": "AGENTS.md",
}

BASE_EXPECTED_FILES = [
    "TODO.md",
    ".diayn/worktree_manifest.md",
    ".diayn/scaffold_version.md",
    ".diayn/network_policy.md",
    ".diayn/dependency-routing/upstream-routing-map.md",
    "docs/project/project_brief.md",
]

GENERATED_DIR_NAMES = {
    ".git",
    ".hg",
    ".svn",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".tox",
    ".venv",
    "venv",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "target",
    "out",
    ".next",
    ".turbo",
}

TEXT_DOC_EXTENSIONS = {".md", ".mdx", ".txt", ".rst", ".adoc"}


def run_git(project_root: Path, git_root: Path | None, args: list[str], safe_directory: Path | None) -> dict:
    command = ["git"]
    if safe_directory:
        command.extend(["-c", f"safe.directory={safe_directory}"])
    command.extend(["-C", str(project_root), *args])
    try:
        proc = subprocess.run(command, capture_output=True, text=True, timeout=10, check=False)
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


def find_git_marker(project_root: Path) -> Path | None:
    current = project_root
    while True:
        marker = current / ".git"
        if marker.exists():
            return current
        if current.parent == current:
            return None
        current = current.parent


def is_probably_generated(path: Path) -> bool:
    return any(part in GENERATED_DIR_NAMES for part in path.parts)


def classify_expected_file(project_root: Path, relative: str) -> dict:
    path = project_root / relative
    exists = path.exists()
    result = {
        "path": relative,
        "exists": exists,
        "proposed_action": "create" if not exists else "owner_review",
        "owner_preservation_required": exists,
    }
    if exists and path.is_file():
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            text = ""
        if "DIAYN" in text or "/diayn-" in text:
            result["proposed_action"] = "merge"
            result["owner_preservation_required"] = False
        result["size_bytes"] = path.stat().st_size
    return result


def resolve_platform(platform: str, entry_file: str | None) -> tuple[str, str, str]:
    normalized = platform.strip().lower()
    if normalized not in ENTRY_FILE_BY_PLATFORM:
        raise SystemExit(f"unsupported platform: {platform}")
    resolved_entry = entry_file or ENTRY_FILE_BY_PLATFORM[normalized]
    if resolved_entry not in {"AGENTS.md", "CLAUDE.md"}:
        raise SystemExit("--entry-file must be AGENTS.md or CLAUDE.md")
    other_entry = "AGENTS.md" if resolved_entry == "CLAUDE.md" else "CLAUDE.md"
    return normalized, resolved_entry, other_entry


def scan_project(project_root: Path, max_files: int, max_file_bytes: int) -> dict:
    markdown_files: list[str] = []
    skipped_dirs: set[str] = set()
    large_files: list[str] = []
    nested_repos: list[str] = []
    possible_secret_files: list[str] = []
    file_count = 0

    for root, dirs, files in os.walk(project_root):
        root_path = Path(root)
        rel_root = root_path.relative_to(project_root)

        kept_dirs = []
        for dirname in dirs:
            dir_path = root_path / dirname
            rel_dir = dir_path.relative_to(project_root)
            if dirname in GENERATED_DIR_NAMES:
                skipped_dirs.add(str(rel_dir).replace("\\", "/"))
                continue
            if dirname == ".git":
                continue
            if dirname == ".diayn" and rel_root != Path("."):
                nested_repos.append(str(rel_dir).replace("\\", "/"))
            if (dir_path / ".git").exists():
                nested_repos.append(str(rel_dir).replace("\\", "/"))
            kept_dirs.append(dirname)
        dirs[:] = kept_dirs

        for filename in files:
            file_count += 1
            if file_count > max_files:
                skipped_dirs.add("<scan_limit_reached>")
                break

            file_path = root_path / filename
            relative = file_path.relative_to(project_root)
            rel_text = str(relative).replace("\\", "/")
            if is_probably_generated(relative):
                continue

            lower_name = filename.lower()
            if lower_name in {".env", ".env.local", ".env.production"} or lower_name.endswith(".pem"):
                possible_secret_files.append(rel_text)

            try:
                size = file_path.stat().st_size
            except OSError:
                continue
            if size > max_file_bytes:
                large_files.append(rel_text)
                continue
            if file_path.suffix.lower() in TEXT_DOC_EXTENSIONS:
                markdown_files.append(rel_text)
        if file_count > max_files:
            break

    return {
        "markdown_files": sorted(markdown_files),
        "skipped_generated_dirs": sorted(skipped_dirs),
        "large_files_skipped": sorted(large_files),
        "nested_repositories": sorted(set(nested_repos)),
        "possible_secret_files": sorted(set(possible_secret_files)),
        "scan_limit_reached": file_count > max_files,
    }


def infer_language(project_root: Path, markdown_files: list[str], max_docs: int = 12) -> dict:
    chinese_chars = 0
    latin_letters = 0
    inspected = []
    for relative in markdown_files[:max_docs]:
        path = project_root / relative
        try:
            text = path.read_text(encoding="utf-8", errors="replace")[:12000]
        except OSError:
            continue
        inspected.append(relative)
        for char in text:
            code = ord(char)
            if 0x4E00 <= code <= 0x9FFF:
                chinese_chars += 1
            elif ("a" <= char.lower() <= "z"):
                latin_letters += 1
    if chinese_chars > 100 and chinese_chars * 2 > latin_letters:
        language = "zh"
    elif latin_letters > 200:
        language = "en"
    else:
        language = "Unknown"
    return {
        "inferred_language": language,
        "docs_inspected": inspected,
        "chinese_chars": chinese_chars,
        "latin_letters": latin_letters,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Dry-run DIAYN harness audit")
    parser.add_argument("--project-root", default=".", help="Target project root to audit")
    parser.add_argument("--output", help="Optional JSON output path")
    parser.add_argument("--max-files", type=int, default=5000)
    parser.add_argument("--max-file-bytes", type=int, default=5 * 1024 * 1024)
    parser.add_argument(
        "--git-safe-directory",
        help="Optional read-only git safe.directory value supplied by the calling agent",
    )
    parser.add_argument(
        "--platform",
        choices=sorted(ENTRY_FILE_BY_PLATFORM),
        default="generic",
        help="Explicit adapter platform. Claude Code uses CLAUDE.md; Codex/OpenCode/generic use AGENTS.md.",
    )
    parser.add_argument(
        "--entry-file",
        choices=["AGENTS.md", "CLAUDE.md"],
        help="Optional explicit entry file override supplied by the adapter or Owner.",
    )
    parser.add_argument(
        "--source",
        default="explicit_adapter_or_generic_default",
        help="Human-readable install or adapter source to record in the audit.",
    )
    args = parser.parse_args()

    project_root = Path(args.project_root).resolve()
    if not project_root.exists():
        raise SystemExit(f"project root does not exist: {project_root}")
    platform, entry_file, other_entry_file = resolve_platform(args.platform, args.entry_file)

    git_marker_root = find_git_marker(project_root)
    safe_directory = Path(args.git_safe_directory).resolve() if args.git_safe_directory else None
    git_toplevel = run_git(project_root, git_marker_root, ["rev-parse", "--show-toplevel"], safe_directory)
    git_branch = run_git(project_root, git_marker_root, ["branch", "--show-current"], safe_directory)
    git_head = run_git(project_root, git_marker_root, ["rev-parse", "HEAD"], safe_directory)
    git_status = run_git(project_root, git_marker_root, ["status", "--porcelain=v1"], safe_directory)

    scan = scan_project(project_root, args.max_files, args.max_file_bytes)
    language = infer_language(project_root, scan["markdown_files"])
    expected_file_paths = [entry_file, *BASE_EXPECTED_FILES]
    expected = [classify_expected_file(project_root, relative) for relative in expected_file_paths]
    conflicts = [item for item in expected if item["exists"] and item["proposed_action"] == "owner_review"]
    missing = [item for item in expected if not item["exists"]]

    owner_gates = []
    if not git_marker_root:
        owner_gates.append({
            "id": "OG-git-001",
            "question": "Target is not inside a Git repository. Should DIAYN initialize document-only mode or should Git be initialized first?",
            "blocks": "worktree planning",
        })
    elif not git_status["ok"]:
        owner_gates.append({
            "id": "OG-git-002",
            "question": "Git status could not be verified. Should the Owner authorize the agent/platform to run Git preflight here?",
            "blocks": "scaffold edits and worktree planning",
        })
    elif git_status["stdout"]:
        owner_gates.append({
            "id": "OG-git-003",
            "question": "The working tree is dirty. Which existing changes must be preserved before DIAYN scaffold edits?",
            "blocks": "scaffold edits",
        })
    if conflicts:
        owner_gates.append({
            "id": "OG-scaffold-001",
            "question": "Existing files overlap DIAYN scaffold templates. Which content must be preserved before applying DIAYN templates?",
            "blocks": "scaffold edits",
        })

    result = {
        "schema": "diayn.harness_audit.v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "project_root": str(project_root),
        "platform": {
            "name": platform,
            "entry_file": entry_file,
            "source": args.source,
            "entry_file_override": args.entry_file,
            "other_entry_file": other_entry_file,
            "other_entry_exists": (project_root / other_entry_file).exists(),
            "other_entry_action": "existing_only_no_default_update"
            if (project_root / other_entry_file).exists()
            else "not_created_by_default",
            "non_default_entry_file_policy": "preserve_existing_only",
            "reason_other_entry_file_not_generated": f"{platform} adapters use {entry_file} by default",
        },
        "git": {
            "marker_root": str(git_marker_root) if git_marker_root else None,
            "is_git_repository": bool(git_marker_root),
            "toplevel": git_toplevel["stdout"] if git_toplevel["ok"] else None,
            "branch": git_branch["stdout"] if git_branch["ok"] else None,
            "head": git_head["stdout"] if git_head["ok"] else None,
            "dirty": bool(git_status["stdout"]) if git_status["ok"] else "Unknown",
            "status_error": None if git_status["ok"] else git_status["stderr"],
        },
        "expected_files": expected,
        "missing_files": [item["path"] for item in missing],
        "conflicts": [{"path": item["path"], "reason": "existing content needs Owner preservation review"} for item in conflicts],
        "scan": scan,
        "language": language,
        "owner_gates": owner_gates,
        "recommended_action": "owner_review" if owner_gates else ("create" if missing else "ready"),
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
