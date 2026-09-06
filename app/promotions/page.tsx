import type { Metadata } from "next";
import Link from "next/link";
import { catalog, isHolidayGame } from "@/lib/catalog";
import { formatGameDate, formatSpecialTag } from "@/lib/format";
import type { Game } from "@/lib/types";

export const metadata: Metadata = {
  title: "Promotions — Seattle Home Tickets",
  description: "Published holiday and special-tag Seattle home games on a month calendar.",
};

function monthRange(fromIso: string, toIso: string): Array<{ y: number; m: number }> {
  const out: Array<{ y: number; m: number }> = [];
  if (!fromIso || !toIso) return out;
  let year = Number(fromIso.slice(0, 4));
  let month = Number(fromIso.slice(5, 7));
  const endYear = Number(toIso.slice(0, 4));
  const endMonth = Number(toIso.slice(5, 7));
  while (year < endYear || (year === endYear && month <= endMonth)) {
    out.push({ y: year, m: month });
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return out;
}

export default function PromotionsPage() {
  const games = catalog.games.filter(isHolidayGame);
  const months = monthRange(catalog.games[0]?.date ?? "", catalog.games.at(-1)?.date ?? "");

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Calendar</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Promotions
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Holiday and special-tag homes already in the catalog — Christmas, rivalry, Decision Day,
        and the like. Not invented giveaway codes or club promo calendars.
      </p>

      <div className="mt-8 space-y-10">
        {months.map(({ y, m }) => (
          <MonthCal key={`${y}-${m}`} year={y} month={m} games={games} />
        ))}
      </div>
    </div>
  );
}

function MonthCal({
  year,
  month,
  games,
}: {
  year: number;
  month: number;
  games: Game[];
}) {
  const monthGames = games.filter((game) => {
    return Number(game.date.slice(0, 4)) === year && Number(game.date.slice(5, 7)) === month;
  });
  const startPad = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const title = new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted">
          {monthGames.length} tagged {monthGames.length === 1 ? "game" : "games"}
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
          const dayGames = monthGames.filter((game) => game.date === iso);
          return (
            <div
              key={iso}
              className={`min-h-20 rounded-lg border p-1.5 text-left ${
                dayGames.length ? "border-gold/30 bg-gold/10" : "border-card-border/60 bg-card/40"
              }`}
            >
              <div className="text-[11px] font-semibold text-muted">{day}</div>
              <ul className="mt-1 space-y-1">
                {dayGames.map((game) => (
                  <li key={game.id}>
                    <Link
                      href={`/?ids=${encodeURIComponent(game.id)}`}
                      className="block text-[10px] leading-tight text-accent hover:text-foreground"
                    >
                      <span className="font-semibold">{game.team}</span>
                      <span className="block text-muted">vs {game.opponent}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {monthGames.length ? (
        <ul className="space-y-1 text-sm text-muted">
          {monthGames.map((game) => (
            <li key={game.id}>
              <Link href={`/?ids=${encodeURIComponent(game.id)}`} className="hover:text-foreground">
                {formatGameDate(game.date)} · {game.team} vs {game.opponent}
                {game.specialTags.length ? ` · ${game.specialTags.map(formatSpecialTag).join(", ")}` : ""}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
