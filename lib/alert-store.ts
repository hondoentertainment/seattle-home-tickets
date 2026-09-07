import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { Redis } from "@upstash/redis";
import { DEFAULT_ALERT_PREFS, isAlertPrefs, type AlertPrefs } from "@/lib/alerts";
import { savedPersistence, type SavedPersistence } from "@/lib/saved-store";

function redisKey(userKey: string): string {
  return `alerts:${userKey}`;
}

let redis: Redis | null = null;
function getRedis(): Redis {
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

function postgresUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

let sql: NeonQueryFunction<false, false> | null = null;
let tableReady = false;

function getSql(): NeonQueryFunction<false, false> {
  const url = postgresUrl();
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!sql) sql = neon(url);
  return sql;
}

async function ensureTable() {
  if (tableReady) return;
  await getSql()`
    CREATE TABLE IF NOT EXISTS alert_prefs (
      user_key TEXT PRIMARY KEY,
      prefs JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  tableReady = true;
}

export function alertPersistence(): SavedPersistence {
  return savedPersistence();
}

export async function readAlertPrefsForUser(userKey: string): Promise<AlertPrefs> {
  const kind = savedPersistence();
  if (kind === "redis") {
    const value = await getRedis().get<AlertPrefs>(redisKey(userKey));
    return isAlertPrefs(value) ? value : { ...DEFAULT_ALERT_PREFS };
  }
  if (kind === "postgres") {
    await ensureTable();
    const rows = (await getSql()`
      SELECT prefs FROM alert_prefs WHERE user_key = ${userKey} LIMIT 1
    `) as Array<{ prefs: unknown }>;
    const raw = rows[0]?.prefs;
    const parsed = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
    return isAlertPrefs(parsed) ? parsed : { ...DEFAULT_ALERT_PREFS };
  }
  return { ...DEFAULT_ALERT_PREFS };
}

export async function writeAlertPrefsForUser(
  userKey: string,
  prefs: AlertPrefs,
): Promise<SavedPersistence> {
  const kind = savedPersistence();
  if (kind === "redis") {
    await getRedis().set(redisKey(userKey), prefs);
    return kind;
  }
  if (kind === "postgres") {
    await ensureTable();
    await getSql()`
      INSERT INTO alert_prefs (user_key, prefs, updated_at)
      VALUES (${userKey}, ${JSON.stringify(prefs)}, now())
      ON CONFLICT (user_key)
      DO UPDATE SET prefs = EXCLUDED.prefs, updated_at = now()
    `;
    return kind;
  }
  return "none";
}
