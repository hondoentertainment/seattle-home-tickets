"use client";

import { useSyncExternalStore } from "react";
import { HOME_MINE_CHANGE_EVENT, readHomeMine } from "@/lib/home-prefs";

function subscribe(onChange: () => void) {
  window.addEventListener(HOME_MINE_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(HOME_MINE_CHANGE_EVENT, onChange);
}

export function useHomeMine() {
  return useSyncExternalStore(subscribe, readHomeMine, () => true);
}
