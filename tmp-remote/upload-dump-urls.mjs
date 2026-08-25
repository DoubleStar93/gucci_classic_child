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
require_once _PS_ROOT_DIR_ . '/app/AppKernel.php';
$kernel = new AppKernel(_PS_ENV_, false);
$kernel->boot();
$packages = $kernel->getContainer()->get('assets.packages');
foreach ([
  'admin.js',
  'tools.js',
  'jquery/plugins/fancybox/jquery.fancybox.js',
  'jquery/plugins/chosen/jquery.chosen.js',
] as $f) {
  echo $f . ' => ' . $packages->getUrl($f, 'front_js') . PHP_EOL;
}
@unlink(__FILE__);
`;

const client = new Client(60_000);
const tmp = path.join(os.tmpdir(), "dump-urls2");
await fs.mkdir(tmp, { recursive: true });
await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});
const local = path.join(tmp, "dump-front-js-urls.php");
await fs.writeFile(local, php);
await client.uploadFrom(local, shopRoot + "/dump-front-js-urls.php");
client.close();
console.log("uploaded");
