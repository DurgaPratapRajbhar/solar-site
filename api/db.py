"""
db.py — Postgres connection + the gallery table

Only this Python service touches the database; the Next.js site asks it over HTTP.
Setting comes from the PROJECT ROOT .env (solar/.env) or the container env:
  DATABASE_URL=postgresql://user:password@host:5432/solar
"""

import os
import time
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@127.0.0.1:5432/solar")


def get_connection():
    """Open a fresh connection; rows come back as dicts."""
    return psycopg.connect(DATABASE_URL, row_factory=dict_row, autocommit=True, connect_timeout=5)


def fetch_all(sql: str, params: tuple = ()) -> list[dict]:
    with get_connection() as conn:
        return conn.execute(sql, params).fetchall()


def fetch_one(sql: str, params: tuple = ()) -> dict | None:
    with get_connection() as conn:
        return conn.execute(sql, params).fetchone()


def execute(sql: str, params: tuple = ()) -> int:
    """Run a write; returns how many rows it touched."""
    with get_connection() as conn:
        return conn.execute(sql, params).rowcount


SCHEMA = """
CREATE TABLE IF NOT EXISTS gallery (
    id         SERIAL PRIMARY KEY,
    media_type VARCHAR(12)  NOT NULL DEFAULT 'image',
    url        VARCHAR(500) NOT NULL,
    poster     VARCHAR(500),
    caption    VARCHAR(200) NOT NULL DEFAULT '',
    sort_order INT          NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Social posts (YouTube / Instagram / Facebook links) live in the same table
ALTER TABLE gallery ALTER COLUMN media_type TYPE VARCHAR(12);
ALTER TABLE gallery DROP CONSTRAINT IF EXISTS gallery_media_type_check;
ALTER TABLE gallery ADD CONSTRAINT gallery_media_type_check
    CHECK (media_type IN ('image', 'video', 'youtube', 'instagram', 'facebook'));
"""


def init_db(attempts: int = 15, pause: float = 2.0) -> bool:
    """Create the table if missing. Returns True if Postgres is reachable.

    Postgres needs a few seconds after its container starts, so the first tries may fail.
    """
    for attempt in range(1, attempts + 1):
        try:
            with get_connection() as conn:
                conn.execute(SCHEMA)
            print("[DB] Postgres connected, tables ready")
            return True
        except Exception as error:
            print(f"[DB] Postgres not ready (try {attempt}/{attempts}): {error}")
            time.sleep(pause)
    return False
