import type { Gender } from "@/lib/types";
import { DEFAULT_QTY, clampQty } from "@/lib/quantity";

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
  qty: number;
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
  qty: DEFAULT_QTY,
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
    qty: params.has("qty") ? clampQty(params.get("qty")) : DEFAULT_QTY,
  };
}

function encodeList(values: string[]): string | null {
  if (!values.length) return null;
  return values.map((value) => encodeURIComponent(value)).join(",");
}

export function explorerStateKey(state: ExplorerState): string {
  return explorerStateToParams(state).toString();
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
  params.set("qty", String(clampQty(state.qty)));
  return params;
}

export function shareUrl(state: ExplorerState): string {
  const params = explorerStateToParams(state);
  params.set("qty", String(clampQty(state.qty)));
  const query = params.toString();
  const url = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ""}`;
  if (url.length < 1800) return url;
  const compact = explorerStateToParams({
    ...EMPTY_STATE,
    ids: state.ids,
    selectedOnly: true,
    qty: state.qty,
  });
  compact.set("qty", String(clampQty(state.qty)));
  return `${window.location.origin}${window.location.pathname}?${compact.toString()}`;
}

const STORAGE_KEY = "seattle-home-tickets:shortlist";
const QTY_STORAGE_KEY = "seattle-home-tickets:qty";

export const SHORTLIST_CHANGE_EVENT = "sht:shortlist-change";
export const SHORTLIST_STORAGE_EVENT = "sht:shortlist-storage";
export const QTY_CHANGE_EVENT = "sht:qty-change";
export const SHORTLIST_OPEN_EVENT = "sht:shortlist-open";
export const SHORTLIST_FILTER_EVENT = "sht:shortlist-filter";

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

export function writeStoredIds(ids: string[], options?: { silent?: boolean }) {
  try {
    const next = JSON.stringify(ids);
    if (localStorage.getItem(STORAGE_KEY) === next) return;
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(
      new CustomEvent<string[]>(
        options?.silent ? SHORTLIST_STORAGE_EVENT : SHORTLIST_CHANGE_EVENT,
        { detail: ids },
      ),
    );
  } catch {
    // private mode / quota
  }
}

export function readStoredQty(): number | null {
  try {
    const raw = localStorage.getItem(QTY_STORAGE_KEY);
    if (raw == null) return null;
    return clampQty(raw);
  } catch {
    return null;
  }
}

export function writeStoredQty(qty: number) {
  try {
    const next = String(clampQty(qty));
    if (localStorage.getItem(QTY_STORAGE_KEY) === next) return;
    localStorage.setItem(QTY_STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent<number>(QTY_CHANGE_EVENT, { detail: clampQty(qty) }));
  } catch {
    // private mode / quota
  }
}

export function sameIds(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

export function shortlistShareUrl(ids: string[], qty: number): string {
  const params = explorerStateToParams({
    ...EMPTY_STATE,
    ids,
    selectedOnly: true,
    qty,
  });
  return `${window.location.origin}/?${params.toString()}`;
}

export function requestShortlistOpen() {
  window.dispatchEvent(new Event(SHORTLIST_OPEN_EVENT));
}

export function requestShowSavedOnCalendar() {
  window.dispatchEvent(new CustomEvent<boolean>(SHORTLIST_FILTER_EVENT, { detail: true }));
}
