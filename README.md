# Seattle Home Tickets

A Next.js (App Router) site that lists **published Seattle HOME sporting events** with unofficial mid-tier ticket estimates for **two seats**. Search, filter, and sort the slate in the browser — no auth, no live ticket API.

Seeded from official and league schedules researched **as of 6 September 2026**. Prices are estimates, not quotes.

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
| Seattle U M/W Basketball | Published non-conference homes (+ Holiday Classic for men) |
| SPU Volleyball + Basketball | Remaining 2026 VB homes and published 2026-27 basketball homes with listed opponents |

Away games are excluded. If a conference basketball slate was not dated yet, it was omitted rather than invented.

## Prices

Every row has `estPriceEachUsd` and `estPricePairUsd` for two mid-tier seats (not cheapest upper deck, not club). These are **unofficial estimates** based on typical 2026 secondary/official ranges for that opponent and venue. They will be wrong the moment inventory moves. Always buy from official club / Ticketmaster / authorized sellers.

The header stats show:

- How many events are visible after filters
- The **sum of pair estimates** if you bought every visible game
- The average pair estimate on screen

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

Data lives in [`data/games.json`](data/games.json). Types are in [`lib/types.ts`](lib/types.ts). To regenerate the JSON after editing [`scripts/generate-games.py`](scripts/generate-games.py):

```bash
python3 scripts/generate-games.py
```

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
- GoHuskies.com football, basketball, volleyball, soccer
- GoSeattleU.com 2026-27 basketball schedules
- SPUFalcons.com 2026 volleyball and 2026-27 basketball schedules

Kickoff times marked `TBD` were not published yet (common for Big Ten football flex windows and most college basketball tips).
