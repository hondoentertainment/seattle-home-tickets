import { catalog, venues } from "@/lib/catalog";
import type { VenueProfile } from "@/lib/types";

export type VenueCard = {
  venue: VenueProfile;
  teams: string[];
  sports: string[];
  gameCount: number;
};

export function venueHref(name: string): string {
  const params = new URLSearchParams();
  params.set("venues", name);
  return `/?${params.toString()}`;
}

export function venueCards(): VenueCard[] {
  return Object.values(venues)
    .map((venue) => {
      const games = catalog.games.filter((game) => game.venue === venue.name);
      return {
        venue,
        teams: [...new Set(games.map((game) => game.team))].sort(),
        sports: [...new Set(games.map((game) => game.sport))].sort(),
        gameCount: games.length,
      };
    })
    .filter((card) => card.gameCount > 0)
    .sort((a, b) => a.venue.name.localeCompare(b.venue.name));
}
