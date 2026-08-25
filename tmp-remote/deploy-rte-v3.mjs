import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");
const stamp = `9.0.3-rte${Date.now().toString(36)}`;

const client = new Client(90_000);
const tmp = path.join(os.tmpdir(), "rte-v3");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

await client.uploadFrom(
  "tmp-remote/bo-rte-rescue.js",
  `${shopRoot}/js/admin/bo-rte-rescue.js`
);
await client.uploadFrom(
  "tmp-remote/bo-rte-rescue.css",
  `${shopRoot}/js/admin/bo-rte-rescue.css`
);

const remote = `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`;
const local = path.join(tmp, "core.twig");
await client.downloadTo(local, remote);
let core = await fs.readFile(local, "utf8");
core = core
  .replace(/bo-rte-rescue\.js\?[^"'\s]+/g, `bo-rte-rescue.js?${stamp}`)
  .replace(/bo-rte-rescue\.css\?[^"'\s]+/g, `bo-rte-rescue.css?${stamp}`)
  .replace(/admin\.js\?[^"'\s]+/g, `admin.js?${stamp}`)
  .replace(/tools\.js\?[^"'\s]+/g, `tools.js?${stamp}`);

await fs.writeFile(local, core, "utf8");
await client.uploadFrom(local, remote);

const cfgLocal = path.join(tmp, "cfg.yml");
const cfgRemote = `${shopRoot}/app/config/config.yml`;
await client.downloadTo(cfgLocal, cfgRemote);
let yml = await fs.readFile(cfgLocal, "utf8");
yml = yml.replace(/version:\s*'[^']+'/, `version: '${stamp}'`);
await fs.writeFile(cfgLocal, yml, "utf8");
await client.uploadFrom(cfgLocal, cfgRemote);

const token = Date.now().toString(36);
try {
  await client.rename(
    `${shopRoot}/var/cache/prod`,
    `${shopRoot}/var/cache/_stash-rte4-${token}`
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
client.close();
