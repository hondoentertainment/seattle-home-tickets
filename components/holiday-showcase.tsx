import { formatGameDate, formatSpecialTag, formatUsd } from "@/lib/format";
import type { Game } from "@/lib/types";

export function HolidayShowcase({
  games,
  onOpen,
}: {
  games: Game[];
  onOpen: (game: Game) => void;
}) {
  if (!games.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-gold">Holiday / special</h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => onOpen(game)}
            className="rounded-2xl border border-gold/25 bg-gold/8 p-4 text-left transition hover:border-gold/50"
          >
            <p className="text-xs font-medium text-gold">
              {game.specialTags.map(formatSpecialTag).join(" · ")}
            </p>
            <p className="mt-1 font-semibold text-foreground">
              {game.team} vs {game.opponent}
            </p>
            <p className="mt-1 text-sm text-muted">
              {formatGameDate(game.date)} · {game.timePt} · {game.venue}
            </p>
            <p className="mt-2 text-sm text-accent">{formatUsd(game.estPricePairUsd)} pair est.</p>
          </button>
        ))}
      </div>
    </section>
  );
}
