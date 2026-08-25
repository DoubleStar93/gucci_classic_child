import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");

const client = new Client(90_000);
const tmp = path.join(os.tmpdir(), "final-v");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

await client.uploadFrom(
  "tmp-remote/clean-stash-fast.php",
  `${shopRoot}/clean-stash-fast.php`
);

const local = path.join(tmp, "core.twig");
await client.downloadTo(
  local,
  `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`
);
const t = await fs.readFile(local, "utf8");
console.log("has defaultTinyMceConfig", t.includes("defaultTinyMceConfig"));
console.log("has plugins override", t.includes("align colorpicker link image table media"));
console.log("has rescue js", t.includes("bo-rte-rescue.js"));
console.log("has str2url", t.includes("window.str2url"));
console.log("has absolute admin.js", t.includes("barbaraalvisi.it/js/admin.js"));

await client.cd(`${shopRoot}/var/cache`);
console.log(
  "cache dirs",
  (await client.list())
    .map((f) => f.name)
    .filter((n) => n.includes("stash") || n === "prod")
);

client.close();
