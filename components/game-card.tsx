import { SaveToggle } from "@/components/save-toggle";
import { TeamMark } from "@/components/team-mark";
import { formatCardDateParts, formatUsd } from "@/lib/format";
import { estimateForQty } from "@/lib/quantity";
import { displayMark } from "@/lib/teams";
import type { Game } from "@/lib/types";

export function GameCard({
  game,
  qty,
  saved,
  onOpen,
  onToggleSave,
}: {
  game: Game;
  qty: number;
  saved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
}) {
  const date = formatCardDateParts(game.date);
  const home = displayMark(game.team, game.sport);
  const away = displayMark(game.opponent, game.sport);
  const price = formatUsd(estimateForQty(game.estPriceEachUsd, qty));
  const matchup = `${game.team} vs ${game.opponent}`;

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-card-border bg-card px-3 py-3">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="w-14 shrink-0">
          <span className="block text-[11px] font-semibold tracking-wide text-muted">{date.dow}</span>
          <span className="block text-sm font-bold leading-5 text-foreground">{date.monthDay}</span>
          <span className="block text-[11px] text-muted">{game.timePt}</span>
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <TeamMark mark={home} size="card" />
          <span className="text-xs font-semibold text-muted">vs</span>
          <TeamMark mark={away} size="card" />
          <span className="sr-only">{matchup}</span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-[11px] text-muted">from</span>
          <span className="block text-base font-bold tabular-nums text-foreground">{price}</span>
          <span className="block text-[11px] text-muted">for {qty}</span>
        </span>
      </button>
      <SaveToggle variant="heart" saved={saved} onToggle={onToggleSave} matchup={matchup} />
    </article>
  );
}
