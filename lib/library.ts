import libraryJson from "@/data/library.json";

export type LibraryCoverage = "full" | "thin";

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  year: number | null;
  blurb: string;
  href: string;
  hrefLabel: string;
};

export type LibraryArticle = {
  id: string;
  title: string;
  outlet: string;
  date: string | null;
  href: string;
};

export type LibraryPodcast = {
  id: string;
  show: string;
  hosts: string | null;
  note: string;
  href: string;
  hrefLabel: string;
};

export type LibraryCollection = {
  id: string;
  team: string;
  short: string;
  sport: string;
  coverage: LibraryCoverage;
  coverageNote: string | null;
  books: LibraryBook[];
  articles: LibraryArticle[];
  podcasts: LibraryPodcast[];
};

export type LibraryCatalog = {
  asOf: string;
  title: string;
  disclaimer: string;
  collections: LibraryCollection[];
};

export const libraryCatalog = libraryJson as LibraryCatalog;

export const libraryCollections = libraryCatalog.collections;

export function libraryCollectionFor(id: string | undefined): LibraryCollection | undefined {
  if (!id) return undefined;
  return libraryCollections.find((row) => row.id === id);
}

export function libraryCounts(collection: LibraryCollection) {
  return {
    books: collection.books.length,
    articles: collection.articles.length,
    podcasts: collection.podcasts.length,
  };
}
