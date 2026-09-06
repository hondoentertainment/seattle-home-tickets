import type { Gender } from "@/lib/types";

export type ExplorerState = {
  q: string;
  teams: string[];
  sports: string[];
  venues: string[];
  months: string[];
  genders: Gender[];
  from: string;
  to: string;
  ids: string[];
  selectedOnly: boolean;
  holidayOnly: boolean;
};

export const EMPTY_STATE: ExplorerState = {
  q: "",
  teams: [],
  sports: [],
  venues: [],
  months: [],
  genders: [],
  from: "",
  to: "",
  ids: [],
  selectedOnly: false,
  holidayOnly: false,
};

function csv(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").map((item) => decodeURIComponent(item)).filter(Boolean);
}

export function parseExplorerState(params: URLSearchParams): ExplorerState {
  const genders = csv(params.get("gender")).filter((item): item is Gender =>
    item === "men" || item === "women" || item === "open",
  );
  return {
    q: params.get("q") ?? "",
    teams: csv(params.get("teams")),
    sports: csv(params.get("sports")),
    venues: csv(params.get("venues")),
    months: csv(params.get("months")),
    genders,
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    ids: csv(params.get("ids")),
    selectedOnly: params.get("selected") === "1",
    holidayOnly: params.get("holiday") === "1",
  };
}

function encodeList(values: string[]): string | null {
  if (!values.length) return null;
  return values.map((value) => encodeURIComponent(value)).join(",");
}

export function explorerStateToParams(state: ExplorerState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  const lists: Array<[string, string[]]> = [
    ["teams", state.teams],
    ["sports", state.sports],
    ["venues", state.venues],
    ["months", state.months],
    ["gender", state.genders],
    ["ids", state.ids],
  ];
  for (const [key, values] of lists) {
    const encoded = encodeList(values);
    if (encoded) params.set(key, encoded);
  }
  if (state.from) params.set("from", state.from);
  if (state.to) params.set("to", state.to);
  if (state.selectedOnly) params.set("selected", "1");
  if (state.holidayOnly) params.set("holiday", "1");
  return params;
}

export function shareUrl(state: ExplorerState): string {
  const params = explorerStateToParams(state);
  const query = params.toString();
  const url = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ""}`;
  if (url.length < 1800) return url;
  const compact = explorerStateToParams({
    ...EMPTY_STATE,
    ids: state.ids,
    selectedOnly: true,
  });
  return `${window.location.origin}${window.location.pathname}?${compact.toString()}`;
}

const STORAGE_KEY = "seattle-home-tickets:shortlist";

export function readStoredIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function writeStoredIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
