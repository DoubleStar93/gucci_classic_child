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
const tmp = path.join(os.tmpdir(), "ps-admin-break");
await fs.mkdir(tmp, { recursive: true });

async function dl(remote, name) {
  const local = path.join(tmp, name.replace(/[\\/]/g, "_"));
  try {
    await client.downloadTo(local, remote);
    const text = await fs.readFile(local, "utf8");
    console.log(`\n=== ${name} (${text.length} bytes) ===`);
    return text;
  } catch (e) {
    console.log(`\n=== ${name} FAIL: ${e.message}`);
    return null;
  }
}

async function listSafe(dir) {
  try {
    await client.cd(dir);
    return (await client.list()).filter((e) => e.name !== "." && e.name !== "..");
  } catch (e) {
    return { error: e.message };
  }
}

try {
  await client.access({
    host: process.env.FTP_HOST.trim(),
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER.trim(),
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });
  console.log("FTP OK", shopRoot);

  const cfg = await listSafe(`${shopRoot}/config`);
  if (Array.isArray(cfg)) {
    console.log("\nconfig/");
    for (const e of cfg.sort((a, b) => a.name.localeCompare(b.name))) {
      console.log(`  ${e.isDirectory ? "[D]" : "[F]"} ${e.name} ${e.size || ""}`);
    }
  } else {
    console.log("config list fail", cfg);
  }

  const params = await dl(`${shopRoot}/app/config/parameters.php`, "parameters.php");
  if (params) {
    const redacted = params
      .replace(/(password['"]\s*=>\s*)['"][^'"]*['"]/gi, "$1'***'")
      .replace(/(secret['"]\s*=>\s*)['"][^'"]*['"]/gi, "$1'***'")
      .replace(/(cookie_key['"]\s*=>\s*)['"][^'"]*['"]/gi, "$1'***'")
      .replace(/(cookie_iv['"]\s*=>\s*)['"][^'"]*['"]/gi, "$1'***'")
      .replace(/(database_password['"]\s*=>\s*)['"][^'"]*['"]/gi, "$1'***'");
    console.log(redacted.slice(0, 2500));
  }

  const logs = await listSafe(`${shopRoot}/var/logs`);
  if (Array.isArray(logs)) {
    const files = logs
      .filter((e) => e.isFile)
      .sort((a, b) => String(b.rawModifiedAt || b.modifiedAt || b.name).localeCompare(String(a.rawModifiedAt || a.modifiedAt || a.name)));
    console.log("\nvar/logs (top by name/date):");
    for (const e of files.slice(0, 15)) {
      console.log(`  ${e.name} size=${e.size} mod=${e.rawModifiedAt || e.modifiedAt || "?"}`);
    }
    // Prefer newest exception / prod logs by filename date
    const dated = files
      .filter((e) => /exception|prod-|dev-/.test(e.name))
      .sort((a, b) => b.name.localeCompare(a.name));
    for (const e of dated.slice(0, 4)) {
      const text = await dl(`${shopRoot}/var/logs/${e.name}`, e.name);
      if (text) console.log(text.slice(-3500));
    }
  }

  try {
    const local = path.join(tmp, "php_errorlog");
    await client.downloadTo(local, `${shopRoot}/php_errorlog`);
    const buf = await fs.readFile(local, "utf8");
    console.log("\n=== php_errorlog TAIL ===");
    console.log(buf.slice(-4000));
  } catch (e) {
    console.log("php_errorlog fail", e.message);
  }

  // maintenance / shop enable clues
  await dl(`${shopRoot}/themes/classic/templates/errors/maintenance.tpl`, "maintenance.tpl");
  await dl(`${shopRoot}/config/defines.inc.php`, "defines.inc.php");

  // settings.inc.php presence
  const settings = await dl(`${shopRoot}/config/settings.inc.php`, "settings.inc.php");
  if (!settings) {
    console.log("\nCRITICAL: config/settings.inc.php missing");
  }
} finally {
  client.close();
}
