import path from "node:path";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");
const adminDir = "l1ka80lkkixgfknd";
const client = new Client(90_000);

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

  const checks = [
    `${shopRoot}/${adminDir}/themes/new-theme/public`,
    `${shopRoot}/${adminDir}/themes/default/js`,
    `${shopRoot}/${adminDir}/themes/default/js/vendor`,
    `${shopRoot}/js/jquery`,
    `${shopRoot}/modules/ps_faviconnotificationbo`,
    `${shopRoot}/modules/ps_faviconnotificationbo/views/js`,
    `${shopRoot}/var/cache/prod`,
  ];

  for (const dir of checks) {
    const entries = await listSafe(dir);
    console.log(`\n=== ${dir} ===`);
    if (!Array.isArray(entries)) {
      console.log("ERR", entries.error);
      continue;
    }
    const sample = entries
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 40)
      .map((e) => `${e.isDirectory ? "[D]" : "[F]"} ${e.name}${e.size != null ? " " + e.size : ""}`);
    console.log(`count=${entries.length}`);
    console.log(sample.join("\n"));
  }

  // critical files existence via size
  const files = [
    `${shopRoot}/${adminDir}/themes/new-theme/public/theme.bundle.js`,
    `${shopRoot}/${adminDir}/themes/new-theme/public/main.bundle.js`,
    `${shopRoot}/${adminDir}/themes/new-theme/public/theme.css`,
    `${shopRoot}/${adminDir}/themes/default/js/vendor/jquery-3.5.1.min.js`,
    `${shopRoot}/js/jquery/jquery-3.7.1.min.js`,
    `${shopRoot}/js/jquery/jquery-3.5.1.min.js`,
    `${shopRoot}/js/jquery/jquery-1.11.0.min.js`,
  ];
  console.log("\n=== file sizes ===");
  for (const f of files) {
    try {
      console.log(await client.size(f), f);
    } catch {
      console.log("MISSING", f);
    }
  }
} finally {
  client.close();
}
