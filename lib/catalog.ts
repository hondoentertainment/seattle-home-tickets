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

export function gameForId(id: string) {
  return catalog.games.find((game) => game.id === id);
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

const HOLIDAY_PRIORITY = [
  "Christmas",
  "Holiday Classic",
  "Apple Cup",
  "Homecoming",
  "Thanksgiving week",
  "New Year's",
  "Decision Day",
  "Labor Day weekend",
];

export function isHolidayGame(game: { specialTags: string[] }): boolean {
  return game.specialTags.length > 0;
}

export function featuredHolidayGames(limit = 6) {
  return [...catalog.games.filter(isHolidayGame)]
    .sort((a, b) => {
      const ap = Math.min(...a.specialTags.map((tag) => HOLIDAY_PRIORITY.indexOf(tag)).filter((n) => n >= 0), 99);
      const bp = Math.min(...b.specialTags.map((tag) => HOLIDAY_PRIORITY.indexOf(tag)).filter((n) => n >= 0), 99);
      return ap - bp || a.date.localeCompare(b.date);
    })
    .slice(0, limit);
}

export const HOLIDAY_TAG_BLURBS: Record<string, string> = {
  Christmas: "Games on December 25.",
  "Holiday Classic": "Seattle Holiday Classic at Climate Pledge Arena (UW vs Baylor and Seattle U vs WSU).",
  "Apple Cup": "Washington vs Washington State football.",
  Homecoming: "Labeled homecoming nights on the published slate.",
  "Thanksgiving week": "Homes during Thanksgiving week (Sun–Sun around the holiday).",
  "New Year's": "New Year’s Eve / Day and the adjacent weekend.",
  "Decision Day": "MLS Decision Day.",
  "Labor Day weekend": "Homes on Labor Day weekend.",
  "MLK Day": "Homes on Martin Luther King Jr. Day.",
  "Presidents Day": "Homes on Presidents Day.",
  Rivalry: "Selected rivalry matchups (Hawks–49ers/Rams, Kraken–Canucks/Oilers, Sounders–LAFC, Apple Cup).",
};
