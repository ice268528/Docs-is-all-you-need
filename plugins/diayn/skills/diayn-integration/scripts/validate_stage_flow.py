#!/usr/bin/env python3
"""Validate a DIAYN Phase 7 stage-flow scenario.

This script checks workflow state evidence for worker, reviewer, sync,
integration, Owner acceptance, closeout, and next-stage baseline refresh.
It validates artifacts; it does not execute product code.
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


ALLOWED_FAILURE_CLASSES = {
    "implementation_failure",
    "blocked",
    "environment_missing",
    "external_service_unavailable",
    "flaky_or_timeout",
    "inconclusive_evidence",
}


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def lane_has_done_review(lane: dict) -> bool:
    return any(review.get("decision") == "done" for review in lane.get("reviews", []))


def lane_has_rejection_loop(lane: dict) -> bool:
    reviews = lane.get("reviews", [])
    return any(review.get("decision") == "rejected" for review in reviews) and lane_has_done_review(lane)


def validate_scenario(scenario: dict) -> list[str]:
    errors: list[str] = []
    if scenario.get("schema") != "diayn.phase7.fixture_scenario.v1":
        errors.append("scenario schema mismatch")

    lanes = scenario.get("lanes", {})
    applicable = {name: lane for name, lane in lanes.items() if lane.get("applicable") == "yes"}
    if not applicable:
        errors.append("at least one applicable lane is required")

    for name, lane in applicable.items():
        if lane.get("worker_status") != "candidate_done":
            errors.append(f"{name}: worker must stop at candidate_done")
        if not lane.get("evidence"):
            errors.append(f"{name}: evidence is required")
        if not lane_has_done_review(lane):
            errors.append(f"{name}: at least one done review is required")
        for review in lane.get("reviews", []):
            decision = review.get("decision")
            if decision not in {"done", "rejected"}:
                errors.append(f"{name}: invalid review decision {decision!r}")
            failure_class = review.get("failure_class")
            if failure_class and failure_class not in ALLOWED_FAILURE_CLASSES:
                errors.append(f"{name}: invalid failure class {failure_class!r}")

    if not any(lane_has_rejection_loop(lane) for lane in applicable.values()):
        errors.append("fixture must include at least one rejected review followed by done")

    sync = scenario.get("sync", {})
    if sync.get("business_code_merged") is not False:
        errors.append("/diayn-sync must not merge business code")
    if not sync.get("documents_synchronized"):
        errors.append("/diayn-sync must synchronize documents/state")

    integration = scenario.get("integration", {})
    if not integration.get("reviewed_code_only"):
        errors.append("/diayn-integration must integrate reviewed code only")
    if integration.get("status") != "ready_for_e2e":
        errors.append("integration must reach ready_for_e2e before Owner acceptance")
    for failure in integration.get("failures", []):
        if failure.get("class") not in ALLOWED_FAILURE_CLASSES:
            errors.append(f"integration: invalid failure class {failure.get('class')!r}")
    required_checks = {"contract", "build", "lint", "smoke"}
    checks = {check.get("name") for check in integration.get("checks", [])}
    missing_checks = required_checks - checks
    if missing_checks:
        errors.append(f"integration missing checks: {sorted(missing_checks)}")

    acceptance = scenario.get("owner_acceptance", {})
    if acceptance.get("decision") != "accepted":
        errors.append("Owner acceptance must be accepted for fixture closeout")

    closeout = scenario.get("closeout", {})
    for required in ["todo_updated", "evidence_archived", "accepted_baseline_recorded", "next_stage_baseline_refreshed"]:
        if closeout.get(required) is not True:
            errors.append(f"closeout missing {required}")

    return errors


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate DIAYN Phase 7 fixture stage flow")
    parser.add_argument("--scenario", required=True)
    parser.add_argument("--output")
    args = parser.parse_args()

    scenario_path = Path(args.scenario)
    scenario = load_json(scenario_path)
    errors = validate_scenario(scenario)
    result = {
        "schema": "diayn.phase7.validation.v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "scenario": str(scenario_path),
        "ok": not errors,
        "stage_id": scenario.get("stage_id"),
        "lanes": {
            name: {
                "applicable": lane.get("applicable"),
                "worker_status": lane.get("worker_status"),
                "review_decisions": [review.get("decision") for review in lane.get("reviews", [])],
            }
            for name, lane in scenario.get("lanes", {}).items()
        },
        "sync_no_business_code_merge": scenario.get("sync", {}).get("business_code_merged") is False,
        "integration_status": scenario.get("integration", {}).get("status"),
        "owner_decision": scenario.get("owner_acceptance", {}).get("decision"),
        "errors": errors,
    }

    payload = json.dumps(result, indent=2, ensure_ascii=False)
    if args.output:
        output = Path(args.output)
        if not output.is_absolute():
            output = Path.cwd() / output
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(payload + "\n", encoding="utf-8")
    print(payload)
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
