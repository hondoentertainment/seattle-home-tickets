"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconRefresh } from "@/components/ui-icons";
import { toast } from "@/lib/feedback";
import {
  formatLastCheckedShort,
  refreshStamp,
  requestCatalogClientRefresh,
  type RefreshStatus,
} from "@/lib/refresh";

export function HeaderRefreshButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function refreshCatalog() {
    if (pending) return;
    setPending(true);
    try {
      const response = await fetch("/api/refresh", { method: "POST", cache: "no-store" });
      const payload = (await response.json()) as RefreshStatus;
      requestCatalogClientRefresh();
      router.refresh();
      toast(payload.message, 5600);
    } catch {
      requestCatalogClientRefresh();
      router.refresh();
      toast(
        `Could not reach the refresh endpoint. Reloaded this page. Last checked ${formatLastCheckedShort(refreshStamp.lastChecked)}.`,
        5600,
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={refreshCatalog}
      disabled={pending}
      aria-label="Refresh"
      aria-busy={pending}
      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-card-border bg-card text-foreground hover:border-accent/50 hover:text-accent disabled:opacity-60"
    >
      <span className={pending ? "animate-spin" : undefined}>
        <IconRefresh />
      </span>
    </button>
  );
}
