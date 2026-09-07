"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/lib/feedback";
import { FIELD_ACTION } from "@/lib/field-control";
import {
  formatLastCheckedShort,
  refreshStamp,
  requestCatalogClientRefresh,
  type RefreshStatus,
} from "@/lib/refresh";

function statusLine(status: RefreshStatus | null): string {
  const stamp = status?.main && status.newerOnMain ? status.main : refreshStamp;
  const checked = formatLastCheckedShort(stamp.lastChecked);
  if (status?.newerOnMain) {
    return `Newer check on main · waiting for deploy · ${checked}`;
  }
  return `Last checked ${checked}`;
}

export function HomeRefreshBar() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<RefreshStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/refresh", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: RefreshStatus) => {
        if (!cancelled) setStatus(payload);
      })
      .catch(() => {
        /* Deploy stamp in the bar is enough if GitHub is unreachable. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshCatalog() {
    if (pending) return;
    setPending(true);
    try {
      const response = await fetch("/api/refresh", { method: "POST", cache: "no-store" });
      const payload = (await response.json()) as RefreshStatus;
      setStatus(payload);
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
    <div className="flex flex-col gap-2 rounded-2xl border border-card-border bg-card/80 p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
      <button
        type="button"
        onClick={refreshCatalog}
        disabled={pending}
        aria-label="Refresh catalog. Reloads this page and queues the GitHub catalog check if configured."
        aria-busy={pending}
        className={`${FIELD_ACTION} min-h-11 min-w-11 px-5 disabled:opacity-60`}
      >
        {pending ? "Refreshing…" : "Refresh"}
      </button>
      <div className="min-w-0 text-xs leading-5 text-muted">
        <p className="font-medium text-foreground">{statusLine(status)}</p>
        <p>
          Catalog as of {refreshStamp.catalogAsOf}
          {refreshStamp.catalogMatchesSeed ? "" : " · seed review pending"}
          {" · not live scores or prices"}
        </p>
      </div>
    </div>
  );
}
