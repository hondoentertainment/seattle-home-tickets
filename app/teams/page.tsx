import type { Metadata } from "next";
import Link from "next/link";
import { TeamMark } from "@/components/team-mark";
import { catalog } from "@/lib/catalog";
import { isCollegeTeam, sportTileLabel, teamCards, teamHref, teamKey } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Teams — Seattle Home Tickets",
  description:
    "Seattle home teams as original color tiles. College tiles include the sport so UW football and basketball stay distinct.",
};

export default function TeamsPage() {
  const cards = teamCards();

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Roster</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Teams
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Original monogram tiles — not official club marks. College programs print the sport on
        the tile so football and basketball don&apos;t collide. Click a tile to open Home filtered
        to that club. Season W–L lives on{" "}
        <Link href="/standings" className="text-accent hover:underline">
          Standings
        </Link>
        .
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={teamKey(card)}>
            <Link
              href={teamHref(card)}
              className="flex items-center gap-4 rounded-2xl border border-card-border bg-card/80 p-4 transition hover:border-accent/40"
            >
              <TeamMark mark={card} />
              <span className="min-w-0">
                <span className="block font-semibold text-foreground">{card.team}</span>
                {isCollegeTeam(card.team) && card.sport ? (
                  <span className="mt-1 inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    {sportTileLabel(card.sport)}
                  </span>
                ) : (
                  <span className="mt-1 block text-xs text-muted">{card.short}</span>
                )}
                <span className="mt-1 block text-xs text-muted">
                  {card.gameCount} published home {card.gameCount === 1 ? "game" : "games"}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-muted">as of {catalog.asOf}</p>
    </div>
  );
}
