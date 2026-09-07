"use client";

import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";
import { MyTeamsBar } from "@/components/my-teams-bar";
import { QuantityStepper } from "@/components/quantity-picker";
import { IconBell, IconBookmark, IconChevron, IconShield } from "@/components/ui-icons";
import { allTeams } from "@/lib/catalog";
import { writeHomeMine } from "@/lib/home-prefs";
import { NO_TICKET_SALES_LINE, UNOFFICIAL_ESTIMATE_LINE } from "@/lib/legal";
import { togglePinnedTeam } from "@/lib/my-teams";
import { useHomeMine } from "@/lib/use-home-prefs";
import { usePinnedTeams } from "@/lib/use-my-teams";
import { useStoredShortlist } from "@/lib/shortlist";
import { requestShortlistOpen, writeStoredQty } from "@/lib/url-state";

export function ProfileClient() {
  const pinned = usePinnedTeams();
  const homeMine = useHomeMine();
  const { ids, qty } = useStoredShortlist();

  return (
    <div className="space-y-6">
      <section className="text-center">
        <AuthControls variant="profile" />
      </section>

      <MyTeamsBar
        variant="profile"
        allTeams={allTeams}
        pinned={pinned}
        mine={homeMine}
        onTogglePin={(team) => {
          togglePinnedTeam(team);
        }}
        onShowMine={() => writeHomeMine(true)}
        onShowAll={() => writeHomeMine(false)}
      />

      <section className="overflow-hidden rounded-2xl border border-card-border bg-card/80">
        <button
          type="button"
          onClick={() => requestShortlistOpen()}
          aria-label={ids.length ? `Open Saved, ${ids.length} games` : "Open Saved"}
          className="flex min-h-14 w-full items-center gap-3 px-4 text-left"
        >
          <IconBookmark />
          <span className="flex-1 text-sm font-medium text-foreground">Open Saved</span>
          {ids.length ? (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
              {ids.length}
            </span>
          ) : null}
          <span className="text-muted">
            <IconChevron />
          </span>
        </button>
        <div className="mx-4 border-t border-card-border" />
        <Link href="/alerts" className="flex min-h-14 items-center gap-3 px-4">
          <IconBell />
          <span className="flex-1 text-sm font-medium text-foreground">Alerts</span>
          <span className="text-muted">
            <IconChevron />
          </span>
        </Link>
      </section>

      <section className="space-y-4 rounded-2xl border border-card-border bg-card/80 p-4">
        <div className="flex min-h-11 items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Default ticket quantity</p>
          <QuantityStepper value={qty} onChange={writeStoredQty} />
        </div>
        <div className="flex min-h-11 items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Home default</p>
          <div className="inline-flex rounded-full bg-background p-1" role="group" aria-label="Home default view">
            <button
              type="button"
              aria-pressed={homeMine}
              onClick={() => writeHomeMine(true)}
              className={`inline-flex min-h-10 items-center rounded-full px-3 text-xs font-semibold ${
                homeMine ? "bg-accent/20 text-foreground" : "text-muted"
              }`}
            >
              My teams
            </button>
            <button
              type="button"
              aria-pressed={!homeMine}
              onClick={() => writeHomeMine(false)}
              className={`inline-flex min-h-10 items-center rounded-full px-3 text-xs font-semibold ${
                !homeMine ? "bg-accent/20 text-foreground" : "text-muted"
              }`}
            >
              All
            </button>
          </div>
        </div>
      </section>

      <p className="flex items-start gap-2 text-xs leading-5 text-muted">
        <span className="mt-0.5 text-muted">
          <IconShield />
        </span>
        {UNOFFICIAL_ESTIMATE_LINE} {NO_TICKET_SALES_LINE}
      </p>
    </div>
  );
}
