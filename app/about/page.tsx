import type { Metadata } from "next";
import Link from "next/link";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About — Seattle Home Tickets",
  description:
    "How Seattle Home Tickets estimates mid-tier ticket prices, weather, travel, and marketplace links for published Seattle home games.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">About</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        A planning board for Seattle home tickets
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        This site is for Seattle fans who want to scan the published{" "}
        <span className="text-foreground">home</span> slate, shortlist a few nights with
        friends, and jump out to official or marketplace pages to check live inventory.
        It is not a box office.
      </p>
      <p className="mt-6">
        <Link
          href="/"
          className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background"
        >
          Back to the calendar
        </Link>
      </p>

      <section className="mt-12 space-y-3">
        <h2 className="text-xl font-semibold text-foreground">How estimates work</h2>
        <p className="leading-7 text-muted">{catalog.priceDisclaimer}</p>
        <p className="leading-7 text-muted">
          Each row lists an unofficial mid-tier price per seat (not cheapest upper deck,
          not club). The calendar defaults to planning for two tickets and lets you
          scale from 1–19. Displayed group prices and totals are{" "}
          <span className="text-foreground">est. each × quantity</span>. They will be
          wrong the moment inventory moves. Always confirm on official club sites before
          you spend.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Weather</h2>
        <p className="leading-7 text-muted">
          Game-day weather is fetched in the browser from{" "}
          <a
            href="https://open-meteo.com/"
            className="text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open-Meteo
          </a>{" "}
          for Seattle (47.6062, −122.3321). No API key. About 16 days of daily high/low,
          precip chance, and wind. Farther dates use monthly climatology (“typical for
          that month in Seattle”), labeled as not a live forecast.
        </p>
        <p className="leading-7 text-muted">
          Outdoor venues (T-Mobile Park, Lumen Field, Husky Stadium, Husky Soccer
          Stadium) treat weather as a go / what-to-wear note. Indoor venues (Climate
          Pledge Arena, Alaska Airlines Arena, Redhawk Center, Royal Brougham Pavilion)
          still show a travel-day snapshot and are marked indoor.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Travel notes</h2>
        <p className="leading-7 text-muted">
          Venue profiles in <code className="text-foreground">data/venues.json</code>{" "}
          cover neighborhood, address, Link / bus tips, parking, rideshare, and generic
          Seattle traffic caveats. They are typical gameday guidance, not live transit
          or lot availability.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ticket links</h2>
        <p className="leading-7 text-muted">
          The detail drawer links to official hubs (club sites and venue box offices)
          plus Ticketmaster, StubHub, SeatGeek, TickPick, and Vivid Seats. Marketplace
          URLs are search links for team + opponent + date — not reserved inventory.
          Quantity is appended where those sites commonly accept{" "}
          <code className="text-foreground">qty</code> /{" "}
          <code className="text-foreground">quantity</code>; official hubs are still
          per-listing, so multiply the seat price if the site ignores it. There are no
          affiliate parameters.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-foreground">What’s on the calendar</h2>
        <p className="leading-7 text-muted">{catalog.scope}</p>
        <p className="leading-7 text-muted">
          Seeded from official and league schedules as of {catalog.asOf}. Conference
          basketball homes without published dates are omitted rather than invented.
          A GitHub Action re-validates the published seed every day at 7:00 AM Pacific
          and stamps “last checked” under the nav and in the footer. It does not scrape
          live prices or invent unpublished dates. Published theme nights and giveaways
          live on Promotions — incomplete club calendars are marked instead of filled in.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Sources</h2>
        <ul className="list-disc space-y-2 pl-5 leading-7 text-muted">
          {catalog.sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Intentionally omitted</h2>
        <ul className="list-disc space-y-2 pl-5 leading-7 text-muted">
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
