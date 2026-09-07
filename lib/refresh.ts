import refreshJson from "@/data/refresh.json";

export type RefreshStamp = {
  lastChecked: string;
  timezone: string;
  catalogAsOf: string;
  catalogMatchesSeed: boolean;
  priceRefresh: string;
  notes: string;
};

export type RefreshDispatch =
  | "queued"
  | "already-running"
  | "recent"
  | "not-configured"
  | "failed"
  | null;

export type RefreshStatus = {
  deploy: RefreshStamp;
  main: RefreshStamp | null;
  newerOnMain: boolean;
  dispatchConfigured: boolean;
  dispatch: RefreshDispatch;
  message: string;
};

export const refreshStamp = refreshJson as RefreshStamp;

/** Client event so Home can refetch weather without touching filters or Saved. */
export const CATALOG_REFRESH_EVENT = "sht:catalog-refresh";

export function requestCatalogClientRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CATALOG_REFRESH_EVENT));
}

export function isRefreshStamp(value: unknown): value is RefreshStamp {
  if (!value || typeof value !== "object") return false;
  const stamp = value as Record<string, unknown>;
  return (
    typeof stamp.lastChecked === "string" &&
    typeof stamp.timezone === "string" &&
    typeof stamp.catalogAsOf === "string" &&
    typeof stamp.catalogMatchesSeed === "boolean" &&
    typeof stamp.priceRefresh === "string" &&
    typeof stamp.notes === "string"
  );
}

export function stampIsNewer(candidate: RefreshStamp, baseline: RefreshStamp): boolean {
  const next = Date.parse(candidate.lastChecked);
  const prev = Date.parse(baseline.lastChecked);
  if (Number.isNaN(next) || Number.isNaN(prev)) return false;
  return next > prev;
}

export function formatLastChecked(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function formatLastCheckedShort(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
