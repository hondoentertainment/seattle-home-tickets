import { Suspense } from "react";
import { GamesExplorer } from "@/components/games-explorer";
import { HomeRefreshBar } from "@/components/home-refresh-bar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="page-gutter mx-auto w-full max-w-7xl flex-1 pt-4 pb-6">
        <div className="mb-4">
          <HomeRefreshBar />
        </div>
        <Suspense fallback={<p className="text-sm text-muted">Loading games…</p>}>
          <GamesExplorer variant="home" />
        </Suspense>
      </main>
    </div>
  );
}
