"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SaveToggle } from "@/components/save-toggle";
import { TeamMark } from "@/components/team-mark";
import {
  IconCar,
  IconCloudSun,
  IconMap,
  IconPin,
  IconStore,
  IconTag,
  IconCalendar,
} from "@/components/ui-icons";
import { venueFor } from "@/lib/catalog";
import { formatGameDate, formatSpecialTag, formatUsd } from "@/lib/format";
import { estimateSpreadLabel, priceBandId, PRICE_BAND_LABELS } from "@/lib/price-band";
import { DEFAULT_QTY, estimateForQty, qtyEstimateLabel } from "@/lib/quantity";
import { displayMark } from "@/lib/teams";
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
  const home = displayMark(game.team, game.sport);

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
        <div className="flex justify-center pt-2 md:hidden">
          <span className="h-1 w-10 rounded-full bg-card-border" />
        </div>
        <div className="flex min-h-14 shrink-0 items-start justify-between gap-3 px-4 pb-3">
          <div className="flex min-w-0 items-start gap-3">
            <TeamMark mark={home} size="card" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted">GAME TRIP-KIT</p>
              <h2 id={titleId} className="text-lg font-semibold text-foreground">
                {game.team.replace("Seattle ", "").replace(" FC", "")} vs {game.opponent}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <IconCalendar className="size-3.5" />
                {formatGameDate(game.date)} · {game.timePt}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                <IconPin className="size-3.5" />
                {game.venue}
                {venue?.neighborhood ? ` · ${venue.neighborhood}` : ""}
              </p>
            </div>
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

        <div className="sheet-scroll min-h-0 flex-1 space-y-2 px-4 py-2">
          {game.specialTags.length ? (
            <div className="flex flex-wrap gap-1.5">
              {game.specialTags.map((tag) => (
                <span key={tag} className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold">
                  {formatSpecialTag(tag)}
                </span>
              ))}
            </div>
          ) : null}

          <KitRow icon={<IconCloudSun />} label="Weather">
            {weather ? (
              <p>
                {weather.label}. {weather.detail}
                {venue ? ` ${venue.indoor ? "Indoor — travel-day note." : "Outdoor."}` : ""}
              </p>
            ) : (
              <p>Loading Seattle weather…</p>
            )}
          </KitRow>

          <KitRow icon={<IconCar />} label="Getting there">
            <p>{arrivalSuggestion(game, venue)}</p>
            {venue ? (
              <p className="mt-2">
                Transit. {venue.transit}
              </p>
            ) : null}
          </KitRow>

          {venue ? (
            <KitRow icon={<IconMap />} label="Neighborhood playbook">
              <p>{venue.neighborhood}</p>
              <p className="mt-2">{venue.address}</p>
              {venue.arriveBy ? (
                <p className="mt-2">
                  Door time. {venue.arriveBy}
                </p>
              ) : null}
              <p className="mt-2">Parking. {venue.parking}</p>
              <p className="mt-2">Rideshare. {venue.rideshare}</p>
              <p className="mt-2">Traffic. {venue.traffic}</p>
              {venue.rainPlan ? <p className="mt-2">Rain. {venue.rainPlan}</p> : null}
              {venue.eatWalk || venue.after ? (
                <p className="mt-2">
                  After. {venue.eatWalk ?? ""} {venue.after ?? ""}
                </p>
              ) : null}
            </KitRow>
          ) : null}

          {market.length ? (
            <KitRow icon={<IconStore />} label="Other sellers including Facebook Marketplace">
              <p>
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
            </KitRow>
          ) : null}

          <KitRow
            icon={<IconTag />}
            label="Unofficial price band"
            trailing={estimateSpreadLabel(game.estPriceEachUsd, qty)}
          >
            <p>
              {formatUsd(group)} {qtyEstimateLabel(qty)} · {formatUsd(game.estPriceEachUsd)} each.
              Unofficial {PRICE_BAND_LABELS[priceBandId(game.estPriceEachUsd)].toLowerCase()}. Not
              live inventory.
            </p>
            {game.priceNotes ? <p className="mt-2">{game.priceNotes}</p> : null}
          </KitRow>
        </div>

        <div className="shrink-0 space-y-2 border-t border-card-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
          {primary ? (
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-accent px-4 text-base font-semibold text-background"
            >
              Get tickets
            </a>
          ) : null}
          {onToggleSave ? (
            <div className="flex justify-center">
              <SaveToggle
                saved={saved}
                onToggle={onToggleSave}
                matchup={`${game.team} vs ${game.opponent}`}
              />
            </div>
          ) : null}
        </div>
      </aside>
    </div>,
    document.body,
  );
}

function KitRow({
  icon,
  label,
  trailing,
  children,
}: {
  icon: ReactNode;
  label: string;
  trailing?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-card-border bg-background/40">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-14 w-full items-center gap-3 px-3 text-left"
      >
        <span className="text-muted">{icon}</span>
        <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{label}</span>
        {trailing ? <span className="text-sm font-semibold tabular-nums text-foreground">{trailing}</span> : null}
        <span className={`text-muted transition ${open ? "rotate-90" : ""}`} aria-hidden>
          ›
        </span>
      </button>
      {open ? <div className="px-3 pb-3 text-sm leading-6 text-muted">{children}</div> : null}
    </div>
  );
}
