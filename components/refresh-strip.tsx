import { formatLastChecked, refreshStamp } from "@/lib/refresh";

export function RefreshStrip() {
  return (
    <p className="border-b border-card-border/70 bg-card/40 px-4 py-1.5 text-center text-[11px] leading-5 text-muted sm:px-6 lg:px-8">
      Catalog last checked {formatLastChecked(refreshStamp.lastChecked)} · estimates are not
      live-scraped
    </p>
  );
}
