"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function FilterSheet({
  open,
  onClose,
  children,
  title = "Filters",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[105] overscroll-none">
      <button
        type="button"
        className="absolute inset-0 bg-[#020806]/80"
        aria-label={`Close ${title.toLowerCase()}`}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ backgroundColor: "#0c1c18" }}
        className="absolute inset-x-0 bottom-0 z-10 isolate flex h-[min(92dvh,100svh)] max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-card-border bg-[#0c1c18] shadow-2xl md:inset-y-0 md:right-0 md:left-auto md:h-dvh md:max-h-dvh md:w-[min(28rem,100%)] md:rounded-none md:border-l"
      >
        <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-card-border px-4 pt-[env(safe-area-inset-top,0px)]">
          <p id={titleId} className="text-sm font-semibold text-foreground">
            {title}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center rounded-xl bg-accent px-3.5 text-sm font-semibold text-background"
          >
            Done
          </button>
        </div>
        <div className="sheet-scroll min-h-0 flex-1 space-y-4 px-4 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
          {children}
        </div>
      </aside>
    </div>,
    document.body,
  );
}
