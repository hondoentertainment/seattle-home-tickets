"use client";

import Link from "next/link";
import { upcomingBundles } from "@/lib/bundles";
import { formatGameDateShort } from "@/lib/format";

export function BundleNights() {
  const bundles = upcomingBundles(3);
  if (!bundles.length) return null;

  return (
    <section className="rounded-2xl border border-card-border bg-card/80 p-3 sm:p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Same-weekend slates</h2>
        <p className="text-xs text-muted">Published dates only</p>
      </div>
      <ul className="mt-2 space-y-2">
        {bundles.map((bundle) => {
          const from = bundle.games[0].date;
          const to = bundle.games[bundle.games.length - 1].date;
          const href = `/?from=${from}&to=${to}&mine=0`;
          return (
            <li key={bundle.id}>
              <Link
                href={href}
                className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-1 text-sm text-foreground hover:text-accent"
              >
                <span className="min-w-0">
                  <span className="block font-medium">{bundle.title}</span>
                  <span className="block text-xs text-muted">{bundle.blurb}</span>
                </span>
                <span className="shrink-0 text-xs text-accent">
                  {formatGameDateShort(from)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
