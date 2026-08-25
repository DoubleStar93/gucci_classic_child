/**
 * Diagnose TinyMCE / product description editors (read-mostly).
 * Uploads a one-shot PHP that boots AdminKernel and prints resolved asset URLs
 * + checks tinymce files existence. Self-deletes.
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

const php = `<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');

echo "=== TinyMCE / front_js diagnose ===\\n";

\$files = [
  'js/tools.js',
  'js/admin.js',
  'js/tiny_mce/tinymce.min.js',
  'js/admin/tinymce.inc.js',
  'js/admin/tinymce_loader.js',
  'js/tiny_mce/skins/prestashop/skin.min.css',
  'js/tiny_mce/themes/modern/theme.min.js',
  'js/tiny_mce/plugins/lists/plugin.min.js',
  'js/tiny_mce/plugins/link/plugin.min.js',
  'js/tiny_mce/plugins/code/plugin.min.js',
  'js/tiny_mce/plugins/table/plugin.min.js',
  'js/tiny_mce/plugins/image/plugin.min.js',
  'js/tiny_mce/plugins/media/plugin.min.js',
  'js/tiny_mce/plugins/colorpicker/plugin.min.js',
  'js/tiny_mce/plugins/placeholder/plugin.min.js',
  'js/tiny_mce/plugins/align/plugin.min.js',
  'js/tiny_mce/plugins/autoresize/plugin.min.js',
  'js/tiny_mce/plugins/advlist/plugin.min.js',
];
foreach (\$files as \$f) {
  \$p = __DIR__ . '/' . \$f;
  echo (is_file(\$p) ? 'OK  ' : 'MISS') . ' ' . \$f;
  if (is_file(\$p)) echo ' (' . filesize(\$p) . ')';
  echo "\\n";
}

try {
  require __DIR__ . '/config/config.inc.php';
  require_once __DIR__ . '/app/AdminKernel.php';
  \$kernel = new AdminKernel(_PS_ENV_, false);
  \$kernel->boot();
  \$c = \$kernel->getContainer();

  // Twig asset helper (public in FO/BO)
  \$twig = null;
  foreach (['twig', 'Twig\\\\Environment'] as \$id) {
    try {
      if (\$c->has(\$id)) { \$twig = \$c->get(\$id); break; }
    } catch (Throwable \$e) {}
  }
  if (!\$twig) {
    // fallback: instantiate Packages manually from config
    echo "twig service unavailable, trying Assets Packages via reflection\\n";
  } else {
    \$tpl = \$twig->createTemplate(
      "admin.js={{ asset('admin.js', 'front_js') }}\\n" .
      "tools.js={{ asset('tools.js', 'front_js') }}\\n" .
      "tinymce={{ asset('tiny_mce/tinymce.min.js', 'front_js') }}\\n" .
      "tinymce.inc={{ asset('admin/tinymce.inc.js', 'front_js') }}\\n" .
      "loader={{ asset('admin/tinymce_loader.js', 'front_js') }}\\n"
    );
    echo "=== Twig asset() ===\\n";
    echo \$tpl->render([]);
  }
} catch (Throwable \$e) {
  echo "KERNEL ERROR: " . \$e->getMessage() . "\\n";
  echo \$e->getFile() . ':' . \$e->getLine() . "\\n";
}

// grep product_edit for tinymce / str2url / rte
\$bundle = __DIR__ . '/l1ka80lkkixgfknd/themes/new-theme/public/product_edit.bundle.js';
if (is_file(\$bundle)) {
  \$chunk = file_get_contents(\$bundle);
  echo "=== product_edit.bundle.js hints ===\\n";
  echo "size=" . strlen(\$chunk) . "\\n";
  foreach (['str2url','tinyMCE','tinymce','autoload_rte','TinyMCE','linkRewrite'] as \$needle) {
    echo \$needle . ': ' . (strpos(\$chunk, \$needle) !== false ? 'yes' : 'no') . "\\n";
  }
}

echo "done\\n";
@unlink(__FILE__);
`;

const localPhp = path.join(os.tmpdir(), "diag-tinymce.php");
await fs.writeFile(localPhp, php, "utf8");

const client = new Client(90_000);
await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});
await client.uploadFrom(localPhp, `${shopRoot}/diag-tinymce.php`);
client.close();

const res = await fetch(`https://barbaraalvisi.it/diag-tinymce.php?t=${Date.now()}`, {
  headers: { "Cache-Control": "no-cache" },
});
console.log(await res.text());
