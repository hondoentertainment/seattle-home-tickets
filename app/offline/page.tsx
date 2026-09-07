import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline — Seattle Home Games",
};

export default function OfflinePage() {
  return (
    <div className="page-gutter mx-auto w-full max-w-lg flex-1 py-16">
      <h1 className="text-2xl font-semibold text-foreground">You’re offline</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        This install can reopen Home from cache after a first visit. Live weather, sign-in,
        and refresh dispatch need a network. The catalog is still the published seed — not
        live scores.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-background"
      >
        Try Home
      </Link>
    </div>
  );
}
