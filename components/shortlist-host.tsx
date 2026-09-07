"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SavedSheet } from "@/components/saved-sheet";
import { gamesForIds, useStoredShortlist } from "@/lib/shortlist";
import { useSavedSync } from "@/lib/saved-sync";
import { shortlistMarkdown } from "@/lib/share";
import type { WeatherBlurb } from "@/lib/types";
import {
  SHORTLIST_OPEN_EVENT,
  requestShowSavedOnCalendar,
  shortlistShareUrl,
  writeStoredIds,
} from "@/lib/url-state";
import { toast } from "@/lib/feedback";
import { getForecast, weatherForDate } from "@/lib/weather";

export function ShortlistHost() {
  useSavedSync();
  const { ids, qty } = useStoredShortlist();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"link" | "summary" | null>(null);
  const [weatherByDate, setWeatherByDate] = useState<Record<string, WeatherBlurb>>({});
  const games = gamesForIds(ids);

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener(SHORTLIST_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(SHORTLIST_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const saved = gamesForIds(ids);
    getForecast().then((forecast) => {
      if (cancelled) return;
      const next: Record<string, WeatherBlurb> = {};
      for (const game of saved) {
        next[game.date] = weatherForDate(game.date, forecast);
      }
      setWeatherByDate(next);
    });
    return () => {
      cancelled = true;
    };
  }, [open, ids]);

  const close = useCallback(() => setOpen(false), []);

  async function copyShareLink() {
    await navigator.clipboard.writeText(shortlistShareUrl(ids, qty));
    setCopied("link");
    toast("Link copied");
    window.setTimeout(() => setCopied(null), 2000);
  }

  async function copySummary() {
    await navigator.clipboard.writeText(shortlistMarkdown(games, weatherByDate, qty));
    setCopied("summary");
    toast("Copied");
    window.setTimeout(() => setCopied(null), 2000);
  }

  if (typeof document === "undefined" || !open) return null;

  return createPortal(
    <SavedSheet
      games={games}
      qty={qty}
      copied={copied}
      onClose={close}
      onRemove={(id) => {
        writeStoredIds(ids.filter((item) => item !== id));
        toast("Removed");
      }}
      onClear={() => {
        writeStoredIds([]);
        toast("Cleared Saved list");
      }}
      onShare={copyShareLink}
      onCopy={copySummary}
      onShowCalendar={() => {
        close();
        if (pathname === "/" || pathname === "/holidays") {
          requestShowSavedOnCalendar();
          return;
        }
        router.push("/?selected=1");
      }}
    />,
    document.body,
  );
}
