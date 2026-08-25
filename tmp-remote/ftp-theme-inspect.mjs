import path from "node:path";
import fs from "node:fs/promises";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");
const client = new Client(60_000);
await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});
const local = path.join(process.cwd(), "tmp-remote", "theme.min.js");
await client.downloadTo(local, `${shopRoot}/js/tiny_mce/themes/modern/theme.min.js`);
const s = await fs.readFile(local, "utf8");
console.log("size", s.length);
console.log("start", s.slice(0, 280));
const i = s.indexOf("ThemeManager");
console.log("TM", i, s.slice(Math.max(0, i - 40), i + 200));
console.log("has add modern quote", s.includes("add('modern'") || s.includes('add("modern"'));
client.close();
