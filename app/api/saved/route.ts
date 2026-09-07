import { auth } from "@/auth";
import { normalizeSavedIds, savedUserKey } from "@/lib/saved-ids";
import { readSavedIds, savedPersistence, writeSavedIds } from "@/lib/saved-store";

export const runtime = "nodejs";

async function requireUserKey(): Promise<{ key: string } | Response> {
  const session = await auth();
  const key = savedUserKey(session?.user);
  if (!key) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return { key };
}

export async function GET() {
  const authed = await requireUserKey();
  if (authed instanceof Response) return authed;
  const persistence = savedPersistence();
  const ids = persistence === "none" ? [] : normalizeSavedIds(await readSavedIds(authed.key));
  return Response.json({ ids, persistence });
}

async function writeFromBody(request: Request) {
  const authed = await requireUserKey();
  if (authed instanceof Response) return authed;
  const key = authed.key;
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }
  const ids = normalizeSavedIds(
    body && typeof body === "object" && "ids" in body ? (body as { ids: unknown }).ids : null,
  );
  const persistence = await writeSavedIds(key, ids);
  return Response.json({ ids, persistence });
}

export function PUT(request: Request) {
  return writeFromBody(request);
}

export function PATCH(request: Request) {
  return writeFromBody(request);
}
