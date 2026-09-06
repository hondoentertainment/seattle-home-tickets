import standingsJson from "@/data/standings.json";
import { markFor, sportTileLabel } from "@/lib/teams";
import type { TeamMark } from "@/lib/teams";

export type StandingStatus = "published" | "upcoming";

export type StandingRow = {
  id: string;
  team: string;
  sport: string;
  league: string;
  conference: string;
  division?: string;
  season: string;
  status: StandingStatus;
  wins?: number;
  losses?: number;
  ties?: number;
  draws?: number;
  otLosses?: number;
  conferenceWins?: number;
  conferenceLosses?: number;
  gamesPlayed?: number;
  points?: number;
  pct?: string;
  rank?: number;
  rankOf?: number;
  gamesBack?: number;
  streak?: string;
  last10?: string;
  recordLabel: string;
  positionLabel?: string;
  note?: string;
  source: string;
  sourceUrl: string;
  asOf: string;
};

export type StandingsCatalog = {
  asOf: string;
  timezone: string;
  disclaimer: string;
  rows: StandingRow[];
};

export const standingsCatalog = standingsJson as StandingsCatalog;

export function standingMark(row: StandingRow): TeamMark | undefined {
  return markFor(row.team, row.sport);
}

export function standingSportLabel(row: StandingRow): string {
  return sportTileLabel(row.sport);
}

export function standingHref(row: StandingRow): string {
  const params = new URLSearchParams();
  params.set("teams", row.team);
  if (row.sport.startsWith("NCAA") || row.sport.startsWith("HS")) params.set("sports", row.sport);
  return `/?${params.toString()}`;
}
