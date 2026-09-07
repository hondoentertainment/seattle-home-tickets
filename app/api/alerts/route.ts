import { auth } from "@/auth";
import { DEFAULT_ALERT_PREFS, isAlertPrefs } from "@/lib/alerts";
import { alertPersistence, readAlertPrefsForUser, writeAlertPrefsForUser } from "@/lib/alert-store";
import { savedUserKey } from "@/lib/saved-ids";

export const runtime = "nodejs";

async function requireUserKey() {
  const session = await auth();
  const key = savedUserKey(session?.user);
  if (!key) return Response.json({ error: "unauthorized" }, { status: 401 });
  return key;
}

export async function GET() {
  const key = await requireUserKey();
  if (key instanceof Response) return key;
  const persistence = alertPersistence();
  const prefs = persistence === "none" ? DEFAULT_ALERT_PREFS : await readAlertPrefsForUser(key);
  return Response.json({
    prefs,
    persistence,
    delivery: "in-app",
    note: "Prefs are stored. Email and web-push are not wired — this route does not send messages.",
  });
}

export async function PUT(request: Request) {
  const key = await requireUserKey();
  if (key instanceof Response) return key;
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }
  const prefs =
    body && typeof body === "object" && "prefs" in body && isAlertPrefs((body as { prefs: unknown }).prefs)
      ? (body as { prefs: import("@/lib/alerts").AlertPrefs }).prefs
      : null;
  if (!prefs) return Response.json({ error: "invalid-prefs" }, { status: 400 });
  const persistence = await writeAlertPrefsForUser(key, prefs);
  return Response.json({
    prefs,
    persistence,
    delivery: "in-app",
    note: "Saved. No email or push is sent from this app yet.",
  });
}
