# Seattle Home Tickets

A Next.js (App Router) site that lists **published Seattle HOME sporting events** with unofficial mid-tier ticket estimates for **two seats**. Search, filter, sort, shortlist, and share the slate in the browser — no auth, no live ticket API.

- **Home (`/`)** — ticket quantity, filters, searchable/sortable grid, shortlist
- **Holidays (`/holidays`)** — holiday showcase, badge key, and holiday-only browsing
- **Teams (`/teams`)** — color monogram tiles (college and high-school tiles print the sport)
- **Standings (`/standings`)** — published W–L / points tables per Seattle club; upcoming sports are listed without invented records
- **Ticket Stats (`/stats`)** — published-catalog counts and unofficial qty-2 totals (not on-field W–L). `/ticket-stats` redirects here
- **Promotions (`/promotions`)** — published theme nights / giveaways from `data/promotions.json` (incomplete calendars marked; nothing invented)
- **Venues (`/venues`)** — catalog buildings with travel notes and a Home venue filter
- **Contact (`/contact`)** — official ticket-office / guest-services pages (this site does not sell tickets)
- **FAQ (`/about`)** — short Q&A. `/faq` redirects here

Seeded from official and league schedules researched **as of 6 September 2026**. Prices are estimates, not quotes. Methodology lives on the FAQ, not the calendar.

## What’s on the grid

| Club | Scope in `data/games.json` |
| --- | --- |
| Seattle Mariners | Remaining 2026 homes through season end (Sep 27 at T-Mobile Park) |
| Seattle Seahawks | Full 2026 regular-season home slate (Weeks 17–18 are road) |
| Seattle Kraken | 2 home preseason + all 41 Climate Pledge regular-season homes through Apr 2027. Finland Global Series omitted |
| Seattle Sounders FC | Remaining 2026 MLS homes through Decision Day (Nov 7 vs LAFC) |
| Seattle Reign FC | Remaining 2026 NWSL homes through Nov 1 vs Orlando |
| Seattle Storm | Remaining 2026 WNBA homes (Aces Sep 17, Wings Sep 23) |
| UW Football | All 7 published 2026 homes |
| UW Men’s Basketball | Published 2026-27 non-conference homes + Seattle Holiday Classic. **No invented Big Ten dates** |
| UW Women’s Basketball | Dated homes only (Santa Clara, Dec 17) |
| UW Volleyball / M+W Soccer | Remaining 2026 fall homes |
| Seattle U M/W Basketball | Men: published non-conference homes + Holiday Classic. Women: all dated 2026-27 homes including WCC |
| SPU Volleyball + Basketball | Remaining 2026 VB homes and published 2026-27 basketball homes with listed opponents |
| O'Dea / Ballard / Roosevelt / Rainier Beach / Eastside Catholic / Bellevue HS Football | Remaining 2026 published homes only (Metro / KingCo). Sport tagged **HS Football** |
| Touring / exhibit sports | **None upcoming** with a published Seattle-city date after Sep 6, 2026. Exhibition / Touring sport + tag is wired for when dates publish |
| Seattle Torrent (PWHL) | Standings row only — 2026–27 Climate Pledge schedule unpublished |

Away games are excluded. If a conference basketball slate, HS conference week, or touring date was not published yet, it was omitted rather than invented.

## Prices

Every row has `estPriceEachUsd` (and a stored pair field) for mid-tier seats (not cheapest upper deck, not club). The UI defaults to **2 tickets** and scales displayed prices as `estPriceEachUsd × quantity` (1–19). Quantity lives in the URL (`qty=`) and `localStorage`. These are **unofficial estimates**. They will be wrong the moment inventory moves. Always buy from official club / Ticketmaster / authorized sellers.

The header stats show:

- How many events are visible after filters
- The **sum of estimates for the chosen quantity** if you bought every visible game
- The average estimate per game at that quantity

## Ticket links

Each game’s detail panel (click the team name, or **Details** on mobile) links out to check live prices:

- Official / primary hubs (mlb.com/mariners, seahawks.com, nhl.com/kraken, soundersfc.com, reignfc.com, storm.wnba.com, gohuskies.com, goseattleu.com, SPU ticket page, O'Dea / Eastside Catholic athletics, Seattle Public Schools digital tickets, plus venue Ticketmaster where useful)
- Marketplaces: Ticketmaster, StubHub, SeatGeek, TickPick, Vivid Seats

Marketplace URLs are **search links** for team + opponent + date, not reserved inventory. No affiliate parameters.

## Weather

Client-side [Open-Meteo](https://open-meteo.com/) forecast for Seattle (47.6062, −122.3321), no API key. About 16 days of daily high/low, precip chance, and wind. Dates beyond that window show **climatology** (“typical for that month in Seattle”), labeled as not a live forecast.

Outdoor venues (T-Mobile Park, Lumen Field, Husky Stadium, Husky Soccer Stadium, West Seattle Stadium, Northwest Athletic Complex, Southeast Athletic Complex, Eastside Catholic, Bellevue HS Stadium) treat weather as a go/wear decision. Indoor venues (Climate Pledge, Alaska Airlines Arena, Redhawk Center, Royal Brougham) still show a travel-day note.

## Travel

Venue profiles live in [`data/venues.json`](data/venues.json): address, neighborhood, transit (Link / bus), parking, rideshare, and Seattle traffic caveats. Surfaced in the same detail panel as tickets and weather.

## Shortlist and sharing

Check **Interested** on any row. Selection is stored in `localStorage` and in the URL (`ids=`). Share the link so a friend opens the same shortlist. **Copy summary** writes markdown with date, matchup, venue, pair estimate, weather blurb, travel one-liner, and ticket links. If the URL gets too long, share falls back to ids-only.

## Filters

Combine freely (also persisted in the URL):

- Search with autocomplete; arrows highlight a suggestion, **Enter** or **Select** applies it (or the typed query if nothing is highlighted). If the menu is closed, Enter opens it. Escape closes without changing filters. Team / sport / venue hits become filter chips; opponent and tag hits become a text query
- Sport, month, venue, and team **dropdowns**: type to narrow, arrows to move, **Enter** or **Select** applies the highlighted option immediately (same as click). Enter on a closed field opens the list. Escape closes without changing the selection
- Ticket quantity is a styled 1–19 listbox (arrows + Enter; Enter opens when closed)
- Category chips (Men / Women / Open — derived from sport: MLB/NFL/NHL/MLS/NCAA men’s / HS football → Men; NWSL/WNBA/NCAA women’s + volleyball / PWHL → Women; Exhibition / Touring → Open); arrows move between chips, Enter applies
- Optional date range
- Selected only
- Holiday / special browsing lives only on [`/holidays`](/holidays). Home does not have a holiday toggle.

## Holiday / special games

Rows are tagged in data (`specialTags`) for Labor Day weekend, Thanksgiving week, Christmas, New Year’s, MLK Day, Presidents Day, Apple Cup, Homecoming, Seattle Holiday Classic, Decision Day, and selected rivalries. Showcase cards, a badge key, and holiday-only browsing live on **Holidays**. The **Promotions** calendar lists published club/school theme nights and giveaways (bobbleheads, Homecoming, Decision Day, and the like) from [`data/promotions.json`](data/promotions.json). Holiday browsing without a published promo stays on **Holidays**. Matching games still show badges on Home.

## Daily refresh

A GitHub Action (`.github/workflows/daily-refresh.yml`) runs at **7:00 AM America/Los_Angeles** and on `workflow_dispatch`. Vercel Cron is not used: only a git commit can update the last-checked stamp and trigger a production redeploy.

GitHub cron is UTC-only, so the workflow fires at `0 14 * * *` (7:00 PDT) and `0 15 * * *` (7:00 PST). A gate step checks `TZ=America/Los_Angeles` and **no-ops unless the local hour is 07 or 08** (08 covers a late cron tick).

What it **does**:

- Regenerates `data/games.json` from `scripts/generate-games.py` (published-date seed)
- Runs `scripts/refresh-prices.py` (stub — live marketplace scrapes are not implemented)
- Writes `data/refresh.json` (`lastChecked`, `catalogAsOf`, whether the seed matched)
- Lints and builds
- If the catalog drifted from the seed: opens a PR (`chore/catalog-seed-drift`) for review
- If the catalog matched: commits the last-checked stamp to `main` so Vercel redeploys and the footer updates

What it **does not**:

- Scrape official or secondary ticket sites for live prices
- Invent unpublished conference basketball dates
- Bump `games.json` `asOf` just because the clock moved
- Pull standings or invent promo calendars (edit [`data/standings.json`](data/standings.json) when league tables move; edit [`data/promotions.json`](data/promotions.json) when clubs publish new nights)

The site shows a short **last checked** stamp in the header and **catalog as of** + last checked in the footer. Prices remain unofficial mid-tier estimates.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

`npm run lint` runs ESLint.

Data lives in [`data/games.json`](data/games.json). Published promotions live in [`data/promotions.json`](data/promotions.json). Types are in [`lib/types.ts`](lib/types.ts). To regenerate the game catalog after editing [`scripts/generate-games.py`](scripts/generate-games.py):

```bash
python3 scripts/generate-games.py
```

Standings live in [`data/standings.json`](data/standings.json) — the same seed style as the game catalog. Each row cites a published table and an `asOf` date. Refresh by editing that file when league tables move; the daily GitHub Action does **not** scrape live standings or invent college basketball records.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS v4
- Client-side [TanStack Table](https://tanstack.com/table) v9 for column sort
- Static JSON (no database, no auth)

## Deploy on Vercel

This is a standard Next.js app. No `vercel.json` is required.

1. Push the repo to GitHub.
2. In Vercel: **Add New Project** → import the repo.
3. Framework preset: Next.js. Build command: `npm run build`. Output: default.
4. Deploy. Subsequent pushes to `main` rebuild automatically if the project is git-linked.

Or with the Vercel CLI:

```bash
npx vercel
```

## Data sources (early Sep 2026)

- MLB.com, CBS Sports, Baseball-Reference — Mariners 2026
- Seahawks.com 2026 schedule release; ESPN NFL
- NHL.com/Kraken schedule + preseason releases; 2026–27 season listings
- SoundersFC / MLS / Ticketmaster home listings
- ReignFC.com single-match tickets
- Storm.wnba.com 2026 schedule
- MLB.com Mariners standings (66–77, 3rd AL West as of Sep 6, 2026)
- NFL.com 2026 NFC West standings (0–0–0 before Week 1)
- ESPN MLS / NWSL club tables (Sounders 7–6–9, 13th West; Reign 9–4–8, 9th)
- WNBA.com standings (Storm 8–32, 15th)
- GoHuskies.com / FOX Big Ten football (Huskies 0–0, AP 17 entering Apple Cup)
- GoHuskies.com football, basketball, volleyball, soccer
- GoSeattleU.com 2026-27 basketball schedules
- SPUFalcons.com 2026 volleyball and 2026-27 basketball schedules
- O’Dea.org / Ballard HS athletics / EastsideCatholic.org 2026 football schedules
- MaxPreps (WIAA partner) Roosevelt and Bellevue 2026-27 football glances
- Seattle Public Schools digital athletic tickets
- PWHL Seattle Torrent FAQ (2026–27 schedule unpublished as of Sep 6)

Kickoff times marked `TBD` were not published yet (common for Big Ten football flex windows and most college basketball tips).
