/**
 * Compare key BO/core files on remote vs local PrestaShop-9.0.3 extract.
 * Reports: identical / differ / missing-on-server / only-on-server (extra).
 */
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import os from "node:os";
import { createReadStream, existsSync } from "node:fs";
import { createInterface } from "node:readline";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");

const extractRoots = [
  path.join(process.cwd(), "tmp-remote", "_ps903", "PrestaShop-9.0.3"),
  path.join(process.cwd(), "tmp-remote", "_ps903"),
  path.join(process.cwd(), "tmp-remote", "_ps903", "prestashop"),
  path.join(process.cwd(), "PrestaShop-9.0.3"),
  path.join(process.cwd(), "PrestaShop-9.0.3", "prestashop"),
];

async function findExtractRoot() {
  for (const root of extractRoots) {
    try {
      await fs.access(path.join(root, "app", "config", "config.yml"));
      return root;
    } catch {}
    try {
      await fs.access(path.join(root, "src", "PrestaShopBundle"));
      return root;
    } catch {}
  }
  // scan one level
  for (const root of [path.join(process.cwd(), "tmp-remote", "_ps903"), path.join(process.cwd(), "PrestaShop-9.0.3")]) {
    try {
      const entries = await fs.readdir(root, { withFileTypes: true });
      for (const e of entries) {
        if (!e.isDirectory()) continue;
        const cand = path.join(root, e.name);
        try {
          await fs.access(path.join(cand, "app", "config", "config.yml"));
          return cand;
        } catch {}
      }
    } catch {}
  }
  return null;
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex").slice(0, 16);
}

const RELATIVE_FILES = [
  // Config (expect differ intentionally)
  "app/config/config.yml",
  // Twig layouts we touched
  "src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig",
  "src/PrestaShopBundle/Resources/views/Admin/Layout/stylesheets.html.twig",
  "src/PrestaShopBundle/Resources/views/Admin/Layout/default_layout.html.twig",
  "src/PrestaShopBundle/Resources/views/Admin/Layout/legacy_layout.html.twig",
  "src/PrestaShopBundle/Resources/views/Admin/Layout/light_layout.html.twig",
  "src/PrestaShopBundle/Resources/views/Admin/Layout/login_layout.html.twig",
  // TinyMCE / legacy JS that affect RTE
  "js/tiny_mce/tinymce.min.js",
  "js/tiny_mce/themes/modern/theme.min.js",
  "js/admin/tinymce.inc.js",
  "js/admin.js",
  "js/tools.js",
  "js/jquery/plugins/fancybox/jquery.fancybox.js",
  "js/jquery/plugins/chosen/jquery.chosen.js",
  // Favicon module
  "modules/ps_faviconnotificationbo/views/templates/hook/displayBackOfficeHeader.tpl",
  "modules/ps_faviconnotificationbo/views/js/ps_faviconnotificationbo.js",
];

const EXTRA_ON_SERVER = [
  "js/admin/bo-rte-rescue-v5.js",
  "js/admin/bo-rte-rescue-v5.css",
  "js/admin/bo-rte-rescue.js",
  "js/admin/bo-rte-rescue.css",
  "js/admin/bo-rte-rescue-v3.js",
  "js/admin/bo-rte-rescue-v4.js",
  "tinymce-selftest.html",
  "tinymce-selftest-v4.html",
  "clean-stash-fast.php",
  "dump-front-js-urls.php",
];

const extractRoot = await findExtractRoot();
if (!extractRoot) {
  console.error("EXTRACT ROOT NOT FOUND — wait for unzip or check structure");
  console.error("Looked in:", extractRoots);
  process.exit(2);
}
console.log("Official extract root:", extractRoot);

const client = new Client(120_000);
const tmp = path.join(os.tmpdir(), "ps-compare-" + Date.now().toString(36));
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

const results = { same: [], differ: [], missingLocal: [], missingRemote: [], extras: [] };

async function existsRemote(rel) {
  try {
    await client.size(shopRoot + "/" + rel);
    return true;
  } catch {
    return false;
  }
}

for (const rel of RELATIVE_FILES) {
  const localPath = path.join(extractRoot, ...rel.split("/"));
  let localBuf = null;
  try {
    localBuf = await fs.readFile(localPath);
  } catch {
    results.missingLocal.push(rel);
    continue;
  }

  const remotePath = shopRoot + "/" + rel;
  const dl = path.join(tmp, rel.replace(/[\\/]/g, "__"));
  try {
    await client.downloadTo(dl, remotePath);
  } catch (e) {
    results.missingRemote.push(rel + " (" + e.message + ")");
    continue;
  }
  const remoteBuf = await fs.readFile(dl);
  const lh = sha256(localBuf);
  const rh = sha256(remoteBuf);
  if (lh === rh) {
    results.same.push(rel);
  } else {
    // For text files, show a short hint
    let hint = "";
    const isText = /\.(yml|twig|tpl|js|css|php)$/i.test(rel) && remoteBuf.length < 500_000;
    if (isText) {
      const lt = localBuf.toString("utf8");
      const rt = remoteBuf.toString("utf8");
      const flags = [];
      if (rt.includes("bo-rte-rescue")) flags.push("has rescue include");
      if (rt.includes("base_urls")) flags.push("has base_urls");
      if (/barbaraalvisi\.it\/js\/(admin|tools)\.js/.test(rt)) flags.push("hardcoded asset URLs");
      if (rel.endsWith("config.yml")) {
        const m = /front_js:[\s\S]{0,200}/.exec(rt);
        if (m) flags.push("front_js: " + m[0].replace(/\s+/g, " ").slice(0, 120));
      }
      if (!flags.length) {
        flags.push(`size local=${localBuf.length} remote=${remoteBuf.length}`);
      }
      hint = " — " + flags.join("; ");
    } else {
      hint = ` — size local=${localBuf.length} remote=${remoteBuf.length}`;
    }
    results.differ.push(rel + hint);
  }
}

for (const rel of EXTRA_ON_SERVER) {
  if (await existsRemote(rel)) {
    results.extras.push(rel + " (NOT in official package)");
  }
}

client.close();

console.log("\n=== IDENTICI all'ufficiale ===");
for (const r of results.same) console.log("  OK  ", r);

console.log("\n=== DIVERSI dall'ufficiale (da valutare) ===");
for (const r of results.differ) console.log("  DIFF", r);
if (!results.differ.length) console.log("  (nessuno)");

console.log("\n=== Extra sul server (nostri patch) ===");
for (const r of results.extras) console.log("  EXTRA", r);
if (!results.extras.length) console.log("  (nessuno)");

console.log("\n=== In zip ma assenti in extract locale (path) ===");
for (const r of results.missingLocal) console.log("  LOCAL?", r);
if (!results.missingLocal.length) console.log("  (nessuno)");

console.log("\n=== In zip ma assenti/non scaricabili sul server ===");
for (const r of results.missingRemote) console.log("  REMOTE?", r);
if (!results.missingRemote.length) console.log("  (nessuno)");

console.log("\nDONE");
