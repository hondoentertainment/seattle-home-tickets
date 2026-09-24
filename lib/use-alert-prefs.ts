"use client";

import { useSyncExternalStore } from "react";
import { ALERTS_CHANGE_EVENT, DEFAULT_ALERT_PREFS, readAlertPrefs } from "@/lib/alerts";

function subscribe(onChange: () => void) {
  window.addEventListener(ALERTS_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(ALERTS_CHANGE_EVENT, onChange);
}

export function useAlertPrefs() {
  return useSyncExternalStore(subscribe, readAlertPrefs, () => DEFAULT_ALERT_PREFS);
}
