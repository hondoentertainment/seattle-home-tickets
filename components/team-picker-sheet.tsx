"use client";

import { FilterSheet } from "@/components/filter-sheet";
import { TeamMark } from "@/components/team-mark";
import { IconCheck } from "@/components/ui-icons";
import { DEFAULT_PINNED_TEAMS } from "@/lib/my-teams";
import { displayMark } from "@/lib/teams";

function orderedTeams(allTeams: readonly string[]): string[] {
  const defaults = new Set<string>(DEFAULT_PINNED_TEAMS);
  return [...DEFAULT_PINNED_TEAMS.filter((team) => allTeams.includes(team)), ...allTeams.filter((team) => !defaults.has(team))];
}

export function TeamPickerSheet({
  open,
  onClose,
  allTeams,
  pinned,
  onTogglePin,
}: {
  open: boolean;
  onClose: () => void;
  allTeams: readonly string[];
  pinned: readonly string[];
  onTogglePin: (team: string) => void;
}) {
  const teams = orderedTeams(allTeams);

  return (
    <FilterSheet open={open} onClose={onClose} title="My teams">
      <p className="text-sm leading-6 text-muted">
        Tap to pin or unpin. Home can show just these clubs. Monograms, not logos.
      </p>
      <div className="space-y-2" role="group" aria-label="Pin Seattle teams">
        {teams.map((team) => {
          const active = pinned.includes(team);
          const mark = displayMark(team);
          return (
            <button
              key={team}
              type="button"
              aria-pressed={active}
              onClick={() => onTogglePin(team)}
              className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-3 text-left ${
                active
                  ? "border-accent bg-accent/15 text-foreground"
                  : "border-card-border bg-card text-muted"
              }`}
            >
              <TeamMark mark={mark} size="card" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">{mark.short}</span>
                <span className="block truncate text-xs text-muted">{team}</span>
              </span>
              <span
                className={`grid size-8 place-items-center rounded-full ${
                  active ? "bg-accent text-background" : "border border-card-border text-muted"
                }`}
              >
                {active ? <IconCheck className="size-4" /> : null}
                <span className="sr-only">{active ? "Pinned" : "Not pinned"}</span>
              </span>
            </button>
          );
        })}
      </div>
    </FilterSheet>
  );
}
