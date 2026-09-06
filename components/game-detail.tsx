import { GENDER_LABELS, venueFor } from "@/lib/catalog";
import { formatGameDate, formatUsd } from "@/lib/format";
import { ticketLinks } from "@/lib/tickets";
import type { Game, WeatherBlurb } from "@/lib/types";

export function GameDetail({
  game,
  weather,
  onClose,
}: {
  game: Game;
  weather?: WeatherBlurb;
  onClose: () => void;
}) {
  const venue = venueFor(game.venue);
  const links = ticketLinks(game, venue);

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
          <dt className="text-xs text-muted">Est. each / pair</dt>
          <dd className="font-semibold text-accent">
            {formatUsd(game.estPriceEachUsd)} / {formatUsd(game.estPricePairUsd)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Category</dt>
          <dd>{GENDER_LABELS[game.gender]}</dd>
        </div>
      </dl>
      {game.specialTags.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {game.specialTags.map((tag) => (
            <span key={tag} className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-muted">{game.priceNotes}</p>

      <section className="mt-5 space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Check live prices</h3>
        <p className="text-xs text-muted">
          Marketplace links are search URLs for this matchup and date — not reserved inventory.
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
            </a>
          ))}
        </div>
      </section>

      <section className="mt-5 space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Weather {venue?.indoor ? "(travel day — indoor venue)" : "(outdoor venue)"}
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
