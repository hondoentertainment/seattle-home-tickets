import { catalog } from "@/lib/catalog";
import { formatGameDateShort } from "@/lib/format";
import type { Game } from "@/lib/types";

export type GameBundle = {
  id: string;
  title: string;
  blurb: string;
  games: Game[];
  weekendStart: string;
};

function thursdayOf(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`);
  const dow = date.getUTCDay();
  const thursdayDelta = dow === 0 ? -3 : dow >= 4 ? 4 - dow : 4 - dow;
  date.setUTCDate(date.getUTCDate() + thursdayDelta);
  return date.toISOString().slice(0, 10);
}

function inWeekendWindow(iso: string, thursday: string): boolean {
  const start = new Date(`${thursday}T12:00:00Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 4);
  const day = new Date(`${iso}T12:00:00Z`);
  return day >= start && day < end;
}

function holidayLabel(games: Game[]): string | null {
  const tags = new Set(games.flatMap((game) => game.specialTags));
  const order = [
    "Christmas",
    "New Year's",
    "Thanksgiving week",
    "Holiday Classic",
    "Labor Day weekend",
    "Apple Cup",
    "Homecoming",
    "MLK Day",
    "Presidents Day",
    "Decision Day",
  ];
  return order.find((tag) => tags.has(tag)) ?? null;
}

export function publishedBundles(games: readonly Game[] = catalog.games): GameBundle[] {
  const weekends = [...new Set(games.map((game) => thursdayOf(game.date)))].sort();
  const bundles: GameBundle[] = [];
  for (const thursday of weekends) {
    const group = games
      .filter((game) => inWeekendWindow(game.date, thursday))
      .sort((a, b) => a.date.localeCompare(b.date) || a.timePt.localeCompare(b.timePt));
    if (group.length < 2) continue;
    const holiday = holidayLabel(group);
    const venues = [...new Set(group.map((game) => game.venue))];
    const title = holiday
      ? `${holiday} · ${group.length} published homes`
      : `${formatGameDateShort(group[0].date)}–${formatGameDateShort(group[group.length - 1].date)}`;
    bundles.push({
      id: `bundle-${thursday}`,
      title,
      blurb: holiday
        ? `${group.length} dated homes that weekend. Published catalog only — not a package sale.`
        : `${group.length} homes · ${venues.slice(0, 3).join(", ")}${venues.length > 3 ? "…" : ""}`,
      games: group,
      weekendStart: thursday,
    });
  }
  return bundles;
}

export function upcomingBundles(limit = 3, fromIso?: string): GameBundle[] {
  const today = fromIso ?? new Date().toISOString().slice(0, 10);
  return publishedBundles().filter((bundle) => bundle.games.some((game) => game.date >= today)).slice(0, limit);
}
