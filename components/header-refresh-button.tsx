"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/lib/feedback";
import {
  formatLastCheckedShort,
  refreshStamp,
  requestCatalogClientRefresh,
  type RefreshStatus,
} from "@/lib/refresh";

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-5 ${spinning ? "animate-spin" : ""}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M17.65 6.35A7.96 7.96 0 0 0 12 4C7.58 4 4.01 7.58 4.01 12S7.58 20 12 20c3.73 0 6.84-2.55 7.73-6h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"
      />
    </svg>
  );
}

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
      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-card-border bg-card text-foreground hover:border-accent/50 hover:text-accent disabled:opacity-60 lg:rounded-full"
    >
      <RefreshIcon spinning={pending} />
    </button>
  );
}
