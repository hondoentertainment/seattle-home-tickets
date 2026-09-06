import Link from "next/link";
import { formatLastChecked, refreshStamp } from "@/lib/refresh";

export function SiteFooter() {
  return (
    <footer className="border-t border-card-border/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          Estimates, not quotes · catalog as of {refreshStamp.catalogAsOf} · last checked{" "}
          {formatLastChecked(refreshStamp.lastChecked)}
        </p>
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/about" className="text-accent hover:underline">
            How this works
          </Link>
          <span>Prices are not live-scraped</span>
        </p>
      </div>
    </footer>
  );
}
