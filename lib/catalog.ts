import catalogJson from "@/data/games.json";
import type { GamesCatalog } from "@/lib/types";

export const catalog = catalogJson as GamesCatalog;

export const allTeams = [...new Set(catalog.games.map((game) => game.team))].sort();
export const allSports = [...new Set(catalog.games.map((game) => game.sport))].sort();
export const allVenues = [...new Set(catalog.games.map((game) => game.venue))].sort();
