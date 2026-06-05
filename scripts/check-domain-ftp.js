import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(repoRoot, ".env") });

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
  const htaccessPath = path.join(tmpDir, "root-htaccess.txt");

  await client.downloadTo(
    htaccessPath,
    "/barbaraalvisi.it/public_html/.htaccess"
  );

  const content = await fs.readFile(htaccessPath, "utf8");
  const domainLine = content
    .split("\n")
    .find((line) => line.includes("#Domain:"));
  console.log("Root .htaccess domain line:", domainLine?.trim() ?? "not found");

  client.close();
  await fs.unlink(htaccessPath).catch(() => {});
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
