/**
 * Non-invasive audit: PrestaShop asset paths (admin front_js + key static files).
 * Read-only FTP + HTTP HEAD. No config writes, no cache changes.
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
const adminFolder = "l1ka80lkkixgfknd";

const client = new Client(90_000);
const tmp = path.join(os.tmpdir(), "ps-asset-audit");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

async function readRemote(remote) {
  const local = path.join(tmp, remote.replace(/[\\/]/g, "_").slice(-100));
  await client.downloadTo(local, remote);
  return fs.readFile(local, "utf8");
}

async function head(url) {
  const res = await fetch(url, { method: "HEAD", redirect: "manual" });
  return {
    url,
    status: res.status,
    type: res.headers.get("content-type") || "",
    len: res.headers.get("content-length") || "",
  };
}

console.log("=== 1) app/config/config.yml — assets ===");
const yml = await readRemote(`${shopRoot}/app/config/config.yml`);
const assetsIdx = yml.indexOf("  assets:");
console.log(yml.slice(assetsIdx, assetsIdx + 350));

const baseUrls = /front_js:[\s\S]*?base_urls:\s*\n\s*-\s*'([^']+)'/.exec(yml);
const basePath = /front_js:[\s\S]*?base_path:\s*'([^']+)'/.exec(yml);
const version = /assets:\s*\n\s*version:\s*'([^']+)'/.exec(yml);
console.log("parsed front_js.base_urls:", baseUrls?.[1] || "(none)");
console.log("parsed front_js.base_path:", basePath?.[1] || "(none)");
console.log("parsed assets.version:", version?.[1] || "(none)");

console.log("\n=== 2) Other YAML mentioning base_path / packages / ../js ===");
const hits = [];
for (const m of yml.matchAll(/.*(?:base_path|base_urls|front_js|\.\.\/js).*/g)) {
  hits.push(m[0].trim());
}
console.log(hits.length ? hits.join("\n") : "(none beyond assets block)");

// Scan a few config files for relative js paths
console.log("\n=== 3) Config files scan (relative js / front_js) ===");
const configFiles = [
  "app/config/config.yml",
  "app/config/config_prod.yml",
  "app/config/config_dev.yml",
  "app/config/parameters.yml",
  "app/config/services.yml",
];
for (const rel of configFiles) {
  try {
    const text = await readRemote(`${shopRoot}/${rel}`);
    const lines = text.split(/\r?\n/).filter((l) =>
      /(\.\.\/js|base_path|front_js|base_urls)/.test(l)
    );
    if (lines.length) {
      console.log(`-- ${rel}`);
      for (const l of lines.slice(0, 12)) console.log("  ", l.trim());
    } else {
      console.log(`-- ${rel}: no matches`);
    }
  } catch (e) {
    console.log(`-- ${rel}: ${e.message}`);
  }
}

console.log("\n=== 4) Compiled admin container front_js package ===");
try {
  await client.cd(`${shopRoot}/var/cache/prod/admin`);
  const top = await client.list();
  const containerDir = top.find((e) => e.isDirectory && /^Container/.test(e.name));
  if (containerDir) {
    const svc = `${shopRoot}/var/cache/prod/admin/${containerDir.name}/getAssets_PackageFrontJsService.php`;
    try {
      const php = await readRemote(svc);
      const url = /UrlPackage\(\[([^\]]+)\]/.exec(php);
      const pathPkg = /PathPackage\(([^,]+)/.exec(php);
      console.log("container:", containerDir.name);
      console.log("UrlPackage args:", url?.[1]?.trim() || "(none)");
      console.log("PathPackage arg:", pathPkg?.[1]?.trim() || "(none)");
    } catch (e) {
      console.log("service file:", e.message);
    }
  } else {
    console.log("no Container* dir yet (cache cold)");
  }
} catch (e) {
  console.log("cache admin:", e.message);
}

console.log("\n=== 5) HTTP HEAD — correct root /js vs broken admin-prefixed ===");
const assets = [
  "admin.js",
  "tools.js",
  "jquery/plugins/fancybox/jquery.fancybox.js",
  "jquery/plugins/fancybox/jquery.fancybox.css",
  "jquery/plugins/chosen/jquery.chosen.js",
  "jquery/plugins/chosen/jquery.chosen.css",
  "tiny_mce/tinymce.min.js",
  "admin/tinymce.inc.js",
  "admin/tinymce_loader.js",
  "tiny_mce/skins/prestashop/skin.min.css",
  "jquery/jquery-3.7.1.min.js",
  "jquery/jquery-1.11.0.min.js",
];

const rows = [];
for (const a of assets) {
  const good = await head(`${staging}/js/${a}`);
  const bad = await head(`${staging}/${adminFolder}/js/${a}`);
  rows.push({ asset: a, root: good.status, adminPrefixed: bad.status });
}
console.table(rows);

console.log("\n=== 6) HTTP HEAD — BO theme assets (new-theme) ===");
const boAssets = [
  `themes/new-theme/public/main.bundle.js`,
  `themes/new-theme/public/theme.css`,
  `themes/new-theme/public/product_edit.bundle.js`,
  `themes/new-theme/public/login.css`,
  `themes/new-theme/public/preload.html.twig`,
];
for (const a of boAssets) {
  const r = await head(`${staging}/${adminFolder}/${a}`);
  console.log(`${r.status}  ${r.len.padStart(8)}  ${a}`);
}

console.log("\n=== 7) Front theme CSS/JS (barbaraalvisi) ===");
const frontAssets = [
  "themes/barbaraalvisi/assets/css/custom.css",
  "themes/barbaraalvisi/assets/css/home-overrides.css",
  "themes/barbaraalvisi/assets/js/barbaraalvisi-theme.js",
  "themes/barbaraalvisi/assets/js/gucci-theme.js",
];
for (const a of frontAssets) {
  const r = await head(`${staging}/${a}`);
  console.log(`${r.status}  ${r.len.padStart(8)}  ${a}`);
}

console.log("\n=== 8) Risk summary ===");
const brokenRoot = rows.filter((r) => r.root >= 400);
const stillAdminOkMistake = rows.filter((r) => r.adminPrefixed === 200);
console.log(
  "Root /js missing (real problem):",
  brokenRoot.length ? brokenRoot.map((r) => r.asset).join(", ") : "none"
);
console.log(
  "Admin-prefixed /js unexpectedly 200 (unusual):",
  stillAdminOkMistake.length
    ? stillAdminOkMistake.map((r) => r.asset).join(", ")
    : "none (expected — those paths must 404)"
);

const mode =
  baseUrls?.[1]
    ? `FIXED via base_urls=${baseUrls[1]}`
    : basePath?.[1]
      ? `RISK via base_path=${basePath[1]} (relative under admin pretty routes)`
      : "UNKNOWN front_js config";
console.log("Current front_js mode:", mode);

client.close();
