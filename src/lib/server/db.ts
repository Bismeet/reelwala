import { PGlite } from "@electric-sql/pglite";
import postgres from "postgres";
import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface Connection {
  query<T extends Record<string, unknown> = Record<string, unknown>>(
    sql: string,
    values?: unknown[],
  ): Promise<{ rows: T[] }>;
  transaction<T>(fn: (tx: Connection) => Promise<T>): Promise<T>;
  close?(): Promise<void>;
}
type Globals = typeof globalThis & { reelDb?: Promise<Connection> };
const globals = globalThis as Globals;
export const dataPath = () =>
  resolve(/* turbopackIgnore: true */ process.env.DATA_DIR ?? ".data");
export async function createDatabase(path?: string): Promise<Connection> {
  let conn: Connection;
  if (process.env.DATABASE_URL && !path) {
    const sql = postgres(process.env.DATABASE_URL, { max: 5 });
    function adapt(client: typeof sql): Connection {
      return {
        query: async (q, v = []) =>
          ({
            rows: (await client.unsafe(q, v as never[])) as unknown as Record<
              string,
              unknown
            >[],
          }) as never,
        transaction: (fn) =>
          client.begin(async (tx) =>
            fn(adapt(tx as unknown as typeof sql)),
          ) as unknown as Promise<never>,
      };
    }
    conn = { ...adapt(sql), close: () => sql.end() };
  } else {
    const directory = path ?? resolve(dataPath(), "postgres");
    await mkdir(directory, { recursive: true });
    const pg = new PGlite(directory);
    function adapt(client: Pick<PGlite, "query" | "transaction">): Connection {
      return {
        query: (q, v = []) => client.query(q, v) as never,
        transaction: (fn) =>
          client.transaction(async (tx) => fn(adapt(tx as unknown as PGlite))),
      };
    }
    conn = { ...adapt(pg), close: () => pg.close() };
  }
  const migration = await readFile(
    resolve("db/migrations/001-intake.sql"),
    "utf8",
  );
  // PostgreSQL clients need one statement per query with parameterized query APIs.
  for (const statement of migration
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean))
    await conn.query(statement);
  return conn;
}
export function database(): Promise<Connection> {
  globals.reelDb ??= createDatabase();
  return globals.reelDb;
}
