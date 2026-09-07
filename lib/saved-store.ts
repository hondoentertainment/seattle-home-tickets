import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { Redis } from "@upstash/redis";

export type SavedPersistence = "redis" | "postgres" | "none";

function redisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function postgresUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

export function savedPersistence(): SavedPersistence {
  if (redisConfigured()) return "redis";
  if (postgresUrl()) return "postgres";
  return "none";
}

function redisKey(userKey: string): string {
  return `saved:${userKey}`;
}

let redis: Redis | null = null;
function getRedis(): Redis {
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

let sql: NeonQueryFunction<false, false> | null = null;
let tableReady = false;

function getSql(): NeonQueryFunction<false, false> {
  const url = postgresUrl();
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!sql) sql = neon(url);
  return sql;
}

async function ensureSavedTable() {
  if (tableReady) return;
  const query = getSql();
  await query`
    CREATE TABLE IF NOT EXISTS saved_events (
      user_key TEXT PRIMARY KEY,
      game_ids TEXT[] NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  tableReady = true;
}

export async function readSavedIds(userKey: string): Promise<string[]> {
  const kind = savedPersistence();
  if (kind === "redis") {
    const value = await getRedis().get<string[]>(redisKey(userKey));
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  }
  if (kind === "postgres") {
    await ensureSavedTable();
    const rows = (await getSql()`
      SELECT game_ids FROM saved_events WHERE user_key = ${userKey} LIMIT 1
    `) as Array<{ game_ids: string[] }>;
    return rows[0]?.game_ids ?? [];
  }
  return [];
}

export async function writeSavedIds(userKey: string, ids: string[]): Promise<SavedPersistence> {
  const kind = savedPersistence();
  if (kind === "redis") {
    await getRedis().set(redisKey(userKey), ids);
    return kind;
  }
  if (kind === "postgres") {
    await ensureSavedTable();
    await getSql()`
      INSERT INTO saved_events (user_key, game_ids, updated_at)
      VALUES (${userKey}, ${ids}, now())
      ON CONFLICT (user_key)
      DO UPDATE SET game_ids = EXCLUDED.game_ids, updated_at = now()
    `;
    return kind;
  }
  return "none";
}
