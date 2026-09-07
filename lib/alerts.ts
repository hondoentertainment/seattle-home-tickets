import { catalog, venueFor } from "@/lib/catalog";
import { promotionsCatalog } from "@/lib/promotions";
import type { Game, WeatherBlurb } from "@/lib/types";

export type AlertPrefs = {
  priceUnder: number | null;
  promoNight: boolean;
  weatherRisk: boolean;
  tomorrowSaved: boolean;
};

export const DEFAULT_ALERT_PREFS: AlertPrefs = {
  priceUnder: null,
  promoNight: false,
  weatherRisk: false,
  tomorrowSaved: false,
};

export const ALERTS_STORAGE_KEY = "seattle-home-tickets:alert-prefs";
export const ALERTS_CHANGE_EVENT = "sht:alerts-change";

export function isAlertPrefs(value: unknown): value is AlertPrefs {
  if (!value || typeof value !== "object") return false;
  const prefs = value as Record<string, unknown>;
  const price = prefs.priceUnder;
  return (
    (price === null || (typeof price === "number" && Number.isFinite(price))) &&
    typeof prefs.promoNight === "boolean" &&
    typeof prefs.weatherRisk === "boolean" &&
    typeof prefs.tomorrowSaved === "boolean"
  );
}

let prefsCache: AlertPrefs = { ...DEFAULT_ALERT_PREFS };
let prefsHydrated = false;

export function readAlertPrefs(): AlertPrefs {
  try {
    const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (!raw) {
      if (!prefsHydrated) {
        prefsHydrated = true;
        prefsCache = { ...DEFAULT_ALERT_PREFS };
      }
      return prefsCache;
    }
    const parsed: unknown = JSON.parse(raw);
    const next = isAlertPrefs(parsed) ? parsed : { ...DEFAULT_ALERT_PREFS };
    prefsHydrated = true;
    prefsCache = next;
    return prefsCache;
  } catch {
    return prefsCache;
  }
}

export function writeAlertPrefs(prefs: AlertPrefs) {
  try {
    prefsCache = prefs;
    prefsHydrated = true;
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent<AlertPrefs>(ALERTS_CHANGE_EVENT, { detail: prefs }));
  } catch {
    // private mode / quota
  }
}

export function pacificTodayIso(now = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
}

export function pacificTomorrowIso(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return next.toISOString().slice(0, 10);
}

const promoGameIds = new Set(promotionsCatalog.promotions.map((promo) => promo.gameId));

export type AlertMatchReason = "price" | "promo" | "weather" | "tomorrow";

export type AlertMatch = {
  game: Game;
  reasons: AlertMatchReason[];
};

export function matchAlerts(
  prefs: AlertPrefs,
  savedIds: readonly string[],
  weatherByDate: Record<string, WeatherBlurb>,
  games: readonly Game[] = catalog.games,
): AlertMatch[] {
  const tomorrow = pacificTomorrowIso();
  const saved = new Set(savedIds);
  const hits: AlertMatch[] = [];
  for (const game of games) {
    const reasons: AlertMatchReason[] = [];
    if (prefs.priceUnder != null && game.estPriceEachUsd <= prefs.priceUnder) {
      reasons.push("price");
    }
    if (prefs.promoNight && promoGameIds.has(game.id)) reasons.push("promo");
    if (prefs.weatherRisk) {
      const venue = venueFor(game.venue);
      const weather = weatherByDate[game.date];
      const wetForecast =
        weather?.kind === "forecast" && /[4-9]\d%|[1-9]\d{2}%/.test(weather.detail);
      const wetClimate =
        weather?.kind === "climatology" && /wet|rain|shower/i.test(weather.detail);
      if (venue && !venue.indoor && (wetForecast || wetClimate)) reasons.push("weather");
    }
    if (prefs.tomorrowSaved && saved.has(game.id) && game.date === tomorrow) {
      reasons.push("tomorrow");
    }
    if (reasons.length) hits.push({ game, reasons });
  }
  return hits.sort((a, b) => a.game.date.localeCompare(b.game.date));
}

export const ALERT_REASON_LABELS: Record<AlertMatchReason, string> = {
  price: "Under your price cap",
  promo: "Published promo night",
  weather: "Outdoor weather risk",
  tomorrow: "Saved for tomorrow",
};
