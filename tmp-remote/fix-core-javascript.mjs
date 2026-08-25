/**
 * Re-upload genuine PS 9.0.3 core_javascript (previous restore had a GitHub fetch error).
 */
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");

const client = new Client(120_000);
const tmp = path.join(os.tmpdir(), "fix-core-js2");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

const local = path.join(process.cwd(), "tmp-remote", "orig-core_javascript.html.twig");
const remote =
  shopRoot +
  "/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig";

const src = await fs.readFile(local, "utf8");
if (!src.includes("asset('admin.js', 'front_js')") || src.includes("Failed to fetch")) {
  throw new Error("local orig-core_javascript.html.twig is invalid");
}

await client.uploadFrom(local, remote);
console.log("uploaded core_javascript", src.length, "chars");

const cfgRemote = shopRoot + "/app/config/config.yml";
const cfgLocal = path.join(tmp, "config.yml");
await client.downloadTo(cfgLocal, cfgRemote);
let yml = await fs.readFile(cfgLocal, "utf8");
const stamp = "9.0.3-restore" + Date.now().toString(36);
yml = yml.replace(/version:\s*'[^']*'/, `version: '${stamp}'`);
if (!/front_js:[\s\S]*?base_urls:/.test(yml)) {
  throw new Error("front_js base_urls missing — abort");
}
await fs.writeFile(cfgLocal, yml);
await client.uploadFrom(cfgLocal, cfgRemote);
console.log("config version", stamp);

const cacheRoot = shopRoot + "/var/cache";
const list = await client.list(cacheRoot);
if (list.some((f) => f.name === "prod" && f.isDirectory)) {
  const stash = "_stash-restore-" + Date.now().toString(36);
  await client.rename(cacheRoot + "/prod", cacheRoot + "/" + stash);
  console.log("stashed prod ->", stash);
}

const verify = path.join(tmp, "verify.twig");
await client.downloadTo(verify, remote);
const t = await fs.readFile(verify, "utf8");
console.log("verify admin.js asset:", t.includes("asset('admin.js', 'front_js')"));
console.log("verify Failed to fetch:", t.includes("Failed to fetch"));
console.log("verify hardcode:", t.includes("barbaraalvisi.it"));
console.log("--- scripts ---");
for (const line of t.split("\n")) {
  if (line.includes("script") || line.includes("if ps")) console.log(line.trim());
}

client.close();
console.log("DONE");
