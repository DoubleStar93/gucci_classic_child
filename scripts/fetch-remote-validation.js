import dotenv from "dotenv";
import { Client } from "basic-ftp";
import { mkdir } from "node:fs/promises";
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

  const outDir = path.join(__dirname, "..", ".tmp-remote");
  await mkdir(outDir, { recursive: true });

  const files = [
    `${shop}/modules/ps_wirepayment/controllers/front/validation.php`,
    `${shop}/override/modules/ps_wirepayment/controllers/front/validation.php`,
    `${shop}/var/cache/prod/class_index.php`,
  ];

  for (const remote of files) {
    const local = path.join(outDir, remote.replace(/[\\/]/g, "_"));
    try {
      await client.downloadTo(local, remote);
      console.log("OK", remote, "->", path.basename(local));
    } catch (error) {
      console.log("ERR", remote, error.message);
    }
  }

  client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
