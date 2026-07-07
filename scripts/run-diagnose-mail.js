/**
 * Carica gucci-diagnose-mail.php sul server, legge output, rimuove file.
 *   node scripts/run-diagnose-mail.js
 *   node scripts/run-diagnose-mail.js --probe
 */
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(repoRoot, ".env") });

const TOKEN = "gucci-mail-diag-2026";
const LOCAL_SCRIPT = path.join(repoRoot, "scripts", "gucci-diagnose-mail.php");
const REMOTE_SCRIPT = "/barbaraalvisi.it/public_html/gucci-diagnose-mail.php";

function getShopUrl() {
  return (process.env.STAGING_URL || "https://barbaraalvisi.it/").replace(/\/+$/, "");
}

async function main() {
  const probe = process.argv.includes("--probe");
  const required = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD"];
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(`Mancano in .env: ${missing.join(", ")}`);
  }

  const client = new Client(60000);
  await client.access({
    host: process.env.FTP_HOST.trim(),
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER.trim(),
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });

  try {
    await client.uploadFrom(LOCAL_SCRIPT, REMOTE_SCRIPT);
    const params = new URLSearchParams({ token: TOKEN });
    if (probe) {
      params.set("smtp_probe", "1");
    }
    const url = `${getShopUrl()}/gucci-diagnose-mail.php?${params.toString()}`;
    console.log("URL:", url);
    console.log("─".repeat(72));

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/plain,*/*",
      },
      signal: AbortSignal.timeout(30000),
    });
    const text = await response.text();
    console.log("HTTP", response.status);
    console.log(text);

    if (!response.ok) {
      process.exit(1);
    }
  } finally {
    try {
      await client.remove(REMOTE_SCRIPT);
      console.log("\nScript diagnostico rimosso dal server.");
    } catch {
      console.warn("\nATTENZIONE: rimuovi manualmente gucci-diagnose-mail.php dal server.");
    }
    client.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
