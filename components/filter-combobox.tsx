"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

export function FilterCombobox<T extends string>({
  label,
  options,
  selected,
  onToggle,
  render,
}: {
  label: string;
  options: T[];
  selected: readonly T[];
  onToggle: (value: T) => void;
  render?: (value: T) => string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((option) => {
      const text = (render ? render(option) : option).toLowerCase();
      return !q || text.includes(q) || option.toLowerCase().includes(q);
    });
  }, [options, query, render]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function choose(option: T) {
    onToggle(option);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      if (visible.length) setActive((index) => (index + 1) % visible.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (visible.length) setActive((index) => (index - 1 + visible.length) % visible.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (visible[highlight]) choose(visible[highlight]);
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  const highlight = visible.length ? Math.min(active, visible.length - 1) : 0;
  const showList = open && visible.length > 0;

  useLayoutEffect(() => {
    if (!showList) return;
    optionRefs.current[highlight]?.scrollIntoView({ block: "nearest" });
  }, [highlight, showList]);

  return (
    <div ref={rootRef} className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      {selected.length ? (
        <div className="flex flex-wrap gap-2">
          {selected.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className="rounded-full border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-accent"
            >
              {render ? render(value) : value} ×
            </button>
          ))}
        </div>
      ) : null}
      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={`Filter ${label}`}
          value={query}
          placeholder={`Type or Enter to apply ${label.toLowerCase()}`}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => {
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-xl border border-card-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-accent/40 placeholder:text-muted focus:ring-2"
        />
        {showList ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-card-border bg-card py-1 shadow-lg shadow-black/40"
          >
            {visible.map((option, index) => {
              const activeOption = selected.includes(option);
              return (
                <li key={option} role="presentation">
                  <button
                    type="button"
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    role="option"
                    aria-selected={index === highlight}
                    onMouseEnter={() => setActive(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(option)}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm ${
                      index === highlight ? "bg-accent/15 text-foreground" : "text-foreground"
                    }`}
                  >
                    <span>{render ? render(option) : option}</span>
                    {activeOption ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">On</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
