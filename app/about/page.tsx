import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "FAQ — Seattle Home Tickets",
  description:
    "FAQ for Seattle Home Tickets: unofficial estimates, sources, weather, shortlist, quantity, holidays, refresh, and trademarks.",
};

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: "What is this site?",
    a: (
      <>
        A planning board for published Seattle-area <span className="text-foreground">home</span>{" "}
        sporting events. Scan the slate, shortlist nights, and jump to official or
        marketplace pages. It is not a box office and does not sell tickets.
      </>
    ),
  },
  {
    q: "Are these live ticket prices?",
    a: (
      <>
        No. Each row is an unofficial mid-tier estimate per seat (not cheapest upper
        deck, not club). Group totals are{" "}
        <span className="text-foreground">est. each × quantity</span>. They will be
        wrong the moment inventory moves. Always confirm on the official club or
        school site. {catalog.priceDisclaimer}
      </>
    ),
  },
  {
    q: "What does quantity do?",
    a: (
      <>
        Defaults to 2 tickets and scales from 1–19. Quantity lives in the URL (
        <code className="text-foreground">qty=</code>) and localStorage. Marketplace
        search links append qty where those sites commonly accept it. Official hubs
        are still per-listing.
      </>
    ),
  },
  {
    q: "What’s on the calendar?",
    a: (
      <>
        {catalog.scope} Seeded as of {catalog.asOf}. Away games, unpublished conference
        or HS weeks, and touring dates without a published Seattle venue are omitted
        rather than invented.
      </>
    ),
  },
  {
    q: "Do you include high schools and touring events?",
    a: (
      <>
        Large Seattle-area high-school football homes are included when a date and
        venue are published (sport tag <span className="text-foreground">HS Football</span>
        ). HS basketball and later Metro/KingCo weeks are skipped until dated.
        Exhibition / Touring is wired as a sport and filter tag, but no upcoming
        Seattle-city touring date was published after Sep 6, 2026 (Globetrotters Feb
        1 already played; PWHL Torrent schedule unpublished).
      </>
    ),
  },
  {
    q: "How do search and filters work?",
    a: (
      <>
        Type in search; arrows highlight a suggestion; <span className="text-foreground">Enter</span> or{" "}
        <span className="text-foreground">Select</span> applies it (or the typed
        query if nothing is highlighted). Filter dropdowns work the same: type,
        arrow, then Enter or Select. Enter on a closed field opens the list. Escape
        closes without changing filters. Sport, team, venue, month, men/women, date
        range, and Saved combine freely in the URL.
      </>
    ),
  },
  {
    q: "What is a shortlist?",
    a: (
      <>
        Check <span className="text-foreground">Interested</span> on a row to add it to
        Saved. Open the list from the <span className="text-foreground">Saved</span> chip,
        the Menu entry, or the desktop nav. The count updates as you add or remove
        nights. Selection is stored in localStorage and <code className="text-foreground">ids=</code>{" "}
        in the URL so you can share the same slate with prices. Copy writes markdown with
        date, matchup, venue, estimate, weather, travel, and ticket links.
      </>
    ),
  },
  {
    q: "How does weather work?",
    a: (
      <>
        Browser fetch from{" "}
        <a href="https://open-meteo.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
          Open-Meteo
        </a>{" "}
        for Seattle (47.6062, −122.3321). About 16 days of high/low, precip chance,
        and wind. Farther dates use monthly climatology, labeled as not a live
        forecast. Outdoor venues treat it as a go / what-to-wear note; indoor venues
        still show a travel-day snapshot.
      </>
    ),
  },
  {
    q: "Where are travel notes?",
    a: (
      <>
        Each game’s detail drawer and the{" "}
        <Link href="/venues" className="text-accent hover:underline">
          Venues
        </Link>{" "}
        page reuse the same profiles (address, neighborhood, Link/bus, parking,
        rideshare, traffic). Typical gameday guidance, not live lot availability.
      </>
    ),
  },
  {
    q: "Holidays vs Promotions?",
    a: (
      <>
        <Link href="/holidays" className="text-accent hover:underline">
          Holidays
        </Link>{" "}
        is the showcase and holiday-only browse (Labor Day, Thanksgiving week,
        Christmas, Homecoming, Apple Cup, and the like).{" "}
        <Link href="/promotions" className="text-accent hover:underline">
          Promotions
        </Link>{" "}
        lists published theme nights and giveaways only — incomplete club calendars
        are marked, nothing is filled in.
      </>
    ),
  },
  {
    q: "Standings vs Ticket Stats?",
    a: (
      <>
        <Link href="/standings" className="text-accent hover:underline">
          Standings
        </Link>{" "}
        is published W–L / points from cited league tables (or “upcoming” with no
        invented record).{" "}
        <Link href="/stats" className="text-accent hover:underline">
          Ticket Stats
        </Link>{" "}
        is catalog counts and unofficial estimate totals — not on-field performance.
      </>
    ),
  },
  {
    q: "When does the catalog refresh?",
    a: (
      <>
        A GitHub Action re-validates the published seed every day at 7:00 AM Pacific
        and stamps “last checked” under the nav and in the footer. It does not scrape
        live prices, invent unpublished dates, or pull standings.
      </>
    ),
  },
  {
    q: "Can I use official logos?",
    a: (
      <>
        No. Tiles are original monograms, not official or trademarked club marks.
        We do not ship team logo files.
      </>
    ),
  },
  {
    q: "Do you have affiliates or sell tickets?",
    a: (
      <>
        No affiliate parameters. Marketplace URLs are search links for team +
        opponent + date, not reserved inventory. For a real purchase or refund, use{" "}
        <Link href="/contact" className="text-accent hover:underline">
          Contact
        </Link>{" "}
        to reach the official ticket office.
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <article className="page-gutter mx-auto w-full max-w-3xl flex-1 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">FAQ</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Short answers. Official ticket offices are on{" "}
        <Link href="/contact" className="text-accent hover:underline">
          Contact
        </Link>
        ; buildings are on{" "}
        <Link href="/venues" className="text-accent hover:underline">
          Venues
        </Link>
        .
      </p>

      <dl className="mt-10 space-y-8">
        {faqs.map((item) => (
          <div key={item.q}>
            <dt className="text-lg font-semibold text-foreground">{item.q}</dt>
            <dd className="mt-2 text-sm leading-7 text-muted">{item.a}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12 space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Sources</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
          {catalog.sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Intentionally omitted</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
          {catalog.omissions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <p className="mt-12">
        <Link href="/" className="text-sm font-medium text-accent hover:underline">
          ← Back to the calendar
        </Link>
      </p>
    </article>
  );
}
