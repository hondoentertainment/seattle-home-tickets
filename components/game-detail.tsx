"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { SaveToggle } from "@/components/save-toggle";
import { venueFor } from "@/lib/catalog";
import { toast } from "@/lib/feedback";
import { formatGameDate, formatSpecialTag, formatUsd } from "@/lib/format";
import { estimateSpreadLabel, priceBandId, PRICE_BAND_LABELS } from "@/lib/price-band";
import { DEFAULT_QTY, estimateForQty, qtyEstimateLabel } from "@/lib/quantity";
import { formatLastCheckedShort, refreshStamp } from "@/lib/refresh";
import { gameSummary } from "@/lib/share";
import { ticketLinks } from "@/lib/tickets";
import { arrivalSuggestion } from "@/lib/trip-kit";
import type { Game, WeatherBlurb } from "@/lib/types";

export function GameDetail({
  game,
  weather,
  qty = DEFAULT_QTY,
  saved = false,
  onToggleSave,
  onClose,
}: {
  game: Game;
  weather?: WeatherBlurb;
  qty?: number;
  saved?: boolean;
  onToggleSave?: () => void;
  onClose: () => void;
}) {
  const venue = venueFor(game.venue);
  const links = ticketLinks(game, venue, qty);
  const official = links.filter((link) => link.kind === "official");
  const market = links.filter((link) => link.kind !== "official");
  const primary = official[0] ?? market[0];
  const group = estimateForQty(game.estPriceEachUsd, qty);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[105] overscroll-none">
      <button
        type="button"
        className="absolute inset-0 bg-[#020806]/80"
        aria-label="Close game details"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ backgroundColor: "#0c1c18" }}
        className="absolute inset-x-0 bottom-0 z-10 isolate flex h-[min(92dvh,100svh)] max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-card-border bg-[#0c1c18] shadow-2xl md:inset-y-0 md:right-0 md:left-auto md:h-dvh md:max-h-dvh md:w-[min(28rem,100%)] md:rounded-none md:border-l"
      >
        <div className="flex min-h-14 shrink-0 items-start justify-between gap-3 border-b border-card-border px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">{game.sport}</p>
            <h2 id={titleId} className="text-lg font-semibold text-foreground">
              {game.team} vs {game.opponent}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {formatGameDate(game.date)} · {game.timePt} · {game.venue}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-card-border px-3.5 text-sm text-muted hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="sheet-scroll min-h-0 flex-1 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Trip kit</p>
          <p className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-accent">{formatUsd(group)}</span>
            <span className="text-sm text-muted">{qtyEstimateLabel(qty)}</span>
            <span className="text-sm text-muted">{formatUsd(game.estPriceEachUsd)} each</span>
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Unofficial {PRICE_BAND_LABELS[priceBandId(game.estPriceEachUsd)].toLowerCase()} · typical
            band {estimateSpreadLabel(game.estPriceEachUsd, qty)} · last checked{" "}
            {formatLastCheckedShort(refreshStamp.lastChecked)}. Not live inventory.
          </p>
          {game.specialTags.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {game.specialTags.map((tag) => (
                <span key={tag} className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold">
                  {formatSpecialTag(tag)}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>
              <span className="font-medium text-foreground">Arrive. </span>
              {arrivalSuggestion(game, venue)}
            </p>
            {weather ? (
              <p>
                <span className="font-medium text-foreground">Weather. </span>
                {weather.label}. {weather.detail}
                {venue ? ` ${venue.indoor ? "Indoor — travel-day note." : "Outdoor."}` : ""}
              </p>
            ) : (
              <p>Loading Seattle weather…</p>
            )}
            {venue ? (
              <p>
                <span className="font-medium text-foreground">Transit. </span>
                {venue.transit}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={async () => {
              const extra = `\nArrive: ${arrivalSuggestion(game, venue)}`;
              await navigator.clipboard.writeText(`${gameSummary(game, weather, qty)}${extra}`);
              toast("Trip kit copied");
            }}
            className="mt-4 inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs font-semibold text-foreground"
          >
            Share trip kit
          </button>

          {market.length ? (
            <details className="mt-4 rounded-2xl border border-card-border px-3 py-2">
              <summary className="cursor-pointer text-sm font-medium text-foreground">Other sellers</summary>
              <p className="mt-2 text-xs leading-5 text-muted">
                Search links only — including Facebook Marketplace peer listings. Finish any
                purchase on that site. We do not sell tickets or show Marketplace inventory.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(official.length > 1 ? official.slice(1) : []).concat(market).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={
                      link.label === "Facebook Marketplace"
                        ? "Opens Facebook Marketplace search in Seattle. Peer listings; finish any purchase on Facebook."
                        : undefined
                    }
                    aria-label={
                      link.label === "Facebook Marketplace"
                        ? "Facebook Marketplace search for this game (opens Facebook)"
                        : undefined
                    }
                    className="inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs text-muted hover:text-foreground"
                  >
                    {link.label}
                    {link.qtyApplied ? ` · ${qty}` : ""}
                  </a>
                ))}
              </div>
            </details>
          ) : null}

          {game.priceNotes ? (
            <details className="mt-3 rounded-2xl border border-card-border px-3 py-2 text-sm text-muted">
              <summary className="cursor-pointer font-medium text-foreground">Estimate note</summary>
              <p className="mt-2 text-xs leading-5">{game.priceNotes}</p>
            </details>
          ) : null}

          {venue ? (
            <details className="mt-3 rounded-2xl border border-card-border px-3 py-2 text-sm text-muted">
              <summary className="cursor-pointer font-medium text-foreground">
                Neighborhood playbook · {venue.neighborhood}
              </summary>
              <div className="mt-2 space-y-2 text-xs leading-5">
                <p>{venue.address}</p>
                {venue.arriveBy ? (
                  <p>
                    <span className="text-foreground">Door time.</span> {venue.arriveBy}
                  </p>
                ) : null}
                <p>
                  <span className="text-foreground">Parking.</span> {venue.parking}
                </p>
                <p>
                  <span className="text-foreground">Rideshare.</span> {venue.rideshare}
                </p>
                <p>
                  <span className="text-foreground">Traffic.</span> {venue.traffic}
                </p>
                {venue.rainPlan ? (
                  <p>
                    <span className="text-foreground">Rain.</span> {venue.rainPlan}
                  </p>
                ) : null}
                {venue.eatWalk ? (
                  <p>
                    <span className="text-foreground">After.</span> {venue.eatWalk}
                    {venue.after ? ` ${venue.after}` : ""}
                  </p>
                ) : venue.after ? (
                  <p>
                    <span className="text-foreground">After.</span> {venue.after}
                  </p>
                ) : null}
              </div>
            </details>
          ) : null}
        </div>

        <div className="shrink-0 space-y-2 border-t border-card-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
          <div className="flex gap-2">
            {onToggleSave ? (
              <SaveToggle
                saved={saved}
                onToggle={onToggleSave}
                matchup={`${game.team} vs ${game.opponent}`}
              />
            ) : null}
            {primary ? (
              <a
                href={primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-2xl bg-accent px-4 text-base font-semibold text-background"
              >
                Get tickets
              </a>
            ) : null}
          </div>
          <p className="text-center text-[11px] leading-4 text-muted">
            We don’t sell tickets. Estimates are unofficial.
          </p>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
