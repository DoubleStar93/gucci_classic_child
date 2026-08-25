/**
 * Fast unblock: delete leftover stashes, bump BO CSS version, clear Symfony prod in-place.
 * Does NOT create new _stash-* folders.
 */
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import crypto from "node:crypto";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");
const staging = (process.env.STAGING_URL || "https://barbaraalvisi.it/")
  .trim()
  .replace(/\/+$/, "");
const admin = "l1ka80lkkixgfknd";
const stamp = "9.0.3-go" + Date.now().toString(36);
const token = crypto.randomBytes(16).toString("hex");
const phpName = "_unblock_" + token.slice(0, 8) + ".php";

const client = new Client(120_000);
const tmp = path.join(os.tmpdir(), "unblock-login");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

let php = await fs.readFile(
  path.join(process.cwd(), "tmp-remote/_unblock_run.php"),
  "utf8"
);
php = php.replace("TOKEN_PLACEHOLDER", token);
const phpLocal = path.join(tmp, phpName);
await fs.writeFile(phpLocal, php, "utf8");
await client.uploadFrom(phpLocal, `${shopRoot}/${phpName}`);
console.log("uploaded", phpName);

const cfgRemote = `${shopRoot}/app/config/config.yml`;
const cfgLocal = path.join(tmp, "config.yml");
await client.downloadTo(cfgLocal, cfgRemote);
let yml = await fs.readFile(cfgLocal, "utf8");
if (!yml.includes("base_urls:") || !yml.includes("barbaraalvisi.it/js")) {
  throw new Error("front_js missing — abort");
}
yml = yml.replace(/version:\s*'[^']+'/, `version: '${stamp}'`);
await fs.writeFile(cfgLocal, yml, "utf8");
await client.uploadFrom(cfgLocal, cfgRemote);
console.log("config version", stamp);

const preload =
  "<!-- BO asset preload -->\n" +
  `<link rel="preload" href="/${admin}/themes/new-theme/public/theme.css?${stamp}" as="style">\n` +
  `<link rel="preload" href="/${admin}/themes/new-theme/public/main.bundle.js?${stamp}" as="script">\n`;
for (const rel of [
  `${admin}/themes/new-theme/public/preload.tpl`,
  `${admin}/themes/new-theme/public/preload.html.twig`,
]) {
  const local = path.join(tmp, path.basename(rel));
  await fs.writeFile(local, preload, "utf8");
  await client.uploadFrom(local, `${shopRoot}/${rel}`);
  console.log("preload", rel);
}

client.close();

const url = `${staging}/${phpName}?token=${token}`;
console.log("hitting cleaner…");
const res = await fetch(url);
const body = await res.text();
console.log("HTTP", res.status);
console.log(body);
if (res.status !== 200 || !body.includes("DONE")) {
  process.exit(2);
}
console.log("STAMP", stamp);
