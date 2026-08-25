/**
 * Restore original PrestaShop BO files; keep only front_js base_urls fix.
 * Delete rescue leftovers and selftests.
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
const staging = "https://barbaraalvisi.it";
const stamp = `9.0.3-restore${Date.now().toString(36)}`;

const client = new Client(120_000);
const tmp = path.join(os.tmpdir(), "ps-restore");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

async function put(localRel, remoteRel) {
  const local = path.isAbsolute(localRel)
    ? localRel
    : path.join(process.cwd(), localRel);
  await client.uploadFrom(local, `${shopRoot}/${remoteRel}`);
  console.log("uploaded", remoteRel);
}

async function del(remoteRel) {
  try {
    await client.remove(`${shopRoot}/${remoteRel}`);
    console.log("deleted", remoteRel);
  } catch (e) {
    console.log("skip del", remoteRel, e.message);
  }
}

// 1) Restore original twig/layout + favicon
await put(
  "tmp-remote/orig-core_javascript.html.twig",
  "src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig"
);
await put(
  "tmp-remote/orig-stylesheets.html.twig",
  "src/PrestaShopBundle/Resources/views/Admin/Layout/stylesheets.html.twig"
);
await put(
  "tmp-remote/orig-favicon-header.tpl",
  "modules/ps_faviconnotificationbo/views/templates/hook/displayBackOfficeHeader.tpl"
);
await put(
  "tmp-remote/orig-favicon.js",
  "modules/ps_faviconnotificationbo/views/js/ps_faviconnotificationbo.js"
);

// 2) Keep ONLY base_urls in config.yml (essential), restore version to PS const if possible
const cfgRemote = `${shopRoot}/app/config/config.yml`;
const cfgLocal = path.join(tmp, "config.yml");
await client.downloadTo(cfgLocal, cfgRemote);
let yml = await fs.readFile(cfgLocal, "utf8");

// Ensure clean assets block: version bust + base_urls only
const assetsBlock = `  assets:
    version: '${stamp}'
    packages:
      front_js:
        base_urls:
          - '${staging}/js'
`;

if (/^\s*assets:\s*$/m.test(yml)) {
  yml = yml.replace(
    /^\s*assets:\s*\n(?:.*\n)*?(?=^\s*# esi|^ {2}secret:)/m,
    assetsBlock + "\n"
  );
} else {
  throw new Error("assets block not found");
}

await fs.writeFile(cfgLocal, yml, "utf8");
await client.uploadFrom(cfgLocal, cfgRemote);
console.log("config.yml assets -> base_urls only, version", stamp);
console.log(yml.slice(yml.indexOf("  assets:"), yml.indexOf("  assets:") + 200));

// 3) Delete rescue leftovers + selftests
const toDelete = [
  "js/admin/bo-rte-rescue.js",
  "js/admin/bo-rte-rescue.css",
  "js/admin/bo-rte-rescue-v3.js",
  "js/admin/bo-rte-rescue-v3.css",
  "js/admin/bo-rte-rescue-v4.js",
  "js/admin/bo-rte-rescue-v4.css",
  "js/admin/bo-rte-rescue-v5.js",
  "js/admin/bo-rte-rescue-v5.css",
  "tinymce-selftest.html",
  "tinymce-selftest-v4.html",
  "clean-stash-fast.php",
];
for (const f of toDelete) await del(f);

// 4) Clear Symfony cache
try {
  await client.rename(
    `${shopRoot}/var/cache/prod`,
    `${shopRoot}/var/cache/_stash-restore-${Date.now().toString(36)}`
  );
  try {
    await client.send(`MKD ${shopRoot}/var/cache/prod`);
  } catch {}
  console.log("cache prod stashed");
} catch (e) {
  console.log("cache", e.message);
}

// Upload cleaner
await put("tmp-remote/clean-stash-fast.php", "clean-stash-fast.php");

client.close();
console.log("RESTORE DONE");
