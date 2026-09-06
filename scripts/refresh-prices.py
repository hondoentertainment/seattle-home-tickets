#!/usr/bin/env python3
"""Best-effort price refresh stub.

Live marketplace scrapes are fragile (auth walls, changing markup, ToS).
This job records that unofficial mid-tier estimates were left as seeded.
"""

from __future__ import annotations


def main() -> None:
    print("price refresh: skipped")
    print("reason: no live listing scrape; estimates stay in data/games.json until a human updates the seed")
    print("buyers should confirm on official club / Ticketmaster / authorized sellers")


if __name__ == "__main__":
    main()
