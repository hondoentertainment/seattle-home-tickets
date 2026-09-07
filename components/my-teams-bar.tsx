"use client";

import { useState } from "react";
import { PickTeamsPrompt } from "@/components/pick-teams-prompt";
import { SegmentedControl } from "@/components/segmented-control";
import { TeamMark } from "@/components/team-mark";
import { TeamPickerSheet } from "@/components/team-picker-sheet";
import { IconCheck, IconPlus } from "@/components/ui-icons";
import { persistPinnedTeams } from "@/lib/my-teams";
import { displayMark } from "@/lib/teams";
import { useHasStoredPinnedTeams } from "@/lib/use-my-teams";

const HOME_VIEW = [
  { value: "mine", label: "My teams" },
  { value: "all", label: "All" },
] as const;

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
  const [open, setOpen] = useState(false);
  const hasStored = useHasStoredPinnedTeams();
  const viewingMine = mine && pinned.length > 0;
  const showPrompt = !hasStored;

  function closePicker() {
    setOpen(false);
    persistPinnedTeams();
  }

  function skipPrompt() {
    persistPinnedTeams();
  }

  const picker = (
    <TeamPickerSheet
      open={open}
      onClose={closePicker}
      allTeams={allTeams}
      pinned={pinned}
      onTogglePin={onTogglePin}
    />
  );

  if (variant === "home") {
    return (
      <div className="space-y-3">
        {showPrompt ? <PickTeamsPrompt onChoose={() => setOpen(true)} onSkip={skipPrompt} /> : null}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">My teams</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-accent"
          >
            <IconPlus className="size-4" />
            {pinned.length ? "Edit" : "Add"}
          </button>
        </div>
        <SegmentedControl
          ariaLabel="Home default view"
          size="compact"
          value={viewingMine ? "mine" : "all"}
          options={HOME_VIEW}
          onChange={(value) => {
            if (value === "mine") onShowMine();
            else onShowAll();
          }}
        />
        {pinned.length === 0 ? (
          <p className="text-xs leading-5 text-muted">
            Pin clubs to filter Home. Tap Add to choose.
          </p>
        ) : (
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {pinned.map((team) => {
              const mark = displayMark(team);
              return (
                <button
                  key={team}
                  type="button"
                  aria-pressed={viewingMine}
                  onClick={onShowMine}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-2.5 text-xs font-semibold ${
                    viewingMine
                      ? "border-accent bg-accent/20 text-foreground"
                      : "border-dashed border-card-border bg-card text-muted"
                  }`}
                >
                  <TeamMark mark={mark} size="chip" />
                  {mark.short}
                  {viewingMine ? <IconCheck className="size-3.5 text-accent" /> : null}
                </button>
              );
            })}
          </div>
        )}
        {picker}
      </div>
    );
  }

  return (
    <section className="space-y-3 rounded-2xl border border-card-border bg-card/80 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">My teams</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-3 text-xs font-semibold text-accent"
        >
          <IconPlus className="size-4" />
          Add
        </button>
      </div>
      {showPrompt ? <PickTeamsPrompt onChoose={() => setOpen(true)} onSkip={skipPrompt} /> : null}
      {pinned.length ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Pinned teams">
          {pinned.map((team) => {
            const mark = displayMark(team);
            return (
              <button
                key={team}
                type="button"
                aria-pressed
                aria-label={`Unpin ${team}`}
                onClick={() => onTogglePin(team)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-accent bg-accent/20 px-2.5 text-xs font-semibold text-foreground"
              >
                <TeamMark mark={mark} size="chip" />
                {mark.short}
                <IconCheck className="size-3.5 text-accent" />
              </button>
            );
          })}
        </div>
      ) : hasStored ? (
        <p className="text-xs leading-5 text-muted">No teams pinned yet. Tap Add to pick clubs.</p>
      ) : null}
      {picker}
    </section>
  );
}
