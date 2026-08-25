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
require __DIR__ . '/config/config.inc.php';
require_once __DIR__ . '/app/AdminKernel.php';
$kernel = new AdminKernel(_PS_ENV_, false);
$kernel->boot();
$twig = $kernel->getContainer()->get('twig');
echo $twig->createTemplate(
  "admin.js={{ asset('admin.js', 'front_js') }}\\n" .
  "tools.js={{ asset('tools.js', 'front_js') }}\\n" .
  "fancybox={{ asset('jquery/plugins/fancybox/jquery.fancybox.js', 'front_js') }}\\n" .
  "chosen={{ asset('jquery/plugins/chosen/jquery.chosen.js', 'front_js') }}\\n"
)->render([]);
@unlink(__FILE__);
`;

const client = new Client(90_000);
const tmp = path.join(os.tmpdir(), "dump5");
await fs.mkdir(tmp, { recursive: true });
await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

const name = "dump-assets-" + Date.now().toString(36) + ".php";
const local = path.join(tmp, name);
await fs.writeFile(local, php);
await client.uploadFrom(local, shopRoot + "/" + name);
console.log("uploaded", name);

try {
  await client.rename(
    shopRoot + "/var/cache/_stash-restore-msxfrzfo",
    shopRoot + "/var/cache/_stash-old-ignore"
  );
  console.log("renamed leftover stash");
} catch (e) {
  console.log("stash rename:", e.message);
}

try {
  await client.remove(shopRoot + "/dump-front-js-urls.php");
  console.log("deleted old dump-front-js-urls.php");
} catch (e) {
  console.log("old dump del:", e.message);
}

client.close();
console.log("URL", "https://barbaraalvisi.it/" + name);
