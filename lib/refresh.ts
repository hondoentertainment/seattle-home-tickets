import refreshJson from "@/data/refresh.json";

export type RefreshStamp = {
  lastChecked: string;
  timezone: string;
  catalogAsOf: string;
  catalogMatchesSeed: boolean;
  priceRefresh: string;
  notes: string;
};

export const refreshStamp = refreshJson as RefreshStamp;

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
