import Link from "next/link";
import { formatLastChecked, refreshStamp } from "@/lib/refresh";

export function SiteFooter() {
  return (
    <footer className="border-t border-card-border/80">
      <div className="page-gutter mx-auto flex max-w-7xl flex-col gap-1 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] text-xs text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p>
          Estimates, not quotes · catalog as of {refreshStamp.catalogAsOf} · last checked{" "}
          {formatLastChecked(refreshStamp.lastChecked)}
        </p>
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/about" className="text-accent hover:underline">
            FAQ
          </Link>
          <Link href="/venues" className="text-accent hover:underline">
            Venues
          </Link>
          <Link href="/contact" className="text-accent hover:underline">
            Contact
          </Link>
          <span>Prices are not live-scraped</span>
        </p>
      </div>
    </footer>
  );
}
