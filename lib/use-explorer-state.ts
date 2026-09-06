"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export function useExplorerState() {
  const router = useRouter();
  const pathname = usePathname();
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
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }, [state, pathname, router]);

  useEffect(() => {
    if (urlKey === lastWritten.current) return;
    lastWritten.current = urlKey;
    const incoming = parseExplorerState(new URLSearchParams(urlKey));
    setState(incoming);
    setDraftQ(incoming.q);
  }, [urlKey]);

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
