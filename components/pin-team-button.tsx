"use client";

import { togglePinnedTeam } from "@/lib/my-teams";
import { usePinnedTeams } from "@/lib/use-my-teams";

export function PinTeamButton({ team }: { team: string }) {
  const pinnedTeams = usePinnedTeams();
  const pinned = pinnedTeams.includes(team);

  return (
    <button
      type="button"
      aria-pressed={pinned}
      aria-label={pinned ? `Unpin ${team} from My teams` : `Pin ${team} to My teams`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        togglePinnedTeam(team);
      }}
      className={`inline-flex min-h-11 items-center rounded-full border px-3 text-xs font-semibold ${
        pinned ? "border-accent bg-accent/15 text-accent" : "border-card-border text-muted"
      }`}
    >
      {pinned ? "Pinned" : "Pin"}
    </button>
  );
}
