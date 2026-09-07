"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GameDetail } from "@/components/game-detail";
import { SaveToggle } from "@/components/save-toggle";
import { gameForId } from "@/lib/catalog";
import { toast } from "@/lib/feedback";
import { formatGameDateShort, formatUsd } from "@/lib/format";
import {
  CATEGORY_LABELS,
  promoHref,
  promotionsCatalog,
  type Promotion,
} from "@/lib/promotions";
import { estimateForQty, qtyEstimateLabel } from "@/lib/quantity";
import { useStoredShortlist } from "@/lib/shortlist";
import type { WeatherBlurb } from "@/lib/types";
import { writeStoredIds } from "@/lib/url-state";
import { getForecast, weatherForDate } from "@/lib/weather";

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

function monthTitle(yyyyMm: string): string {
  const [year, month] = yyyyMm.split("-");
  return new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function teamChipLabel(name: string): string {
  return name.replace("Seattle ", "").replace("Washington ", "UW ");
}

export function PromotionsCalendar() {
  const { ids, qty } = useStoredShortlist();
  const [team, setTeam] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [weatherByDate, setWeatherByDate] = useState<Record<string, WeatherBlurb>>({});
  const saved = useMemo(() => new Set(ids), [ids]);

  const promos = useMemo(() => {
    const rows = promotionsCatalog.promotions.filter((promo) => !team || promo.team === team);
    return [...rows].sort((a, b) => a.date.localeCompare(b.date) || a.team.localeCompare(b.team));
  }, [team]);

  const months = [...new Set(promos.map((promo) => monthKey(promo.date)))];
  const teamsWithPromos = [...new Set(promotionsCatalog.promotions.map((promo) => promo.team))].sort();
  const openGame = openId ? gameForId(openId) : undefined;

  useEffect(() => {
    let cancelled = false;
    getForecast().then((forecast) => {
      if (cancelled) return;
      const next: Record<string, WeatherBlurb> = {};
      for (const promo of promotionsCatalog.promotions) {
        next[promo.date] = weatherForDate(promo.date, forecast);
      }
      setWeatherByDate(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleSave(gameId: string) {
    const removing = ids.includes(gameId);
    writeStoredIds(removing ? ids.filter((id) => id !== gameId) : [...ids, gameId]);
    toast(removing ? "Removed" : "Saved");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Team">
        <FilterChip label="All teams" active={!team} onClick={() => setTeam("")} />
        {teamsWithPromos.map((name) => (
          <FilterChip
            key={name}
            label={teamChipLabel(name)}
            active={team === name}
            onClick={() => setTeam(name)}
          />
        ))}
      </div>

      <p className="mt-3 text-xs text-muted">
        {promos.length} {promos.length === 1 ? "night" : "nights"}
        {team ? ` · ${teamChipLabel(team)}` : ""}
      </p>

      {promos.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-card-border px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No published promos</p>
          <p className="mt-1 text-sm text-muted">Try All teams, or check Holidays for dated specials.</p>
          <button
            type="button"
            onClick={() => setTeam("")}
            className="mt-3 inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs"
          >
            Show all teams
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {months.map((key) => (
            <section key={key} className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">{monthTitle(key)}</h2>
              <ul className="space-y-4">
                {promos
                  .filter((promo) => monthKey(promo.date) === key)
                  .map((promo) => (
                    <PromoCard
                      key={promo.id}
                      promo={promo}
                      qty={qty}
                      saved={saved.has(promo.gameId)}
                      onOpen={() => setOpenId(promo.gameId)}
                      onToggleSave={() => toggleSave(promo.gameId)}
                    />
                  ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {months.length ? (
        <details className="mt-8 rounded-2xl border border-card-border bg-card/60 px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-foreground">Month view</summary>
          <div className="mt-4 space-y-8">
            {months.map((key) => (
              <MonthGrid
                key={key}
                yyyyMm={key}
                promos={promos.filter((promo) => monthKey(promo.date) === key)}
                onOpen={(gameId) => setOpenId(gameId)}
              />
            ))}
          </div>
        </details>
      ) : null}

      {openGame ? (
        <GameDetail
          game={openGame}
          weather={weatherByDate[openGame.date]}
          qty={qty}
          saved={saved.has(openGame.id)}
          onToggleSave={() => toggleSave(openGame.id)}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </div>
  );
}

function PromoCard({
  promo,
  qty,
  saved,
  onOpen,
  onToggleSave,
}: {
  promo: Promotion;
  qty: number;
  saved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
}) {
  const game = gameForId(promo.gameId);
  const matchup = `${promo.team} vs ${promo.opponent}`;

  return (
    <li className="flex gap-3 rounded-2xl border border-card-border bg-card p-4">
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {formatGameDateShort(promo.date)}
          {game ? ` · ${game.timePt}` : ""}
        </p>
        <h3 className="mt-1 text-[17px] font-bold leading-6 text-foreground">{promo.title}</h3>
        <p className="mt-1 text-sm text-muted">
          {matchup} · {promo.venue}
        </p>
        {game ? (
          <p className="mt-3 text-xl font-bold tabular-nums text-accent">
            {formatUsd(estimateForQty(game.estPriceEachUsd, qty))}
            <span className="ml-2 text-xs font-medium text-muted">{qtyEstimateLabel(qty)}</span>
          </p>
        ) : null}
        <p className="mt-2 text-xs text-gold">{CATEGORY_LABELS[promo.category]}</p>
        <span className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent">
          Tickets
        </span>
      </button>
      {game ? (
        <SaveToggle saved={saved} onToggle={onToggleSave} matchup={matchup} />
      ) : (
        <Link
          href={promoHref(promo)}
          className="inline-flex min-h-11 items-center self-start text-sm font-semibold text-accent"
        >
          See game
        </Link>
      )}
    </li>
  );
}

function MonthGrid({
  yyyyMm,
  promos,
  onOpen,
}: {
  yyyyMm: string;
  promos: Promotion[];
  onOpen: (gameId: string) => void;
}) {
  const [year, month] = yyyyMm.split("-").map(Number);
  const startPad = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <section>
      <h3 className="text-sm font-semibold text-foreground">{monthTitle(yyyyMm)}</h3>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) return <div key={`pad-${index}`} />;
          const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayPromos = promos.filter((promo) => promo.date === iso);
          return (
            <div
              key={iso}
              className={`min-h-16 rounded-lg border p-1.5 text-left ${
                dayPromos.length ? "border-gold/30 bg-gold/10" : "border-card-border/60 bg-card/40"
              }`}
            >
              <div className="text-[11px] font-semibold text-muted">{day}</div>
              <ul className="mt-1 space-y-1">
                {dayPromos.map((promo) => (
                  <li key={promo.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(promo.gameId)}
                      className="block w-full text-left text-[10px] leading-tight text-accent"
                    >
                      {promo.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center rounded-full px-3 text-xs font-medium ${
        active ? "bg-accent/15 text-accent" : "bg-card text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
