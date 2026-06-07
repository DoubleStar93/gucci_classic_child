import dotenv from "dotenv";
import { Client } from "basic-ftp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, readdir } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const shop = process.env.FTP_REMOTE_PATH.trim().replace(/\/themes\/classic-gucci\/?$/i, "");

async function tryDownload(client, remotePath) {
  const local = path.join(__dirname, "..", "tmp", "remote-log.txt");
  await mkdir(path.dirname(local), { recursive: true });
  await client.downloadTo(local, remotePath);
  const content = await readFile(local, "utf8");
  return content;
}

async function main() {
  const client = new Client(60_000);
  await client.access({
    host: process.env.FTP_HOST,
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });

  try {
    const logsDir = `${shop}/var/logs`;
    const entries = await client.list(logsDir);
    console.log(
      "Logs:",
      entries.map((e) => e.name).join(", ")
    );

    for (const entry of entries.filter((e) => e.isFile)) {
      if (!/exception|prod-2026-06-07/.test(entry.name)) {
        continue;
      }
      const content = await tryDownload(client, `${logsDir}/${entry.name}`);
      console.log(`\n=== ${entry.name} (tail) ===\n${content.slice(-8000)}`);
    }
  } catch (error) {
    console.error("Logs error:", error.message);
  }

  try {
    const classes = await client.list(`${shop}/themes/classic-gucci/classes`);
    console.log("\nTheme classes:", classes.map((e) => e.name).join(", "));
  } catch (error) {
    console.error("Classes error:", error.message);
  }

  client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
