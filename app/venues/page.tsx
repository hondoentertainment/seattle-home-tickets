import type { Metadata } from "next";
import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { venueCards, venueHref } from "@/lib/venue-index";

export const metadata: Metadata = {
  title: "Venues — Seattle Home Tickets",
  description:
    "Seattle-area venues on the published home calendar: address, transit, parking, indoor vs outdoor, and which teams play there.",
};

export default function VenuesPage() {
  const cards = venueCards();

  return (
    <div className="page-gutter mx-auto w-full max-w-7xl flex-1 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Venues
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Buildings on this calendar. Tap a venue to see its games. Travel notes are typical
        gameday guidance, not live lot status.
      </p>

      <ul className="mt-6 grid gap-4 lg:grid-cols-2">
        {cards.map(({ venue, teams, gameCount }) => (
          <li key={venue.name} className="rounded-2xl border border-card-border bg-card/80 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-semibold text-foreground">{venue.name}</h2>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                {venue.indoor ? "Indoor" : "Outdoor"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              {venue.neighborhood} · {venue.address}
            </p>
            <p className="mt-3 text-xs text-muted">
              {gameCount} published home {gameCount === 1 ? "game" : "games"}
              {teams.length ? ` · ${teams.join(", ")}` : ""}
            </p>
            <details className="mt-3 text-sm text-muted">
              <summary className="cursor-pointer font-medium text-foreground">Getting there</summary>
              <div className="mt-2 space-y-2 text-xs leading-5">
                <p>
                  <span className="text-foreground">Transit.</span> {venue.transit}
                </p>
                <p>
                  <span className="text-foreground">Parking.</span> {venue.parking}
                </p>
                <p>
                  <span className="text-foreground">Rideshare.</span> {venue.rideshare}
                </p>
                <p>
                  <span className="text-foreground">Traffic.</span> {venue.traffic}
                </p>
              </div>
            </details>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={venueHref(venue.name)}
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-3 text-xs font-semibold text-background"
              >
                See games
              </Link>
              <a
                href={venue.officialTickets}
                className="inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Official tickets
              </a>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-muted">as of {catalog.asOf}</p>
    </div>
  );
}
