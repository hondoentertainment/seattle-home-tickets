import { venueFor } from "@/lib/catalog";
import { formatGameDate, formatSpecialTag, formatUsd } from "@/lib/format";
import { DEFAULT_QTY, estimateForQty, qtyEstimateLabel } from "@/lib/quantity";
import { ticketLinks } from "@/lib/tickets";
import type { Game, WeatherBlurb } from "@/lib/types";

export function GameDetail({
  game,
  weather,
  qty = DEFAULT_QTY,
  onClose,
}: {
  game: Game;
  weather?: WeatherBlurb;
  qty?: number;
  onClose: () => void;
}) {
  const venue = venueFor(game.venue);
  const links = ticketLinks(game, venue, qty);
  const group = estimateForQty(game.estPriceEachUsd, qty);

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 max-h-[85vh] overflow-y-auto rounded-t-3xl border border-card-border bg-card p-5 shadow-2xl md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[28rem] md:max-h-none md:rounded-none md:border-l">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-accent">{game.sport}</p>
          <h2 className="text-xl font-semibold text-foreground">
            {game.team} vs {game.opponent}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {formatGameDate(game.date)} · {game.timePt} PT · {game.tv}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-card-border px-3 py-1 text-sm text-muted hover:text-foreground"
        >
          Close
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted">{qtyEstimateLabel(qty)}</dt>
          <dd className="font-semibold text-accent">{formatUsd(group)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Est. each</dt>
          <dd>{formatUsd(game.estPriceEachUsd)}</dd>
        </div>
      </dl>
      {game.specialTags.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {game.specialTags.map((tag) => (
            <span key={tag} className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold">
              {formatSpecialTag(tag)}
            </span>
          ))}
        </div>
      ) : null}
      {game.priceNotes ? (
        <details className="mt-3 text-xs leading-5 text-muted">
          <summary className="cursor-pointer text-foreground hover:text-accent">Estimate note</summary>
          <p className="mt-2">{game.priceNotes}</p>
        </details>
      ) : null}

      <section className="mt-5 space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Tickets</h3>
        <p className="text-xs text-muted">
          Marketplace links include a quantity hint where the site accepts one. Official
          hubs are per-listing — multiply the seat price by {qty} if needed.
        </p>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full border px-3 py-1.5 text-xs ${
                link.kind === "official"
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-card-border text-muted hover:text-foreground"
              }`}
            >
              {link.label}
              {link.qtyApplied ? ` · ${qty}` : ""}
            </a>
          ))}
        </div>
      </section>

      <section className="mt-5 space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Weather
          {venue ? (
            <span className="ml-2 text-xs font-normal text-muted">
              {venue.indoor ? "Indoor · travel day" : "Outdoor"}
            </span>
          ) : null}
        </h3>
        {weather ? (
          <p className="text-sm text-muted">
            <span className="text-foreground">{weather.label}.</span> {weather.detail}
          </p>
        ) : (
          <p className="text-sm text-muted">Loading Seattle weather…</p>
        )}
      </section>

      {venue ? (
        <section className="mt-5 space-y-2 text-sm text-muted">
          <h3 className="text-sm font-semibold text-foreground">Getting there</h3>
          <p>
            <span className="text-foreground">{venue.neighborhood}</span> · {venue.address}
          </p>
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
        </section>
      ) : null}
    </aside>
  );
}
