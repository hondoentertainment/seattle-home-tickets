"use client";

import { useCallback, useState } from "react";
import { TeamPickerSheet } from "@/components/team-picker-sheet";
import { persistPinnedTeams, togglePinnedTeam } from "@/lib/my-teams";
import { usePinnedTeams } from "@/lib/use-my-teams";

export function TeamsEditBar({ allTeams }: { allTeams: readonly string[] }) {
  const [open, setOpen] = useState(false);
  const pinned = usePinnedTeams();

  const closePicker = useCallback(() => {
    setOpen(false);
    persistPinnedTeams();
  }, []);

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-card-border bg-card/80 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">My teams</p>
        <p className="mt-0.5 text-xs leading-5 text-muted">
          {pinned.length
            ? `${pinned.length} pinned · edit to group, reorder, or pin more`
            : "Pin clubs for Home’s My teams filter"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-accent/40 bg-accent/10 px-3 text-xs font-semibold text-accent"
      >
        {pinned.length ? "Edit" : "Add"}
      </button>
      <TeamPickerSheet
        open={open}
        onClose={closePicker}
        allTeams={allTeams}
        pinned={pinned}
        onTogglePin={togglePinnedTeam}
      />
    </div>
  );
}
