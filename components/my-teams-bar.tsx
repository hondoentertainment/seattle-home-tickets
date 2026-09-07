"use client";

import { useState } from "react";
import { TeamMark } from "@/components/team-mark";
import { FIELD_CHIP } from "@/lib/field-control";
import { DEFAULT_PINNED_TEAMS } from "@/lib/my-teams";
import { displayMark } from "@/lib/teams";

export function MyTeamsBar({
  allTeams,
  pinned,
  mine,
  onTogglePin,
  onShowMine,
  onShowAll,
  variant = "home",
}: {
  allTeams: readonly string[];
  pinned: readonly string[];
  mine: boolean;
  onTogglePin: (team: string) => void;
  onShowMine: () => void;
  onShowAll: () => void;
  variant?: "home" | "profile";
}) {
  const [open, setOpen] = useState(variant === "profile");
  const viewingMine = mine && pinned.length > 0;

  if (variant === "home") {
    return (
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-muted">My teams</p>
          <div className="flex items-center gap-2">
            {viewingMine ? (
              <button
                type="button"
                onClick={onShowAll}
                className="inline-flex min-h-11 items-center text-xs font-semibold text-muted hover:text-foreground"
              >
                All
              </button>
            ) : (
              <button
                type="button"
                onClick={onShowMine}
                className="inline-flex min-h-11 items-center text-xs font-semibold text-accent"
              >
                My teams
              </button>
            )}
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex min-h-11 items-center text-xs font-semibold text-accent"
            >
              {open ? "Done" : "Edit"}
            </button>
          </div>
        </div>
        {!open && pinned.length === 0 ? (
          <p className="text-xs leading-5 text-muted">Pin clubs with Edit to filter Home.</p>
        ) : null}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {(open ? allTeams : pinned).map((team) => {
            const active = pinned.includes(team);
            const mark = displayMark(team);
            return (
              <button
                key={team}
                type="button"
                aria-pressed={open ? active : viewingMine}
                onClick={() => (open ? onTogglePin(team) : onShowMine())}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-2.5 text-xs font-medium ${
                  open
                    ? active
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-card-border bg-card text-muted"
                    : "border-card-border bg-card text-foreground"
                }`}
              >
                <TeamMark mark={mark} size="chip" />
                {mark.short}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">My teams</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {pinned.map((team) => {
          const mark = displayMark(team);
          return (
            <button
              key={team}
              type="button"
              aria-label={`Unpin ${team}`}
              onClick={() => onTogglePin(team)}
              className="flex flex-col items-center gap-1"
            >
              <TeamMark mark={mark} size="card" />
              <span className="max-w-14 truncate text-[10px] font-medium text-muted">{mark.short}</span>
            </button>
          );
        })}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex flex-col items-center gap-1"
        >
          <span className="grid size-11 place-items-center rounded-full border border-dashed border-muted text-lg leading-none text-muted">
            +
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Add</span>
        </button>
      </div>
      {open ? (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Pin Seattle teams">
          {allTeams.map((team) => {
            const active = pinned.includes(team);
            return (
              <button
                key={team}
                type="button"
                aria-pressed={active}
                onClick={() => onTogglePin(team)}
                className={`${FIELD_CHIP} ${
                  active ? "border-accent bg-accent/15 text-accent" : "border-card-border bg-card text-muted"
                }`}
              >
                {team.replace("Seattle ", "").replace("Washington ", "")}
              </button>
            );
          })}
        </div>
      ) : pinned.length === 0 ? (
        <p className="mt-2 text-xs leading-5 text-muted">
          Pin clubs to filter Home. Defaults were {DEFAULT_PINNED_TEAMS.length} Seattle teams + Huskies.
        </p>
      ) : null}
    </div>
  );
}
