"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatGameDate } from "@/lib/format";
import {
  CATEGORY_LABELS,
  promoHref,
  promotionsCatalog,
  type Promotion,
} from "@/lib/promotions";

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

export function PromotionsCalendar() {
  const [team, setTeam] = useState<string>("");
  const promos = useMemo(() => {
    const rows = promotionsCatalog.promotions.filter((promo) => !team || promo.team === team);
    return [...rows].sort((a, b) => a.date.localeCompare(b.date) || a.team.localeCompare(b.team));
  }, [team]);

  const months = [...new Set(promos.map((promo) => monthKey(promo.date)))];
  const teamsWithPromos = [
    ...new Set(promotionsCatalog.promotions.map((promo) => promo.team)),
  ].sort();

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <FilterChip label="All teams" active={!team} onClick={() => setTeam("")} />
        {teamsWithPromos.map((name) => (
          <FilterChip
            key={name}
            label={name.replace("Seattle ", "").replace("Washington ", "UW ")}
            active={team === name}
            onClick={() => setTeam(name)}
          />
        ))}
      </div>

      <p className="mt-3 text-xs text-muted">
        {promos.length} published {promos.length === 1 ? "night" : "nights"}
        {team ? ` · ${team}` : ""}. Holidays without a club promo stay on{" "}
        <Link href="/holidays" className="text-accent hover:underline">
          Holidays
        </Link>
        .
      </p>

      <div className="mt-8 space-y-10">
        {months.map((key) => (
          <MonthBlock
            key={key}
            yyyyMm={key}
            promos={promos.filter((promo) => monthKey(promo.date) === key)}
          />
        ))}
      </div>
    </div>
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

function MonthBlock({ yyyyMm, promos }: { yyyyMm: string; promos: Promotion[] }) {
  const [year, month] = yyyyMm.split("-").map(Number);
  const startPad = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">{monthTitle(yyyyMm)}</h2>
        <p className="text-xs text-muted">
          {promos.length} {promos.length === 1 ? "night" : "nights"}
        </p>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) return <div key={`pad-${index}`} />;
          const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayPromos = promos.filter((promo) => promo.date === iso);
          return (
            <div
              key={iso}
              className={`min-h-20 rounded-lg border p-1.5 text-left ${
                dayPromos.length ? "border-gold/30 bg-gold/10" : "border-card-border/60 bg-card/40"
              }`}
            >
              <div className="text-[11px] font-semibold text-muted">{day}</div>
              <ul className="mt-1 space-y-1">
                {dayPromos.map((promo) => (
                  <li key={promo.id}>
                    <Link
                      href={promoHref(promo)}
                      className="block text-[10px] leading-tight text-accent hover:text-foreground"
                    >
                      <span className="font-semibold">{promo.title}</span>
                      <span className="block text-muted">{promo.team.replace("Seattle ", "")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <ul className="space-y-2">
        {promos.map((promo) => (
          <li
            key={promo.id}
            className="rounded-2xl border border-card-border bg-card/80 px-4 py-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Link href={promoHref(promo)} className="font-semibold text-foreground hover:text-accent">
                {formatGameDate(promo.date)} · {promo.title}
              </Link>
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                {CATEGORY_LABELS[promo.category]}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {promo.team} vs {promo.opponent} · {promo.venue}
              {promo.quantityNote ? ` · ${promo.quantityNote}` : ""}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">{promo.description}</p>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
              <Link href={promoHref(promo)} className="text-accent hover:underline">
                See game
              </Link>
              <a
                href={promo.sourceUrl}
                className="text-muted hover:text-foreground hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {promo.source}
              </a>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
