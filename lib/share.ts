import { ticketLinks } from "@/lib/tickets";
import { venueFor } from "@/lib/catalog";
import { formatGameDate, formatUsd } from "@/lib/format";
import { SHARE_DISCLAIMER } from "@/lib/legal";
import { DEFAULT_QTY, estimateForQty, qtyEstimateLabel, qtyNoun } from "@/lib/quantity";
import type { Game, WeatherBlurb } from "@/lib/types";

export function gameSummary(game: Game, weather?: WeatherBlurb, qty = DEFAULT_QTY): string {
  const venue = venueFor(game.venue);
  const travel = venue
    ? `${venue.neighborhood} · ${venue.transit}`
    : game.venue;
  const links = ticketLinks(game, venue, qty)
    .slice(0, 4)
    .map((link) => `- ${link.label}: ${link.href}`)
    .join("\n");
  const tags = game.specialTags.length ? `Tags: ${game.specialTags.join(", ")}\n` : "";
  const wx = weather ? `Weather: ${weather.label} — ${weather.detail}\n` : "";
  const group = estimateForQty(game.estPriceEachUsd, qty);
  return [
    `${formatGameDate(game.date)} · ${game.timePt}`,
    `${game.team} vs ${game.opponent} (${game.sport})`,
    `${game.venue} · TV: ${game.tv}`,
    `${qtyEstimateLabel(qty)}: ${formatUsd(group)} (each ${formatUsd(game.estPriceEachUsd)})`,
    tags.trimEnd(),
    wx.trimEnd(),
    `Travel: ${travel}`,
    "Tickets:",
    links,
  ]
    .filter(Boolean)
    .join("\n");
}

export function shortlistMarkdown(
  games: Game[],
  weatherByDate: Record<string, WeatherBlurb>,
  qty = DEFAULT_QTY,
): string {
  if (!games.length) return "No games selected.";
  const total = games.reduce((sum, game) => sum + estimateForQty(game.estPriceEachUsd, qty), 0);
  const header = [
    "# Seattle Home Games shortlist",
    "",
    `Planning for ${qty} ${qtyNoun(qty)}. ${SHARE_DISCLAIMER}`,
    `Shortlist total ${qtyEstimateLabel(qty)}: ${formatUsd(total)}`,
  ].join("\n");
  return [header, "", ...games.map((game) => gameSummary(game, weatherByDate[game.date], qty)), ""]
    .join("\n\n---\n\n");
}
