"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  explorerStateKey,
  explorerStateToParams,
  parseExplorerState,
  readStoredIds,
  readStoredQty,
  writeStoredIds,
  writeStoredQty,
  type ExplorerState,
} from "@/lib/url-state";

function writeLocation(query: string) {
  const next = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  const current = `${window.location.pathname}${window.location.search}`;
  if (current === next) return;
  window.history.replaceState(window.history.state, "", next);
}

export function useExplorerState() {
  const searchParams = useSearchParams();
  const urlKey = searchParams.toString();

  const [state, setState] = useState(() => parseExplorerState(new URLSearchParams(urlKey)));
  const [draftQ, setDraftQ] = useState(state.q);
  const lastWritten = useRef(urlKey);
  const hydrated = useRef(false);

  const apply = useCallback((updater: (prev: ExplorerState) => ExplorerState) => {
    setState((prev) => updater(prev));
  }, []);

  const patch = useCallback(
    (partial: Partial<ExplorerState>) => {
      apply((prev) => ({ ...prev, ...partial }));
    },
    [apply],
  );

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const storedIds = searchParams.get("ids") ? [] : readStoredIds();
    const storedQty = searchParams.has("qty") ? null : readStoredQty();
    if (!storedIds.length && storedQty == null) return;
    // localStorage is an external store read once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate ids/qty
    setState((prev) => ({
      ...prev,
      ids: prev.ids.length || !storedIds.length ? prev.ids : storedIds,
      qty: storedQty ?? prev.qty,
    }));
  }, [searchParams]);

  useEffect(() => {
    const query = explorerStateKey(state);
    writeStoredIds(state.ids);
    writeStoredQty(state.qty);
    if (query === lastWritten.current) return;
    lastWritten.current = query;
    writeLocation(query);
  }, [state]);

  useEffect(() => {
    const onPop = () => {
      const incoming = window.location.search.startsWith("?")
        ? window.location.search.slice(1)
        : window.location.search;
      lastWritten.current = incoming;
      const parsed = parseExplorerState(new URLSearchParams(incoming));
      setState(parsed);
      setDraftQ(parsed.q);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (draftQ === state.q) return;
    const timer = window.setTimeout(() => {
      apply((prev) => (prev.q === draftQ ? prev : { ...prev, q: draftQ }));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [draftQ, state.q, apply]);

  const viewState = useMemo(() => ({ ...state, q: draftQ }), [state, draftQ]);

  return { state: viewState, persisted: state, draftQ, setDraftQ, apply, patch };
}

export function toggleListValue<T extends string>(values: readonly T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export { explorerStateToParams, parseExplorerState };
