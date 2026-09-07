import type { Metadata } from "next";
import Link from "next/link";
import { contactGroups } from "@/lib/contacts";

export const metadata: Metadata = {
  title: "Contact — Seattle Home Tickets",
  description:
    "Official ticket-office and guest-services pages for Seattle clubs and schools on this calendar. This site is unofficial and does not sell tickets.",
};

export default function ContactPage() {
  return (
    <div className="page-gutter mx-auto w-full max-w-3xl flex-1 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Contact
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        This site does not sell tickets. Use the official club or school page for
        purchases, refunds, or gameday help. How the catalog works is on the{" "}
        <Link href="/about" className="text-accent hover:underline">
          FAQ
        </Link>
        .
      </p>

      {contactGroups.map((group) => (
        <section key={group.heading} className="mt-8">
          <h2 className="text-sm font-semibold text-foreground">{group.heading}</h2>
          {group.note ? <p className="mt-1 text-xs leading-5 text-muted">{group.note}</p> : null}
          <ul className="mt-3 space-y-3">
            {group.entries.map((entry) => (
              <li key={entry.name} className="rounded-2xl border border-card-border bg-card/80 px-4 py-3">
                <p className="font-medium text-foreground">{entry.name}</p>
                <p className="mt-2 flex flex-wrap gap-2">
                  {entry.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-sm text-accent hover:border-accent/50"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
