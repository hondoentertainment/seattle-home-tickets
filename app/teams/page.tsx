import type { Metadata } from "next";
import Link from "next/link";
import { PinTeamButton } from "@/components/pin-team-button";
import { TeamMark } from "@/components/team-mark";
import { catalog } from "@/lib/catalog";
import { pageTitle } from "@/lib/brand";
import { isSchoolTeam, sportTileLabel, teamCards, teamHref, teamKey } from "@/lib/teams";

export const metadata: Metadata = {
  title: pageTitle("Teams"),
  description:
    "Seattle home teams as original color tiles. College and high-school tiles include the sport so football and basketball stay distinct.",
};

export default function TeamsPage() {
  const cards = teamCards();

  return (
    <div className="page-gutter mx-auto w-full max-w-7xl flex-1 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Teams
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Tap a team to see its home games. Pin clubs for Home’s My teams filter. Tiles are
        original monograms, not official logos.
        Records are on{" "}
        <Link href="/standings" className="text-accent hover:underline">
          Standings
        </Link>
        .
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={teamKey(card)} className="flex items-center gap-3 rounded-2xl border border-card-border bg-card/80 p-4">
            <Link href={teamHref(card)} className="flex min-w-0 flex-1 items-center gap-4">
              <TeamMark mark={card} />
              <span className="min-w-0">
                <span className="block font-semibold text-foreground">{card.team}</span>
                {isSchoolTeam(card.team) && card.sport ? (
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
            <PinTeamButton team={card.team} />
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-muted">as of {catalog.asOf}</p>
    </div>
  );
}
