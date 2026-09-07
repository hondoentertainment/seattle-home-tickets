"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_PINNED_LIST, MY_TEAMS_CHANGE_EVENT, readPinnedTeams } from "@/lib/my-teams";

function subscribe(onChange: () => void) {
  window.addEventListener(MY_TEAMS_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(MY_TEAMS_CHANGE_EVENT, onChange);
}

export function usePinnedTeams() {
  return useSyncExternalStore(subscribe, readPinnedTeams, () => DEFAULT_PINNED_LIST);
}
