"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { normalizeSavedIds, unionSavedIds } from "@/lib/saved-ids";
import {
  SHORTLIST_CHANGE_EVENT,
  parseExplorerState,
  readStoredIds,
  writeStoredIds,
} from "@/lib/url-state";

type SavedResponse = {
  ids?: unknown;
  persistence?: "redis" | "postgres" | "none";
};

const MERGE_KEY = "seattle-home-tickets:saved-merged";

function shareIdsInUrl(): boolean {
  return parseExplorerState(new URLSearchParams(window.location.search)).ids.length > 0;
}

async function fetchSaved(): Promise<SavedResponse | null> {
  const response = await fetch("/api/saved", { credentials: "same-origin" });
  if (response.status === 401) return null;
  if (!response.ok) return { persistence: "none", ids: [] };
  return (await response.json()) as SavedResponse;
}

async function putSaved(ids: string[]): Promise<void> {
  await fetch("/api/saved", {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
}

export function useSavedSync() {
  const { data, status } = useSession();
  const userKey = data?.user?.id || data?.user?.email || null;
  const pushing = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !userKey) return;
    let cancelled = false;

    (async () => {
      const payload = await fetchSaved();
      if (cancelled || !payload || payload.persistence === "none") return;
      const server = normalizeSavedIds(payload.ids);
      const local = readStoredIds();
      const alreadyMerged = sessionStorage.getItem(MERGE_KEY) === userKey;
      const next = alreadyMerged ? server : unionSavedIds(server, local);
      sessionStorage.setItem(MERGE_KEY, userKey);
      writeStoredIds(next, { silent: shareIdsInUrl() });
      if (!alreadyMerged || next.join("\n") !== server.join("\n")) {
        pushing.current = true;
        try {
          await putSaved(next);
        } finally {
          pushing.current = false;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, userKey]);

  useEffect(() => {
    if (status === "unauthenticated") {
      sessionStorage.removeItem(MERGE_KEY);
    }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let timer = 0;

    function onChange(event: Event) {
      if (pushing.current) return;
      const ids = (event as CustomEvent<string[]>).detail;
      if (!Array.isArray(ids)) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void putSaved(normalizeSavedIds(ids));
      }, 350);
    }

    window.addEventListener(SHORTLIST_CHANGE_EVENT, onChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(SHORTLIST_CHANGE_EVENT, onChange);
    };
  }, [status]);
}
