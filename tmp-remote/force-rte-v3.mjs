import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");
const stamp = `9.0.3-v3${Date.now().toString(36)}`;

const client = new Client(90_000);
const tmp = path.join(os.tmpdir(), "rte-v3-force");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

const localJs = path.join(process.cwd(), "tmp-remote/bo-rte-rescue.js");
const localCss = path.join(process.cwd(), "tmp-remote/bo-rte-rescue.css");
const text = await fs.readFile(localJs, "utf8");
console.log("local head:", text.slice(0, 70));

await client.uploadFrom(localJs, `${shopRoot}/js/admin/bo-rte-rescue.js`);
await client.uploadFrom(localJs, `${shopRoot}/js/admin/bo-rte-rescue-v3.js`);
await client.uploadFrom(localCss, `${shopRoot}/js/admin/bo-rte-rescue.css`);
await client.uploadFrom(localCss, `${shopRoot}/js/admin/bo-rte-rescue-v3.css`);

const dl = path.join(tmp, "dl.js");
await client.downloadTo(dl, `${shopRoot}/js/admin/bo-rte-rescue-v3.js`);
console.log("remote v3 head:", (await fs.readFile(dl, "utf8")).slice(0, 70));

const coreRemote = `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`;
const coreLocal = path.join(tmp, "core.twig");
await client.downloadTo(coreLocal, coreRemote);
let core = await fs.readFile(coreLocal, "utf8");

core = core.replace(/bo-rte-rescue(?:-v3)?\.js\?[^"'\s]*/g, `bo-rte-rescue-v3.js?${stamp}`);
core = core.replace(/bo-rte-rescue(?:-v3)?\.css\?[^"'\s]*/g, `bo-rte-rescue-v3.css?${stamp}`);

if (!core.includes("bo-rte-rescue-v3.js")) {
  core += `\n<script src="https://barbaraalvisi.it/js/admin/bo-rte-rescue-v3.js?${stamp}"></script>\n`;
}
if (!core.includes("bo-rte-rescue-v3.css")) {
  core = core.replace(
    /bo-rte-rescue\.css[^"']*/,
    `bo-rte-rescue-v3.css?${stamp}`
  );
}

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
    `${shopRoot}/var/cache/_stash-v3b-${Date.now().toString(36)}`
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
console.log("twig v3:", core.includes("bo-rte-rescue-v3.js"));
client.close();
