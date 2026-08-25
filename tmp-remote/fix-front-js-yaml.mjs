import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");
const staging = (process.env.STAGING_URL || "https://barbaraalvisi.it/")
  .trim()
  .replace(/\/+$/, "");

const client = new Client(90_000);
const tmp = path.join(os.tmpdir(), "fix-front-js-yaml");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

const remote = `${shopRoot}/app/config/config.yml`;
const local = path.join(tmp, "config.yml");
await client.downloadTo(local, remote);
let yml = await fs.readFile(local, "utf8");

const stamp = `9.0.3-fix${Date.now().toString(36)}`;

const assetsBlock = `  assets:
    version: '${stamp}'
    packages:
      front_js:
        base_urls:
          - '${staging}/js'
`;

if (!/^\s*assets:\s*$/m.test(yml)) {
  console.error("assets: block not found");
  process.exit(1);
}

yml = yml.replace(
  /^\s*assets:\s*\n(?:.*\n)*?(?=^\s*# esi|^ {2}secret:)/m,
  assetsBlock + "\n"
);

await fs.writeFile(local, yml, "utf8");
await client.uploadFrom(local, remote);

const i = yml.indexOf("  assets:");
console.log(yml.slice(i, i + 220));

const token = Date.now().toString(36);
try {
  await client.rename(
    `${shopRoot}/var/cache/prod`,
    `${shopRoot}/var/cache/_stash-frontjs-prod-${token}`
  );
  try {
    await client.send(`MKD ${shopRoot}/var/cache/prod`);
  } catch {
    // exists
  }
  console.log("cache prod stashed");
} catch (e) {
  console.log("cache:", e.message);
}

client.close();
console.log("OK");
