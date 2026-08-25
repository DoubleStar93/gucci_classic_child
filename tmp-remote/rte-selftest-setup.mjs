/**
 * Build a self-test page that loads the same TinyMCE stack and reports success/fail.
 * Also inspect product page asset inclusion patterns from PS templates.
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
const tmp = path.join(os.tmpdir(), "rte-selftest");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

// 1) Find how javascript is included on Symfony product pages
async function find(dir, pred, depth = 0, acc = []) {
  if (depth > 4) return acc;
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
      if (["vendor", "node_modules"].includes(e.name)) continue;
      await find(p, pred, depth + 1, acc);
    } else if (pred(e.name)) acc.push(p);
  }
  return acc;
}

const twigRoots = [
  `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin`,
  `${shopRoot}/l1ka80lkkixgfknd/themes/new-theme/templates`,
];

console.log("=== Search javascript include chain ===");
for (const root of twigRoots) {
  const files = await find(root, (n) => /\.twig$/.test(n));
  for (const f of files) {
    const local = path.join(tmp, f.replace(/[\\/]/g, "_").slice(-90));
    try {
      await client.downloadTo(local, f);
    } catch {
      continue;
    }
    const t = await fs.readFile(local, "utf8");
    if (!/core_javascript|javascript\.html|product_edit\.bundle|tinymce|autoload_rte/i.test(t)) {
      continue;
    }
    const lines = t.split(/\n/).filter((l) =>
      /core_javascript|javascript\.html|product_edit|tinymce|autoload_rte|bo-rte/i.test(l)
    );
    if (lines.length) {
      console.log("\n--", f.replace(shopRoot, ""));
      console.log(lines.slice(0, 15).join("\n"));
    }
  }
}

// 2) Upload self-test HTML (public) that mimics BO TinyMCE init
const selftest = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<title>TinyMCE self-test</title>
<script src="https://barbaraalvisi.it/js/jquery/jquery-3.7.1.min.js"></script>
<script>
  window.baseAdminDir = '/l1ka80lkkixgfknd/';
  window.iso_user = 'it';
  window.tinyMCEPreInit = { base: 'https://barbaraalvisi.it/js/tiny_mce', suffix: '.min' };
</script>
<script src="https://barbaraalvisi.it/js/tiny_mce/tinymce.min.js"></script>
<style>
  body{font:14px sans-serif;padding:20px}
  #log{white-space:pre-wrap;background:#111;color:#0f0;padding:12px;min-height:120px}
  textarea{width:100%;height:160px}
</style>
</head><body>
<h1>TinyMCE self-test</h1>
<textarea id="t1" class="autoload_rte"><p>Hello test</p></textarea>
<div id="log"></div>
<script>
var logEl = document.getElementById('log');
function L(m){ logEl.textContent += m + '\\n'; console.log(m); }
L('tinyMCE typeof: ' + typeof tinyMCE);
try {
  tinyMCE.init({
    mode: 'exact',
    elements: 't1',
    theme: 'modern',
    skin: 'prestashop',
    plugins: 'lists link code table',
    toolbar: 'bold italic | bullist | link | code',
    menubar: false,
    height: 220,
    setup: function(ed){
      ed.on('init', function(){ L('INIT OK id=' + ed.id + ' iframe=' + !!ed.iframeElement); });
    }
  });
  setTimeout(function(){
    L('editors count: ' + (tinyMCE.editors ? tinyMCE.editors.length : 'n/a'));
    L('mce shells: ' + document.querySelectorAll('.mce-tinymce').length);
    L('iframes: ' + document.querySelectorAll('.mce-tinymce iframe').length);
  }, 1500);
} catch(e) {
  L('THROW: ' + e.message);
}
</script>
</body></html>`;

const stLocal = path.join(tmp, "tinymce-selftest.html");
await fs.writeFile(stLocal, selftest, "utf8");
await client.uploadFrom(stLocal, `${shopRoot}/tinymce-selftest.html`);
console.log("\nUploaded https://barbaraalvisi.it/tinymce-selftest.html");

client.close();
