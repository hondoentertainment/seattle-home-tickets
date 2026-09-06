import type { Metadata } from "next";
import Link from "next/link";
import { TeamMark } from "@/components/team-mark";
import {
  standingHref,
  standingMark,
  standingSportLabel,
  standingsCatalog,
  type StandingRow,
} from "@/lib/standings";

export const metadata: Metadata = {
  title: "Standings — Seattle Home Tickets",
  description:
    "Published season standings for Seattle clubs and large high-school programs on this calendar. Upcoming sports are listed without invented records.",
};

export default function StandingsPage() {
  const published = standingsCatalog.rows.filter((row) => row.status === "published");
  const upcoming = standingsCatalog.rows.filter((row) => row.status === "upcoming");

  return (
    <div className="page-gutter mx-auto w-full max-w-7xl flex-1 py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Tables</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Standings
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        {standingsCatalog.disclaimer} Snapshot date{" "}
        <span className="text-foreground">{standingsCatalog.asOf}</span> (
        {standingsCatalog.timezone}).
      </p>
      <p className="mt-3 text-sm">
        <Link href="/stats" className="text-accent hover:underline">
          Ticket Stats
        </Link>
        {" · "}
        <Link href="/teams" className="text-accent hover:underline">
          Teams
        </Link>
      </p>

      <Section title="In season" rows={published} />
      <Section title="Not started / unpublished" rows={upcoming} />
    </div>
  );
}

function Section({ title, rows }: { title: string; rows: StandingRow[] }) {
  return (
    <section className="mt-8 space-y-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="grid gap-3 lg:grid-cols-2">
        {rows.map((row) => (
          <StandingCard key={row.id} row={row} />
        ))}
      </ul>
    </section>
  );
}

function StandingCard({ row }: { row: StandingRow }) {
  const mark = standingMark(row);
  const tableRank =
    row.status === "published" &&
    row.rank != null &&
    row.rankOf != null &&
    (row.gamesPlayed ?? 0) > 0;

  return (
    <li className="rounded-2xl border border-card-border bg-card/80 p-4">
      <div className="flex items-start gap-4">
        {mark ? <TeamMark mark={mark} /> : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{row.team}</h3>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              {standingSportLabel(row)}
            </span>
            {row.status === "upcoming" ? (
              <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                Upcoming
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted">
            {row.division ? `${row.division} · ` : ""}
            {row.conference} · {row.season}
          </p>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">
            {row.recordLabel}
          </p>
          <p className="mt-1 text-sm text-muted">
            {row.positionLabel}
            {tableRank ? ` · ${row.rank} of ${row.rankOf}` : null}
            {row.gamesBack != null ? ` · ${row.gamesBack} GB` : null}
            {row.streak ? ` · ${row.streak}` : null}
          </p>
          {row.note ? <p className="mt-3 text-sm leading-6 text-muted">{row.note}</p> : null}
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
            <Link href={standingHref(row)} className="text-accent hover:underline">
              Filter Home
            </Link>
            <a
              href={row.sourceUrl}
              className="text-muted hover:text-foreground hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.source}
            </a>
            <span className="text-muted">as of {row.asOf}</span>
          </p>
        </div>
      </div>
    </li>
  );
}
