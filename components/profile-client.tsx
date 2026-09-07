"use client";

import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";
import { MyTeamsBar } from "@/components/my-teams-bar";
import { QuantityPicker } from "@/components/quantity-picker";
import { allTeams } from "@/lib/catalog";
import { FIELD_CHIP } from "@/lib/field-control";
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
    <div className="space-y-4">
      <section className="rounded-2xl border border-card-border bg-card/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">You</p>
        <div className="mt-3">
          <AuthControls variant="profile" />
        </div>
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

      <section className="rounded-2xl border border-card-border bg-card/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Home default</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Home default view">
          <button
            type="button"
            aria-pressed={homeMine}
            onClick={() => writeHomeMine(true)}
            className={`${FIELD_CHIP} ${
              homeMine ? "border-accent/50 bg-accent/10 text-accent" : "border-card-border bg-card text-muted"
            }`}
          >
            My teams
          </button>
          <button
            type="button"
            aria-pressed={!homeMine}
            onClick={() => writeHomeMine(false)}
            className={`${FIELD_CHIP} ${
              !homeMine ? "border-accent/50 bg-accent/10 text-accent" : "border-card-border bg-card text-muted"
            }`}
          >
            All teams
          </button>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">
          Used when Home has no <code className="text-foreground">mine=</code> in the URL.
        </p>
      </section>

      <section className="rounded-2xl border border-card-border bg-card/80 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Ticket quantity</p>
        <QuantityPicker value={qty} onChange={writeStoredQty} />
      </section>

      <section className="rounded-2xl border border-card-border bg-card/80 p-4">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => requestShortlistOpen()}
            aria-label={ids.length ? `Open Saved, ${ids.length} games` : "Open Saved"}
            className="inline-flex min-h-11 items-center justify-between rounded-xl px-1 text-left text-sm font-medium text-foreground"
          >
            <span>Saved</span>
            <span className="text-xs text-muted">{ids.length ? `${ids.length} · Open` : "Open"}</span>
          </button>
          <Link
            href="/alerts"
            className="inline-flex min-h-11 items-center justify-between rounded-xl px-1 text-sm font-medium text-foreground"
          >
            <span>Alerts</span>
            <span className="text-xs text-muted">In-app prefs</span>
          </Link>
          <Link
            href="/teams"
            className="inline-flex min-h-11 items-center rounded-xl px-1 text-sm font-medium text-accent"
          >
            All team tiles
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-muted">
        {UNOFFICIAL_ESTIMATE_LINE} {NO_TICKET_SALES_LINE} Alerts do not send email or
        web-push.
      </p>
    </div>
  );
}
