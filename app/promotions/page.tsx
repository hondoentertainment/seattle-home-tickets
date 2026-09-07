import type { Metadata } from "next";
import { PromotionsCalendar } from "@/components/promotions-calendar";
import { promotionsCatalog } from "@/lib/promotions";

export const metadata: Metadata = {
  title: "Promotions — Seattle Home Tickets",
  description:
    "Published promotional nights, theme matches, and giveaways for Seattle home games. Nothing invented.",
};

export default function PromotionsPage() {
  const unpublished = promotionsCatalog.coverage.filter((row) => row.status !== "published");

  return (
    <div className="page-gutter mx-auto w-full max-w-7xl flex-1 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Promotions
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{promotionsCatalog.disclaimer}</p>
      <p className="mt-2 text-xs text-muted">
        As of {promotionsCatalog.asOf} ({promotionsCatalog.timezone}).
      </p>

      <details className="mt-5 rounded-2xl border border-card-border bg-card/60 px-4 py-3 text-sm text-muted">
        <summary className="cursor-pointer font-medium text-foreground">
          Coverage — what is published vs incomplete
        </summary>
        <ul className="mt-3 space-y-2">
          {promotionsCatalog.coverage.map((row) => (
            <li key={row.team}>
              <span className="font-medium text-foreground">{row.team}</span>
              {" · "}
              <span className="uppercase tracking-wider text-[10px] text-gold">{row.status}</span>
              {" — "}
              {row.note}
            </li>
          ))}
        </ul>
        {unpublished.length ? (
          <p className="mt-3 text-xs">
            Incomplete on purpose: {unpublished.map((row) => row.team).join(", ")}.
          </p>
        ) : null}
      </details>

      <div className="mt-8">
        <PromotionsCalendar />
      </div>
    </div>
  );
}
