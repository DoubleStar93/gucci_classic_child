/**
 * Deep-diagnose why product description RTE still empty.
 * Uploads one-shot PHP that boots AdminKernel lightly + checks files.
 * Also inspects bo-rte-rescue, tinymce paths, and CSS that may hide textareas.
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

const client = new Client(120_000);
const tmp = path.join(os.tmpdir(), "rte-deep");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

async function get(rel) {
  const local = path.join(tmp, rel.replace(/[\\/]/g, "_").slice(-90));
  await client.downloadTo(local, `${shopRoot}/${rel}`);
  return fs.readFile(local, "utf8");
}

console.log("=== core_javascript ===");
const core = await get(
  "src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig"
);
console.log(core);

console.log("\n=== bo-rte-rescue.js ===");
try {
  console.log(await get("js/admin/bo-rte-rescue.js"));
} catch (e) {
  console.log("MISSING", e.message);
}

console.log("\n=== HTTP probes ===");
for (const u of [
  `${staging}/js/admin.js`,
  `${staging}/js/tools.js`,
  `${staging}/js/admin/bo-rte-rescue.js`,
  `${staging}/js/tiny_mce/tinymce.min.js`,
  `${staging}/js/tiny_mce/skins/prestashop/skin.min.css`,
  `${staging}/js/tiny_mce/themes/modern/theme.min.js`,
  `${staging}/l1ka80lkkixgfknd/themes/new-theme/public/product_edit.bundle.js`,
]) {
  const r = await fetch(u, { method: "HEAD", redirect: "manual" });
  console.log(r.status, u.replace(staging, ""));
}

// Extract TinyMCEEditor selector from product_edit bundle
const bundle = await get(
  "l1ka80lkkixgfknd/themes/new-theme/public/product_edit.bundle.js"
);
const idx = bundle.indexOf("autoload_rte");
console.log("\nautoload_rte in product_edit:", idx >= 0);
const idx2 = bundle.indexOf("tineMceEditor");
console.log("tineMceEditor map:", idx2 >= 0);
// find selectorClass near TinyMCE
const m = bundle.match(/selectorClass:"([^"]+)"/);
console.log("selectorClass sample:", m?.[1]);
const m2 = [...bundle.matchAll(/selectorClass:"([^"]+)"/g)].map((x) => x[1]);
console.log("all selectorClass:", [...new Set(m2)].slice(0, 20));

// How TinyMCEEditor is registered
const tinymceBits = [];
let i = 0;
while ((i = bundle.indexOf("TinyMCEEditor", i)) !== -1 && tinymceBits.length < 5) {
  tinymceBits.push(bundle.slice(i, i + 180).replace(/\s+/g, " "));
  i += 12;
}
console.log("\nTinyMCEEditor refs:");
tinymceBits.forEach((b) => console.log("-", b));

client.close();
