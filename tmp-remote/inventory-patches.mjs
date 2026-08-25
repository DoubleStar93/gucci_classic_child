/**
 * Inventory of BO/core patches applied during TinyMCE/admin.js incident.
 * Read-only FTP inspection.
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
const tmp = path.join(os.tmpdir(), "patch-inventory");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

async function get(rel) {
  const local = path.join(tmp, rel.replace(/[\\/]/g, "_").slice(-100));
  await client.downloadTo(local, `${shopRoot}/${rel}`);
  return fs.readFile(local, "utf8");
}

async function exists(rel) {
  try {
    await get(rel);
    return true;
  } catch {
    return false;
  }
}

console.log("=== 1) app/config/config.yml assets ===");
const yml = await get("app/config/config.yml");
const i = yml.indexOf("  assets:");
console.log(yml.slice(i, i + 280));
console.log("PS_LOG_MAX_FILES:", /PS_LOG_MAX_FILES[^\\n]*/.exec(yml)?.[0]);

console.log("\n=== 2) core_javascript.html.twig (custom markers) ===");
const core = await get(
  "src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig"
);
const markers = [
  "barbaraalvisi.it/js",
  "tinyMCEPreInit",
  "defaultTinyMceConfig",
  "str2url",
  "bo-rte-rescue",
  "themes/modern/theme.min.js",
  "asset('admin.js'",
  "asset('tools.js'",
  "base_path",
];
for (const m of markers) {
  console.log(`  ${m}: ${core.includes(m)}`);
}
console.log("  length:", core.length);
console.log("  --- snippets ---");
for (const line of core.split("\n")) {
  if (/barbaraalvisi|bo-rte|tinyMCE|str2url|admin\\.js|tools\\.js|defaultTiny|filemanager/.test(line)) {
    console.log(" ", line.trim().slice(0, 140));
  }
}

console.log("\n=== 3) stylesheets.html.twig ===");
try {
  const ss = await get(
    "src/PrestaShopBundle/Resources/views/Admin/Layout/stylesheets.html.twig"
  );
  console.log("  absolute fancybox/chosen:", ss.includes("barbaraalvisi.it/js"));
  console.log("  asset front_js fancybox:", ss.includes("asset('jquery/plugins/fancybox"));
} catch (e) {
  console.log("  missing/err", e.message);
}

console.log("\n=== 4) Custom JS/CSS files under js/admin ===");
await client.cd(`${shopRoot}/js/admin`);
const adminJs = await client.list();
console.log(
  adminJs
    .filter((f) => /bo-rte|rescue/i.test(f.name))
    .map((f) => `${f.name} (${f.size})`)
    .join("\n  ") || "  (none)"
);

console.log("\n=== 5) Favicon module patches ===");
try {
  const tpl = await get(
    "modules/ps_faviconnotificationbo/views/templates/hook/displayBackOfficeHeader.tpl"
  );
  console.log(
    "  typeof check:",
    tpl.includes("typeof ps_faviconnotificationbo")
  );
  console.log(
    "  old unsafe check:",
    tpl.includes("undefined !== ps_faviconnotificationbo")
  );
  const favJs = await get(
    "modules/ps_faviconnotificationbo/views/js/ps_faviconnotificationbo.js"
  );
  console.log(
    "  window.ps_faviconnotificationbo:",
    favJs.includes("window.ps_faviconnotificationbo")
  );
} catch (e) {
  console.log("  err", e.message);
}

console.log("\n=== 6) One-shot leftover public PHP/HTML ===");
for (const f of [
  "clean-stash-fast.php",
  "tinymce-selftest.html",
  "tinymce-selftest-v4.html",
  "diag-tinymce.php",
  "dump-front-js-urls.php",
  "render-bo-assets.php",
]) {
  console.log(`  ${f}: ${await exists(f)}`);
}

console.log("\n=== 7) Native PS 9.0.3 defaults (reference) ===");
console.log("  front_js.base_path: '../js'");
console.log("  core_javascript: asset('admin.js','front_js') + asset('tools.js','front_js')");
console.log("  TinyMCEEditor loads theme async via ScriptLoader");
console.log("  No bo-rte-rescue*, no hardcoded absolute URLs in twig");

client.close();
