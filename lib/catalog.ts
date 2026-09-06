import catalogJson from "@/data/games.json";
import venuesJson from "@/data/venues.json";
import type { GamesCatalog, VenueProfile } from "@/lib/types";

export const catalog = catalogJson as GamesCatalog;
export const venues = venuesJson as Record<string, VenueProfile>;

export const allTeams = [...new Set(catalog.games.map((game) => game.team))].sort();
export const allSports = [...new Set(catalog.games.map((game) => game.sport))].sort();
export const allVenues = [...new Set(catalog.games.map((game) => game.venue))].sort();
export const allMonths = [
  ...new Set(catalog.games.map((game) => game.date.slice(0, 7))),
].sort();
export const allSpecialTags = [
  ...new Set(catalog.games.flatMap((game) => game.specialTags)),
].sort();

export function venueFor(name: string): VenueProfile | undefined {
  return venues[name];
}

export function monthLabel(yyyyMm: string): string {
  const [year, month] = yyyyMm.split("-");
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export const GENDER_LABELS = {
  men: "Men",
  women: "Women",
  open: "Open / other",
} as const;
