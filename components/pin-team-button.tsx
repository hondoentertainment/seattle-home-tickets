"use client";

import { IconCheck } from "@/components/ui-icons";
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
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold ${
        pinned
          ? "border-accent bg-accent/20 text-foreground"
          : "border-dashed border-card-border text-muted"
      }`}
    >
      {pinned ? <IconCheck className="size-3.5 text-accent" /> : null}
      {pinned ? "Pinned" : "Pin"}
    </button>
  );
}
