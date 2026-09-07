"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  ALERT_REASON_LABELS,
  isAlertPrefs,
  matchAlerts,
  writeAlertPrefs,
  type AlertPrefs,
} from "@/lib/alerts";
import { toast } from "@/lib/feedback";
import { FIELD_INPUT } from "@/lib/field-control";
import { formatGameDateShort, formatUsd } from "@/lib/format";
import { useStoredShortlist } from "@/lib/shortlist";
import type { WeatherBlurb } from "@/lib/types";
import { getForecast, weatherForDate } from "@/lib/weather";
import { catalog } from "@/lib/catalog";
import { useAlertPrefs } from "@/lib/use-alert-prefs";

export function AlertsClient() {
  const { status } = useSession();
  const { ids } = useStoredShortlist();
  const prefs = useAlertPrefs();
  const [weatherByDate, setWeatherByDate] = useState<Record<string, WeatherBlurb>>({});
  const [persistence, setPersistence] = useState<"local" | "redis" | "postgres" | "none">("local");

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/alerts", { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { prefs?: unknown; persistence?: "redis" | "postgres" | "none" } | null) => {
        if (!payload) return;
        if (isAlertPrefs(payload.prefs)) writeAlertPrefs(payload.prefs);
        if (payload.persistence && payload.persistence !== "none") {
          setPersistence(payload.persistence);
        }
      })
      .catch(() => {
        /* local prefs still apply */
      });
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    getForecast().then((forecast) => {
      if (cancelled) return;
      const next: Record<string, WeatherBlurb> = {};
      for (const game of catalog.games) {
        next[game.date] = weatherForDate(game.date, forecast);
      }
      setWeatherByDate(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const matches = useMemo(
    () => matchAlerts(prefs, ids, weatherByDate),
    [prefs, ids, weatherByDate],
  );

  function update(next: AlertPrefs) {
    writeAlertPrefs(next);
    if (status === "authenticated") {
      fetch("/api/alerts", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefs: next }),
      }).catch(() => {
        toast("Saved on this device. Account sync failed.");
      });
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <fieldset className="space-y-3 rounded-2xl border border-card-border bg-card/80 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">What to watch</legend>
        <label className="block text-sm text-muted">
          Price under (each, unofficial)
          <input
            type="number"
            min={0}
            max={500}
            placeholder="Off"
            value={prefs.priceUnder ?? ""}
            onChange={(event) => {
              const raw = event.target.value;
              update({
                ...prefs,
                priceUnder: raw === "" ? null : Math.max(0, Number.parseInt(raw, 10) || 0),
              });
            }}
            className={`${FIELD_INPUT} mt-1`}
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={prefs.promoNight}
            onChange={(event) => update({ ...prefs, promoNight: event.target.checked })}
          />
          Published promo / theme nights
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={prefs.weatherRisk}
            onChange={(event) => update({ ...prefs, weatherRisk: event.target.checked })}
          />
          Outdoor weather risk (forecast or typical wet month)
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={prefs.tomorrowSaved}
            onChange={(event) => update({ ...prefs, tomorrowSaved: event.target.checked })}
          />
          Tomorrow’s Saved games
        </label>
        <p className="text-xs leading-5 text-muted">
          Delivery: in-app list below. Email and web-push need a sender / VAPID keys — not
          wired. Storage: {persistence === "local" ? "this browser" : persistence}.
        </p>
      </fieldset>

      <section>
        <h2 className="text-sm font-semibold text-foreground">
          Matching published games · {matches.length}
        </h2>
        {matches.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Nothing matches yet. Set a preference, or save a game for tomorrow.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {matches.map((hit) => (
              <li key={hit.game.id} className="rounded-2xl border border-card-border bg-card/80 p-3">
                <p className="text-xs uppercase tracking-wider text-accent">{hit.game.sport}</p>
                <p className="font-semibold text-foreground">
                  {hit.game.team} vs {hit.game.opponent}
                </p>
                <p className="text-xs text-muted">
                  {formatGameDateShort(hit.game.date)} · {formatUsd(hit.game.estPriceEachUsd)} each
                </p>
                <p className="mt-1 text-xs text-muted">
                  {hit.reasons.map((reason) => ALERT_REASON_LABELS[reason]).join(" · ")}
                </p>
                <Link
                  href={`/?q=${encodeURIComponent(hit.game.opponent)}&from=${hit.game.date}&to=${hit.game.date}&mine=0`}
                  className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-accent"
                >
                  Open on Home
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
