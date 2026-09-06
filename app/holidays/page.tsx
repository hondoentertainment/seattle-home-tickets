import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GamesExplorer } from "@/components/games-explorer";
import { HOLIDAY_TAG_BLURBS, allSpecialTags } from "@/lib/catalog";
import { formatSpecialTag } from "@/lib/format";

export const metadata: Metadata = {
  title: "Holidays — Seattle Home Tickets",
  description:
    "Holiday and special Seattle home games: Christmas, Holiday Classic, Apple Cup, Thanksgiving week, and other tagged nights.",
};

export default function HolidaysPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="page-gutter mx-auto w-full max-w-7xl pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Holiday / special</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Dates worth circling
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Published Seattle homes that fall on or around holidays and named events.
          Badges on each row come from <code className="text-foreground">specialTags</code> in
          the data — they are not invented dates.
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
          {allSpecialTags.map((tag) => (
            <li key={tag}>
              <span className="font-medium text-gold">{formatSpecialTag(tag)}</span>
              {HOLIDAY_TAG_BLURBS[tag] ? ` — ${HOLIDAY_TAG_BLURBS[tag]}` : ""}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            ← Back to all games
          </Link>
        </p>
      </div>

      <main className="page-gutter mx-auto w-full max-w-7xl flex-1 py-6">
        <Suspense fallback={<p className="text-sm text-muted">Loading holiday games…</p>}>
          <GamesExplorer variant="holidays" />
        </Suspense>
      </main>
    </div>
  );
}
