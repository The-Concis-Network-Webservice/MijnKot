// @ts-ignore
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath =
  process.env.DB_PATH ?? path.join(process.cwd(), "db", "local.sqlite");

if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new Database(dbPath);

function normalizeSql(sql: string) {
  // Replace $1, $2 with ? for better-sqlite3
  let s = sql.replace(/\$\d+/g, "?");
  // Replace now() with datetime('now') for sqlite compatibility if mistakenly used
  s = s.replace(/\bnow\(\)/gi, "datetime('now')");
  return s;
}

export async function query<T>(
  text: string,
  params: Array<string | number | boolean | null> = []
) {
  const stmt = db.prepare(normalizeSql(text));
  if (stmt.reader) {
    const rows = stmt.all(params);
    return rows as T[];
  } else {
    stmt.run(params);
    return [] as T[];
  }
}

export async function queryOne<T>(
  text: string,
  params: Array<string | number | boolean | null> = []
) {
  const normalizedSql = normalizeSql(text);
  const stmt = db.prepare(normalizedSql);

  // In SQLite with better-sqlite3, UPDATE/INSERT/DELETE with RETURNING
  // are treated as reader statements (stmt.reader = true)
  // So we can safely use get() for all cases
  const row = stmt.get(params);
  return (row ?? null) as T | null;
}

