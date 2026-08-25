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
const tmp = path.join(os.tmpdir(), "bust-assets");
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

if (!yml.includes("base_urls:") || !yml.includes("barbaraalvisi.it/js")) {
  console.error("front_js broken — abort");
  process.exit(1);
}

const stamp = `9.0.3-fix${Date.now().toString(36)}`;
yml = yml.replace(/version:\s*'[^']+'/, `version: '${stamp}'`);
await fs.writeFile(local, yml, "utf8");
await client.uploadFrom(local, remote);

const token = Date.now().toString(36);
try {
  await client.rename(
    `${shopRoot}/var/cache/prod`,
    `${shopRoot}/var/cache/_stash-bust-${token}`
  );
  try {
    await client.send(`MKD ${shopRoot}/var/cache/prod`);
  } catch {
    // exists
  }
  console.log("cache stashed");
} catch (e) {
  console.log("cache:", e.message);
}

console.log("version", stamp);
client.close();
