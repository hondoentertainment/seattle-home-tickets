"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { ToggleSwitch } from "@/components/toggle-switch";
import {
  ALERT_REASON_LABELS,
  isAlertPrefs,
  matchAlerts,
  writeAlertPrefs,
  type AlertPrefs,
} from "@/lib/alerts";
import { toast } from "@/lib/feedback";
import { formatGameDateShort, formatUsd } from "@/lib/format";
import { useStoredShortlist } from "@/lib/shortlist";
import type { WeatherBlurb } from "@/lib/types";
import { getForecast, weatherForDate } from "@/lib/weather";
import { catalog } from "@/lib/catalog";
import { useAlertPrefs } from "@/lib/use-alert-prefs";

const PRICE_PRESETS = [50, 75, 100, 150] as const;
const PRICE_STEP = 5;
const PRICE_MAX = 500;

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

  const priceOn = prefs.priceUnder != null;

  return (
    <div className="mt-6 space-y-6">
      <section className="space-y-4 rounded-2xl border border-card-border bg-card/80 p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Price under (each)</p>
          <p className="mt-0.5 text-xs leading-5 text-muted">
            Unofficial mid-tier estimate, not a live quote.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Price threshold">
          <button
            type="button"
            aria-pressed={!priceOn}
            onClick={() => update({ ...prefs, priceUnder: null })}
            className={`inline-flex min-h-11 items-center rounded-full border px-3 text-xs font-semibold ${
              !priceOn
                ? "border-accent bg-accent text-background"
                : "border-card-border bg-background text-muted"
            }`}
          >
            Off
          </button>
          {PRICE_PRESETS.map((amount) => {
            const selected = prefs.priceUnder === amount;
            return (
              <button
                key={amount}
                type="button"
                aria-pressed={selected}
                onClick={() => update({ ...prefs, priceUnder: amount })}
                className={`inline-flex min-h-11 items-center rounded-full border px-3 text-xs font-semibold ${
                  selected
                    ? "border-accent bg-accent text-background"
                    : "border-card-border bg-background text-muted"
                }`}
              >
                ${amount}
              </button>
            );
          })}
        </div>
        {priceOn ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-card-border bg-background p-1">
            <button
              type="button"
              aria-label="Lower price cap"
              disabled={(prefs.priceUnder ?? 0) <= PRICE_STEP}
              onClick={() =>
                update({
                  ...prefs,
                  priceUnder: Math.max(PRICE_STEP, (prefs.priceUnder ?? PRICE_PRESETS[1]) - PRICE_STEP),
                })
              }
              className="inline-flex size-11 items-center justify-center rounded-xl text-xl font-semibold text-foreground disabled:opacity-40"
            >
              −
            </button>
            <p className="text-center">
              <span className="block text-lg font-bold tabular-nums text-foreground">
                ${prefs.priceUnder}
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                each
              </span>
            </p>
            <button
              type="button"
              aria-label="Raise price cap"
              disabled={(prefs.priceUnder ?? 0) >= PRICE_MAX}
              onClick={() =>
                update({
                  ...prefs,
                  priceUnder: Math.min(PRICE_MAX, (prefs.priceUnder ?? PRICE_PRESETS[1]) + PRICE_STEP),
                })
              }
              className="inline-flex size-11 items-center justify-center rounded-xl text-xl font-semibold text-foreground disabled:opacity-40"
            >
              +
            </button>
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-2xl border border-card-border bg-card/80">
        <ToggleRow
          title="Published promo nights"
          detail="Theme nights and giveaways already on the calendar."
          checked={prefs.promoNight}
          onChange={(promoNight) => update({ ...prefs, promoNight })}
        />
        <div className="mx-4 border-t border-card-border" />
        <ToggleRow
          title="Outdoor weather risk"
          detail="Forecast or typical wet month at an outdoor venue."
          checked={prefs.weatherRisk}
          onChange={(weatherRisk) => update({ ...prefs, weatherRisk })}
        />
        <div className="mx-4 border-t border-card-border" />
        <ToggleRow
          title="Tomorrow’s Saved games"
          detail="Games you saved that are on tomorrow’s slate."
          checked={prefs.tomorrowSaved}
          onChange={(tomorrowSaved) => update({ ...prefs, tomorrowSaved })}
        />
      </section>

      <p className="text-xs leading-5 text-muted">
        Delivery: in-app list below. Email and web-push need a sender / VAPID keys — not
        wired. Storage: {persistence === "local" ? "this browser" : persistence}.
      </p>

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

function ToggleRow({
  title,
  detail,
  checked,
  onChange,
}: {
  title: string;
  detail: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex min-h-16 items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted">{detail}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}
