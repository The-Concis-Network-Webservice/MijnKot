import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

function normalizeSql(sql: string) {
  // Replace $1, $2 with ? for D1 compatibility
  let s = sql.replace(/\$\d+/g, "?");
  // Replace now() with datetime('now') for sqlite compatibility
  s = s.replace(/\bnow\(\)/gi, "datetime('now')");
  return s;
}

function getDB() {
  try {
    const ctx = getRequestContext();
    if (!ctx?.env?.DB) {
      throw new Error(
        "D1 Database binding 'DB' not found. Ensure you are running with Cloudflare Pages dev environment."
      );
    }
    return ctx.env.DB;
  } catch (error) {
    throw new Error(
      `Failed to get D1 database context: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure you're running in Edge runtime with 'export const runtime = \"edge\"' in your route.`
    );
  }
}

export async function query<T>(
  text: string,
  params: Array<string | number | boolean | null> = []
) {
  const db = getDB();
  const stmt = db.prepare(normalizeSql(text)).bind(...params);
  const { results } = await stmt.all();
  return results as T[];
}

export async function queryOne<T>(
  text: string,
  params: Array<string | number | boolean | null> = []
) {
  const db = getDB();
  const stmt = db.prepare(normalizeSql(text)).bind(...params);
  const result = await stmt.first();
  return (result ?? null) as T | null;
}
