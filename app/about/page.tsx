import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { PRODUCT_NAME, pageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("FAQ"),
  description: `FAQ for ${PRODUCT_NAME}: unofficial estimates, sources, weather, shortlist, quantity, holidays, library, refresh, and trademarks.`,
};

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: "What is this site?",
    a: (
      <>
        {PRODUCT_NAME} is a planning board for published Seattle-area{" "}
        <span className="text-foreground">home</span> sporting events. Scan the slate,
        save nights, and jump to official or marketplace pages. It is unofficial: not
        a box office, not affiliated with the clubs or schools, and it does not sell
        tickets.
      </>
    ),
  },
  {
    q: "Are these live ticket prices?",
    a: (
      <>
        No. Each row is an unofficial mid-tier estimate per seat (not cheapest upper
        deck, not club). We also show a typical band around that seed (~75–135%) and
        the last-checked stamp — not live marketplace ranges. Group totals are{" "}
        <span className="text-foreground">est. each × quantity</span>. They are not
        quotes, face values, or reserved inventory. Confirm on official or
        marketplace search links. {catalog.priceDisclaimer}
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
        Type in <span className="text-foreground">Search games</span>; arrows highlight
        a suggestion; <span className="text-foreground">Enter</span> or{" "}
        <span className="text-foreground">Search</span> applies it. Advanced options
        stay behind <span className="text-foreground">Filters</span>; active ones show
        as chips you can tap to remove. Sport, team, venue, month, men/women, date
        range, and Saved combine in the URL.
      </>
    ),
  },
  {
    q: "How do I save games?",
    a: (
      <>
        Tap <span className="text-foreground">Save</span> on a row (it switches to{" "}
        <span className="text-foreground">Saved</span>) to add it to the Saved list.
        Open that list from <span className="text-foreground">Saved</span> on{" "}
        <Link href="/profile" className="text-accent hover:underline">
          Profile
        </Link>
        . Signed out, the list stays in this
        browser&apos;s localStorage. Sign in with Google to merge that list onto your
        account (union on first login this session, then the server copy wins). Share
        URLs still use <code className="text-foreground">ids=</code> so a friend can
        open the same slate without an account. Copied markdown includes unofficial
        estimates, weather, travel, and ticket search links — not a checkout.
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
        is a date-first list of published theme nights and giveaways. Tap a night
        for tickets or Save. Incomplete club calendars stay empty — nothing is
        filled in.
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
    q: "Where is my profile?",
    a: (
      <>
        <Link href="/profile" className="text-accent hover:underline">
          Profile
        </Link>{" "}
        is in the header and desktop nav. Signed out, My teams, alerts, quantity,
        and Saved still work on this device. Continue with Google only appears when OAuth
        secrets are configured. We do not send email or web-push.
      </>
    ),
  },
  {
    q: "What are My teams?",
    a: (
      <>
        Pin Seattle clubs on Home, Teams, or{" "}
        <Link href="/profile" className="text-accent hover:underline">
          Profile
        </Link>
        . First visit offers a short <strong>Pick your teams</strong> prompt (not a
        wizard). Home defaults to those pins (big clubs + Huskies until you edit).{" "}
        <strong>All</strong> shows the full published slate without deleting pins.
        Pins live in this browser.
      </>
    ),
  },
  {
    q: "Do you send price or weather alerts?",
    a: (
      <>
        <Link href="/alerts" className="text-accent hover:underline">
          Alerts
        </Link>{" "}
        stores in-app preferences (price cap, published promo nights, outdoor weather
        risk, tomorrow’s Saved). Matching games are listed on that page. We do{" "}
        <span className="text-foreground">not</span> send email or web-push yet — do
        not expect a notification on your lock screen.
      </>
    ),
  },
  {
    q: "Can I share a group shortlist?",
    a: (
      <>
        Saved → <strong>Copy invite</strong> makes a link with{" "}
        <code className="text-foreground">ids=</code> and{" "}
        <code className="text-foreground">invite=1</code>. Friends can add those
        published games to their Saved. That is a shared list, not RSVP.
      </>
    ),
  },
  {
    q: "When does the catalog refresh?",
    a: (
      <>
        A GitHub Action re-validates the published seed every day at 7:00 AM Pacific
        (and when someone runs it from the Actions tab or the header{" "}
        <strong>Refresh</strong> icon, if a dispatch token is configured). It
        writes a real last-checked timestamp in the footer, then commits
        so Vercel redeploys. It does not scrape live prices, invent unpublished
        dates, or pull standings. Catalog “as of” comes from the seed file, not from
        the clock. Header <strong>Refresh</strong> reloads this page and, when{" "}
        <code className="text-foreground">GH_REFRESH_TOKEN</code> is set, queues that
        Action — it will not claim a live rebuild. If the seed and{" "}
        <code className="text-foreground">data/games.json</code> differ, the stamp
        says seed review pending and the job opens a PR instead of silently changing
        the slate.
      </>
    ),
  },
  {
    q: "What’s the Library?",
    a: (
      <>
        <Link href="/library" className="text-accent hover:underline">
          Library
        </Link>{" "}
        is an unofficial reading list — real books, articles, and podcasts for
        Seattle home teams. Filter by club. Links leave the site. It is a fan and
        editorial collection, not affiliated with leagues, clubs, or schools. Thin
        shelves (Torrent, Reign books, prep sports) stay thin instead of padded.
      </>
    ),
  },
  {
    q: "Can I use official logos?",
    a: (
      <>
        No. Tiles are original monograms, not official or trademarked club marks.
        We do not ship team logo files. Club, league, venue, and school names remain
        trademarks of their owners. This site is unofficial and is not endorsed by
        those organizations.
      </>
    ),
  },
  {
    q: "Do you have affiliates or sell tickets?",
    a: (
      <>
        No affiliate parameters and no ticket sales. Marketplace URLs (including
        Facebook Marketplace in Seattle) are search links for team + opponent +
        date, not reserved inventory or in-app checkout. For a real purchase or
        refund, use{" "}
        <Link href="/contact" className="text-accent hover:underline">
          Contact
        </Link>{" "}
        to reach the official ticket office.
      </>
    ),
  },
  {
    q: "Can I sign in with Google?",
    a: (
      <>
        Yes, when Google sign-in is offered: tap{" "}
        <span className="text-foreground">Continue with Google</span>. That only
        syncs Saved games to your account. The calendar stays public. If sign-in
        isn’t shown, the list stays in this browser. Share URLs with{" "}
        <code className="text-foreground">ids=</code> still work either way.
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <article className="page-gutter mx-auto w-full max-w-3xl flex-1 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        FAQ
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
