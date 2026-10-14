import { database } from "../src/lib/server/db";
import { cleanupUploads } from "../src/lib/server/uploads";
async function main() {
  const db = await database();
  try {
    console.log(
      JSON.stringify({ expiredFilesCleaned: await cleanupUploads() }),
    );
  } finally {
    await db.close?.();
  }
}
void main().catch(() => {
  console.error(
    "Cleanup failed. Stop the local server before running this command.",
  );
  process.exitCode = 1;
});
