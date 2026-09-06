import { allSports, allSpecialTags, allTeams, allVenues, catalog } from "@/lib/catalog";

export type SuggestionKind = "team" | "sport" | "venue" | "opponent" | "tag";

export type SearchSuggestion = {
  id: string;
  kind: SuggestionKind;
  label: string;
  detail: string;
};

const opponents = [...new Set(catalog.games.map((game) => game.opponent))].sort();

export function searchSuggestions(query: string, limit = 8): SearchSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];
  const out: SearchSuggestion[] = [];
  const push = (item: SearchSuggestion) => {
    if (out.length >= limit) return;
    if (out.some((existing) => existing.id === item.id)) return;
    out.push(item);
  };

  for (const team of allTeams) {
    if (team.toLowerCase().includes(q)) {
      push({ id: `team:${team}`, kind: "team", label: team, detail: "Team" });
    }
  }
  for (const sport of allSports) {
    if (sport.toLowerCase().includes(q)) {
      push({ id: `sport:${sport}`, kind: "sport", label: sport, detail: "Sport" });
    }
  }
  for (const venue of allVenues) {
    if (venue.toLowerCase().includes(q)) {
      push({ id: `venue:${venue}`, kind: "venue", label: venue, detail: "Venue" });
    }
  }
  for (const opponent of opponents) {
    if (opponent.toLowerCase().includes(q)) {
      push({ id: `opp:${opponent}`, kind: "opponent", label: opponent, detail: "Opponent" });
    }
  }
  for (const tag of allSpecialTags) {
    if (tag.toLowerCase().includes(q)) {
      push({ id: `tag:${tag}`, kind: "tag", label: tag, detail: "Holiday / special" });
    }
  }
  return out;
}
