import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");
const stamp = `9.0.3-v5${Date.now().toString(36)}`;
const staging = "https://barbaraalvisi.it";

const client = new Client(90_000);
const tmp = path.join(os.tmpdir(), "rte-v5");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

await client.uploadFrom(
  "tmp-remote/bo-rte-rescue-v5.js",
  `${shopRoot}/js/admin/bo-rte-rescue-v5.js`
);
await client.uploadFrom(
  "tmp-remote/bo-rte-rescue.css",
  `${shopRoot}/js/admin/bo-rte-rescue-v5.css`
);

const coreRemote = `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`;
const coreLocal = path.join(tmp, "core.twig");
await client.downloadTo(coreLocal, coreRemote);
let core = await fs.readFile(coreLocal, "utf8");

// Point all rescue refs to v5
core = core.replace(/bo-rte-rescue(?:-v[0-9]+)?\.(js|css)\?[^"'\s]*/g, `bo-rte-rescue-v5.$1?${stamp}`);

if (!core.includes("bo-rte-rescue-v5.js")) {
  core += `\n<script src="${staging}/js/admin/bo-rte-rescue-v5.js?${stamp}"></script>\n`;
}
if (!core.includes("bo-rte-rescue-v5.css")) {
  core = core.replace(
    /(<script src="\{\{\s*asset\('themes\/new-theme\/public\/main\.bundle\.js'\)\s*\}\}"><\/script>)/,
    `$1\n<link rel="stylesheet" href="${staging}/js/admin/bo-rte-rescue-v5.css?${stamp}">\n`
  );
}

// Keep early str2url + tinyMCEPreInit; theme load handled by rescue v5 fetch+eval
await fs.writeFile(coreLocal, core, "utf8");
await client.uploadFrom(coreLocal, coreRemote);

const cfgLocal = path.join(tmp, "cfg.yml");
await client.downloadTo(cfgLocal, `${shopRoot}/app/config/config.yml`);
let yml = await fs.readFile(cfgLocal, "utf8");
yml = yml.replace(/version:\s*'[^']+'/, `version: '${stamp}'`);
await fs.writeFile(cfgLocal, yml, "utf8");
await client.uploadFrom(cfgLocal, `${shopRoot}/app/config/config.yml`);

try {
  await client.rename(
    `${shopRoot}/var/cache/prod`,
    `${shopRoot}/var/cache/_stash-v5-${Date.now().toString(36)}`
  );
  try {
    await client.send(`MKD ${shopRoot}/var/cache/prod`);
  } catch {}
} catch (e) {
  console.log("cache", e.message);
}

await client.uploadFrom(
  "tmp-remote/clean-stash-fast.php",
  `${shopRoot}/clean-stash-fast.php`
);

console.log("DONE", stamp);
console.log("has v5", core.includes("bo-rte-rescue-v5.js"));
client.close();
