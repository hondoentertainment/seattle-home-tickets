import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertsClient } from "@/components/alerts-client";
import { pageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("Alerts"),
  description:
    "In-app alert preferences for unofficial price caps, published promo nights, outdoor weather risk, and tomorrow’s Saved games.",
};

export default function AlertsPage() {
  return (
    <div className="page-gutter mx-auto w-full max-w-2xl flex-1 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Alerts
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        In-app only. We do not send email or web-push from this site yet. Preferences stay
        in this browser, and on your account if you are signed in and Redis/Neon is
        configured.
      </p>
      <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading alerts…</p>}>
        <AlertsClient />
      </Suspense>
    </div>
  );
}
