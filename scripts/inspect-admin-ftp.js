import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(repoRoot, ".env") });

const REMOTE_FILES = [
  "/barbaraalvisi.it/public_html/.htaccess",
  "/barbaraalvisi.it/public_html/l1ka80lkkixgfknd/.htaccess",
  "/barbaraalvisi.it/public_html/app/config/config.yml",
  "/barbaraalvisi.it/public_html/config/defines.inc.php",
  "/barbaraalvisi.it/public_html/config/defines_custom.inc.php",
  "/barbaraalvisi.it/public_html/config/settings.inc.php",
  "/barbaraalvisi.it/public_html/.env",
  "/barbaraalvisi.it/public_html/.env.local",
];

async function main() {
  const client = new Client(30000);
  await client.access({
    host: process.env.FTP_HOST,
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });

  const tmpDir = path.join(repoRoot, ".tmp-admin");
  await fs.mkdir(tmpDir, { recursive: true });

  for (const remote of REMOTE_FILES) {
    const localName = remote.split("/").slice(-2).join("_");
    try {
      await client.downloadTo(path.join(tmpDir, localName), remote);
      const content = await fs.readFile(path.join(tmpDir, localName), "utf8");
      console.log(`\n=== ${remote} ===`);
      for (const line of content.split("\n")) {
        if (/domain|host|url|uri|ssl|media|shop|barbara|http/i.test(line)) {
          console.log(line.trim());
        }
      }
    } catch (error) {
      console.log(`SKIP ${remote}: ${error.message}`);
    }
  }

  client.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
