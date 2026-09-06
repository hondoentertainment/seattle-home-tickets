import { Suspense } from "react";
import { GamesExplorer } from "@/components/games-explorer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-4 pb-6 sm:px-6 lg:px-8">
        <Suspense fallback={<p className="text-sm text-muted">Loading the slate…</p>}>
          <GamesExplorer variant="home" />
        </Suspense>
      </main>
    </div>
  );
}
