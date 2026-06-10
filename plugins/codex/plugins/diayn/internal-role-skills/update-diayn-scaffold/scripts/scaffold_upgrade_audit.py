#!/usr/bin/env python3
"""Dry-run DIAYN scaffold upgrade audit.

This helper reads an existing project, classifies likely DIAYN migration work,
and prints a migration plan plus patch proposal. It never edits the target
project, never creates worktrees, and has no apply mode.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable


TEXT_SUFFIXES = {
    ".md",
    ".markdown",
    ".txt",
    ".yaml",
    ".yml",
    ".json",
    ".toml",
    ".html",
    ".htm",
}

SKIP_DIRS = {
    ".git",
    ".hg",
    ".svn",
    ".venv",
    "venv",
    "node_modules",
    "dist",
    "build",
    "third_party",
}

CORE_ARTIFACTS = [
    ("README.md", "entry", "preserve and add a short DIAYN entry if needed"),
    ("AGENTS.md", "entry", "create or patch as lightweight agent index"),
    ("CLAUDE.md", "entry", "create or patch as lightweight Claude-facing index when Claude Code is used"),
    ("TODO.md", "control", "Controller-owned global summary, not a worker task board"),
    ("docs/project/project_brief.md", "project", "project purpose and non-goals"),
    ("docs/project/file_index.md", "project", "project organization and important paths"),
    ("docs/shared/README.md", "shared", "shared-doc boundary"),
    ("docs/shared/integration_issues.md", "shared", "cross-lane issue record"),
    ("docs/lanes/backend/board.md", "lane", "backend lane board"),
    ("docs/lanes/backend/handoff.md", "lane", "backend handoff"),
    ("docs/lanes/backend/evidence.md", "lane", "backend evidence index"),
    ("docs/lanes/backend/review_log.md", "lane", "backend review summary index"),
    ("docs/lanes/frontend/board.md", "lane", "frontend lane board"),
    ("docs/lanes/frontend/handoff.md", "lane", "frontend handoff"),
    ("docs/lanes/frontend/evidence.md", "lane", "frontend evidence index"),
    ("docs/lanes/frontend/review_log.md", "lane", "frontend review summary index"),
    ("docs/meta/diayn_command_reference.md", "meta", "canonical /diayn-* command index"),
    ("docs/meta/status_model.md", "meta", "canonical status authority"),
    ("docs/meta/agent_doc_permissions.md", "meta", "role-aware write boundaries"),
    ("docs/templates/lane_board_template.md", "template", "lane board reusable shape"),
    (".diayn/worktree_manifest.md", "control", "Controller-owned planned worktree record"),
    (".diayn/session_registry.md", "control", "Controller-owned session registry"),
    (".diayn/sync_log.md", "control", "Controller sync and integration record"),
]

OLD_COMMAND_PATTERN = re.compile(
    r"/diayn\s+(init|plan|worktrees|backend|frontend|sync|integration|bug|new|html|review\s+backend|review\s+frontend)\b",
    re.IGNORECASE,
)
OLD_STATUS_PATTERN = re.compile(
    r"\b(auto_verified|waiting_Owner_test|waiting_verify)\b|"
    r"(?i:(?:status|state)[^\n]{0,80}(?<!owner_)accepted\b)"
)
FALSE_SUPPORT_PATTERN = re.compile(
    r"(?i)(installable\s+Codex\s+plugin|published\s+Codex\s+plugin|"
    r"working\s+OpenCode|working\s+Claude\s+Code|shell\s+CLI\s+provided|"
    r"global\s+DIAYN\s+CLI|custom\s+DIAYN\s+runtime)"
)


def is_historical_command_context(line: str) -> bool:
    lower = line.lower()
    return "older two-segment" in lower or "historical" in lower or "migration note" in lower


def is_negative_support_context(line: str) -> bool:
    lower = line.lower()
    return (
        "do not claim" in lower
        or "does not claim" in lower
        or "not working" in lower
        or "not `working`" in lower
        or "there is no" in lower
        or "no installable" in lower
        or "not installable" in lower
        or "not published" in lower
        or "not a plugin" in lower
        or "not a global" in lower
        or "not a shell" in lower
        or "not a custom" in lower
        or "why not" in lower
        or "before local" in lower
        or "before a local" in lower
    )


@dataclass
class Artifact:
    path: str
    kind: str
    exists: bool
    classification: str
    reason: str


@dataclass
class Issue:
    issue: str
    path: str
    line: int | None
    evidence: str
    severity: str
    route: str


def posix(path: Path) -> str:
    return path.as_posix()


def relpath(path: Path, root: Path) -> str:
    try:
        return posix(path.relative_to(root))
    except ValueError:
        return str(path)


def is_under(parts: Iterable[str], name: str) -> bool:
    needle = name.lower()
    return any(part.lower() == needle for part in parts)


def iter_text_files(root: Path, max_bytes: int) -> Iterable[Path]:
    for path in root.rglob("*"):
        parts = path.relative_to(root).parts
        if any(part in SKIP_DIRS for part in parts):
            continue
        if len(parts) >= 2 and parts[0] == ".diayn" and parts[1] == "local":
            continue
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            if path.stat().st_size > max_bytes:
                continue
        except OSError:
            continue
        yield path


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="utf-8", errors="replace")


def scan_file(path: Path, root: Path) -> list[Issue]:
    issues: list[Issue] = []
    rel = relpath(path, root)
    negative_context_until = 0
    for index, line in enumerate(read_text(path).splitlines(), start=1):
        clean_line = line.lstrip("\ufeff")
        lower_line = clean_line.strip().lower()
        if re.search(r"\b(is|are)\s+not\s*:?\s*$", lower_line):
            negative_context_until = max(negative_context_until, index + 8)
        old_command = OLD_COMMAND_PATTERN.search(clean_line)
        if old_command and not is_historical_command_context(clean_line):
            issues.append(
                Issue(
                    issue="legacy_two_segment_command",
                    path=rel,
                    line=index,
                    evidence=clean_line.strip()[:180],
                    severity="update",
                    route="Patch to one-segment /diayn-* wording after Owner approves the migration plan.",
                )
            )
        old_status = OLD_STATUS_PATTERN.search(clean_line)
        if old_status:
            issues.append(
                Issue(
                    issue="legacy_status_or_status_shaped_value",
                    path=rel,
                    line=index,
                    evidence=clean_line.strip()[:180],
                    severity="conflict",
                    route="Map through docs/meta/legacy_migration_guide.md; do not jump worker self-verification to done.",
                )
            )
        false_support = FALSE_SUPPORT_PATTERN.search(clean_line)
        if false_support and index > negative_context_until and not is_negative_support_context(clean_line):
            issues.append(
                Issue(
                    issue="truthfulness_support_claim",
                    path=rel,
                    line=index,
                    evidence=clean_line.strip()[:180],
                    severity="conflict",
                    route="Downgrade support language to working/manual_fallback/documented_only/draft_only/missing as evidence allows.",
                )
            )
    return issues


def audit_artifacts(root: Path, issues: list[Issue]) -> list[Artifact]:
    issue_paths = {issue.path for issue in issues}
    artifacts: list[Artifact] = []
    for rel, kind, purpose in CORE_ARTIFACTS:
        exists = (root / rel).exists()
        if not exists:
            classification = "create"
            reason = f"Missing DIAYN {kind} artifact; propose creating from template or minimal scaffold."
        elif rel in issue_paths:
            classification = "conflict"
            reason = f"Existing {kind} artifact contains stale command, status, or support wording."
        else:
            classification = "preserve"
            reason = f"Existing {kind} artifact should be preserved; {purpose}."
        artifacts.append(Artifact(rel, kind, exists, classification, reason))

    for optional_path, kind, reason in [
        (".claude/commands", "adapter", "Claude Code command adapter is present; verify support level before claiming working."),
        (".opencode/commands", "adapter", "OpenCode command adapter is present; verify support level before claiming working."),
        (".opencode/skills", "adapter", "OpenCode skill wrappers are present; verify discovery before claiming working."),
    ]:
        path = root / optional_path
        if path.exists():
            artifacts.append(Artifact(optional_path, kind, True, "preserve", reason))

    local_identity = root / ".diayn" / "local"
    if local_identity.exists():
        artifacts.append(
            Artifact(
                ".diayn/local",
                "local",
                True,
                "conflict",
                "Local identity directory is present in the project tree; keep local-only and do not commit it.",
            )
        )
    return artifacts


def plan_steps(artifacts: list[Artifact], issues: list[Issue]) -> list[dict[str, str]]:
    steps: list[dict[str, str]] = []
    create_paths = [item.path for item in artifacts if item.classification == "create"]
    conflict_paths = sorted({issue.path for issue in issues})
    preserve_paths = [item.path for item in artifacts if item.classification == "preserve"]

    if preserve_paths:
        steps.append(
            {
                "step": "preserve_existing_content",
                "classification": "preserve",
                "targets": ", ".join(preserve_paths[:8]) + (" ..." if len(preserve_paths) > 8 else ""),
                "safety": "Do not replace existing user docs; patch around them.",
            }
        )
    if create_paths:
        steps.append(
            {
                "step": "create_missing_scaffold_docs",
                "classification": "create",
                "targets": ", ".join(create_paths[:10]) + (" ..." if len(create_paths) > 10 else ""),
                "safety": "Create only after Owner approves the plan; use project-neutral placeholders.",
            }
        )
    if conflict_paths:
        steps.append(
            {
                "step": "resolve_conflicts",
                "classification": "conflict",
                "targets": ", ".join(conflict_paths[:10]) + (" ..." if len(conflict_paths) > 10 else ""),
                "safety": "Require Owner or Controller decision before changing contradictory content.",
            }
        )
    steps.append(
        {
            "step": "record_migration",
            "classification": "owner_decision",
            "targets": "migration plan, conflict report, approved patch list",
            "safety": "Keep an audit trail; do not claim upgrade completion until patches are applied and reviewed.",
        }
    )
    return steps


def owner_questions(root: Path, artifacts: list[Artifact], issues: list[Issue], project_slug: str | None) -> list[str]:
    questions: list[str] = []
    if not project_slug:
        questions.append("Confirm project_slug; do not silently use the folder name as final truth.")
    if not (root / "docs" / "lanes").exists():
        questions.append("Confirm initial lanes. Default is backend/frontend, but existing projects may need different lane names.")
    if any(issue.issue == "legacy_status_or_status_shaped_value" for issue in issues):
        questions.append("Confirm how legacy statuses map to candidate_done, done, ready_for_e2e, owner_gate, or owner_accepted.")
    if any(item.path == ".diayn/local" for item in artifacts):
        questions.append("Decide whether .diayn/local is accidental tracked content or an untracked local-only directory.")
    if any(issue.issue == "truthfulness_support_claim" for issue in issues):
        questions.append("Confirm which tool support claims have real smoke-test evidence.")
    return questions


def build_report(data: dict[str, object]) -> str:
    artifacts: list[Artifact] = data["artifacts"]  # type: ignore[assignment]
    issues: list[Issue] = data["issues"]  # type: ignore[assignment]
    steps: list[dict[str, str]] = data["migration_plan"]  # type: ignore[assignment]
    questions: list[str] = data["owner_questions"]  # type: ignore[assignment]
    counts = data["counts"]  # type: ignore[assignment]

    lines: list[str] = []
    lines.append("# DIAYN Scaffold Upgrade Dry Run")
    lines.append("")
    lines.append("Dry run only: no project files were modified, no worktrees were created, and no commit was made.")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append(f"- Project root: `{data['project_root']}`")
    lines.append(f"- Generated at: `{data['generated_at']}`")
    lines.append(f"- Project slug input: `{data['project_slug'] or 'not provided'}`")
    lines.append(f"- Artifact counts: `{json.dumps(counts, sort_keys=True)}`")
    lines.append(f"- Conflict count: `{len(issues)}`")
    lines.append("")
    lines.append("## Artifact Inventory")
    lines.append("")
    lines.append("| Path | Kind | Exists | Classification | Reason |")
    lines.append("| --- | --- | --- | --- | --- |")
    for item in artifacts:
        exists = "yes" if item.exists else "no"
        lines.append(f"| `{item.path}` | `{item.kind}` | {exists} | `{item.classification}` | {item.reason} |")
    lines.append("")
    lines.append("## Conflict Report")
    lines.append("")
    lines.append("| Issue | Path | Line | Severity | Evidence | Route |")
    lines.append("| --- | --- | --- | --- | --- | --- |")
    if issues:
        for issue in issues:
            line = str(issue.line) if issue.line is not None else "n/a"
            evidence = issue.evidence.replace("|", "\\|")
            lines.append(f"| `{issue.issue}` | `{issue.path}` | {line} | `{issue.severity}` | {evidence} | {issue.route} |")
    else:
        lines.append("| None | n/a | n/a | n/a | No stale command, legacy status, or overclaim pattern found in scanned text files. | None |")
    lines.append("")
    lines.append("## Migration Plan")
    lines.append("")
    lines.append("| Step | Classification | Targets | Safety rule |")
    lines.append("| --- | --- | --- | --- |")
    for step in steps:
        lines.append(f"| `{step['step']}` | `{step['classification']}` | {step['targets']} | {step['safety']} |")
    lines.append("")
    lines.append("## Patch Proposal")
    lines.append("")
    lines.append("- Preserve existing README, AGENTS.md, CLAUDE.md, docs, and .diayn content by default.")
    lines.append("- Add missing DIAYN documents from templates or minimal project-neutral placeholders only after approval.")
    lines.append("- Patch stale `/diayn ...` wording to canonical `/diayn-*` only in approved files.")
    lines.append("- Map legacy status terms through `docs/meta/legacy_migration_guide.md`; do not mark worker self-verification as `done`.")
    lines.append("- Keep `.diayn/local/**` local-only and out of committed scaffold content.")
    lines.append("- Record final decisions and accepted migration scope in repository Markdown, not only chat.")
    lines.append("")
    lines.append("## Owner Questions")
    lines.append("")
    if questions:
        for question in questions:
            lines.append(f"- {question}")
    else:
        lines.append("- None from this dry-run scan.")
    lines.append("")
    lines.append("## Apply Boundary")
    lines.append("")
    lines.append("This helper has no apply mode. To apply, the agent must ask the Owner to approve a specific patch list, then edit only the approved files and report changed paths.")
    lines.append("")
    return "\n".join(lines)


def audit(args: argparse.Namespace) -> dict[str, object]:
    root = Path(args.project_root).resolve()
    if not root.exists() or not root.is_dir():
        raise SystemExit(f"Project root does not exist or is not a directory: {root}")

    issues: list[Issue] = []
    for path in iter_text_files(root, args.max_file_bytes):
        issues.extend(scan_file(path, root))

    artifacts = audit_artifacts(root, issues)
    counts: dict[str, int] = {}
    for item in artifacts:
        counts[item.classification] = counts.get(item.classification, 0) + 1

    data: dict[str, object] = {
        "project_root": str(root),
        "project_slug": args.project_slug,
        "generated_at": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),
        "mode": "dry-run",
        "artifacts": artifacts,
        "issues": issues,
        "counts": counts,
        "migration_plan": plan_steps(artifacts, issues),
        "owner_questions": owner_questions(root, artifacts, issues, args.project_slug),
        "safety": "read-only audit; no overwrite; no worktree creation; no commit; no apply mode",
    }
    return data


def to_json(data: dict[str, object]) -> str:
    serializable = dict(data)
    serializable["artifacts"] = [asdict(item) for item in data["artifacts"]]  # type: ignore[index]
    serializable["issues"] = [asdict(item) for item in data["issues"]]  # type: ignore[index]
    return json.dumps(serializable, ensure_ascii=False, indent=2)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Dry-run audit for upgrading an existing project into a DIAYN scaffold.")
    parser.add_argument("--project-root", default=".", help="Existing project root to audit.")
    parser.add_argument("--project-slug", help="Owner-confirmed project_slug, if already known.")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown")
    parser.add_argument("--output", help="Optional report output path. The target project is still not modified.")
    parser.add_argument("--max-file-bytes", type=int, default=200_000, help="Skip larger text files during stale wording scan.")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    data = audit(args)
    text = to_json(data) if args.format == "json" else build_report(data)
    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(text, encoding="utf-8", newline="\n")
    try:
        print(text)
    except UnicodeEncodeError:
        sys.stdout.buffer.write(text.encode("utf-8", errors="replace"))
        sys.stdout.buffer.write(b"\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
