import { GamesExplorer } from "@/components/games-explorer";
import { catalog } from "@/lib/catalog";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-card-border/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Seattle home slate · estimates as of {catalog.asOf}
          </p>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Two seats. Every published home game.
            </h1>
            <p className="text-base leading-7 text-muted sm:text-lg">
              A searchable, sortable grid of Seattle{" "}
              <span className="text-foreground">home</span> sporting events —
              Mariners through season end, full Seahawks and Kraken homes,
              remaining MLS/NWSL/WNBA, and dated college slates — with unofficial
              mid-tier estimates for a pair.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/30 bg-gold/8 px-4 py-3 text-sm leading-6 text-gold">
            Prices are estimates, not tickets. They are not live quotes, face
            values, or advice to buy. Confirm on official club sites before you
            spend.
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <GamesExplorer />
      </main>

      <footer className="border-t border-card-border/80">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 text-sm leading-6 text-muted sm:px-6 lg:px-8">
          <p className="text-foreground">{catalog.scope}</p>
          <p>{catalog.priceDisclaimer}</p>
          <div>
            <p className="mb-1 font-medium text-foreground">Sources</p>
            <ul className="list-disc space-y-1 pl-5">
              {catalog.sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium text-foreground">Intentionally omitted</p>
            <ul className="list-disc space-y-1 pl-5">
              {catalog.omissions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
