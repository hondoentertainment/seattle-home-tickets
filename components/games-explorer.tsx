"use client";

import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { allSports, allTeams, catalog } from "@/lib/catalog";
import { formatGameDate, formatUsd, parseIsoDate } from "@/lib/format";
import type { Game } from "@/lib/types";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

const helper = createColumnHelper<typeof features, Game>();

const columns = helper.columns([
  helper.accessor("date", {
    header: "Date",
    sortFn: (a, b) => parseIsoDate(a.original.date) - parseIsoDate(b.original.date),
    cell: (info) => (
      <div>
        <div className="font-medium text-foreground">{formatGameDate(info.row.original.date)}</div>
        <div className="text-xs text-muted">{info.row.original.day}</div>
      </div>
    ),
  }),
  helper.accessor("team", {
    header: "Team",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  helper.accessor("sport", { header: "Sport" }),
  helper.accessor("opponent", { header: "Opponent" }),
  helper.accessor("venue", { header: "Venue" }),
  helper.accessor("timePt", {
    header: "Time",
    cell: (info) => (
      <div>
        <div>{info.getValue()}</div>
        <div className="text-xs text-muted">{info.row.original.tv}</div>
      </div>
    ),
  }),
  helper.accessor("estPriceEachUsd", {
    header: "Est. each",
    cell: (info) => <span className="tabular-nums">{formatUsd(info.getValue())}</span>,
  }),
  helper.accessor("estPricePairUsd", {
    header: "Est. pair",
    cell: (info) => (
      <span className="font-semibold tabular-nums text-accent">{formatUsd(info.getValue())}</span>
    ),
  }),
]);

const EMPTY_GAMES: Game[] = [];

function matchesSearch(game: Game, query: string): boolean {
  if (!query) return true;
  const haystack = [game.team, game.opponent, game.venue, game.sport, game.tv, game.season]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function GamesExplorer() {
  const [query, setQuery] = useState("");
  const [sports, setSports] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showTeams, setShowTeams] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return catalog.games.filter((game) => {
      if (!matchesSearch(game, normalizedQuery)) return false;
      if (sports.length && !sports.includes(game.sport)) return false;
      if (teams.length && !teams.includes(game.team)) return false;
      if (fromDate && game.date < fromDate) return false;
      if (toDate && game.date > toDate) return false;
      return true;
    });
  }, [normalizedQuery, sports, teams, fromDate, toDate]);

  const table = useTable(
    {
      features,
      columns,
      data: filtered.length ? filtered : EMPTY_GAMES,
      initialState: { sorting: [{ id: "date", desc: false }] },
    },
    (state) => ({ sorting: state.sorting }),
  );

  const pairTotal = filtered.reduce((sum, game) => sum + game.estPricePairUsd, 0);
  const activeFilters = sports.length + teams.length + (fromDate ? 1 : 0) + (toDate ? 1 : 0);
  const currentSort = table.state.sorting[0] ?? { id: "date", desc: false };

  function toggleSport(sport: string) {
    setSports((current) =>
      current.includes(sport) ? current.filter((item) => item !== sport) : [...current, sport],
    );
  }

  function toggleTeam(team: string) {
    setTeams((current) =>
      current.includes(team) ? current.filter((item) => item !== team) : [...current, team],
    );
  }

  function clearFilters() {
    setQuery("");
    setSports([]);
    setTeams([]);
    setFromDate("");
    setToDate("");
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Visible events"
          value={filtered.length.toString()}
          hint={`${catalog.games.length} published homes`}
        />
        <StatCard
          label="If you bought every visible pair"
          value={formatUsd(pairTotal)}
          hint="Sum of estimated pair prices"
        />
        <StatCard
          label="Avg. pair on screen"
          value={filtered.length ? formatUsd(Math.round(pairTotal / filtered.length)) : "—"}
          hint="Unofficial mid-tier average"
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-card-border bg-card/80 p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-end">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Search team, opponent, venue, sport
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Kraken, Lumen, volleyball…"
              className="w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-accent/40 placeholder:text-muted focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              From
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              To
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Sport</p>
          <div className="flex flex-wrap gap-2">
            {allSports.map((sport) => {
              const active = sports.includes(sport);
              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => toggleSport(sport)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-card-border bg-background text-muted hover:border-accent/50 hover:text-foreground"
                  }`}
                >
                  {sport}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowTeams((open) => !open)}
            className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-foreground"
          >
            Teams {teams.length ? `(${teams.length} selected)` : "(multi-select)"} {showTeams ? "▴" : "▾"}
          </button>
          {showTeams ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {allTeams.map((team) => (
                <label
                  key={team}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={teams.includes(team)}
                    onChange={() => toggleTeam(team)}
                    className="accent-accent"
                  />
                  <span>{team}</span>
                </label>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <p>
            Showing {filtered.length} of {catalog.games.length}
            {activeFilters || query ? " · filters on" : ""}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-card-border px-3 py-1.5 text-foreground hover:border-accent/50"
          >
            Clear search & filters
          </button>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-card-border bg-card/70 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-background/70 text-xs uppercase tracking-wider text-muted">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th key={header.id} className="whitespace-nowrap px-4 py-3 font-semibold">
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 hover:text-foreground"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                          <SortMark state={header.column.getIsSorted()} />
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-card-border/70 align-top hover:bg-accent/5"
                  title={row.original.priceNotes}
                >
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-muted">
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">
            No games match those filters. Clear and try again.
          </p>
        ) : null}
      </div>

      <div className="space-y-3 md:hidden">
        <div className="flex items-center gap-2 text-sm">
          <label className="flex-1">
            <span className="sr-only">Sort by</span>
            <select
              value={currentSort.id}
              onChange={(event) =>
                table.setSorting([{ id: event.target.value, desc: currentSort.desc }])
              }
              className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-foreground"
            >
              <option value="date">Date</option>
              <option value="team">Team</option>
              <option value="sport">Sport</option>
              <option value="opponent">Opponent</option>
              <option value="venue">Venue</option>
              <option value="timePt">Time</option>
              <option value="estPriceEachUsd">Est. each</option>
              <option value="estPricePairUsd">Est. pair</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => table.setSorting([{ id: currentSort.id, desc: !currentSort.desc }])}
            className="rounded-xl border border-card-border bg-card px-3 py-2"
          >
            {currentSort.desc ? "Desc" : "Asc"}
          </button>
        </div>
        {table.getRowModel().rows.map((row) => {
          const game = row.original;
          return (
            <article key={game.id} className="rounded-2xl border border-card-border bg-card p-4">
              <p className="text-xs uppercase tracking-wider text-accent">{game.sport}</p>
              <h2 className="mt-1 text-base font-semibold text-foreground">
                {game.team} vs {game.opponent}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {formatGameDate(game.date)} · {game.timePt} · {game.venue}
              </p>
              <p className="mt-1 text-xs text-muted">{game.tv}</p>
              <div className="mt-3">
                <p className="text-xs text-muted">Est. each / pair</p>
                <p className="text-sm text-foreground">
                  {formatUsd(game.estPriceEachUsd)}{" "}
                  <span className="font-semibold text-accent">
                    {formatUsd(game.estPricePairUsd)}
                  </span>
                </p>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No games match those filters.</p>
        ) : null}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

function SortMark({ state }: { state: false | "asc" | "desc" }) {
  if (state === "asc") return <span aria-hidden>↑</span>;
  if (state === "desc") return <span aria-hidden>↓</span>;
  return (
    <span className="text-card-border" aria-hidden>
      ↕
    </span>
  );
}
