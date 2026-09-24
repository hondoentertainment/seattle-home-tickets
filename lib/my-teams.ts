const STORAGE_KEY = "seattle-home-tickets:my-teams";
export const MY_TEAMS_CHANGE_EVENT = "sht:my-teams-change";

/** First-visit pins: big Seattle clubs + Huskies. HS and other schools stay one tap away. */
export const DEFAULT_PINNED_TEAMS = [
  "Seattle Mariners",
  "Seattle Seahawks",
  "Seattle Kraken",
  "Seattle Sounders FC",
  "Seattle Reign FC",
  "Seattle Storm",
  "Washington Huskies",
] as const;

export function isDefaultPin(team: string): boolean {
  return (DEFAULT_PINNED_TEAMS as readonly string[]).includes(team);
}

let pinnedCache: string[] = [...DEFAULT_PINNED_TEAMS];
let pinnedCacheKey = "";
let pinnedHydrated = false;

export function readPinnedTeams(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let next: string[] = [...DEFAULT_PINNED_TEAMS];
    if (raw != null) {
      const parsed: unknown = JSON.parse(raw);
      next = Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [];
    }
    const key = next.join("\n");
    if (key === pinnedCacheKey && pinnedHydrated) return pinnedCache;
    pinnedHydrated = true;
    pinnedCacheKey = key;
    pinnedCache = next;
    return pinnedCache;
  } catch {
    return pinnedCache;
  }
}

export function hasStoredPinnedTeams(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) != null;
  } catch {
    return true;
  }
}

export function persistPinnedTeams(): string[] {
  const next = readPinnedTeams();
  writePinnedTeams(next);
  return next;
}

export function writePinnedTeams(teams: string[]) {
  try {
    const next = [...new Set(teams.filter(Boolean))];
    pinnedCache = next;
    pinnedCacheKey = next.join("\n");
    pinnedHydrated = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent<string[]>(MY_TEAMS_CHANGE_EVENT, { detail: next }));
  } catch {
    // private mode / quota
  }
}

export function togglePinnedTeam(team: string): string[] {
  const current = readPinnedTeams();
  const next = current.includes(team) ? current.filter((item) => item !== team) : [...current, team];
  writePinnedTeams(next);
  return next;
}

/** Append missing teams, keeping the current pin order. */
export function pinTeams(teams: readonly string[]): string[] {
  const current = readPinnedTeams();
  const have = new Set(current);
  const next = [...current];
  for (const team of teams) {
    if (!team || have.has(team)) continue;
    next.push(team);
    have.add(team);
  }
  if (next.length === current.length) return current;
  writePinnedTeams(next);
  return next;
}

export function unpinTeams(teams: readonly string[]): string[] {
  const remove = new Set(teams.filter(Boolean));
  if (remove.size === 0) return readPinnedTeams();
  const current = readPinnedTeams();
  const next = current.filter((team) => !remove.has(team));
  if (next.length === current.length) return current;
  writePinnedTeams(next);
  return next;
}

export function movePinnedTeam(team: string, direction: -1 | 1): string[] {
  const current = readPinnedTeams();
  const index = current.indexOf(team);
  if (index < 0) return current;
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= current.length) return current;
  const next = [...current];
  const [item] = next.splice(index, 1);
  next.splice(nextIndex, 0, item);
  writePinnedTeams(next);
  return next;
}

export const DEFAULT_PINNED_LIST = [...DEFAULT_PINNED_TEAMS];
