import Link from "next/link";
import { Suspense } from "react";
import { GamesExplorer } from "@/components/games-explorer";
import { catalog } from "@/lib/catalog";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-4 pb-6 sm:px-6 lg:px-8">
        <Suspense fallback={<p className="text-sm text-muted">Loading the slate…</p>}>
          <GamesExplorer variant="home" />
        </Suspense>
      </main>

      <footer className="border-t border-card-border/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted sm:px-6 lg:px-8">
          <p>Estimates, not quotes · as of {catalog.asOf}</p>
          <Link href="/about" className="text-accent hover:underline">
            How this works
          </Link>
        </div>
      </footer>
    </div>
  );
}
