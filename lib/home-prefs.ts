const STORAGE_KEY = "seattle-home-tickets:home-mine";
export const HOME_MINE_CHANGE_EVENT = "sht:home-mine-change";

let mineCache = true;
let mineHydrated = false;

export function readHomeMine(): boolean {
  if (mineHydrated) return mineCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    mineHydrated = true;
    if (raw === "0") mineCache = false;
    else if (raw === "1") mineCache = true;
    else mineCache = true;
    return mineCache;
  } catch {
    mineHydrated = true;
    return mineCache;
  }
}

export function writeHomeMine(mine: boolean) {
  try {
    mineCache = mine;
    mineHydrated = true;
    localStorage.setItem(STORAGE_KEY, mine ? "1" : "0");
    window.dispatchEvent(new CustomEvent<boolean>(HOME_MINE_CHANGE_EVENT, { detail: mine }));
  } catch {
    mineCache = mine;
    mineHydrated = true;
  }
}
