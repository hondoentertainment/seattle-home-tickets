import Link from "next/link";
import { NO_TICKET_SALES_LINE, TRADEMARK_LINE, UNOFFICIAL_ESTIMATE_LINE } from "@/lib/legal";
import { formatLastChecked, refreshStamp } from "@/lib/refresh";

export function SiteFooter() {
  return (
    <footer className="border-t border-card-border/80">
        <div className="page-gutter mx-auto flex max-w-7xl flex-col gap-2 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] text-xs leading-5 text-muted lg:pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
        <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>
            Catalog as of {refreshStamp.catalogAsOf} · last checked{" "}
            {formatLastChecked(refreshStamp.lastChecked)}
            {refreshStamp.catalogMatchesSeed ? "" : " · seed review pending"}
            {" · prices are not live-scraped"}
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
          </p>
        </div>
        <p>
          {UNOFFICIAL_ESTIMATE_LINE} {NO_TICKET_SALES_LINE} {TRADEMARK_LINE}
        </p>
      </div>
    </footer>
  );
}
