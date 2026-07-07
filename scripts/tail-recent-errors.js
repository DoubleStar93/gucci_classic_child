import dotenv from "dotenv";
import { Client } from "basic-ftp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const shop = process.env.FTP_REMOTE_PATH.trim().replace(/\/themes\/classic-gucci\/?$/i, "");

async function tail(remote, bytes = 8000) {
  const local = path.join(__dirname, "..", "tmp", path.basename(remote));
  await mkdir(path.dirname(local), { recursive: true });
  const client = new Client(120_000);
  await client.access({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });
  await client.downloadTo(local, remote);
  client.close();
  const content = await readFile(local, "utf8");
  return content.slice(-bytes);
}

const files = [
  `${shop}/var/logs/20260707_exception.log`,
  `${shop}/var/logs/prod-2026-07-07.log`,
  `${shop}/php_errorlog`,
];

for (const f of files) {
  try {
    const tailText = await tail(f);
    const lines = tailText.split("\n").filter((l) => /15:0|Fatal|wire|validation|PaymentModule|500/i.test(l));
    console.log(`\n=== ${path.basename(f)} ===`);
    console.log(lines.slice(-20).join("\n") || tailText.split("\n").slice(-8).join("\n"));
  } catch (e) {
    console.log(`ERR ${f}: ${e.message}`);
  }
}
