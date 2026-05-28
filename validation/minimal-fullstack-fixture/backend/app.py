#!/usr/bin/env python3
"""Minimal stdlib backend for DIAYN controlled fixture validation."""

from __future__ import annotations

import argparse
import json
import sqlite3
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
FRONTEND_INDEX = ROOT / "frontend" / "index.html"


def connect(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute(
        """
        create table if not exists users (
            id integer primary key autoincrement,
            email text not null unique,
            password text not null,
            created_at real not null
        )
        """
    )
    conn.commit()
    return conn


def read_json(handler: BaseHTTPRequestHandler) -> dict[str, Any]:
    length = int(handler.headers.get("content-length", "0"))
    raw = handler.rfile.read(length) if length else b"{}"
    try:
        data = json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def write_json(handler: BaseHTTPRequestHandler, status: HTTPStatus, body: dict[str, Any]) -> None:
    payload = json.dumps(body, ensure_ascii=False).encode("utf-8")
    handler.send_response(status.value)
    handler.send_header("content-type", "application/json; charset=utf-8")
    handler.send_header("content-length", str(len(payload)))
    handler.end_headers()
    handler.wfile.write(payload)


def write_html(handler: BaseHTTPRequestHandler, status: HTTPStatus, text: str) -> None:
    payload = text.encode("utf-8")
    handler.send_response(status.value)
    handler.send_header("content-type", "text/html; charset=utf-8")
    handler.send_header("content-length", str(len(payload)))
    handler.end_headers()
    handler.wfile.write(payload)


class FixtureHandler(BaseHTTPRequestHandler):
    server_version = "DIAYNFixture/0.1"

    @property
    def db_path(self) -> Path:
        return Path(self.server.db_path)  # type: ignore[attr-defined]

    def log_message(self, format: str, *args: object) -> None:
        return

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path in {"/", "/index.html"}:
            write_html(self, HTTPStatus.OK, FRONTEND_INDEX.read_text(encoding="utf-8"))
            return
        if parsed.path == "/api/health":
            write_json(self, HTTPStatus.OK, {"ok": True, "service": "diayn-fixture"})
            return
        write_json(self, HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        data = read_json(self)
        if parsed.path == "/api/register":
            self.register(data)
            return
        if parsed.path == "/api/login":
            self.login(data)
            return
        write_json(self, HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})

    def register(self, data: dict[str, Any]) -> None:
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))
        if "@" not in email or len(password) < 6:
            write_json(self, HTTPStatus.BAD_REQUEST, {"ok": False, "error": "invalid_input"})
            return
        try:
            with connect(self.db_path) as conn:
                cursor = conn.execute(
                    "insert into users (email, password, created_at) values (?, ?, ?)",
                    (email, password, time.time()),
                )
                user_id = int(cursor.lastrowid)
        except sqlite3.IntegrityError:
            write_json(self, HTTPStatus.CONFLICT, {"ok": False, "error": "email_exists"})
            return
        write_json(self, HTTPStatus.CREATED, {"ok": True, "user": {"id": user_id, "email": email}})

    def login(self, data: dict[str, Any]) -> None:
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))
        with connect(self.db_path) as conn:
            row = conn.execute(
                "select id, email from users where email = ? and password = ?",
                (email, password),
            ).fetchone()
        if not row:
            write_json(self, HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "invalid_credentials"})
            return
        write_json(self, HTTPStatus.OK, {"ok": True, "user": {"id": int(row[0]), "email": row[1]}})


def main() -> int:
    parser = argparse.ArgumentParser(description="Run the DIAYN minimal fixture backend.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--db", required=True)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), FixtureHandler)
    server.db_path = str(Path(args.db).resolve())  # type: ignore[attr-defined]
    print(json.dumps({"host": args.host, "port": args.port, "db": server.db_path}), flush=True)
    server.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
