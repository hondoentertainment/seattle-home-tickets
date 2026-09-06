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
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Support</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Contact
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Seattle Home Tickets is unofficial. We do not sell tickets, take orders, or
        handle refunds. For a purchase, account, or gameday issue, use the club or
        school page — those are the published official channels, not inboxes we
        invented.
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">
        Questions about how this catalog works (estimates, filters, shortlist) belong
        on the{" "}
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
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {entry.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-accent hover:underline"
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
