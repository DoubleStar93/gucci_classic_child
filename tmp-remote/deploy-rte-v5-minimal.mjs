/**
 * Minimal TinyMCE fix: keep stock PS twig + front_js base_urls,
 * only append rescue v5 (fetch+eval theme modern).
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
const staging = (process.env.STAGING_URL || "https://barbaraalvisi.it/")
  .trim()
  .replace(/\/+$/, "");
const stamp = `9.0.3-v5${Date.now().toString(36)}`;

const client = new Client(90_000);
const tmp = path.join(os.tmpdir(), "rte-v5-min");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

await client.uploadFrom(
  path.join(process.cwd(), "tmp-remote/bo-rte-rescue-v5.js"),
  `${shopRoot}/js/admin/bo-rte-rescue-v5.js`
);
await client.uploadFrom(
  path.join(process.cwd(), "tmp-remote/bo-rte-rescue.css"),
  `${shopRoot}/js/admin/bo-rte-rescue-v5.css`
);
console.log("uploaded rescue v5 assets");

const coreRemote = `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`;
const coreLocal = path.join(tmp, "core.twig");
await client.downloadTo(coreLocal, coreRemote);
let core = await fs.readFile(coreLocal, "utf8");

if (core.includes("Failed to fetch") || !core.includes("asset('admin.js'")) {
  throw new Error("core_javascript looks invalid — abort");
}

// Strip any previous rescue includes, then append clean ones once.
core = core
  .replace(/\n?<link[^>]*bo-rte-rescue[^>]*>\n?/g, "\n")
  .replace(/\n?<script[^>]*bo-rte-rescue[^>]*><\/script>\n?/g, "\n")
  .trimEnd();

core += `\n<link rel="stylesheet" href="${staging}/js/admin/bo-rte-rescue-v5.css?${stamp}">\n`;
core += `<script src="${staging}/js/admin/bo-rte-rescue-v5.js?${stamp}"></script>\n`;

await fs.writeFile(coreLocal, core, "utf8");
await client.uploadFrom(coreLocal, coreRemote);
console.log("patched core_javascript (stock + rescue v5 only)");

const cfgRemote = `${shopRoot}/app/config/config.yml`;
const cfgLocal = path.join(tmp, "cfg.yml");
await client.downloadTo(cfgLocal, cfgRemote);
let yml = await fs.readFile(cfgLocal, "utf8");
if (!/front_js:[\s\S]*?base_urls:/.test(yml)) {
  throw new Error("front_js base_urls missing — abort");
}
yml = yml.replace(/version:\s*'[^']+'/, `version: '${stamp}'`);
await fs.writeFile(cfgLocal, yml, "utf8");
await client.uploadFrom(cfgLocal, cfgRemote);
console.log("bumped assets version", stamp);

try {
  await client.rename(
    `${shopRoot}/var/cache/prod`,
    `${shopRoot}/var/cache/_stash-v5-${Date.now().toString(36)}`
  );
  console.log("stashed prod cache");
} catch (e) {
  console.log("cache stash:", e.message);
}

client.close();
console.log("DONE — hard-refresh product edit page");
