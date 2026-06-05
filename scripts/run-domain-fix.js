import dotenv from "dotenv";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(repoRoot, ".env") });

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
  const remoteScript = "/barbaraalvisi.it/public_html/ps-fix-domain.php";
  await client.uploadFrom(localScript, remoteScript);
  console.log("Uploaded fix script");

  const url = `https://barbaraalvisi.it/ps-fix-domain.php?token=${TOKEN}`;
  console.log("Running:", url);
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });
  const text = await response.text();
  console.log("Status:", response.status);
  console.log(text);

  client.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
