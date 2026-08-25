import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");

const tmp = path.join(os.tmpdir(), "bo-err-check");
await fs.mkdir(tmp, { recursive: true });

const client = new Client(90_000);
await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

const local = path.join(tmp, "core_javascript.html.twig");
await client.downloadTo(
  local,
  `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`
);
const t = await fs.readFile(local, "utf8");
console.log("has rescue:", t.includes("bo-rte-rescue"));
console.log("has absolute admin.js:", t.includes("barbaraalvisi.it/js/admin.js"));
console.log("has asset admin.js:", t.includes("asset('admin.js'"));

// Fix favicon tpl — typeof is safe; bare identifier throws ReferenceError
const tplRemote = `${shopRoot}/modules/ps_faviconnotificationbo/views/templates/hook/displayBackOfficeHeader.tpl`;
const tplLocal = path.join(tmp, "displayBackOfficeHeader.tpl");
await client.downloadTo(tplLocal, tplRemote);
let tpl = await fs.readFile(tplLocal, "utf8");
console.log("tpl before check:", /undefined !== ps_faviconnotificationbo|typeof ps_faviconnotificationbo/.exec(tpl)?.[0]);

if (tpl.includes("undefined !== ps_faviconnotificationbo")) {
  tpl = tpl.replace(
    "undefined !== ps_faviconnotificationbo",
    "typeof ps_faviconnotificationbo !== 'undefined'"
  );
  await fs.writeFile(tplLocal, tpl, "utf8");
  await client.uploadFrom(tplLocal, tplRemote);
  console.log("FIXED favicon tpl typeof check");
} else {
  console.log("favicon tpl already safe or different");
}

// Also expose on window in module JS (belt & suspenders)
const jsRemote = `${shopRoot}/modules/ps_faviconnotificationbo/views/js/ps_faviconnotificationbo.js`;
const jsLocal = path.join(tmp, "ps_faviconnotificationbo.js");
await client.downloadTo(jsLocal, jsRemote);
let js = await fs.readFile(jsLocal, "utf8");
if (!js.includes("window.ps_faviconnotificationbo")) {
  js = js.replace(
    "let ps_faviconnotificationbo = {};",
    "let ps_faviconnotificationbo = {};\nwindow.ps_faviconnotificationbo = ps_faviconnotificationbo;"
  );
  // keep initialize assignment on both
  if (!js.includes("window.ps_faviconnotificationbo = ps_faviconnotificationbo")) {
    // already added above
  }
  await fs.writeFile(jsLocal, js, "utf8");
  await client.uploadFrom(jsLocal, jsRemote);
  console.log("FIXED favicon js window export");
} else {
  console.log("favicon js already exports window");
}

client.close();
console.log("done");
