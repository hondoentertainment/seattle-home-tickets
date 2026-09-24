#!/usr/bin/env python3
"""Validate data/refresh.json against the published catalog.

Fails the daily Action if the stamp is missing, unparseable, or claims a
catalog date that is not in data/games.json. Does not invent dates, scores,
or live prices.
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "games.json"
STAMP = ROOT / "data" / "refresh.json"
REQUIRED = (
    "lastChecked",
    "timezone",
    "catalogAsOf",
    "catalogMatchesSeed",
    "priceRefresh",
    "notes",
)


def fail(message: str) -> None:
    print(f"validate-refresh: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    if not CATALOG.is_file():
        fail(f"missing {CATALOG}")
    if not STAMP.is_file():
        fail(f"missing {STAMP}")

    catalog = json.loads(CATALOG.read_text())
    stamp = json.loads(STAMP.read_text())

    missing = [key for key in REQUIRED if key not in stamp]
    if missing:
        fail(f"refresh.json missing keys: {', '.join(missing)}")

    try:
        datetime.fromisoformat(stamp["lastChecked"])
    except (TypeError, ValueError) as exc:
        fail(f"lastChecked is not ISO-8601: {stamp.get('lastChecked')!r} ({exc})")

    if stamp["timezone"] != "America/Los_Angeles":
        fail("timezone must be America/Los_Angeles")

    catalog_as_of = catalog.get("asOf")
    if not catalog_as_of:
        fail("data/games.json has no asOf (catalog date must come from the seed)")
    if stamp["catalogAsOf"] != catalog_as_of:
        fail(
            f"catalogAsOf {stamp['catalogAsOf']!r} does not match games.json asOf {catalog_as_of!r}"
        )

    if not isinstance(stamp["catalogMatchesSeed"], bool):
        fail("catalogMatchesSeed must be a boolean")

    if stamp["priceRefresh"] != "not-scraped":
        fail("priceRefresh must stay 'not-scraped' until a real scrape exists")

    notes = stamp["notes"]
    if not isinstance(notes, str) or not notes.strip():
        fail("notes must explain what the check actually did")

    print(
        "validate-refresh: ok "
        f"lastChecked={stamp['lastChecked']} "
        f"catalogAsOf={stamp['catalogAsOf']} "
        f"matches={stamp['catalogMatchesSeed']}"
    )


if __name__ == "__main__":
    main()
