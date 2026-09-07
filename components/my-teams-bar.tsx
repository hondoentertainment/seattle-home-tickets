"use client";

import { useState } from "react";
import { FIELD_CHIP } from "@/lib/field-control";
import { DEFAULT_PINNED_TEAMS } from "@/lib/my-teams";

export function MyTeamsBar({
  allTeams,
  pinned,
  mine,
  onTogglePin,
  onShowMine,
  onShowAll,
}: {
  allTeams: readonly string[];
  pinned: readonly string[];
  mine: boolean;
  onTogglePin: (team: string) => void;
  onShowMine: () => void;
  onShowAll: () => void;
}) {
  const [open, setOpen] = useState(false);
  const viewingMine = mine && pinned.length > 0;
  const pinCount = pinned.length;

  return (
    <div className="rounded-2xl border border-card-border bg-card/80 p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={viewingMine}
          onClick={viewingMine ? onShowAll : onShowMine}
          className={`${FIELD_CHIP} ${
            viewingMine ? "border-accent/50 bg-accent/10 text-accent" : "border-card-border bg-card text-muted"
          }`}
        >
          {viewingMine ? `My teams · ${pinCount}` : pinCount ? "Show my teams" : "My teams"}
        </button>
        {viewingMine ? (
          <button
            type="button"
            onClick={onShowAll}
            className="inline-flex min-h-11 items-center rounded-full px-2 text-xs font-semibold text-muted hover:text-foreground"
          >
            All teams
          </button>
        ) : null}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-11 items-center rounded-full px-2 text-xs font-semibold text-accent"
        >
          {open ? "Done" : "Edit pins"}
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
                className={`inline-flex min-h-11 items-center rounded-full border px-3 text-xs font-medium ${
                  active
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-card-border bg-background text-muted"
                }`}
              >
                {team.replace("Seattle ", "").replace("Washington ", "")}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mt-2 text-xs leading-5 text-muted">
          {viewingMine
            ? "Home is showing pinned clubs. All teams clears the view without deleting pins."
            : pinCount
              ? "Pins stay saved. Tap Show my teams to filter Home."
              : `Pin clubs to filter Home. Defaults were ${DEFAULT_PINNED_TEAMS.length} Seattle teams + Huskies.`}
        </p>
      )}
    </div>
  );
}
