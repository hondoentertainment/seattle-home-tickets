import type { Metadata } from "next";
import Link from "next/link";
import { formatGameDate, formatUsd } from "@/lib/format";
import { catalogStats } from "@/lib/stats";
import type { StatRow } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Ticket Stats — Seattle Home Tickets",
  description:
    "Catalog ticket counts and unofficial mid-tier estimate totals for published Seattle home games — not on-field W–L.",
};

export default function StatsPage() {
  const stats = catalogStats(2);

  return (
    <div className="page-gutter mx-auto w-full max-w-7xl flex-1 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Ticket stats
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Catalog counts and unofficial mid-tier totals at 2 tickets
        {stats.dateFrom && stats.dateTo
          ? ` (${formatGameDate(stats.dateFrom)} – ${formatGameDate(stats.dateTo)})`
          : ""}
        . Not live prices, and not team W–L — that is on{" "}
        <Link href="/standings" className="text-accent hover:underline">
          Standings
        </Link>
        .
      </p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Games", String(stats.gameCount)],
          ["Teams", String(stats.teamCount)],
          ["Sports", String(stats.sportCount)],
          ["Venues", String(stats.venueCount)],
          ["Weekends", String(stats.weekendCount)],
          ["Holidays / specials", String(stats.holidayCount)],
          ["Est. total @ qty 2", formatUsd(stats.totalAtQty)],
          ["Avg / game @ qty 2", formatUsd(stats.avgAtQty)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-card-border bg-card/80 px-4 py-3">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      <Section title="By team" column="Team" rows={stats.byTeam} />
      <Section title="By sport" column="Sport" rows={stats.bySport} />
      <Section title="By month" column="Month" rows={stats.byMonth} />
      <Section title="By venue" column="Venue" rows={stats.byVenue} />
    </div>
  );
}

function Section({
  title,
  column,
  rows,
}: {
  title: string;
  column: string;
  rows: StatRow[];
}) {
  return (
    <section className="mt-8 space-y-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="overflow-x-auto rounded-2xl border border-card-border">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-background/70 text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-3 py-2 font-semibold">{column}</th>
              <th className="px-3 py-2 font-semibold">Games</th>
              <th className="px-3 py-2 font-semibold">Est. for 2 tickets</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-card-border/70">
                <td className="px-3 py-2 text-foreground">{row.label}</td>
                <td className="px-3 py-2 tabular-nums text-muted">{row.count}</td>
                <td className="px-3 py-2 tabular-nums text-muted">{formatUsd(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
