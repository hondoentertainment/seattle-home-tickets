import { isIsoDate, pacificTodayIso } from "@/lib/format";
import { gameLevel } from "@/lib/game-level";
import type { Game } from "@/lib/types";
import type { ExplorerState } from "@/lib/url-state";

/** Empty From means the window starts on today's Pacific calendar day. */
export function rangeStart(from: string, now = new Date()): string {
  return isIsoDate(from) ? from : pacificTodayIso(now);
}

export function matchesSearch(game: Game, query: string): boolean {
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

export function filterGames(
  games: readonly Game[],
  state: ExplorerState,
  query: string,
  pinnedTeams: readonly string[] = [],
): Game[] {
  const normalized = query.trim().toLowerCase();
  const selected = new Set(state.ids);
  const usePins = state.mine && pinnedTeams.length > 0 && state.teams.length === 0;
  const start = rangeStart(state.from);
  return games.filter((game) => {
    if (!matchesSearch(game, normalized)) return false;
    if (state.sports.length && !state.sports.includes(game.sport)) return false;
    if (state.teams.length && !state.teams.includes(game.team)) return false;
    if (usePins && !pinnedTeams.includes(game.team)) return false;
    if (state.venues.length && !state.venues.includes(game.venue)) return false;
    if (state.months.length && !state.months.includes(game.date.slice(0, 7))) return false;
    if (state.genders.length && !state.genders.includes(game.gender)) return false;
    if (state.levels.length) {
      const level = gameLevel(game);
      if (!level || !state.levels.includes(level)) return false;
    }
    if (state.focusTags.length && !state.focusTags.some((tag) => game.specialTags.includes(tag))) {
      return false;
    }
    if (game.date < start) return false;
    if (state.to && game.date > state.to) return false;
    if (state.holidayOnly && game.specialTags.length === 0) return false;
    if (state.selectedOnly && !selected.has(game.id)) return false;
    return true;
  });
}
