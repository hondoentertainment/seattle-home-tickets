import type { Metadata } from "next";
import Link from "next/link";
import { PromotionsCalendar } from "@/components/promotions-calendar";
import { promotionsCatalog } from "@/lib/promotions";

export const metadata: Metadata = {
  title: "Promotions — Seattle Home Games",
  description:
    "Published promotional nights, theme matches, and giveaways for Seattle home games. Nothing invented.",
};

export default function PromotionsPage() {
  return (
    <div className="page-gutter mx-auto w-full max-w-7xl flex-1 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Promotions
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Published giveaways and theme nights. Tap a night for tickets or Save. Always
        confirm on the club page — quantities change.
      </p>
      <p className="mt-3">
        <Link href="/" className="text-sm font-medium text-accent hover:underline">
          All games
        </Link>
        {" · "}
        <Link href="/holidays" className="text-sm font-medium text-accent hover:underline">
          Holidays
        </Link>
      </p>

      <details className="mt-5 rounded-2xl border border-card-border bg-card/60 px-4 py-3 text-sm text-muted">
        <summary className="cursor-pointer font-medium text-foreground">What is published</summary>
        <p className="mt-2 text-xs">
          As of {promotionsCatalog.asOf}. Incomplete calendars are left blank on purpose.
        </p>
        <ul className="mt-3 space-y-2">
          {promotionsCatalog.coverage.map((row) => (
            <li key={row.team}>
              <span className="font-medium text-foreground">{row.team}</span>
              {" — "}
              {row.note}
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-8">
        <PromotionsCalendar />
      </div>
    </div>
  );
}
