import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");
const client = new Client(90_000);
const tmp = path.join(os.tmpdir(), "ps-log-max");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

const remote = `${shopRoot}/app/config/config.yml`;
const local = path.join(tmp, "config.yml");
await client.downloadTo(local, remote);
let yml = await fs.readFile(local, "utf8");

const key = "env(PS_LOG_MAX_FILES)";
if (!yml.includes(key)) {
  console.error("PS_LOG_MAX_FILES non trovato in config.yml");
  process.exit(1);
}

const before = yml.match(/env\(PS_LOG_MAX_FILES\):\s*'?\d+'?/);
console.log("prima:", before?.[0]);

yml = yml.replace(/env\(PS_LOG_MAX_FILES\):\s*'?\d+'?/, "env(PS_LOG_MAX_FILES): '7'");

const after = yml.match(/env\(PS_LOG_MAX_FILES\):\s*'?\d+'?/);
console.log("dopo:", after?.[0]);

await fs.writeFile(local, yml, "utf8");
await client.uploadFrom(local, remote);
console.log("config.yml aggiornato");

const token = Date.now().toString(36);
try {
  await client.rename(
    `${shopRoot}/var/cache/prod`,
    `${shopRoot}/var/cache/_stash-logmax-prod-${token}`
  );
  try {
    await client.send(`MKD ${shopRoot}/var/cache/prod`);
  } catch {
    // exists
  }
  console.log("cache prod stashed");
} catch (e) {
  console.log("cache:", e.message);
}

client.close();
console.log("OK: rotazione log Symfony = 7 giorni");
