#!/usr/bin/env python3
"""Run the DIAYN minimal fixture end-to-end validation."""

from __future__ import annotations

import argparse
import json
import socket
import sqlite3
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "backend" / "app.py"


def free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def request_json(url: str, method: str = "GET", body: dict[str, Any] | None = None) -> tuple[int, dict[str, Any]]:
    data = None
    headers = {}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["content-type"] = "application/json"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            payload = response.read().decode("utf-8")
            return int(response.status), json.loads(payload)
    except urllib.error.HTTPError as exc:
        payload = exc.read().decode("utf-8")
        return int(exc.code), json.loads(payload)


def request_text(url: str) -> tuple[int, str]:
    with urllib.request.urlopen(url, timeout=5) as response:
        return int(response.status), response.read().decode("utf-8")


def wait_for_health(base_url: str) -> None:
    deadline = time.time() + 8
    last_error: Exception | None = None
    while time.time() < deadline:
        try:
            status, body = request_json(f"{base_url}/api/health")
            if status == 200 and body.get("ok") is True:
                return
        except Exception as exc:  # noqa: BLE001 - record startup failure details.
            last_error = exc
        time.sleep(0.2)
    raise RuntimeError(f"backend did not become healthy: {last_error}")


def check(condition: bool, name: str, details: dict[str, Any]) -> dict[str, Any]:
    return {"name": name, "result": "pass" if condition else "fail", "details": details}


def run() -> dict[str, Any]:
    port = free_port()
    base_url = f"http://127.0.0.1:{port}"
    checks: list[dict[str, Any]] = []
    with tempfile.TemporaryDirectory(prefix="diayn-fixture-", ignore_cleanup_errors=True) as temp_dir:
        db_path = Path(temp_dir) / "fixture.sqlite3"
        process = subprocess.Popen(
            [sys.executable, str(APP), "--host", "127.0.0.1", "--port", str(port), "--db", str(db_path)],
            cwd=str(ROOT),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        try:
            wait_for_health(base_url)
            checks.append(check(True, "backend health", {"url": f"{base_url}/api/health"}))

            html_status, html = request_text(f"{base_url}/")
            checks.append(
                check(
                    html_status == 200 and "fixture-form" in html and "/api/register" in html and "/api/login" in html,
                    "frontend served and wired to API",
                    {"status": html_status, "has_form": "fixture-form" in html},
                )
            )

            email = f"owner-{int(time.time())}@example.test"
            password = "secret123"
            register_status, register_body = request_json(
                f"{base_url}/api/register",
                "POST",
                {"email": email, "password": password},
            )
            checks.append(
                check(
                    register_status == 201 and register_body.get("ok") is True and register_body.get("user", {}).get("email") == email,
                    "register user",
                    {"status": register_status, "body": register_body},
                )
            )

            login_status, login_body = request_json(
                f"{base_url}/api/login",
                "POST",
                {"email": email, "password": password},
            )
            checks.append(
                check(
                    login_status == 200 and login_body.get("ok") is True and login_body.get("user", {}).get("email") == email,
                    "login user",
                    {"status": login_status, "body": login_body},
                )
            )

            duplicate_status, duplicate_body = request_json(
                f"{base_url}/api/register",
                "POST",
                {"email": email, "password": password},
            )
            checks.append(
                check(
                    duplicate_status == 409 and duplicate_body.get("error") == "email_exists",
                    "duplicate registration rejected",
                    {"status": duplicate_status, "body": duplicate_body},
                )
            )

            bad_login_status, bad_login_body = request_json(
                f"{base_url}/api/login",
                "POST",
                {"email": email, "password": "wrongpass"},
            )
            checks.append(
                check(
                    bad_login_status == 401 and bad_login_body.get("error") == "invalid_credentials",
                    "bad login rejected",
                    {"status": bad_login_status, "body": bad_login_body},
                )
            )

            with sqlite3.connect(db_path) as conn:
                row = conn.execute("select count(*) from users where email = ?", (email,)).fetchone()
            persisted_count = int(row[0]) if row else 0
            checks.append(
                check(
                    persisted_count == 1,
                    "user persisted in sqlite",
                    {"db": str(db_path), "email": email, "count": persisted_count},
                )
            )
        finally:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)
            if process.stdout:
                process.stdout.close()
            if process.stderr:
                process.stderr.close()

    failed = [item for item in checks if item["result"] != "pass"]
    return {
        "result": "pass" if not failed else "fail",
        "fixture": str(ROOT),
        "checks": checks,
        "failed_count": len(failed),
        "support_boundary": "controlled fixture only; not real-project validation; not native slash-command smoke test",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Run DIAYN minimal fixture E2E validation.")
    parser.add_argument("--output", help="Optional JSON output file.")
    args = parser.parse_args()
    result = run()
    payload = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(payload + "\n", encoding="utf-8")
    print(payload)
    return 0 if result["result"] == "pass" else 1


if __name__ == "__main__":
    raise SystemExit(main())
