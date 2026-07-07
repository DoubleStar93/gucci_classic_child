import dotenv from "dotenv";
import { Client } from "basic-ftp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const shop = process.env.FTP_REMOTE_PATH.trim().replace(/\/themes\/classic-gucci\/?$/i, "");

async function tailFile(client, remotePath, maxBytes = 15000) {
  const local = path.join(__dirname, "..", "tmp", "remote-log-tail.txt");
  await mkdir(path.dirname(local), { recursive: true });
  await client.downloadTo(local, remotePath);
  const content = await readFile(local, "utf8");
  return content.slice(-maxBytes);
}

async function main() {
  const client = new Client(120_000);
  await client.access({
    host: process.env.FTP_HOST,
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });

  const dirs = [
    `${shop}/var/logs`,
    shop,
    `${shop}/var/cache/prod`,
  ];

  for (const dir of dirs) {
    try {
      const entries = await client.list(dir);
      console.log(`\nDIR ${dir}`);
      entries
        .sort((a, b) => (b.modifiedAt || 0) - (a.modifiedAt || 0))
        .forEach((entry) => {
          const when = entry.modifiedAt ? entry.modifiedAt.toISOString() : "no-date";
          console.log(`  ${entry.isDirectory ? "[D]" : "[F]"} ${entry.name} (${when})`);
        });
    } catch (error) {
      console.log(`DIR ${dir} ERR: ${error.message}`);
    }
  }

  const downloaded = new Set();
  const keywords = /wire|payment|validation|order|checkout|fatal|exception|timeout|mail|smtp/i;

  try {
    const logs = await client.list(`${shop}/var/logs`);
    const files = logs
      .filter((entry) => entry.isFile)
      .sort((a, b) => (b.modifiedAt || 0) - (a.modifiedAt || 0));

    for (const file of files.slice(0, 12)) {
      const remote = `${shop}/var/logs/${file.name}`;
      if (downloaded.has(remote)) {
        continue;
      }
      downloaded.add(remote);

      const tail = await tailFile(client, remote);
      const hits = tail.split("\n").filter((line) => keywords.test(line));
      console.log(`\n=== ${file.name} (hits: ${hits.length}) ===`);
      if (hits.length) {
        console.log(hits.slice(-40).join("\n"));
      } else {
        console.log(tail.slice(-2500));
      }
    }
  } catch (error) {
    console.error("var/logs error:", error.message);
  }

  for (const name of ["error_log", "php_errorlog"]) {
    try {
      const remote = `${shop}/${name}`;
      const tail = await tailFile(client, remote, 20000);
      const hits = tail.split("\n").filter((line) => keywords.test(line));
      console.log(`\n=== ${name} (hits: ${hits.length}) ===`);
      console.log((hits.length ? hits.slice(-40) : tail.split("\n").slice(-30)).join("\n"));
    } catch {
      // ignore missing file
    }
  }

  client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
