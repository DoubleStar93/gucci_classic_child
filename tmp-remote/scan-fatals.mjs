import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");
const client = new Client(180_000);
const tmp = path.join(os.tmpdir(), "php_err3");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

const local = path.join(tmp, "php_errorlog");
await client.downloadTo(local, `${shopRoot}/php_errorlog`);
const t = await fs.readFile(local, "utf8");
const lines = t.split(/\r?\n/);
const fatals = lines.filter((l) =>
  /PHP Fatal|Fatal error|Uncaught Error|Uncaught Exception|No space left|Disk quota exceeded/i.test(l)
);
console.log("total lines", lines.length);
console.log("fatal-like", fatals.length);
for (const l of fatals.slice(-30)) console.log(l);
client.close();
