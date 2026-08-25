/**
 * Safe BO core restore:
 * 1) Local backup of every remote file we overwrite/delete
 * 2) Official twig + asset()-based preload (no hardcoded URLs)
 * 3) Keep only front_js.base_urls; version = PS 9.0.3 const
 * 4) Remove bo-rte-rescue*
 * 5) Cache-Control private on admin public assets + refresh CSS mtime
 * 6) Clear Symfony prod in-place (no new _stash-*)
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
const stamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\.\d+Z$/, "Z");
const backupDir = path.join(
  process.cwd(),
  "backups",
  `bo-core-${stamp}`
);

const coreJsLocal = path.join(
  process.cwd(),
  "tmp-remote/orig-core_javascript.html.twig"
);
const stylesLocal = path.join(
  process.cwd(),
  "tmp-remote/orig-stylesheets.html.twig"
);

const client = new Client(180_000);
const tmp = path.join(os.tmpdir(), "restore-bo-core");
await fs.mkdir(tmp, { recursive: true });
await fs.mkdir(backupDir, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

async function downloadToBackup(remoteRel) {
  const dest = path.join(backupDir, remoteRel.replace(/[\\/]/g, "__"));
  try {
    await client.downloadTo(dest, `${shopRoot}/${remoteRel}`);
    const buf = await fs.readFile(dest);
    console.log("backup", remoteRel, buf.length);
    return buf;
  } catch (e) {
    console.log("backup skip", remoteRel, e.message);
    await fs.writeFile(dest + ".MISSING.txt", e.message, "utf8");
    return null;
  }
}

async function putLocal(localPath, remoteRel) {
  await client.uploadFrom(localPath, `${shopRoot}/${remoteRel}`);
  console.log("upload", remoteRel);
}

async function putText(remoteRel, text) {
  const local = path.join(tmp, remoteRel.replace(/[\\/]/g, "_").slice(-80));
  await fs.writeFile(local, text, "utf8");
  await putLocal(local, remoteRel);
}

async function del(remoteRel) {
  try {
    await client.remove(`${shopRoot}/${remoteRel}`);
    console.log("deleted", remoteRel);
  } catch (e) {
    console.log("skip del", remoteRel, e.message);
  }
}

const coreSrc = await fs.readFile(coreJsLocal, "utf8");
const stylesSrc = await fs.readFile(stylesLocal, "utf8");
if (
  !coreSrc.includes("asset('admin.js', 'front_js')") ||
  coreSrc.includes("bo-rte-rescue") ||
  coreSrc.includes("barbaraalvisi.it")
) {
  throw new Error("orig-core_javascript.html.twig is not clean 9.0.3");
}
if (
  !stylesSrc.includes("asset('themes/new-theme/public/theme.css')") ||
  stylesSrc.includes("barbaraalvisi.it")
) {
  throw new Error("orig-stylesheets.html.twig is not clean 9.0.3");
}

console.log("=== 1) BACKUP ===");
const toBackup = [
  "app/config/config.yml",
  "src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig",
  "src/PrestaShopBundle/Resources/views/Admin/Layout/stylesheets.html.twig",
  `${admin}/themes/new-theme/public/preload.html.twig`,
  `${admin}/themes/new-theme/public/preload.tpl`,
  `${admin}/themes/new-theme/public/.htaccess`,
  "js/admin/bo-rte-rescue-v5.js",
  "js/admin/bo-rte-rescue-v5.css",
  "js/admin/bo-rte-rescue.js",
  "js/admin/bo-rte-rescue.css",
];
for (const rel of toBackup) {
  await downloadToBackup(rel);
}

await fs.writeFile(
  path.join(backupDir, "README.txt"),
  [
    "Backup BO core before restore B+C",
    `date: ${new Date().toISOString()}`,
    "To rollback: upload the __-named files back to the original remote paths",
    "  (replace __ with /).",
    "config.yml assets must keep front_js.base_urls if you roll back twig only.",
    "",
  ].join("\n"),
  "utf8"
);

console.log("=== 2) RESTORE TWIG ===");
await putLocal(
  coreJsLocal,
  "src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig"
);
await putLocal(
  stylesLocal,
  "src/PrestaShopBundle/Resources/views/Admin/Layout/stylesheets.html.twig"
);

console.log("=== 3) PRELOAD via asset() (no hardcoded URLs) ===");
const preloadTwig = await fs.readFile(
  path.join(process.cwd(), "tmp-remote/preload-official.html.twig"),
  "utf8"
);
await putText(`${admin}/themes/new-theme/public/preload.html.twig`, preloadTwig);
await putText(
  `${admin}/themes/new-theme/public/preload.tpl`,
  "{* legacy companion; HeadTag uses preload.html.twig *}\n"
);

console.log("=== 4) config.yml: official version + base_urls only ===");
const cfgRemote = `${shopRoot}/app/config/config.yml`;
const cfgLocal = path.join(tmp, "config.yml");
await client.downloadTo(cfgLocal, cfgRemote);
let yml = await fs.readFile(cfgLocal, "utf8");
if (!/^\s*assets:\s*$/m.test(yml)) {
  throw new Error("assets: block not found");
}
const assetsBlock = `  assets:
    version: !php/const PrestaShop\\PrestaShop\\Core\\Version::VERSION
    packages:
      front_js:
        base_urls:
          - '${staging}/js'
`;
yml = yml.replace(
  /^\s*assets:\s*\n(?:.*\n)*?(?=^\s*# esi|^ {2}secret:)/m,
  assetsBlock + "\n"
);
if (!yml.includes("base_urls:") || !yml.includes(`${staging}/js`)) {
  throw new Error("config.yml rewrite failed");
}
if (!yml.includes("!php/const PrestaShop\\PrestaShop\\Core\\Version::VERSION")) {
  throw new Error("official version const missing after rewrite");
}
await fs.writeFile(cfgLocal, yml, "utf8");
await client.uploadFrom(cfgLocal, cfgRemote);
const snippet = yml.slice(yml.indexOf("  assets:"), yml.indexOf("  assets:") + 220);
console.log(snippet);

console.log("=== 5) DELETE rescue leftovers ===");
for (const f of [
  "js/admin/bo-rte-rescue.js",
  "js/admin/bo-rte-rescue.css",
  "js/admin/bo-rte-rescue-v3.js",
  "js/admin/bo-rte-rescue-v3.css",
  "js/admin/bo-rte-rescue-v4.js",
  "js/admin/bo-rte-rescue-v4.css",
  "js/admin/bo-rte-rescue-v5.js",
  "js/admin/bo-rte-rescue-v5.css",
]) {
  await del(f);
}

console.log("=== 6) Cache-Control on admin public + refresh CSS mtime ===");
await putLocal(
  path.join(process.cwd(), "tmp-remote/htaccess-admin-public.txt"),
  `${admin}/themes/new-theme/public/.htaccess`
);

for (const name of ["theme.css", "login.css"]) {
  const rel = `${admin}/themes/new-theme/public/${name}`;
  const local = path.join(tmp, name);
  await client.downloadTo(local, `${shopRoot}/${rel}`);
  const size = (await fs.stat(local)).size;
  if (size < 1000) {
    throw new Error(`${name} too small (${size}) — abort re-upload`);
  }
  await client.uploadFrom(local, `${shopRoot}/${rel}`);
  console.log("refreshed mtime", rel, size);
}

console.log("=== 7) Clear Symfony prod in-place ===");
const token = crypto.randomBytes(16).toString("hex");
const phpName = "_clearprod_" + token.slice(0, 8) + ".php";
let php = await fs.readFile(
  path.join(process.cwd(), "tmp-remote/_clear_prod_only.php"),
  "utf8"
);
php = php.replace("TOKEN_PLACEHOLDER", token);
const phpLocal = path.join(tmp, phpName);
await fs.writeFile(phpLocal, php, "utf8");
await client.uploadFrom(phpLocal, `${shopRoot}/${phpName}`);
client.close();

const url = `${staging}/${phpName}?token=${token}`;
console.log("hitting prod clearer…");
const res = await fetch(url);
const body = await res.text();
console.log("HTTP", res.status);
console.log(body);
if (res.status !== 200 || !body.includes("DONE")) {
  process.exit(2);
}

console.log("BACKUP_DIR", backupDir);
console.log("RESTORE DONE");
