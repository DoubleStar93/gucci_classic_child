/**
 * Find how BO includes tools.js/admin.js and whether any hardcoded relative paths remain.
 * Read-only FTP download of admin layout templates + sample of product_edit for TinyMCE init order.
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
const admin = `${shopRoot}/l1ka80lkkixgfknd`;

const client = new Client(120_000);
const tmp = path.join(os.tmpdir(), "ps-bo-layout-audit");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

async function get(remote) {
  const local = path.join(tmp, remote.replace(/[\\/]/g, "_").slice(-120));
  await client.downloadTo(local, remote);
  return fs.readFile(local, "utf8");
}

async function findFiles(dir, pred, depth = 0, acc = []) {
  if (depth > 5) return acc;
  let list;
  try {
    await client.cd(dir);
    list = await client.list();
  } catch {
    return acc;
  }
  for (const e of list) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory) {
      if (["vendor", "node_modules", ".git"].includes(e.name)) continue;
      await findFiles(p, pred, depth + 1, acc);
    } else if (pred(e.name, p)) {
      acc.push(p);
    }
  }
  return acc;
}

console.log("=== Search twig/tpl for tools.js / front_js / tinymce ===");
const roots = [
  `${admin}/themes/new-theme/templates`,
  `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin`,
];

const interesting = [];
for (const root of roots) {
  const files = await findFiles(
    root,
    (name) => /\.(twig|tpl)$/.test(name),
    0,
    []
  );
  for (const f of files) {
    let text;
    try {
      text = await get(f);
    } catch {
      continue;
    }
    if (/tools\.js|admin\.js|front_js|tinymce|str2url|tiny_mce/i.test(text)) {
      interesting.push({ f, text });
    }
  }
}

for (const { f, text } of interesting) {
  const lines = text.split(/\r?\n/);
  const matched = [];
  lines.forEach((line, i) => {
    if (/tools\.js|admin\.js|front_js|tinymce|tiny_mce|str2url/i.test(line)) {
      matched.push(`${i + 1}: ${line.trim()}`);
    }
  });
  if (matched.length) {
    console.log("\n--", f.replace(shopRoot, ""));
    console.log(matched.slice(0, 20).join("\n"));
  }
}

console.log("\n=== product_edit.bundle.js around str2url / TinyMCE ===");
const bundlePath = `${admin}/themes/new-theme/public/product_edit.bundle.js`;
const bundle = await get(bundlePath);
for (const needle of ["str2url", "TinyMCEEditor", "new TinyMCE", "linkRewriteStateRefresh"]) {
  let idx = 0;
  let n = 0;
  while ((idx = bundle.indexOf(needle, idx)) !== -1 && n < 3) {
    console.log(`\n[${needle} @ ${idx}]`);
    console.log(bundle.slice(Math.max(0, idx - 120), idx + 200).replace(/\s+/g, " "));
    idx += needle.length;
    n++;
  }
}

client.close();
