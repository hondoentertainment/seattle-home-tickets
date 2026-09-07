import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GamesExplorer } from "@/components/games-explorer";
import { HOLIDAY_TAG_BLURBS, allSpecialTags } from "@/lib/catalog";
import { formatSpecialTag } from "@/lib/format";
import { pageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("Holidays"),
  description:
    "Holiday and special Seattle home games: Christmas, Holiday Classic, Apple Cup, Thanksgiving week, and other tagged nights.",
};

export default function HolidaysPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="page-gutter mx-auto w-full max-w-7xl pt-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Holiday games
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Home games on or near U.S. holidays. Same search and filters as Home. Dates come
          from the published catalog — nothing invented.
        </p>
        <details className="mt-4 max-w-2xl text-sm text-muted">
          <summary className="cursor-pointer font-medium text-foreground">What counts</summary>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {allSpecialTags.map((tag) => (
              <li key={tag}>
                <span className="font-medium text-gold">{formatSpecialTag(tag)}</span>
                {HOLIDAY_TAG_BLURBS[tag] ? ` — ${HOLIDAY_TAG_BLURBS[tag]}` : ""}
              </li>
            ))}
          </ul>
        </details>
        <p className="mt-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            ← All games
          </Link>
        </p>
      </div>

      <main className="page-gutter mx-auto w-full max-w-7xl flex-1 py-6">
        <Suspense fallback={<p className="text-sm text-muted">Loading games…</p>}>
          <GamesExplorer variant="holidays" />
        </Suspense>
      </main>
    </div>
  );
}
