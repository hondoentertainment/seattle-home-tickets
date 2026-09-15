import { catalog } from "@/lib/catalog";
import { gameLevel } from "@/lib/game-level";

export const TEAM_GROUPS = ["pro", "college", "other"] as const;
export type TeamGroup = (typeof TEAM_GROUPS)[number];
export type TeamGroupFilter = "all" | TeamGroup;

export const TEAM_GROUP_LABELS: Record<TeamGroupFilter, string> = {
  all: "All",
  pro: "Pro",
  college: "College",
  other: "Other",
};

export const TEAM_GROUP_FILTERS = [
  { value: "all", label: "All" },
  { value: "pro", label: "Pro" },
  { value: "college", label: "College" },
  { value: "other", label: "Other" },
] as const;

const groupCache = new Map<string, TeamGroup>();

/** Classify a catalog home club. HS / unpublished-level sports land in Other. */
export function teamGroup(team: string): TeamGroup {
  const cached = groupCache.get(team);
  if (cached) return cached;

  let group: TeamGroup = "other";
  for (const game of catalog.games) {
    if (game.team !== team) continue;
    const level = gameLevel(game);
    if (level === "pro") {
      group = "pro";
      break;
    }
    if (level === "college") group = "college";
  }
  groupCache.set(team, group);
  return group;
}

export function teamsInGroup(teams: readonly string[], filter: TeamGroupFilter): string[] {
  if (filter === "all") return [...teams];
  return teams.filter((team) => teamGroup(team) === filter);
}

export function groupTeams(teams: readonly string[]): Record<TeamGroup, string[]> {
  const next: Record<TeamGroup, string[]> = { pro: [], college: [], other: [] };
  for (const team of teams) next[teamGroup(team)].push(team);
  return next;
}
