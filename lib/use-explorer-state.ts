"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  explorerStateKey,
  explorerStateToParams,
  parseExplorerState,
  readStoredIds,
  writeStoredIds,
  type ExplorerState,
} from "@/lib/url-state";

export function useExplorerState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlKey = searchParams.toString();

  const [state, setState] = useState(() => parseExplorerState(new URLSearchParams(urlKey)));
  const [draftQ, setDraftQ] = useState(state.q);

  const writtenKey = useRef(urlKey);
  const pendingWrite = useRef(false);

  const commitUrl = useCallback(
    (next: ExplorerState) => {
      const query = explorerStateKey(next);
      writtenKey.current = query;
      pendingWrite.current = true;
      writeStoredIds(next.ids);
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router],
  );

  const apply = useCallback(
    (updater: (prev: ExplorerState) => ExplorerState) => {
      setState((prev) => {
        const next = updater(prev);
        queueMicrotask(() => commitUrl(next));
        return next;
      });
    },
    [commitUrl],
  );

  const patch = useCallback(
    (partial: Partial<ExplorerState>) => {
      apply((prev) => ({ ...prev, ...partial }));
    },
    [apply],
  );

  useEffect(() => {
    if (pendingWrite.current) {
      if (urlKey === writtenKey.current) pendingWrite.current = false;
      return;
    }
    if (urlKey === writtenKey.current) return;
    writtenKey.current = urlKey;
    const incoming = parseExplorerState(new URLSearchParams(urlKey));
    setState(incoming);
    setDraftQ(incoming.q);
  }, [urlKey]);

  useEffect(() => {
    if (searchParams.get("ids")) return;
    const stored = readStoredIds();
    if (!stored.length) return;
    // localStorage is an external store; apply once after mount if the URL has no ids.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate shortlist
    apply((prev) => (prev.ids.length ? prev : { ...prev, ids: stored }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
