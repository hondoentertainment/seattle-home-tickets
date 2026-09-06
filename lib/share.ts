import { ticketLinks } from "@/lib/tickets";
import { venueFor } from "@/lib/catalog";
import { formatGameDate, formatUsd } from "@/lib/format";
import type { Game, WeatherBlurb } from "@/lib/types";

export function gameSummary(game: Game, weather?: WeatherBlurb): string {
  const venue = venueFor(game.venue);
  const travel = venue
    ? `${venue.neighborhood} · ${venue.transit}`
    : game.venue;
  const links = ticketLinks(game, venue)
    .slice(0, 4)
    .map((link) => `- ${link.label}: ${link.href}`)
    .join("\n");
  const tags = game.specialTags.length ? `Tags: ${game.specialTags.join(", ")}\n` : "";
  const wx = weather ? `Weather: ${weather.label} — ${weather.detail}\n` : "";
  return [
    `${formatGameDate(game.date)} · ${game.timePt}`,
    `${game.team} vs ${game.opponent} (${game.sport})`,
    `${game.venue} · TV: ${game.tv}`,
    `Est. pair: ${formatUsd(game.estPricePairUsd)} (each ${formatUsd(game.estPriceEachUsd)})`,
    tags.trimEnd(),
    wx.trimEnd(),
    `Travel: ${travel}`,
    "Tickets:",
    links,
  ]
    .filter(Boolean)
    .join("\n");
}

export function shortlistMarkdown(games: Game[], weatherByDate: Record<string, WeatherBlurb>): string {
  if (!games.length) return "No games selected.";
  return ["# Seattle home tickets shortlist", "", ...games.map((game) => gameSummary(game, weatherByDate[game.date])), ""]
    .join("\n\n---\n\n");
}
