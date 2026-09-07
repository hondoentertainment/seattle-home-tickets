"use client";

import { useSyncExternalStore } from "react";
import { catalog } from "@/lib/catalog";
import { DEFAULT_QTY } from "@/lib/quantity";
import type { Game } from "@/lib/types";
import {
  QTY_CHANGE_EVENT,
  SHORTLIST_CHANGE_EVENT,
  parseExplorerState,
  readStoredIds,
  readStoredQty,
} from "@/lib/url-state";

const EMPTY_IDS: string[] = [];

let idsCache = EMPTY_IDS;
let idsCacheKey = "";
let idsHydrated = false;
let qtyCache = DEFAULT_QTY;

export function readVisibleShortlistIds(): string[] {
  const fromUrl = parseExplorerState(new URLSearchParams(window.location.search)).ids;
  return fromUrl.length ? fromUrl : readStoredIds();
}

export function gamesForIds(ids: readonly string[]): Game[] {
  const byId = new Map(catalog.games.map((game) => [game.id, game]));
  return ids.flatMap((id) => {
    const game = byId.get(id);
    return game ? [game] : [];
  });
}

function cacheIds(next: string[]) {
  idsHydrated = true;
  const key = next.join("\n");
  if (key === idsCacheKey) return idsCache;
  idsCacheKey = key;
  idsCache = next;
  return idsCache;
}

function subscribeIds(onStoreChange: () => void) {
  function onChange(event: Event) {
    const next = (event as CustomEvent<string[]>).detail;
    if (Array.isArray(next)) {
      cacheIds(next.filter((item) => typeof item === "string"));
    }
    onStoreChange();
  }
  window.addEventListener(SHORTLIST_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(SHORTLIST_CHANGE_EVENT, onChange);
}

function getIdsSnapshot() {
  if (!idsHydrated) return cacheIds(readVisibleShortlistIds());
  return idsCache;
}

function subscribeQty(onStoreChange: () => void) {
  window.addEventListener(QTY_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(QTY_CHANGE_EVENT, onStoreChange);
}

function getQtySnapshot() {
  const next = readStoredQty() ?? DEFAULT_QTY;
  qtyCache = next;
  return qtyCache;
}

export function useStoredShortlist() {
  const ids = useSyncExternalStore(subscribeIds, getIdsSnapshot, () => EMPTY_IDS);
  const qty = useSyncExternalStore(subscribeQty, getQtySnapshot, () => DEFAULT_QTY);
  return { ids, qty };
}
