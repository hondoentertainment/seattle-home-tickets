"use client";

import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GameDetail } from "@/components/game-detail";
import { HolidayShowcase } from "@/components/holiday-showcase";
import {
  GENDER_LABELS,
  allMonths,
  allSports,
  allTeams,
  allVenues,
  catalog,
  monthLabel,
} from "@/lib/catalog";
import { formatGameDate, formatUsd, parseIsoDate } from "@/lib/format";
import { shortlistMarkdown } from "@/lib/share";
import type { Game, Gender, WeatherBlurb } from "@/lib/types";
import {
  EMPTY_STATE,
  explorerStateToParams,
  parseExplorerState,
  readStoredIds,
  shareUrl,
  writeStoredIds,
  type ExplorerState,
} from "@/lib/url-state";
import { getForecast, weatherForDate } from "@/lib/weather";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});
const helper = createColumnHelper<typeof features, Game>();
const EMPTY_GAMES: Game[] = [];

function matchesSearch(game: Game, query: string): boolean {
  if (!query) return true;
  const haystack = [
    game.team,
    game.opponent,
    game.venue,
    game.sport,
    game.tv,
    game.season,
    game.specialTags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function GamesExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = useMemo(
    () => parseExplorerState(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const [openId, setOpenId] = useState<string | null>(null);
  const [weatherByDate, setWeatherByDate] = useState<Record<string, WeatherBlurb>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const replaceState = useCallback(
    (next: ExplorerState) => {
      const query = explorerStateToParams(next).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      writeStoredIds(next.ids);
    },
    [pathname, router],
  );

  const patch = useCallback(
    (partial: Partial<ExplorerState>) => {
      replaceState({ ...state, ...partial });
    },
    [replaceState, state],
  );

  useEffect(() => {
    if (searchParams.get("ids")) return;
    const stored = readStoredIds();
    if (stored.length) {
      const params = explorerStateToParams({ ...state, ids: stored });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    // Hydrate shortlist from localStorage once when the URL has no ids.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    getForecast().then((forecast) => {
      if (cancelled) return;
      const next: Record<string, WeatherBlurb> = {};
      for (const game of catalog.games) {
        next[game.date] = weatherForDate(game.date, forecast);
      }
      setWeatherByDate(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedQuery = state.q.trim().toLowerCase();
  const selected = useMemo(
    () => new Set(state.ids),
    [state.ids],
  );

  const filtered = useMemo(() => {
    return catalog.games.filter((game) => {
      if (!matchesSearch(game, normalizedQuery)) return false;
      if (state.sports.length && !state.sports.includes(game.sport)) return false;
      if (state.teams.length && !state.teams.includes(game.team)) return false;
      if (state.venues.length && !state.venues.includes(game.venue)) return false;
      if (state.months.length && !state.months.includes(game.date.slice(0, 7))) return false;
      if (state.genders.length && !state.genders.includes(game.gender)) return false;
      if (state.from && game.date < state.from) return false;
      if (state.to && game.date > state.to) return false;
      if (state.holidayOnly && game.specialTags.length === 0) return false;
      if (state.selectedOnly && !selected.has(game.id)) return false;
      return true;
    });
  }, [normalizedQuery, state, selected]);

  const holidayGames = useMemo(() => {
    const tagged = catalog.games.filter((game) => game.specialTags.length > 0);
    const priority = [
      "Christmas",
      "Holiday Classic",
      "Apple Cup",
      "Homecoming",
      "Thanksgiving week",
      "New Year's",
      "Decision Day",
      "Labor Day weekend",
    ];
    return [...tagged]
      .sort((a, b) => {
        const ap = Math.min(...a.specialTags.map((tag) => priority.indexOf(tag)).filter((n) => n >= 0), 99);
        const bp = Math.min(...b.specialTags.map((tag) => priority.indexOf(tag)).filter((n) => n >= 0), 99);
        return ap - bp || a.date.localeCompare(b.date);
      })
      .slice(0, 6);
  }, []);

  const columns = useMemo(
    () =>
      helper.columns([
        helper.display({
          id: "select",
          header: " ",
          cell: (info) => (
            <input
              type="checkbox"
              checked={selected.has(info.row.original.id)}
              onChange={() => toggleId(info.row.original.id)}
              aria-label={`Interested in ${info.row.original.team} vs ${info.row.original.opponent}`}
              className="accent-accent"
            />
          ),
        }),
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
            <span className="font-semibold tabular-nums text-accent">
              {formatUsd(info.getValue())}
            </span>
          ),
        }),
      ]),
    // toggleId is stable enough via patch/state.ids
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, state.ids],
  );

  const table = useTable(
    {
      features,
      columns,
      data: filtered.length ? filtered : EMPTY_GAMES,
      initialState: { sorting: [{ id: "date", desc: false }] },
    },
    (tableState) => ({ sorting: tableState.sorting }),
  );

  const pairTotal = filtered.reduce((sum, game) => sum + game.estPricePairUsd, 0);
  const selectedGames = catalog.games.filter((game) => selected.has(game.id));
  const openGame = catalog.games.find((game) => game.id === openId) ?? null;
  const currentSort = table.state.sorting[0] ?? { id: "date", desc: false };

  function toggleId(id: string) {
    const next = selected.has(id) ? state.ids.filter((item) => item !== id) : [...state.ids, id];
    patch({ ids: next });
  }

  function toggleList(key: "sports" | "teams" | "venues" | "months", value: string) {
    const current = state[key];
    patch({
      [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    });
  }

  function toggleGender(value: Gender) {
    patch({
      genders: state.genders.includes(value)
        ? state.genders.filter((item) => item !== value)
        : [...state.genders, value],
    });
  }

  async function copyShareLink() {
    const url = shareUrl({ ...state, selectedOnly: true });
    await navigator.clipboard.writeText(url);
    setCopied("link");
    setTimeout(() => setCopied(null), 2000);
  }

  async function copySummary() {
    const text = shortlistMarkdown(selectedGames, weatherByDate);
    await navigator.clipboard.writeText(text);
    setCopied("summary");
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section className="space-y-6 pb-24">
      <HolidayShowcase games={holidayGames} onOpen={(game) => setOpenId(game.id)} />

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
              value={state.q}
              onChange={(event) => patch({ q: event.target.value })}
              placeholder="Kraken, Lumen, volleyball…"
              className="w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-accent/40 placeholder:text-muted focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">From</span>
            <input
              type="date"
              value={state.from}
              onChange={(event) => patch({ from: event.target.value })}
              className="w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">To</span>
            <input
              type="date"
              value={state.to}
              onChange={(event) => patch({ to: event.target.value })}
              className="w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
        </div>

        <ChipRow
          label="Sport"
          options={allSports}
          selected={state.sports}
          onToggle={(value) => toggleList("sports", value)}
        />
        <ChipRow
          label="Month"
          options={allMonths}
          selected={state.months}
          onToggle={(value) => toggleList("months", value)}
          render={(value) => monthLabel(value)}
        />
        <ChipRow
          label="Category"
          options={["men", "women", "open"] as Gender[]}
          selected={state.genders}
          onToggle={(value) => toggleGender(value)}
          render={(value) => GENDER_LABELS[value]}
        />
        <ChipRow
          label="Venue"
          options={allVenues}
          selected={state.venues}
          onToggle={(value) => toggleList("venues", value)}
        />

        <MultiSelect
          label="Teams"
          options={allTeams}
          selected={state.teams}
          onToggle={(value) => toggleList("teams", value)}
        />

        <div className="flex flex-wrap items-center gap-2">
          <ToggleChip
            active={state.holidayOnly}
            onClick={() => patch({ holidayOnly: !state.holidayOnly })}
          >
            Holiday / special only
          </ToggleChip>
          <ToggleChip
            active={state.selectedOnly}
            onClick={() => patch({ selectedOnly: !state.selectedOnly })}
          >
            Selected only
          </ToggleChip>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <p>
            Showing {filtered.length} of {catalog.games.length}
          </p>
          <button
            type="button"
            onClick={() => replaceState({ ...EMPTY_STATE, ids: state.ids })}
            className="rounded-full border border-card-border px-3 py-1.5 text-foreground hover:border-accent/50"
          >
            Clear filters
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
                    <th key={header.id} className="whitespace-nowrap px-3 py-3 font-semibold">
                      {header.isPlaceholder ? null : header.column.id === "select" ? (
                        <table.FlexRender header={header} />
                      ) : (
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
                >
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3 text-muted">
                      {cell.column.id === "team" ? (
                        <button
                          type="button"
                          className="text-left text-foreground hover:text-accent"
                          onClick={() => setOpenId(row.original.id)}
                        >
                          <table.FlexRender cell={cell} />
                          {row.original.specialTags.length ? (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {row.original.specialTags.map((tag) => (
                                <span key={tag} className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] text-gold">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </button>
                      ) : (
                        <table.FlexRender cell={cell} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">No games match those filters.</p>
        ) : null}
      </div>

      <div className="space-y-3 md:hidden">
        <div className="flex items-center gap-2 text-sm">
          <select
            value={currentSort.id}
            onChange={(event) => table.setSorting([{ id: event.target.value, desc: currentSort.desc }])}
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
              <div className="flex items-start justify-between gap-3">
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={selected.has(game.id)}
                    onChange={() => toggleId(game.id)}
                    className="accent-accent"
                  />
                  Interested
                </label>
                <button
                  type="button"
                  onClick={() => setOpenId(game.id)}
                  className="text-xs text-accent"
                >
                  Details
                </button>
              </div>
              {game.specialTags.length ? (
                <p className="mt-2 text-xs text-gold">{game.specialTags.join(" · ")}</p>
              ) : null}
              <h2 className="mt-1 text-base font-semibold text-foreground">
                {game.team} vs {game.opponent}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {formatGameDate(game.date)} · {game.timePt} · {game.venue}
              </p>
              <p className="mt-2 text-sm">
                {formatUsd(game.estPriceEachUsd)}{" "}
                <span className="font-semibold text-accent">{formatUsd(game.estPricePairUsd)}</span>
              </p>
            </article>
          );
        })}
      </div>

      {selectedGames.length ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-card-border bg-background/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-foreground">
              {selectedGames.length} game{selectedGames.length === 1 ? "" : "s"} selected
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-background"
              >
                {copied === "link" ? "Link copied" : "Share link"}
              </button>
              <button
                type="button"
                onClick={copySummary}
                className="rounded-full border border-card-border px-3 py-1.5 text-xs"
              >
                {copied === "summary" ? "Summary copied" : "Copy summary"}
              </button>
              <button
                type="button"
                onClick={() => patch({ selectedOnly: true })}
                className="rounded-full border border-card-border px-3 py-1.5 text-xs"
              >
                Review selected
              </button>
              <button
                type="button"
                onClick={() => patch({ ids: [], selectedOnly: false })}
                className="rounded-full border border-card-border px-3 py-1.5 text-xs"
              >
                Clear selection
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {openGame ? (
        <GameDetail
          game={openGame}
          weather={weatherByDate[openGame.date]}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </section>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
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

function ChipRow<T extends string>({
  label,
  options,
  selected,
  onToggle,
  render,
}: {
  label: string;
  options: T[];
  selected: readonly T[];
  onToggle: (value: T) => void;
  render?: (value: T) => string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-card-border bg-background text-muted hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {render ? render(option) : option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
        active ? "border-gold bg-gold/15 text-gold" : "border-card-border text-muted"
      }`}
    >
      {children}
    </button>
  );
}

function MultiSelect({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-foreground"
      >
        {label} {selected.length ? `(${selected.length} selected)` : "(multi-select)"} {open ? "▴" : "▾"}
      </button>
      {open ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="accent-accent"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}
