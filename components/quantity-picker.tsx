"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { FIELD_TRIGGER } from "@/lib/field-control";
import { composingKey } from "@/lib/listbox-keys";
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
  const optionRefs = useRef<Partial<Record<number, HTMLButtonElement | null>>>({});
  const listId = useId();

  useLayoutEffect(() => {
    if (!open) return;
    optionRefs.current[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

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
    if (composingKey(event)) return;
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
    if (event.key === "Escape") {
      if (!open) return;
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative w-full shrink-0 md:w-auto md:min-w-[11.5rem]" onKeyDown={onKeyDown}>
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
        className={`${FIELD_TRIGGER} md:min-w-[11.5rem]`}
      >
        <span className="truncate text-sm font-semibold leading-5 text-foreground">
          {value} {qtyNoun(value)}
        </span>
        <span className="text-sm leading-5 text-muted" aria-hidden>
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
                  ref={(node) => {
                    optionRefs.current[qty] = node;
                  }}
                  role="option"
                  aria-selected={selected}
                  tabIndex={-1}
                  onMouseEnter={() => setActive(qty)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(qty)}
                  className={`flex w-full items-center justify-between px-3.5 py-2 text-sm leading-5 ${
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
