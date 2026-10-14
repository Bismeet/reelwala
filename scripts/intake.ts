import { database } from "../src/lib/server/db";
async function main() {
  const args = process.argv.slice(2);
  const showDetails = args.includes("--details");
  const db = await database();
  try {
    const tables = ["enquiries", "creator_applications", "outbox"] as const;
    const result: Record<string, unknown> = {};
    for (const table of tables) {
      const select = showDetails
        ? "*"
        : "id,created_at," +
          (table === "outbox" ? "entity_type,entity_id,state" : "status");
      result[table] = (
        await db.query(
          `SELECT ${select} FROM ${table} ORDER BY created_at DESC LIMIT 50`,
        )
      ).rows;
    }
    if (showDetails)
      result.uploads = (
        await db.query(
          "SELECT id,application_id,kind,filename,object_key,state FROM uploads WHERE application_id IS NOT NULL ORDER BY created_at DESC LIMIT 100",
        )
      ).rows;
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await db.close?.();
  }
}
void main().catch(() => {
  console.error(
    "Could not read intake records. Stop the local server before running this command.",
  );
  process.exitCode = 1;
});
