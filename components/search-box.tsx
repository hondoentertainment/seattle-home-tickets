"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { composingKey } from "@/lib/listbox-keys";
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
  const [active, setActive] = useState(-1);
  const list = useMemo(() => searchSuggestions(value), [value]);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();
  const highlight = active >= 0 && active < list.length ? active : -1;
  const showList = open && list.length > 0;

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useLayoutEffect(() => {
    if (highlight < 0) return;
    optionRefs.current[highlight]?.scrollIntoView({ block: "nearest" });
  }, [highlight, showList]);

  function choose(item: SearchSuggestion) {
    if (item.kind === "team") onPickFilter("teams", item.label);
    else if (item.kind === "sport") onPickFilter("sports", item.label);
    else if (item.kind === "venue") onPickFilter("venues", item.label);
    else onCommit(item.label);
    setOpen(false);
    setActive(-1);
    inputRef.current?.focus();
  }

  function apply() {
    if (open && highlight >= 0 && list[highlight]) {
      choose(list[highlight]);
      return;
    }
    onCommit(value);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (composingKey(event)) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!list.length) return;
      if (!open) {
        setOpen(true);
        setActive(event.key === "ArrowDown" ? 0 : list.length - 1);
        return;
      }
      setActive((index) => {
        if (index < 0) return event.key === "ArrowDown" ? 0 : list.length - 1;
        const delta = event.key === "ArrowDown" ? 1 : -1;
        return (index + delta + list.length) % list.length;
      });
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (!open && list.length) {
        setOpen(true);
        return;
      }
      apply();
      return;
    }

    if (event.key === "Escape") {
      if (!open) return;
      event.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1" onKeyDown={onKeyDown}>
      <div className="flex h-11 items-center gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Search team, opponent, venue, sport</span>
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={showList && highlight >= 0 ? `${listId}-${highlight}` : undefined}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
              setActive(-1);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search team, opponent, venue…"
            className="h-11 w-full rounded-xl border border-card-border bg-card px-3 text-[13px] text-foreground outline-none ring-accent/40 placeholder:text-muted focus:ring-2"
          />
        </label>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (!open && list.length) {
              setOpen(true);
              inputRef.current?.focus();
              return;
            }
            apply();
            inputRef.current?.focus();
          }}
          className="inline-flex h-11 w-[88px] shrink-0 items-center justify-center rounded-xl border-[1.5px] border-accent bg-transparent text-sm font-semibold text-accent outline-none ring-accent/40 hover:bg-accent/10 focus:ring-2"
        >
          Select
        </button>
      </div>
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
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={index === highlight}
                tabIndex={-1}
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
