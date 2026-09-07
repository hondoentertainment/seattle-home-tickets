import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { TeamMark } from "@/components/team-mark";
import { formatGameDate } from "@/lib/format";
import {
  libraryCatalog,
  libraryCollectionFor,
  libraryCollections,
  libraryCounts,
  type LibraryCollection,
} from "@/lib/library";
import { PRODUCT_NAME, pageTitle } from "@/lib/brand";
import { markFor } from "@/lib/teams";

export const metadata: Metadata = {
  title: pageTitle("Library"),
  description: `Unofficial books, articles, and podcasts for Seattle home teams. Fan and editorial collection for ${PRODUCT_NAME} — not affiliated with leagues or clubs.`,
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function formatItemDate(iso: string | null): string | null {
  if (!iso) return null;
  return formatGameDate(iso);
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string | string[] }>;
}) {
  const selectedId = firstParam((await searchParams).team);
  const selected = libraryCollectionFor(selectedId);
  const collections = selected ? [selected] : libraryCollections;

  return (
    <div className="page-gutter mx-auto w-full max-w-7xl flex-1 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Library
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Books, articles, and podcasts for Seattle home teams. A {PRODUCT_NAME}{" "}
        reading list — unofficial, editorial, and incomplete on purpose when the
        shelf is thin.
      </p>

      <div className="mt-4 rounded-2xl border border-gold/40 bg-gold/5 px-4 py-3 text-xs leading-5 text-muted">
        {libraryCatalog.disclaimer}
      </div>

      <nav aria-label="Filter by team" className="-mx-1 mt-5 flex gap-2 overflow-x-auto pb-1">
        <FilterChip href="/library" active={!selected} label="All" />
        {libraryCollections.map((collection) => (
          <FilterChip
            key={collection.id}
            href={`/library?team=${collection.id}`}
            active={selected?.id === collection.id}
            label={collection.short}
          />
        ))}
      </nav>

      <div className="mt-8 space-y-10">
        {collections.map((collection) => (
          <CollectionBlock key={collection.id} collection={collection} />
        ))}
      </div>

      <p className="mt-10 text-xs text-muted">
        Checked {libraryCatalog.asOf}.{" "}
        <Link href="/about" className="text-accent hover:underline">
          FAQ
        </Link>
        {" · "}
        <Link href="/teams" className="text-accent hover:underline">
          Teams
        </Link>
      </p>
    </div>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-3 text-xs font-semibold ${
        active
          ? "border-gold bg-gold/15 text-gold"
          : "border-card-border bg-card text-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

function CollectionBlock({ collection }: { collection: LibraryCollection }) {
  const counts = libraryCounts(collection);
  const mark = markFor(collection.team);
  const empty = counts.books + counts.articles + counts.podcasts === 0;

  return (
    <section className="scroll-mt-24" id={collection.id}>
      <div className="flex items-start gap-3">
        {mark ? <TeamMark mark={mark} size="sm" /> : null}
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">{collection.team}</h2>
          <p className="mt-0.5 text-xs text-muted">
            {collection.sport}
            {" · "}
            {counts.books} {counts.books === 1 ? "book" : "books"}
            {" · "}
            {counts.articles} {counts.articles === 1 ? "article" : "articles"}
            {" · "}
            {counts.podcasts} {counts.podcasts === 1 ? "podcast" : "podcasts"}
          </p>
        </div>
      </div>

      {collection.coverageNote ? (
        <p className="mt-3 rounded-xl border border-gold/30 bg-gold/5 px-3 py-2 text-xs leading-5 text-gold">
          {collection.coverageNote}
        </p>
      ) : null}

      {empty ? (
        <p className="mt-4 text-sm text-muted">Nothing verified for this shelf yet.</p>
      ) : (
        <div className="mt-4 space-y-6">
          <ItemGroup label="Books">
            {collection.books.length === 0 ? (
              <EmptyLine text="No verified books on this shelf." />
            ) : (
              collection.books.map((book) => (
                <li key={book.id} className="rounded-2xl border border-card-border bg-card/80 p-4">
                  <h3 className="font-semibold text-foreground">{book.title}</h3>
                  <p className="mt-1 text-xs text-gold">
                    {book.author}
                    {book.year ? ` · ${book.year}` : ""}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{book.blurb}</p>
                  <OutLink href={book.href} label={book.hrefLabel} />
                </li>
              ))
            )}
          </ItemGroup>

          <ItemGroup label="Articles">
            {collection.articles.length === 0 ? (
              <EmptyLine text="No verified articles on this shelf." />
            ) : (
              collection.articles.map((article) => (
                <li key={article.id} className="rounded-2xl border border-card-border bg-card/80 p-4">
                  <h3 className="font-semibold text-foreground">{article.title}</h3>
                  <p className="mt-1 text-xs text-gold">
                    {article.outlet}
                    {formatItemDate(article.date) ? ` · ${formatItemDate(article.date)}` : ""}
                  </p>
                  <OutLink href={article.href} label="Read" />
                </li>
              ))
            )}
          </ItemGroup>

          <ItemGroup label="Podcasts">
            {collection.podcasts.length === 0 ? (
              <EmptyLine text="No verified podcasts on this shelf." />
            ) : (
              collection.podcasts.map((podcast) => (
                <li key={podcast.id} className="rounded-2xl border border-card-border bg-card/80 p-4">
                  <h3 className="font-semibold text-foreground">{podcast.show}</h3>
                  {podcast.hosts ? <p className="mt-1 text-xs text-gold">{podcast.hosts}</p> : null}
                  <p className="mt-2 text-sm leading-6 text-muted">{podcast.note}</p>
                  <OutLink href={podcast.href} label={podcast.hrefLabel} />
                </li>
              ))
            )}
          </ItemGroup>
        </div>
      )}
    </section>
  );
}

function ItemGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">{label}</h3>
      <ul className="mt-2 grid gap-3 lg:grid-cols-2">{children}</ul>
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <li className="text-sm text-muted lg:col-span-2">{text}</li>;
}

function OutLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex min-h-11 items-center rounded-full border border-card-border px-3 text-xs font-semibold text-foreground hover:border-gold/50 hover:text-gold"
    >
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
