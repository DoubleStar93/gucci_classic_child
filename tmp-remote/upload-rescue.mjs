import path from "node:path";
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

await client.uploadFrom(
  "tmp-remote/bo-rte-rescue.js",
  `${shopRoot}/js/admin/bo-rte-rescue.js`
);
await client.uploadFrom(
  "tmp-remote/bo-rte-rescue.css",
  `${shopRoot}/js/admin/bo-rte-rescue.css`
);
console.log("rescue v2.1 uploaded");
client.close();
