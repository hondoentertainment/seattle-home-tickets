import { catalog } from "@/lib/catalog";

const knownIds = new Set(catalog.games.map((game) => game.id));

export function normalizeSavedIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !knownIds.has(item) || seen.has(item)) continue;
    seen.add(item);
    ids.push(item);
  }
  return ids;
}

export function unionSavedIds(server: readonly string[], local: readonly string[]): string[] {
  return normalizeSavedIds([...server, ...local]);
}

export function savedUserKey(user: { id?: string | null; email?: string | null } | undefined): string | null {
  const id = user?.id?.trim();
  if (id) return `google:${id}`;
  const email = user?.email?.trim().toLowerCase();
  if (email) return `email:${email}`;
  return null;
}
