import dotenv from "dotenv";
import { Client } from "basic-ftp";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const shop = "/barbaraalvisi.it/public_html";
const suffix = randomBytes(4).toString("hex");

async function main() {
  const client = new Client(120_000);
  await client.access({
    host: process.env.FTP_HOST,
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });

  const mboPath = `${shop}/modules/ps_mbo`;
  const disabled = `${shop}/modules/_ps_mbo_off_${suffix}`;

  try {
    await client.rename(mboPath, disabled);
    console.log(`OK: ${mboPath} → ${disabled}`);
  } catch (error) {
    console.error(`RENAME ps_mbo failed: ${error.message}`);
    const list = await client.list(`${shop}/modules`);
    console.log(
      "mbo-related:",
      list.filter((x) => /mbo/i.test(x.name)).map((x) => x.name).join(", ") || "none"
    );
  }

  const cachePath = `${shop}/var/cache`;
  const stashCache = `${shop}/var/_stash-cache-${suffix}`;
  try {
    await client.rename(cachePath, stashCache);
    await client.ensureDir(cachePath);
    console.log(`OK: cache stashed → ${stashCache}`);
  } catch (error) {
    console.error(`CACHE stash failed: ${error.message}`);
  }

  client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
