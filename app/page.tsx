import { Suspense } from "react";
import { GamesExplorer } from "@/components/games-explorer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="page-gutter mx-auto w-full max-w-7xl flex-1 pt-4 pb-6">
        <Suspense fallback={<p className="text-sm text-muted">Loading the slate…</p>}>
          <GamesExplorer variant="home" />
        </Suspense>
      </main>
    </div>
  );
}
