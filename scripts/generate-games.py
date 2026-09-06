#!/usr/bin/env python3
"""Generate data/games.json from researched, published Seattle home schedules."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

AS_OF = "2026-09-06"


def dow(iso: str) -> str:
    y, m, d = map(int, iso.split("-"))
    return date(y, m, d).strftime("%a")


def et_to_pt(et: str) -> str:
    """Convert published ET clock times (e.g. '9:40p', '5:00p') to PT. ET-PT is always 3 hours."""
    et = et.strip().lower().replace(" ", "")
    ampm = "PM" if et.endswith("p") or et.endswith("pm") else "AM"
    core = et.rstrip("apm")
    hh, mm = core.split(":")
    h = int(hh)
    if ampm == "PM" and h != 12:
        h24 = h + 12
    elif ampm == "AM" and h == 12:
        h24 = 0
    else:
        h24 = h
    h24 -= 3
    if h24 < 0:
        h24 += 24
    out_ampm = "AM" if h24 < 12 else "PM"
    h12 = h24 % 12
    if h12 == 0:
        h12 = 12
    return f"{h12}:{mm} {out_ampm}"


def game(
    team: str,
    sport: str,
    iso: str,
    opponent: str,
    venue: str,
    time_pt: str,
    tv: str,
    each: int,
    notes: str,
    source: str,
    season: str,
    slug: str | None = None,
) -> dict:
    ymd = iso.replace("-", "")
    ident = slug or f"{team.split()[-1].lower()}-{sport.lower().replace(' ', '-')}-{ymd}"
    return {
        "id": ident,
        "date": iso,
        "day": dow(iso),
        "team": team,
        "sport": sport,
        "opponent": opponent,
        "venue": venue,
        "timePt": time_pt,
        "tv": tv,
        "estPriceEachUsd": each,
        "estPricePairUsd": each * 2,
        "priceNotes": notes,
        "source": source,
        "season": season,
    }


MID = "Estimated mid-tier pair (two seats). Not a live quote — secondary and official prices move daily."
PRO = MID + " Assumes lower-bowl / 200-level style inventory, not club or cheapest upper deck."
COLLEGE = MID + " Campus reserved seating, not student or premium club."
D2 = MID + " General reserved seating at a D-II venue."

games: list[dict] = []

# --- Mariners remaining 2026 homes (season ends Sep 27) ---
m_src = "MLB.com / CBS Sports / Baseball-Reference 2026 Mariners schedule (as of 2026-09-06)"
m_note = PRO + " 2026 regular season ends Sep 27 at T-Mobile Park; no remaining homes after that."
for iso, opp, t, each in [
    ("2026-09-06", "Athletics", "1:10 PM", 38),
    ("2026-09-08", "Texas Rangers", "6:40 PM", 28),
    ("2026-09-09", "Texas Rangers", "1:10 PM", 32),
    ("2026-09-10", "Texas Rangers", "1:10 PM", 30),
    ("2026-09-22", "Houston Astros", "6:40 PM", 36),
    ("2026-09-23", "Houston Astros", "7:10 PM", 40),
    ("2026-09-24", "Los Angeles Angels", "6:40 PM", 32),
    ("2026-09-25", "Los Angeles Angels", "7:10 PM", 36),
    ("2026-09-26", "Los Angeles Angels", "6:40 PM", 42),
    ("2026-09-27", "Los Angeles Angels", "12:10 PM", 34),
]:
    games.append(
        game(
            "Seattle Mariners",
            "MLB",
            iso,
            opp,
            "T-Mobile Park",
            t,
            "ROOT Sports",
            each,
            m_note,
            m_src,
            "2026 MLB regular season (remaining homes; season ends Sep 27)",
        )
    )

# --- Seahawks full 2026 RS homes (Weeks 17–18 are road) ---
s_src = "Seahawks.com 2026 schedule release; ESPN NFL team schedule"
s_note = PRO + " Weeks 17 (at CAR) and 18 (at LAR) are away — no additional published homes."
for iso, opp, t, tv, each in [
    ("2026-09-09", "New England Patriots", "5:20 PM", "NBC", 185),
    ("2026-10-04", "Los Angeles Chargers", "1:25 PM", "CBS", 145),
    ("2026-10-11", "San Francisco 49ers", "1:25 PM", "FOX", 195),
    ("2026-10-25", "Kansas City Chiefs", "5:20 PM", "NBC", 220),
    ("2026-11-02", "Chicago Bears", "5:15 PM", "ESPN", 175),
    ("2026-11-08", "Arizona Cardinals", "1:25 PM", "FOX", 140),
    ("2026-12-07", "Dallas Cowboys", "5:15 PM", "ESPN", 210),
    ("2026-12-13", "New York Giants", "1:25 PM", "FOX", 135),
    ("2026-12-25", "Los Angeles Rams", "5:15 PM", "FOX", 250),
]:
    games.append(
        game(
            "Seattle Seahawks",
            "NFL",
            iso,
            opp,
            "Lumen Field",
            t,
            tv,
            each,
            s_note,
            s_src,
            "2026 NFL regular season (all published home games)",
        )
    )

# --- Kraken preseason homes ---
k_pre_src = "NHL.com/Kraken 2026-27 preseason schedule (Jun 24, 2026)"
games.append(
    game(
        "Seattle Kraken",
        "NHL",
        "2026-09-19",
        "Vancouver Canucks",
        "Climate Pledge Arena",
        "7:00 PM",
        "KHN",
        48,
        PRO + " Preseason.",
        k_pre_src,
        "2026-27 NHL preseason",
        "kraken-nhl-pre-20260919",
    )
)
games.append(
    game(
        "Seattle Kraken",
        "NHL",
        "2026-09-24",
        "Calgary Flames",
        "Climate Pledge Arena",
        "6:40 PM",
        "KHN",
        45,
        PRO + " Preseason.",
        k_pre_src,
        "2026-27 NHL preseason",
        "kraken-nhl-pre-20260924",
    )
)

# Kraken RS homes: date, opponent, ET clock from published schedule
# Finland Global Series (Nov 12 vs CAR in Helsinki) omitted — not Seattle.
k_rs_src = "Wikipedia 2026–27 Seattle Kraken season; Sports Brackets / NHL schedule release (Jul 2026). Finland Global Series excluded."
k_rs_et = [
    ("2026-10-04", "Calgary Flames", "8:00p", 125),
    ("2026-10-06", "Vegas Golden Knights", "9:40p", 130),
    ("2026-10-20", "Detroit Red Wings", "9:40p", 95),
    ("2026-10-22", "Utah Mammoth", "9:40p", 88),
    ("2026-10-24", "Minnesota Wild", "10:00p", 98),
    ("2026-10-28", "Toronto Maple Leafs", "10:00p", 140),
    ("2026-11-04", "Calgary Flames", "10:00p", 105),
    ("2026-11-07", "New York Rangers", "5:00p", 145),
    ("2026-11-19", "Vancouver Canucks", "9:40p", 135),
    ("2026-11-23", "Anaheim Ducks", "9:40p", 90),
    ("2026-11-25", "Chicago Blackhawks", "9:40p", 110),
    ("2026-11-28", "Edmonton Oilers", "10:00p", 150),
    ("2026-12-01", "Dallas Stars", "9:40p", 115),
    ("2026-12-03", "Dallas Stars", "9:40p", 112),
    ("2026-12-06", "Buffalo Sabres", "8:00p", 92),
    ("2026-12-10", "Washington Capitals", "9:00p", 118),
    ("2026-12-12", "Nashville Predators", "10:00p", 95),
    ("2026-12-22", "San Jose Sharks", "9:40p", 85),
    ("2026-12-29", "Philadelphia Flyers", "9:40p", 100),
    ("2027-01-02", "New York Islanders", "10:00p", 102),
    ("2027-01-03", "Vancouver Canucks", "8:00p", 138),
    ("2027-01-05", "Tampa Bay Lightning", "9:40p", 120),
    ("2027-01-12", "Florida Panthers", "9:40p", 122),
    ("2027-01-16", "San Jose Sharks", "10:00p", 86),
    ("2027-01-18", "Columbus Blue Jackets", "4:00p", 90),
    ("2027-01-31", "New Jersey Devils", "4:00p", 108),
    ("2027-02-03", "Montreal Canadiens", "9:40p", 125),
    ("2027-02-13", "St. Louis Blues", "10:00p", 95),
    ("2027-02-15", "Pittsburgh Penguins", "4:00p", 118),
    ("2027-02-17", "Ottawa Senators", "9:40p", 100),
    ("2027-02-22", "Boston Bruins", "9:40p", 145),
    ("2027-02-27", "Winnipeg Jets", "7:00p", 110),
    ("2027-03-11", "Los Angeles Kings", "9:40p", 115),
    ("2027-03-13", "Edmonton Oilers", "10:00p", 155),
    ("2027-03-15", "St. Louis Blues", "9:40p", 96),
    ("2027-03-19", "Colorado Avalanche", "10:00p", 140),
    ("2027-03-21", "Los Angeles Kings", "8:00p", 118),
    ("2027-03-23", "Vegas Golden Knights", "9:40p", 142),
    ("2027-03-25", "Anaheim Ducks", "9:40p", 92),
    ("2027-03-30", "Utah Mammoth", "9:40p", 90),
    ("2027-04-03", "Winnipeg Jets", "7:00p", 120),
]
assert len(k_rs_et) == 41, len(k_rs_et)
for iso, opp, et, each in k_rs_et:
    games.append(
        game(
            "Seattle Kraken",
            "NHL",
            iso,
            opp,
            "Climate Pledge Arena",
            et_to_pt(et),
            "KHN / national TBD",
            each,
            PRO + " Weeknight homes generally 6:40 PM PT per club; times can flex for national TV.",
            k_rs_src,
            "2026-27 NHL regular season (Seattle homes only; Finland Global Series omitted)",
        )
    )

# --- Sounders remaining MLS homes ---
snd_src = "SoundersFC / MLS 2026 schedule; Ticketmaster home listings (updated after original Nov 2025 release)"
for iso, opp, t, each, extra in [
    ("2026-09-23", "Real Salt Lake", "6:30 PM", 48, ""),
    ("2026-09-26", "Minnesota United FC", "5:30 PM", 52, ""),
    ("2026-10-01", "Sporting Kansas City", "6:30 PM", 46, ""),
    ("2026-10-17", "CF Montréal", "7:30 PM", 44, ""),
    ("2026-10-28", "Houston Dynamo FC", "7:30 PM", 45, ""),
    ("2026-11-07", "Los Angeles FC", "4:00 PM", 85, " Decision Day regular-season finale."),
]:
    games.append(
        game(
            "Seattle Sounders FC",
            "MLS",
            iso,
            opp,
            "Lumen Field",
            t,
            "Apple TV",
            each,
            PRO + extra,
            snd_src,
            "2026 MLS regular season (remaining homes through Decision Day)",
        )
    )

# --- Reign remaining NWSL homes ---
r_src = "ReignFC.com single-match tickets / 2026 schedule (as of 2026-09-06)"
for iso, opp, t, each in [
    ("2026-09-06", "San Diego Wave FC", "6:00 PM", 36),
    ("2026-09-12", "Bay FC", "5:00 PM", 38),
    ("2026-09-25", "Boston Legacy FC", "5:30 PM", 34),
    ("2026-10-02", "North Carolina Courage", "7:00 PM", 35),
    ("2026-11-01", "Orlando Pride", "2:00 PM", 42),
]:
    games.append(
        game(
            "Seattle Reign FC",
            "NWSL",
            iso,
            opp,
            "Lumen Field",
            t,
            "NWSL+/Ion TBD",
            each,
            PRO,
            r_src,
            "2026 NWSL regular season (remaining homes)",
        )
    )

# --- Storm remaining WNBA homes ---
st_src = "Storm.wnba.com 2026 regular-season schedule; Climate Pledge Arena listings"
for iso, opp, each in [
    ("2026-09-17", "Las Vegas Aces", 72),
    ("2026-09-23", "Dallas Wings", 42),
]:
    games.append(
        game(
            "Seattle Storm",
            "WNBA",
            iso,
            opp,
            "Climate Pledge Arena",
            "7:00 PM",
            "KONG / WNBA League Pass",
            each,
            PRO + " Regular season ends Sep 23 at home; playoffs not listed.",
            st_src,
            "2026 WNBA regular season (remaining homes)",
        )
    )

# --- UW Football remaining homes ---
uwf_src = "GoHuskies.com 2026 football schedule / kickoff announcements"
for iso, opp, t, tv, each, extra in [
    ("2026-09-06", "Washington State", "1:00 PM", "NBC", 95, " Boeing Apple Cup."),
    ("2026-09-12", "Utah State", "12:30 PM", "BTN", 45, ""),
    ("2026-09-19", "Eastern Washington", "4:15 PM", "BTN", 35, ""),
    ("2026-09-26", "Minnesota", "TBD", "TBD", 70, " Kickoff window announced ~12 days prior."),
    ("2026-10-09", "Iowa", "6:00 PM", "FOX or FS1", 85, ""),
    ("2026-11-07", "Penn State", "TBD", "TBD", 110, " Homecoming / Purple Reign. Kickoff TBA."),
    ("2026-11-21", "Indiana", "TBD", "TBD", 130, " Salute to Service / Senior Day. Kickoff TBA."),
]:
    games.append(
        game(
            "Washington Huskies",
            "NCAA Football",
            iso,
            opp,
            "Husky Stadium",
            t,
            tv,
            each,
            COLLEGE + extra,
            uwf_src,
            "2026 FBS regular season (all published homes)",
        )
    )

# --- UW Men's Basketball published non-con homes + Holiday Classic; no undated Big Ten ---
uwm_src = "GoHuskies.com 2026-27 non-conference schedule (Aug 25, 2026). Big Ten dates not yet published — omitted."
for iso, opp, venue, each, extra, slug in [
    ("2026-10-25", "Washington State (exhibition)", "Alaska Airlines Arena", 22, " Exhibition.", "uw-mbb-exh-20261025"),
    ("2026-11-02", "Colgate", "Alaska Airlines Arena", 28, "", "uw-mbb-20261102"),
    ("2026-11-09", "Mississippi Valley State", "Alaska Airlines Arena", 22, "", "uw-mbb-20261109"),
    ("2026-11-19", "Utah Tech", "Alaska Airlines Arena", 26, "", "uw-mbb-20261119"),
    ("2026-11-29", "Norfolk State", "Alaska Airlines Arena", 28, "", "uw-mbb-20261129"),
    ("2026-12-08", "Southern Utah", "Alaska Airlines Arena", 26, "", "uw-mbb-20261208"),
    ("2026-12-19", "Baylor", "Climate Pledge Arena", 75, " Seattle Holiday Classic; ticket includes SU vs WSU.", "uw-mbb-20261219"),
    ("2026-12-28", "Cornell", "Alaska Airlines Arena", 32, "", "uw-mbb-20261228"),
]:
    games.append(
        game(
            "Washington Huskies",
            "NCAA Men's Basketball",
            iso,
            opp,
            venue,
            "TBD",
            "BTN+/TBD",
            each,
            COLLEGE + extra + " Tip times TBA. Big Ten homes omitted until dated.",
            uwm_src,
            "2026-27 NCAA men's basketball (published non-conference homes + Holiday Classic)",
            slug,
        )
    )

# --- UW Women's Basketball dated homes only ---
games.append(
    game(
        "Washington Huskies",
        "NCAA Women's Basketball",
        "2026-12-17",
        "Santa Clara",
        "Alaska Airlines Arena",
        "TBD",
        "BTN+/TBD",
        20,
        COLLEGE + " Only dated 2026-27 home as of early Sep 2026. Big Ten homes not dated — omitted.",
        "Wikipedia / GoHuskies 2026-27 WBB listings",
        "2026-27 NCAA women's basketball (dated homes only)",
        "uw-wbb-20261217",
    )
)

# --- UW Volleyball remaining 2026 fall homes ---
uwv_src = "GoHuskies.com 2026 volleyball schedule"
for iso, opp, t, each in [
    ("2026-09-10", "Lipscomb", "7:00 PM", 16),
    ("2026-09-13", "Washington State", "2:00 PM", 20),
    ("2026-10-02", "Illinois", "7:00 PM", 18),
    ("2026-10-04", "Purdue", "2:00 PM", 18),
    ("2026-10-16", "Rutgers", "7:00 PM", 16),
    ("2026-10-18", "Indiana", "2:00 PM", 16),
    ("2026-10-30", "Iowa", "7:00 PM", 18),
    ("2026-11-01", "Maryland", "12:00 PM", 16),
    ("2026-11-06", "Northwestern", "7:00 PM", 16),
    ("2026-11-08", "Nebraska", "TBD", 32),
]:
    games.append(
        game(
            "Washington Huskies",
            "NCAA Volleyball",
            iso,
            opp,
            "Alaska Airlines Arena",
            t,
            "BTN+/TBD",
            each,
            COLLEGE,
            uwv_src,
            "2026 NCAA volleyball (remaining fall homes)",
        )
    )

# --- UW Men's Soccer remaining homes ---
for iso, opp, t, each in [
    ("2026-09-11", "Penn State", "7:30 PM", 15),
    ("2026-09-25", "Rutgers", "7:30 PM", 14),
    ("2026-10-02", "Wisconsin", "7:00 PM", 14),
    ("2026-10-10", "Northwestern", "7:00 PM", 14),
    ("2026-10-14", "Seattle U", "7:00 PM", 16),
    ("2026-10-30", "Maryland", "5:00 PM", 16),
]:
    games.append(
        game(
            "Washington Huskies",
            "NCAA Men's Soccer",
            iso,
            opp,
            "Husky Soccer Stadium",
            t,
            "BTN+/TBD",
            each,
            COLLEGE,
            "GoHuskies.com 2026 men's soccer schedule",
            "2026 NCAA men's soccer (remaining fall homes)",
        )
    )

# --- UW Women's Soccer remaining homes ---
for iso, opp, t, each in [
    ("2026-09-10", "Maryland", "8:00 PM", 14),
    ("2026-09-13", "Rutgers", "1:00 PM", 14),
    ("2026-10-03", "USC", "7:00 PM", 16),
    ("2026-10-08", "Iowa", "7:00 PM", 14),
    ("2026-10-11", "Penn State", "1:00 PM", 16),
    ("2026-10-30", "Oregon", "8:00 PM", 18),
]:
    games.append(
        game(
            "Washington Huskies",
            "NCAA Women's Soccer",
            iso,
            opp,
            "Husky Soccer Stadium",
            t,
            "BTN+/TBD",
            each,
            COLLEGE,
            "GoHuskies.com 2026 women's soccer schedule",
            "2026 NCAA women's soccer (remaining fall homes)",
        )
    )

# --- Seattle U Men's Basketball published non-con homes + Holiday Classic ---
su_m_src = "GoSeattleU.com 2026-27 MBB non-conference schedule (Aug 27, 2026). WCC dates not yet published — omitted."
for iso, opp, venue, each, extra, slug in [
    ("2026-11-07", "Portland State", "Redhawk Center", 18, " Homecoming.", "su-mbb-20261107"),
    ("2026-11-11", "UTSA", "Redhawk Center", 16, "", "su-mbb-20261111"),
    ("2026-11-14", "Idaho State", "Redhawk Center", 16, "", "su-mbb-20261114"),
    ("2026-11-28", "UC Irvine", "Redhawk Center", 20, "", "su-mbb-20261128"),
    ("2026-12-01", "Norfolk State", "Redhawk Center", 16, "", "su-mbb-20261201"),
    ("2026-12-12", "Puget Sound", "Redhawk Center", 12, "", "su-mbb-20261212"),
    ("2026-12-15", "Austin Peay", "Redhawk Center", 16, "", "su-mbb-20261215"),
    ("2026-12-19", "Washington State", "Climate Pledge Arena", 45, " Seattle Holiday Classic (shared ticket with UW vs Baylor).", "su-mbb-20261219"),
    ("2026-12-22", "UC Davis", "Redhawk Center", 16, "", "su-mbb-20261222"),
]:
    games.append(
        game(
            "Seattle U Redhawks",
            "NCAA Men's Basketball",
            iso,
            opp,
            venue,
            "TBD",
            "WCC Network/TBD",
            each,
            COLLEGE + extra,
            su_m_src,
            "2026-27 NCAA men's basketball (published non-conference homes + Holiday Classic)",
            slug,
        )
    )

# --- Seattle U Women's Basketball published homes (non-con + dated WCC) ---
su_w_src = "GoSeattleU.com 2026-27 WBB schedule (Sep 1, 2026). WCC homes are dated."
for iso, opp, each, extra in [
    ("2026-11-06", "UC Riverside", 14, ""),
    ("2026-11-18", "Pacific Lutheran", 10, ""),
    ("2026-11-25", "Weber State", 14, ""),
    ("2026-11-29", "Montana", 14, ""),
    ("2026-12-05", "North Texas", 16, ""),
    ("2026-12-12", "Lewis & Clark", 10, ""),
    ("2026-12-18", "Portland State", 14, ""),
    ("2027-01-07", "Denver", 16, " WCC."),
    ("2027-01-09", "San Diego", 16, " WCC."),
    ("2027-01-21", "San Francisco", 16, " WCC."),
    ("2027-01-23", "Pepperdine", 16, " WCC."),
    ("2027-01-30", "Saint Mary's", 18, " WCC."),
    ("2027-02-11", "Santa Clara", 16, " WCC."),
    ("2027-02-13", "LMU", 16, " WCC."),
    ("2027-02-20", "Portland", 16, " WCC / I-5 rival."),
    ("2027-02-27", "Pacific", 16, " WCC regular-season home finale."),
]:
    games.append(
        game(
            "Seattle U Redhawks",
            "NCAA Women's Basketball",
            iso,
            opp,
            "Redhawk Center",
            "TBD",
            "WCC Network/TBD",
            each,
            COLLEGE + extra,
            su_w_src,
            "2026-27 NCAA women's basketball (all published dated homes, including WCC)",
        )
    )

# --- SPU Volleyball remaining 2026 fall homes ---
spu_v_src = "SPUFalcons.com 2026 women's volleyball schedule (Jul 29, 2026)"
for iso, opp, t, each in [
    ("2026-09-17", "Western Oregon", "7:00 PM", 10),
    ("2026-09-19", "Saint Martin's", "2:00 PM", 10),
    ("2026-09-26", "MSU Billings", "2:00 PM", 10),
    ("2026-10-08", "Simon Fraser", "7:00 PM", 10),
    ("2026-10-10", "Western Washington", "2:00 PM", 12),
    ("2026-10-29", "Central Washington", "7:00 PM", 10),
    ("2026-10-31", "Northwest Nazarene", "2:00 PM", 10),
    ("2026-11-12", "Alaska Fairbanks", "7:00 PM", 10),
    ("2026-11-14", "Alaska Anchorage", "2:00 PM", 12),
]:
    games.append(
        game(
            "Seattle Pacific Falcons",
            "NCAA Volleyball",
            iso,
            opp,
            "Royal Brougham Pavilion",
            t,
            "GNAC.tv",
            each,
            D2,
            spu_v_src,
            "2026 NCAA D-II volleyball (remaining fall homes)",
        )
    )

# --- SPU Men's Basketball published homes with confirmed opponents ---
spu_m_src = "SPUFalcons.com 2026-27 men's basketball schedule (verified Sep 6, 2026)"
for iso, opp, t, each in [
    ("2026-12-03", "Central Washington", "7:30 PM", 12),
    ("2026-12-05", "Northwest Nazarene", "2:00 PM", 12),
    ("2026-12-19", "Western Colorado", "3:00 PM", 10),
    ("2027-01-07", "Saint Martin's", "7:00 PM", 12),
    ("2027-01-09", "Western Oregon", "4:15 PM", 12),
    ("2027-01-28", "Simon Fraser", "5:15 PM", 12),
    ("2027-01-30", "Western Washington", "4:15 PM", 14),
    ("2027-02-13", "MSU Billings", "2:00 PM", 12),
    ("2027-02-18", "Alaska Fairbanks", "5:15 PM", 12),
    ("2027-02-20", "Alaska Anchorage", "4:15 PM", 12),
]:
    games.append(
        game(
            "Seattle Pacific Falcons",
            "NCAA Men's Basketball",
            iso,
            opp,
            "Royal Brougham Pavilion",
            t,
            "GNAC.tv",
            each,
            D2 + " GNAC home from official 2026-27 schedule page.",
            spu_m_src,
            "2026-27 NCAA D-II men's basketball (published homes with listed opponents)",
        )
    )

# --- SPU Women's Basketball published homes with confirmed opponents ---
spu_w_src = "SPUFalcons.com 2026-27 women's basketball schedule (verified Sep 6, 2026)"
for iso, opp, t, each in [
    ("2026-12-03", "Central Washington", "5:15 PM", 12),
    ("2026-12-05", "Northwest Nazarene", "4:15 PM", 12),
    ("2026-12-12", "George Fox", "3:00 PM", 10),
    ("2026-12-19", "Edmonds College", "12:30 PM", 10),
    ("2027-01-09", "MSU Billings", "2:00 PM", 12),
    ("2027-01-14", "Western Washington", "7:00 PM", 14),
    ("2027-01-16", "Simon Fraser", "2:00 PM", 12),
    ("2027-01-28", "Western Oregon", "7:30 PM", 12),
    ("2027-01-30", "Saint Martin's", "2:00 PM", 12),
    ("2027-02-18", "Alaska Fairbanks", "7:30 PM", 12),
    ("2027-02-20", "Alaska Anchorage", "2:00 PM", 12),
]:
    games.append(
        game(
            "Seattle Pacific Falcons",
            "NCAA Women's Basketball",
            iso,
            opp,
            "Royal Brougham Pavilion",
            t,
            "GNAC.tv",
            each,
            D2,
            spu_w_src,
            "2026-27 NCAA D-II women's basketball (published homes with listed opponents)",
        )
    )

MEN_SPORTS = {
    "MLB",
    "NFL",
    "NHL",
    "MLS",
    "NCAA Football",
    "NCAA Men's Basketball",
    "NCAA Men's Soccer",
}
WOMEN_SPORTS = {
    "NWSL",
    "WNBA",
    "NCAA Women's Basketball",
    "NCAA Women's Soccer",
    "NCAA Volleyball",
}


def special_tags(g: dict) -> list[str]:
    iso = g["date"]
    tags: list[str] = []
    if "2026-09-05" <= iso <= "2026-09-07":
        tags.append("Labor Day weekend")
    if "2026-11-22" <= iso <= "2026-11-29":
        tags.append("Thanksgiving week")
    if iso == "2026-12-25":
        tags.append("Christmas")
    if iso in {"2026-12-31", "2027-01-01", "2027-01-02", "2027-01-03"}:
        tags.append("New Year's")
    if iso == "2027-01-18":
        tags.append("MLK Day")
    if iso == "2027-02-15":
        tags.append("Presidents Day")
    if "Apple Cup" in g["priceNotes"] or (
        g["team"] == "Washington Huskies"
        and g["sport"] == "NCAA Football"
        and "Washington State" in g["opponent"]
    ):
        tags.append("Apple Cup")
    if "Homecoming" in g["priceNotes"]:
        tags.append("Homecoming")
    if "Holiday Classic" in g.get("priceNotes", "") and "Climate Pledge" in g.get("venue", ""):
        tags.append("Holiday Classic")
    if "Decision Day" in g["priceNotes"]:
        tags.append("Decision Day")
    rival_pairs = {
        ("Seattle Seahawks", "San Francisco 49ers"),
        ("Seattle Seahawks", "Los Angeles Rams"),
        ("Seattle Kraken", "Vancouver Canucks"),
        ("Seattle Kraken", "Edmonton Oilers"),
        ("Seattle Sounders FC", "Los Angeles FC"),
        ("Washington Huskies", "Washington State"),
    }
    if (g["team"], g["opponent"]) in rival_pairs:
        tags.append("Rivalry")
    # unique preserve order
    seen: set[str] = set()
    out: list[str] = []
    for tag in tags:
        if tag not in seen:
            seen.add(tag)
            out.append(tag)
    return out


for g in games:
    if g["sport"] in MEN_SPORTS:
        g["gender"] = "men"
    elif g["sport"] in WOMEN_SPORTS:
        g["gender"] = "women"
    else:
        g["gender"] = "open"
    g["specialTags"] = special_tags(g)

games.sort(key=lambda g: (g["date"], g["timePt"], g["team"]))

payload = {
    "asOf": AS_OF,
    "timezone": "America/Los_Angeles",
    "scope": "Seattle-area HOME games only. Away games and the Kraken Finland Global Series are excluded. Undated Big Ten basketball homes are omitted rather than invented.",
    "priceDisclaimer": "All prices are unofficial mid-tier estimates for TWO seats researched as of early September 2026. They are not live marketplace quotes, face values, or a recommendation to buy. Always confirm on official club / Ticketmaster / secondary sites.",
    "sources": [
        "MLB.com, CBS Sports, Baseball-Reference — Mariners 2026",
        "Seahawks.com schedule release; ESPN NFL 2026",
        "NHL.com/Kraken schedule + preseason releases; Wikipedia 2026–27 Kraken season",
        "SoundersFC / MLS / Ticketmaster 2026 home listings",
        "ReignFC.com 2026 single-match tickets",
        "Storm.wnba.com 2026 schedule; Climate Pledge Arena",
        "GoHuskies.com football, MBB, WBB, volleyball, soccer 2026/26-27",
        "GoSeattleU.com 2026-27 basketball non-conference schedules",
        "SPUFalcons.com 2026 volleyball and 2026-27 basketball schedules",
    ],
    "omissions": [
        "Kraken vs Carolina, Nov 12, 2026 at Veikkaus Arena (Helsinki) — not a Seattle home",
        "Seahawks Weeks 17–18 (at Carolina, at Rams) — road games",
        "UW / Seattle U men's basketball conference homes without published dates (Big Ten / WCC weekly windows only)",
        "UW women's basketball conference homes (opponents named, dates unpublished)",
        "SPU basketball tournament placeholders (GNAC / NCAA) without a listed opponent",
        "Completed 2026 homes before the remaining-season window except where the club slate is specified as full-season (Seahawks, Kraken)",
    ],
    "games": games,
}

out = Path("/workspace/data/games.json")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(payload, indent=2) + "\n")
print(f"Wrote {len(games)} games to {out}")
from collections import Counter

print(Counter(g["team"] for g in games))
print(Counter(g["sport"] for g in games))
print(Counter(g["gender"] for g in games))
print(Counter(tag for g in games for tag in g["specialTags"]))
