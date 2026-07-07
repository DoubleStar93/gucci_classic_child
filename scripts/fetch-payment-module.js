import dotenv from "dotenv";
import { Client } from "basic-ftp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const shop = process.env.FTP_REMOTE_PATH.trim().replace(/\/themes\/classic-gucci\/?$/i, "");

async function main() {
  const client = new Client(120_000);
  await client.access({
    host: process.env.FTP_HOST,
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });

  const remote = `${shop}/classes/PaymentModule.php`;
  const local = path.join(__dirname, "..", ".tmp-remote", "PaymentModule.php");
  await client.downloadTo(local, remote);
  client.close();
  console.log("downloaded", local);
}

main().catch(console.error);
