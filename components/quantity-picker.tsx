"use client";

import { useEffect, useId, useRef, useState } from "react";
import { QTY_OPTIONS, qtyNoun } from "@/lib/quantity";

export function QuantityPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (qty: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(value);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function openList() {
    setActive(value);
    setOpen(true);
  }

  function choose(qty: number) {
    onChange(qty);
    setOpen(false);
  }

  function move(delta: number) {
    const index = QTY_OPTIONS.indexOf(active);
    const next = QTY_OPTIONS[Math.min(QTY_OPTIONS.length - 1, Math.max(0, (index < 0 ? 0 : index) + delta))];
    setActive(next);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
      move(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
      choose(active);
      return;
    }
    if (event.key === "Escape") setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Number of tickets"
        onClick={() => {
          if (open) setOpen(false);
          else openList();
        }}
        onKeyDown={onKeyDown}
        className="flex min-w-[11.5rem] items-center justify-between gap-3 rounded-xl border border-card-border bg-gradient-to-b from-white/8 to-background px-3 py-2.5 text-left shadow-inner outline-none ring-accent/40 hover:border-accent/40 focus:ring-2"
      >
        <span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Tickets
          </span>
          <span className="text-sm font-semibold text-foreground">
            {value} {qtyNoun(value)}
          </span>
        </span>
        <span className="text-xs text-accent" aria-hidden>
          {open ? "▴" : "▾"}
        </span>
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Ticket quantity"
          className="absolute right-0 z-40 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-card-border bg-card py-1 shadow-lg shadow-black/40"
        >
          {QTY_OPTIONS.map((qty) => {
            const selected = qty === value;
            const highlighted = qty === active;
            return (
              <li key={qty} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(qty)}
                  onClick={() => choose(qty)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm ${
                    highlighted ? "bg-accent/15 text-foreground" : "text-foreground"
                  }`}
                >
                  <span className="font-medium">
                    {qty} {qtyNoun(qty)}
                  </span>
                  {selected ? <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">Selected</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
