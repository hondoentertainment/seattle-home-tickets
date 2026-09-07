import { venueFor } from "@/lib/catalog";
import type { Game, VenueProfile } from "@/lib/types";

function parseTimePt(timePt: string): { hour24: number; minute: number } | null {
  const match = timePt.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const mer = match[3].toUpperCase();
  if (mer === "PM" && hour !== 12) hour += 12;
  if (mer === "AM" && hour === 12) hour = 0;
  return { hour24: hour, minute };
}

export function arrivalMinutes(game: Game, venue?: VenueProfile): number {
  if (game.sport === "NFL") return 90;
  if (game.sport === "NCAA Football") return 75;
  if (game.sport.startsWith("HS ")) return 30;
  if (venue?.indoor === false) return 60;
  return 40;
}

export function arrivalSuggestion(game: Game, venue = venueFor(game.venue)): string {
  const minutes = arrivalMinutes(game, venue);
  const parsed = parseTimePt(game.timePt);
  if (!parsed) {
    return `Plan to be at ${game.venue} about ${minutes} minutes before published start (tip is TBD).`;
  }
  let hour = parsed.hour24;
  let minute = parsed.minute - minutes;
  while (minute < 0) {
    minute += 60;
    hour -= 1;
  }
  if (hour < 0) hour += 24;
  const mer = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  const clock = `${hour12}:${String(minute).padStart(2, "0")} ${mer}`;
  const crowd =
    game.sport === "NFL" || game.sport === "NCAA Football"
      ? "Gates and SoDo / Montlake traffic need the extra time."
      : venue?.indoor
        ? "Indoor building — this is a walk-in buffer, not a weather hold."
        : "Outdoor venue — add time if the forecast is wet.";
  return `Be at the venue by about ${clock} PT (${minutes} min before ${game.timePt}). ${crowd}`;
}

export function transitHighlight(venue?: VenueProfile): string {
  if (!venue) return "Check the venue page for transit notes.";
  return venue.transit;
}
