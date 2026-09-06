import { catalog, isHolidayGame, monthLabel } from "@/lib/catalog";
import { estimateForQty } from "@/lib/quantity";
import type { Game } from "@/lib/types";

export type StatRow = {
  key: string;
  label: string;
  count: number;
  total: number;
};

function tally(games: readonly Game[], keyOf: (game: Game) => string, qty: number): StatRow[] {
  const map = new Map<string, { count: number; total: number }>();
  for (const game of games) {
    const key = keyOf(game);
    const current = map.get(key) ?? { count: 0, total: 0 };
    current.count += 1;
    current.total += estimateForQty(game.estPriceEachUsd, qty);
    map.set(key, current);
  }
  return [...map.entries()]
    .map(([key, value]) => ({ key, label: key, count: value.count, total: value.total }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

export function catalogStats(qty = 2) {
  const games = catalog.games;
  const total = games.reduce((sum, game) => sum + estimateForQty(game.estPriceEachUsd, qty), 0);
  const holidayGames = games.filter(isHolidayGame);
  const byMonth = tally(games, (game) => game.date.slice(0, 7), qty)
    .map((row) => ({ ...row, label: monthLabel(row.key) }))
    .sort((a, b) => a.key.localeCompare(b.key));

  return {
    gameCount: games.length,
    holidayCount: holidayGames.length,
    weekendCount: games.filter((game) => game.day === "Sat" || game.day === "Sun").length,
    teamCount: new Set(games.map((game) => game.team)).size,
    sportCount: new Set(games.map((game) => game.sport)).size,
    venueCount: new Set(games.map((game) => game.venue)).size,
    dateFrom: games[0]?.date ?? "",
    dateTo: games[games.length - 1]?.date ?? "",
    totalAtQty: total,
    avgAtQty: games.length ? Math.round(total / games.length) : 0,
    byTeam: tally(games, (game) => game.team, qty),
    bySport: tally(games, (game) => game.sport, qty),
    byMonth,
    byVenue: tally(games, (game) => game.venue, qty),
  };
}
