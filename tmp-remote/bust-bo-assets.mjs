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
const tmp = path.join(os.tmpdir(), "bust-assets");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

const stamp = `9.0.3-fix${Date.now().toString(36)}`;
const configRemote = `${shopRoot}/app/config/config.yml`;
const local = path.join(tmp, "config.yml");
await client.downloadTo(local, configRemote);
let yml = await fs.readFile(local, "utf8");

const constVersion =
  "version: !php/const PrestaShop\\PrestaShop\\Core\\Version::VERSION";
if (yml.includes(constVersion)) {
  yml = yml.replace(constVersion, `version: '${stamp}'`);
} else if (/version:\s*['"][^'"]+['"]/.test(yml)) {
  yml = yml.replace(/(assets:[\s\S]*?version:\s*)['"][^'"]+['"]/, `$1'${stamp}'`);
} else {
  yml = yml.replace(/(assets:\s*\n)/, `$1    version: '${stamp}'\n`);
}

await fs.writeFile(local, yml, "utf8");
await client.uploadFrom(local, configRemote);
console.log("asset version ->", stamp);
const idx = yml.indexOf("assets:");
console.log(yml.slice(idx, idx + 240));

const token = Date.now().toString(36);
for (const name of ["prod", "dev"]) {
  try {
    await client.rename(
      `${shopRoot}/var/cache/${name}`,
      `${shopRoot}/var/cache/_stash-unlock-${name}-${token}`
    );
    try {
      await client.send(`MKD ${shopRoot}/var/cache/${name}`);
    } catch {
      // exists
    }
    console.log("cache stashed", name);
  } catch (e) {
    console.log("cache", name, e.message);
  }
}

for (const f of ["theme.css", "login.css", "main.bundle.js", "login_form.bundle.js"]) {
  const remote = `${shopRoot}/l1ka80lkkixgfknd/themes/new-theme/public/${f}`;
  const loc = path.join(tmp, f);
  await client.downloadTo(loc, remote);
  await client.uploadFrom(loc, remote);
  console.log("retouched", f, (await fs.stat(loc)).size);
}

client.close();
console.log("DONE");
