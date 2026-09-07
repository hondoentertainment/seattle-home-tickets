"use client";

import { useEffect, useId, useRef } from "react";
import { formatGameDateShort, formatUsd } from "@/lib/format";
import { estimateForQty, qtyEstimateLabel } from "@/lib/quantity";
import type { Game } from "@/lib/types";

export function SavedSheet({
  games,
  qty,
  copied,
  onClose,
  onRemove,
  onClear,
  onShare,
  onCopy,
  onShowCalendar,
}: {
  games: Game[];
  qty: number;
  copied: "link" | "summary" | null;
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onShare: () => void;
  onCopy: () => void;
  onShowCalendar: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const total = games.reduce((sum, game) => sum + estimateForQty(game.estPriceEachUsd, qty), 0);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close saved list"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 isolate flex max-h-[min(88dvh,40rem)] w-full flex-col overflow-hidden rounded-t-3xl border border-card-border bg-card shadow-2xl md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-h-none md:w-[min(28rem,100%)] md:rounded-none md:border-l"
      >
        <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-card-border px-4 pt-[env(safe-area-inset-top,0px)]">
          <div>
            <p id={titleId} className="text-sm font-semibold text-foreground">
              Saved{games.length ? ` · ${games.length}` : ""}
            </p>
            <p className="text-xs text-muted">
              {games.length
                ? `${formatUsd(total)} ${qtyEstimateLabel(qty)}`
                : "Interested events stay on this device"}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-card-border px-3.5 text-sm leading-5 text-muted hover:text-foreground"
          >
            Close
          </button>
        </div>

        {games.length ? (
          <div className="flex shrink-0 flex-wrap gap-2 border-b border-card-border px-4 py-3">
            <button
              type="button"
              onClick={onShare}
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-3 text-xs font-semibold text-background"
            >
              {copied === "link" ? "Copied" : "Share"}
            </button>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs"
            >
              {copied === "summary" ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={onShowCalendar}
              className="inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs"
            >
              On calendar
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs"
            >
              Clear
            </button>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          {games.length === 0 ? (
            <p className="text-sm leading-6 text-muted">
              Check <span className="text-foreground">Interested</span> on a home game to save it
              here. The list persists in this browser and can be shared with prices from Home.
            </p>
          ) : (
            <ul className="space-y-2">
              {games.map((game) => (
                <li
                  key={game.id}
                  className="rounded-2xl border border-card-border bg-background px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                        {game.sport}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {game.team} vs {game.opponent}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {formatGameDateShort(game.date)} · {game.timePt} · {game.venue}
                      </p>
                      <p className="mt-2 text-sm">
                        <span className="font-semibold text-accent">
                          {formatUsd(estimateForQty(game.estPriceEachUsd, qty))}
                        </span>
                        <span className="ml-2 text-xs text-muted">
                          {formatUsd(game.estPriceEachUsd)} each
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(game.id)}
                      className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-card-border px-3 text-xs text-muted hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
