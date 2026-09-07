"use client";

import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { FilterCombobox } from "@/components/filter-combobox";
import { GameDetail } from "@/components/game-detail";
import { HolidayShowcase } from "@/components/holiday-showcase";
import { QuantityPicker } from "@/components/quantity-picker";
import { SaveToggle } from "@/components/save-toggle";
import { SearchBox } from "@/components/search-box";
import {
  GENDER_LABELS,
  allMonths,
  allSports,
  allTeams,
  allVenues,
  catalog,
  featuredHolidayGames,
  monthLabel,
  venueFor,
} from "@/lib/catalog";
import { toast } from "@/lib/feedback";
import { FIELD_CHIP, FIELD_INPUT, FIELD_ROW, FIELD_SHELL } from "@/lib/field-control";
import { filterGames } from "@/lib/filter-games";
import { formatGameDate, formatGameDateShort, formatSpecialTag, formatUsd, parseIsoDate } from "@/lib/format";
import { estimateForQty, qtyEstimateLabel } from "@/lib/quantity";
import type { Game, Gender, WeatherBlurb } from "@/lib/types";
import { EMPTY_STATE, requestShortlistOpen, shareUrl, type ExplorerState } from "@/lib/url-state";
import { toggleListValue, useExplorerState } from "@/lib/use-explorer-state";
import { getForecast, weatherForDate } from "@/lib/weather";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});
const helper = createColumnHelper<typeof features, Game>();
const EMPTY_GAMES: Game[] = [];

export function GamesExplorer({ variant = "home" }: { variant?: "home" | "holidays" }) {
  const { state, draftQ, setDraftQ, commitQ, apply, patch } = useExplorerState();
  const holidayOnly = variant === "holidays";
  const [openId, setOpenId] = useState<string | null>(null);
  const [weatherByDate, setWeatherByDate] = useState<Record<string, WeatherBlurb>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(
    () =>
      Boolean(
        state.sports.length ||
          state.teams.length ||
          state.venues.length ||
          state.months.length ||
          state.from ||
          state.to,
      ),
  );

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

  const selected = useMemo(() => new Set(state.ids), [state.ids]);
  const filtered = useMemo(
    () => filterGames(catalog.games, { ...state, holidayOnly }, draftQ),
    [state, draftQ, holidayOnly],
  );

  const holidayGames = useMemo(() => featuredHolidayGames(6), []);
  const holidayCount = catalog.games.filter((game) => game.specialTags.length > 0).length;

  const columns = useMemo(
    () =>
      helper.columns([
        helper.display({
          id: "select",
          header: "Save",
          cell: (info) => (
            <SaveToggle
              saved={selected.has(info.row.original.id)}
              onToggle={() => toggleId(info.row.original.id)}
              matchup={`${info.row.original.team} vs ${info.row.original.opponent}`}
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
        helper.accessor((row) => estimateForQty(row.estPriceEachUsd, state.qty), {
          id: "estGroup",
          header: qtyEstimateLabel(state.qty),
          cell: (info) => (
            <span className="font-semibold tabular-nums text-accent">
              {formatUsd(info.getValue())}
            </span>
          ),
        }),
      ]),
    // toggleId is stable enough via patch/state.ids
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, state.ids, state.qty],
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

  const groupTotal = filtered.reduce(
    (sum, game) => sum + estimateForQty(game.estPriceEachUsd, state.qty),
    0,
  );
  const selectedGames = catalog.games.filter((game) => selected.has(game.id));
  const openGame = catalog.games.find((game) => game.id === openId) ?? null;
  const currentSort = table.state.sorting[0] ?? { id: "date", desc: false };
  const extraFilterCount =
    state.sports.length +
    state.teams.length +
    state.venues.length +
    state.months.length +
    state.genders.length +
    (state.from ? 1 : 0) +
    (state.to ? 1 : 0);

  function toggleId(id: string) {
    const removing = state.ids.includes(id);
    apply((prev) => ({
      ...prev,
      ids: prev.ids.includes(id) ? prev.ids.filter((item) => item !== id) : [...prev.ids, id],
    }));
    toast(removing ? "Removed" : "Saved");
  }

  function toggleList(key: "sports" | "teams" | "venues" | "months", value: string) {
    apply((prev) => ({ ...prev, [key]: toggleListValue(prev[key], value) }));
  }

  function toggleGender(value: Gender) {
    apply((prev) => ({ ...prev, genders: toggleListValue(prev.genders, value) }));
  }

  function clearFilters() {
    setDraftQ("");
    apply((prev) => ({ ...EMPTY_STATE, ids: prev.ids, qty: prev.qty }));
  }

  async function copyShareLink() {
    const url = shareUrl({ ...state, selectedOnly: true });
    await navigator.clipboard.writeText(url);
    setCopied("link");
    toast("Link copied");
    setTimeout(() => setCopied(null), 2000);
  }

  const filterPanel = (
      <div className="flex flex-col gap-2 rounded-2xl border border-card-border bg-card/80 p-3 sm:p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
          <SearchBox
            value={draftQ}
            onChange={setDraftQ}
            onCommit={commitQ}
            onPickFilter={(kind, value) => {
              setDraftQ("");
              apply((prev) => ({
                ...prev,
                q: "",
                [kind]: prev[kind].includes(value) ? prev[kind] : [...prev[kind], value],
              }));
            }}
          />
          <QuantityPicker value={state.qty} onChange={(qty) => patch({ qty })} />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <ToggleChip active={state.selectedOnly} onClick={requestShortlistOpen}>
            {selected.size ? `Saved · ${selected.size}` : "Saved"}
          </ToggleChip>
          <button
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" && !filtersOpen) {
                event.preventDefault();
                setFiltersOpen(true);
              }
              if (event.key === "Escape" && filtersOpen) {
                event.preventDefault();
                setFiltersOpen(false);
              }
            }}
            className={`${FIELD_CHIP} w-full sm:w-auto ${
              filtersOpen || extraFilterCount
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-card-border bg-card text-muted"
            }`}
          >
            <span className="truncate">
              Filters{extraFilterCount ? ` · ${extraFilterCount}` : ""} {filtersOpen ? "▴" : "▾"}
            </span>
          </button>
          {variant === "holidays" ? (
            <span className={`${FIELD_CHIP} w-full border-gold/30 bg-gold/10 text-gold sm:w-auto`}>
              Holiday games
            </span>
          ) : null}
          <span className="hidden text-xs leading-5 text-muted sm:ml-auto sm:inline">
            {filtered.length} of {holidayOnly ? holidayCount : catalog.games.length}
          </span>
        </div>
        <ActiveFilterChips
          state={state}
          draftQ={draftQ}
          onClearQuery={() => {
            setDraftQ("");
            apply((prev) => ({ ...prev, q: "" }));
          }}
          onClearList={(key, value) => toggleList(key, value)}
          onClearGender={(value) => toggleGender(value)}
          onClearSelectedOnly={() => patch({ selectedOnly: false })}
          onClearFrom={() => patch({ from: "" })}
          onClearTo={() => patch({ to: "" })}
          onClearAll={clearFilters}
        />
        {selected.size === 0 ? (
          <p className="text-[11px] leading-4 text-muted">
            Tap <span className="text-foreground">Save</span> on a game to add it here.
          </p>
        ) : null}

        {filtersOpen ? (
          <div className="space-y-4 border-t border-card-border/70 pt-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">From</span>
                <input
                  type="date"
                  value={state.from}
                  onChange={(event) => patch({ from: event.target.value })}
                  className={FIELD_INPUT}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">To</span>
                <input
                  type="date"
                  value={state.to}
                  onChange={(event) => patch({ to: event.target.value })}
                  className={FIELD_INPUT}
                />
              </label>
            </div>
            <FilterCombobox
              label="Sport"
              options={allSports}
              selected={state.sports}
              onToggle={(value) => toggleList("sports", value)}
            />
            <FilterCombobox
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
            <FilterCombobox
              label="Venue"
              options={allVenues}
              selected={state.venues}
              onToggle={(value) => toggleList("venues", value)}
            />
            <FilterCombobox
              label="Teams"
              options={allTeams}
              selected={state.teams}
              onToggle={(value) => toggleList("teams", value)}
            />
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs text-foreground hover:border-accent/50"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>
  );

  return (
    <section className="space-y-4 pb-24">
      {variant === "holidays" ? (
        <HolidayShowcase games={holidayGames} qty={state.qty} onOpen={(game) => setOpenId(game.id)} />
      ) : null}
      {filterPanel}
      <p className="text-xs text-muted">
        {filtered.length} events · {formatUsd(groupTotal)} {qtyEstimateLabel(state.qty)}
        {filtered.length
          ? ` · avg ${formatUsd(Math.round(groupTotal / filtered.length))}`
          : ""}
      </p>

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
                          <span className="mt-1 block text-xs font-semibold text-accent">Tickets</span>
                          {row.original.specialTags.length ? (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {row.original.specialTags.map((tag) => (
                                <span key={tag} className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] text-gold">
                                  {formatSpecialTag(tag)}
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
          <EmptyGames onClear={clearFilters} />
        ) : null}
      </div>

      <div className="space-y-3 md:hidden">
        <div className={`${FIELD_ROW} text-sm`}>
          <select
            value={currentSort.id}
            onChange={(event) => table.setSorting([{ id: event.target.value, desc: currentSort.desc }])}
            className={FIELD_INPUT}
          >
            <option value="date">Date</option>
            <option value="team">Team</option>
            <option value="sport">Sport</option>
            <option value="opponent">Opponent</option>
            <option value="venue">Venue</option>
            <option value="timePt">Time</option>
            <option value="estPriceEachUsd">Est. each</option>
            <option value="estGroup">{qtyEstimateLabel(state.qty)}</option>
          </select>
          <button
            type="button"
            onClick={() => table.setSorting([{ id: currentSort.id, desc: !currentSort.desc }])}
            className={`${FIELD_SHELL} inline-flex min-w-11 items-center justify-center bg-card`}
          >
            {currentSort.desc ? "Desc" : "Asc"}
          </button>
        </div>
        {filtered.length === 0 ? (
          <EmptyGames onClear={clearFilters} />
        ) : null}
        {table.getRowModel().rows.map((row) => {
          const game = row.original;
          const weather = weatherByDate[game.date];
          const venue = venueFor(game.venue);
          const extra = [
            weather?.label,
            venue?.neighborhood,
            game.specialTags[0] ? formatSpecialTag(game.specialTags[0]) : null,
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <article key={game.id} className="rounded-2xl border border-card-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {formatGameDateShort(game.date)} · {game.timePt}
              </p>
              <h2 className="mt-1 text-[17px] font-bold leading-6 text-foreground">
                {game.team} vs {game.opponent}
              </h2>
              <p className="mt-1 text-sm text-muted">{game.venue}</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-xl font-bold tabular-nums text-accent">
                  {formatUsd(estimateForQty(game.estPriceEachUsd, state.qty))}
                </span>
                <span className="text-xs text-muted">
                  {qtyEstimateLabel(state.qty)} · {formatUsd(game.estPriceEachUsd)} each
                </span>
              </p>
              {extra ? <p className="mt-2 text-xs leading-4 text-muted">{extra}</p> : null}
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                <button
                  type="button"
                  onClick={() => setOpenId(game.id)}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-3 text-sm font-semibold text-background"
                >
                  Tickets
                </button>
                <SaveToggle
                  saved={selected.has(game.id)}
                  onToggle={() => toggleId(game.id)}
                  matchup={`${game.team} vs ${game.opponent}`}
                />
              </div>
            </article>
          );
        })}
      </div>

      {selectedGames.length ? (
        <div className="page-gutter fixed inset-x-0 bottom-0 z-30 border-t border-card-border bg-background/95 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={requestShortlistOpen}
              className="text-left text-sm text-foreground"
            >
              <span className="block">{selectedGames.length} saved</span>
              <span className="block text-[11px] font-normal text-muted">
                Unofficial estimates · not a box office
              </span>
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={requestShortlistOpen}
                className="inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs font-semibold"
              >
                View
              </button>
              <button
                type="button"
                onClick={copyShareLink}
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-3 text-xs font-semibold text-background"
              >
                {copied === "link" ? "Copied" : "Share"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {openGame ? (
        <GameDetail
          game={openGame}
          weather={weatherByDate[openGame.date]}
          qty={state.qty}
          saved={selected.has(openGame.id)}
          onToggleSave={() => toggleId(openGame.id)}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </section>
  );
}

function EmptyGames({ onClear }: { onClear: () => void }) {
  return (
    <div className="px-4 py-10 text-center">
      <p className="text-sm font-medium text-foreground">No games match</p>
      <p className="mt-1 text-sm text-muted">Clear filters or try a different search.</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-3 inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs text-foreground hover:border-accent/50"
      >
        Clear filters
      </button>
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
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function moveFocus(index: number, delta: number) {
    const next = (index + delta + options.length) % options.length;
    buttonRefs.current[next]?.focus();
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option, index) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              aria-pressed={active}
              onClick={() => onToggle(option)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  moveFocus(index, 1);
                } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  moveFocus(index, -1);
                } else if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onToggle(option);
                }
              }}
              className={`inline-flex min-h-11 min-w-0 items-center rounded-full border px-3 text-xs font-medium leading-5 transition ${
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

function ActiveFilterChips({
  state,
  draftQ,
  onClearQuery,
  onClearList,
  onClearGender,
  onClearSelectedOnly,
  onClearFrom,
  onClearTo,
  onClearAll,
}: {
  state: ExplorerState;
  draftQ: string;
  onClearQuery: () => void;
  onClearList: (key: "sports" | "teams" | "venues" | "months", value: string) => void;
  onClearGender: (value: Gender) => void;
  onClearSelectedOnly: () => void;
  onClearFrom: () => void;
  onClearTo: () => void;
  onClearAll: () => void;
}) {
  const query = draftQ || state.q;
  const chips: Array<{ key: string; label: string; onClear: () => void }> = [];
  if (query) chips.push({ key: "q", label: `“${query}”`, onClear: onClearQuery });
  if (state.selectedOnly) chips.push({ key: "saved", label: "Saved only", onClear: onClearSelectedOnly });
  if (state.from) chips.push({ key: "from", label: `From ${formatGameDateShort(state.from)}`, onClear: onClearFrom });
  if (state.to) chips.push({ key: "to", label: `To ${formatGameDateShort(state.to)}`, onClear: onClearTo });
  for (const value of state.genders) {
    chips.push({ key: `g-${value}`, label: GENDER_LABELS[value], onClear: () => onClearGender(value) });
  }
  for (const value of state.sports) {
    chips.push({ key: `s-${value}`, label: value, onClear: () => onClearList("sports", value) });
  }
  for (const value of state.months) {
    chips.push({ key: `m-${value}`, label: monthLabel(value), onClear: () => onClearList("months", value) });
  }
  for (const value of state.venues) {
    chips.push({ key: `v-${value}`, label: value, onClear: () => onClearList("venues", value) });
  }
  for (const value of state.teams) {
    chips.push({ key: `t-${value}`, label: value, onClear: () => onClearList("teams", value) });
  }
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onClear}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 text-xs font-medium text-accent"
        >
          <span>{chip.label}</span>
          <span aria-hidden>×</span>
          <span className="sr-only">Remove {chip.label}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex min-h-11 items-center rounded-full px-2 text-xs font-semibold text-muted hover:text-foreground"
      >
        Clear all
      </button>
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
      className={`${FIELD_CHIP} w-full sm:w-auto ${
        active ? "border-gold bg-gold/15 text-gold" : "border-card-border bg-card text-muted"
      }`}
    >
      <span className="truncate">{children}</span>
    </button>
  );
}
