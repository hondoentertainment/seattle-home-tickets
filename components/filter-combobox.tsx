"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FIELD_ACTION, FIELD_CHIP, FIELD_INPUT, FIELD_LIST, FIELD_ROW } from "@/lib/field-control";
import { composingKey } from "@/lib/listbox-keys";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((option) => {
      const text = (render ? render(option) : option).toLowerCase();
      return !q || text.includes(q) || option.toLowerCase().includes(q);
    });
  }, [options, query, render]);

  const highlight = visible.length ? Math.min(active, visible.length - 1) : -1;
  const showList = open && visible.length > 0;

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

  useLayoutEffect(() => {
    if (!showList || highlight < 0) return;
    optionRefs.current[highlight]?.scrollIntoView({ block: "nearest" });
  }, [highlight, showList]);

  function choose(option: T) {
    onToggle(option);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function openList(index = 0) {
    setActive(visible.length ? Math.min(index, visible.length - 1) : 0);
    setOpen(true);
  }

  function applyHighlight() {
    if (highlight >= 0 && visible[highlight]) {
      choose(visible[highlight]);
      return true;
    }
    return false;
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (composingKey(event)) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openList(0);
        return;
      }
      if (!visible.length) return;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) => {
        const current = Math.min(Math.max(index, 0), visible.length - 1);
        return (current + delta + visible.length) % visible.length;
      });
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (!open) {
        openList(0);
        return;
      }
      applyHighlight();
      return;
    }

    if (event.key === "Escape") {
      if (!open && !query) return;
      event.preventDefault();
      setOpen(false);
      setQuery("");
    }
  }

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
              className={`${FIELD_CHIP} w-auto border-accent bg-accent/15 text-accent`}
            >
              {render ? render(value) : value} ×
            </button>
          ))}
        </div>
      ) : null}
      <div className="relative" onKeyDown={onKeyDown}>
        <div className={FIELD_ROW}>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={showList && highlight >= 0 ? `${listId}-${highlight}` : undefined}
            aria-label={`Filter ${label}`}
            value={query}
            placeholder="Type to filter"
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => {
              setActive(0);
              setOpen(true);
            }}
            className={`${FIELD_INPUT} flex-1 truncate placeholder:truncate`}
          />
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (!open) {
                openList(0);
                inputRef.current?.focus();
                return;
              }
              if (!applyHighlight()) inputRef.current?.focus();
            }}
            className={FIELD_ACTION}
          >
            Add
          </button>
        </div>
        {showList ? (
          <ul
            id={listId}
            role="listbox"
            className={`${FIELD_LIST} z-30`}
          >
            {visible.map((option, index) => {
              const activeOption = selected.includes(option);
              return (
                <li key={option} role="presentation">
                  <button
                    type="button"
                    id={`${listId}-${index}`}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    role="option"
                    aria-selected={index === highlight}
                    tabIndex={-1}
                    onMouseEnter={() => setActive(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(option)}
                    className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm leading-5 ${
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
