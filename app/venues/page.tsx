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
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Places</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Venues
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Typical gameday notes from the catalog — not live lot or transit status. Click a
        venue to open Home filtered to that building. Official guest-services pages are on{" "}
        <Link href="/contact" className="text-accent hover:underline">
          Contact
        </Link>
        .
      </p>

      <ul className="mt-6 grid gap-4 lg:grid-cols-2">
        {cards.map(({ venue, teams, sports, gameCount }) => (
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
            <p className="mt-3 text-sm leading-6 text-muted">
              <span className="text-foreground">Transit.</span> {venue.transit}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              <span className="text-foreground">Parking.</span> {venue.parking}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              <span className="text-foreground">Rideshare.</span> {venue.rideshare}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              <span className="text-foreground">Traffic.</span> {venue.traffic}
            </p>
            <p className="mt-3 text-xs text-muted">
              {gameCount} published home {gameCount === 1 ? "game" : "games"}
              {teams.length ? ` · ${teams.join(", ")}` : ""}
              {sports.length ? ` · ${sports.join(", ")}` : ""}
            </p>
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
              <Link href={venueHref(venue.name)} className="text-accent hover:underline">
                Filter Home
              </Link>
              <a
                href={venue.officialTickets}
                className="text-muted hover:text-foreground hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Official tickets
              </a>
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-muted">as of {catalog.asOf}</p>
    </div>
  );
}
