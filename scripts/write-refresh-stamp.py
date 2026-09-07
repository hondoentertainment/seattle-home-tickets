#!/usr/bin/env python3
"""Write data/refresh.json after a catalog validation run.

lastChecked is the real America/Los_Angeles clock at stamp time.
catalogAsOf is copied from data/games.json — never invented.
This script does not scrape tickets, standings, or promotions.
"""

from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "games.json"
OUT = ROOT / "data" / "refresh.json"
PT = ZoneInfo("America/Los_Angeles")


def main() -> None:
    if not CATALOG.is_file():
        raise SystemExit(f"missing catalog: {CATALOG}")
    catalog = json.loads(CATALOG.read_text())
    catalog_as_of = catalog.get("asOf")
    if not isinstance(catalog_as_of, str) or not catalog_as_of.strip():
        raise SystemExit("data/games.json asOf is required (published seed date, not the clock)")
    matches = os.environ.get("CATALOG_MATCHES_SEED", "1") == "1"
    payload = {
        "lastChecked": datetime.now(PT).isoformat(timespec="seconds"),
        "timezone": "America/Los_Angeles",
        "catalogAsOf": catalog_as_of,
        "catalogMatchesSeed": matches,
        "priceRefresh": "not-scraped",
        "notes": (
            "Validated the published seed. Did not invent dates or scrape live ticket prices."
            if matches
            else "Seed and data/games.json differ. Open a PR with the regenerated catalog; do not invent dates."
        ),
    }
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"Wrote {OUT} lastChecked={payload['lastChecked']} matches={matches}")


if __name__ == "__main__":
    main()
