import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const TOKEN =
  "gucci-fix-" +
  createHash("sha256").update("barbaraalvisi-domain-fix-2026").digest("hex").slice(0, 16);

async function main() {
  const client = new Client(60000);
  await client.access({
    host: process.env.FTP_HOST,
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });

  const localScript = path.join(__dirname, "ps-fix-domain.php");
  const adminScript = "/barbaraalvisi.it/public_html/l1ka80lkkixgfknd/ps-fix-domain.php";
  await client.uploadFrom(localScript, adminScript);
  await client.remove("/barbaraalvisi.it/public_html/ps-fix-domain.php").catch(() => {});
  console.log(`Open in browser:\nhttps://barbaraalvisi.it/l1ka80lkkixgfknd/ps-fix-domain.php?token=${TOKEN}`);
  client.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
