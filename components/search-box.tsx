"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { searchSuggestions, type SearchSuggestion } from "@/lib/suggestions";

export function SearchBox({
  value,
  onChange,
  onCommit,
  onPickFilter,
}: {
  value: string;
  onChange: (value: string) => void;
  onCommit: (value: string) => void;
  onPickFilter: (kind: "teams" | "sports" | "venues", value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const list = useMemo(() => searchSuggestions(value), [value]);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function choose(item: SearchSuggestion) {
    if (item.kind === "team") onPickFilter("teams", item.label);
    else if (item.kind === "sport") onPickFilter("sports", item.label);
    else if (item.kind === "venue") onPickFilter("venues", item.label);
    else onCommit(item.label);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (list.length) {
        setOpen(true);
        setActive((index) => (index + 1) % list.length);
      }
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (list.length) {
        setOpen(true);
        setActive((index) => (index - 1 + list.length) % list.length);
      }
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (open && list[highlight]) choose(list[highlight]);
      else onCommit(value);
      setOpen(false);
      return;
    }
    if (event.key === "Escape") setOpen(false);
  }

  const highlight = list.length ? Math.min(active, list.length - 1) : 0;
  const showList = open && list.length > 0;

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <label className="block">
        <span className="sr-only">Search team, opponent, venue, sport</span>
        <input
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList ? `${listId}-${highlight}` : undefined}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search team, opponent, venue, sport"
          className="w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-accent/40 placeholder:text-muted focus:ring-2"
        />
      </label>
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-40 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-card-border bg-card py-1 shadow-lg shadow-black/40"
        >
          {list.map((item, index) => (
            <li key={item.id} role="presentation">
              <button
                id={`${listId}-${index}`}
                type="button"
                role="option"
                aria-selected={index === highlight}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(item)}
                className={`flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-sm ${
                  index === highlight ? "bg-accent/15 text-foreground" : "text-foreground"
                }`}
              >
                <span>{item.label}</span>
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {item.detail}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
