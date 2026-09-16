"use client";

import { useMemo, useState } from "react";
import { FilterSheet } from "@/components/filter-sheet";
import { SegmentedControl } from "@/components/segmented-control";
import { TeamMark } from "@/components/team-mark";
import { IconCheck, IconChevronDown, IconChevronUp } from "@/components/ui-icons";
import { movePinnedTeam, pinTeams, unpinTeams } from "@/lib/my-teams";
import {
  TEAM_GROUP_FILTERS,
  TEAM_GROUP_LABELS,
  TEAM_GROUPS,
  groupTeams,
  teamsInGroup,
  type TeamGroupFilter,
} from "@/lib/team-groups";
import { displayMark } from "@/lib/teams";

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
  const [filter, setFilter] = useState<TeamGroupFilter>("all");
  const pinnedSet = useMemo(() => new Set(pinned), [pinned]);
  const scoped = useMemo(() => teamsInGroup(allTeams, filter), [allTeams, filter]);
  const pinnedInScope = scoped.filter((team) => pinnedSet.has(team)).length;
  const unpinnedByGroup = useMemo(() => {
    const remaining = allTeams.filter((team) => !pinnedSet.has(team));
    if (filter === "all") return groupTeams(remaining);
    return { [filter]: teamsInGroup(remaining, filter) } as Record<string, string[]>;
  }, [allTeams, filter, pinnedSet]);
  const canSelectAll = pinnedInScope < scoped.length;
  const canClear = pinnedInScope > 0;
  const addGroups = useMemo(() => {
    if (filter === "all") {
      return TEAM_GROUPS.flatMap((group) => {
        const teams = unpinnedByGroup[group] ?? [];
        return teams.length ? [{ label: TEAM_GROUP_LABELS[group], teams }] : [];
      });
    }
    const teams = unpinnedByGroup[filter] ?? [];
    return teams.length ? [{ label: `Add ${TEAM_GROUP_LABELS[filter].toLowerCase()}`, teams }] : [];
  }, [filter, unpinnedByGroup]);

  return (
    <FilterSheet open={open} onClose={onClose} title="Edit teams">
      <p className="text-sm leading-6 text-muted">
        Pin clubs, filter by league, and reorder Home chips. Monograms, not logos.
      </p>
      <SegmentedControl
        ariaLabel="Filter teams by league"
        size="compact"
        value={filter}
        options={TEAM_GROUP_FILTERS}
        onChange={setFilter}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 text-xs leading-5 text-muted">
          {scoped.length === 0
            ? "No clubs in this group"
            : `${pinnedInScope} of ${scoped.length} pinned`}
        </p>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            disabled={!canSelectAll}
            onClick={() => pinTeams(scoped)}
            className="inline-flex min-h-11 items-center rounded-full border border-accent/40 bg-accent/10 px-3 text-xs font-semibold text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Select all
          </button>
          <button
            type="button"
            disabled={!canClear}
            onClick={() => unpinTeams(scoped)}
            className="inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>
      {pinned.length ? (
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Your order</p>
          <p className="-mt-1 text-xs leading-5 text-muted">Home chips follow this order.</p>
          <div className="space-y-2" role="list" aria-label="Pinned team order">
            {pinned.map((team, index) => (
              <PinnedOrderRow
                key={team}
                team={team}
                index={index}
                last={index === pinned.length - 1}
                onToggle={() => onTogglePin(team)}
              />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-xs leading-5 text-muted">Nothing pinned yet. Select clubs below.</p>
      )}
      {addGroups.map((section) => (
        <TeamAddGroup
          key={section.label}
          label={section.label}
          teams={section.teams}
          onTogglePin={onTogglePin}
        />
      ))}
      {scoped.length > 0 && pinnedInScope === scoped.length && addGroups.length === 0 ? (
        <p className="text-xs leading-5 text-muted">Every club in this group is pinned.</p>
      ) : null}
    </FilterSheet>
  );
}

function PinnedOrderRow({
  team,
  index,
  last,
  onToggle,
}: {
  team: string;
  index: number;
  last: boolean;
  onToggle: () => void;
}) {
  const mark = displayMark(team);
  return (
    <div
      role="listitem"
      className="flex min-h-14 items-center gap-1 rounded-2xl border border-accent bg-accent/15 pr-1"
    >
      <button
        type="button"
        aria-pressed
        onClick={onToggle}
        className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-3 text-left text-foreground"
      >
        <TeamMark mark={mark} size="card" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{mark.short}</span>
          <span className="block truncate text-xs text-muted">{team}</span>
        </span>
        <span className="grid size-8 place-items-center rounded-full bg-accent text-background">
          <IconCheck className="size-4" />
          <span className="sr-only">Pinned, tap to unpin</span>
        </span>
      </button>
      <div className="flex shrink-0">
        <button
          type="button"
          disabled={index === 0}
          aria-label={`Move ${team} up`}
          onClick={() => movePinnedTeam(team, -1)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-foreground disabled:text-muted/40"
        >
          <IconChevronUp />
        </button>
        <button
          type="button"
          disabled={last}
          aria-label={`Move ${team} down`}
          onClick={() => movePinnedTeam(team, 1)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-foreground disabled:text-muted/40"
        >
          <IconChevronDown />
        </button>
      </div>
    </div>
  );
}

function TeamAddGroup({
  label,
  teams,
  onTogglePin,
}: {
  label: string;
  teams: readonly string[];
  onTogglePin: (team: string) => void;
}) {
  return (
    <section className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <div className="space-y-2" role="group" aria-label={label}>
        {teams.map((team) => {
          const mark = displayMark(team);
          return (
            <button
              key={team}
              type="button"
              aria-pressed={false}
              onClick={() => onTogglePin(team)}
              className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-card-border bg-card px-3 text-left text-muted"
            >
              <TeamMark mark={mark} size="card" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">{mark.short}</span>
                <span className="block truncate text-xs text-muted">{team}</span>
              </span>
              <span className="grid size-8 place-items-center rounded-full border border-card-border">
                <span className="sr-only">Not pinned</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
