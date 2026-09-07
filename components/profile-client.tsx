"use client";

import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";
import { MyTeamsBar } from "@/components/my-teams-bar";
import { QuantityStepper } from "@/components/quantity-picker";
import { SegmentedControl } from "@/components/segmented-control";
import { IconBell, IconBookmark, IconChevron, IconShield } from "@/components/ui-icons";
import { allTeams } from "@/lib/catalog";
import { writeHomeMine } from "@/lib/home-prefs";
import { NO_TICKET_SALES_LINE, UNOFFICIAL_ESTIMATE_LINE } from "@/lib/legal";
import { togglePinnedTeam } from "@/lib/my-teams";
import { qtyNoun } from "@/lib/quantity";
import { useHomeMine } from "@/lib/use-home-prefs";
import { usePinnedTeams } from "@/lib/use-my-teams";
import { useStoredShortlist } from "@/lib/shortlist";
import { requestShortlistOpen, writeStoredQty } from "@/lib/url-state";

const HOME_DEFAULT = [
  { value: "mine", label: "My teams" },
  { value: "all", label: "All" },
] as const;

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

      <section className="space-y-5 rounded-2xl border border-card-border bg-card/80 p-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Default ticket quantity</p>
            <p className="mt-0.5 text-xs leading-5 text-muted">
              Scales unofficial estimates on Home and Saved.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {qty} {qtyNoun(qty)}
            </p>
            <QuantityStepper value={qty} onChange={writeStoredQty} />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Home default</p>
            <p className="mt-0.5 text-xs leading-5 text-muted">
              What Home opens to. Pins stay either way.
            </p>
          </div>
          <SegmentedControl
            ariaLabel="Home default view"
            value={homeMine ? "mine" : "all"}
            options={HOME_DEFAULT}
            onChange={(value) => writeHomeMine(value === "mine")}
          />
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
