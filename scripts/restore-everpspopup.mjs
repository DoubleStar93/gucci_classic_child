import { randomBytes } from "node:crypto";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(repoRoot, ".env") });

function getShopRoot(themeRemotePath) {
  return themeRemotePath.replace(/\/themes\/classic-gucci\/?$/i, "");
}

async function main() {
  for (const key of ["FTP_HOST", "FTP_USER", "FTP_PASSWORD", "FTP_REMOTE_PATH"]) {
    if (!process.env[key]?.trim()) {
      throw new Error(`Manca ${key} in .env`);
    }
  }

  const stagingUrl = (process.env.STAGING_URL || "https://barbaraalvisi.it").trim().replace(/\/+$/, "");
  const themeRemote = process.env.FTP_REMOTE_PATH.trim().replace(/\/+$/, "");
  const shopRoot = getShopRoot(themeRemote);
  const localModule = path.join(repoRoot, "modules", "everpspopup");
  const remoteModule = `${shopRoot}/modules/everpspopup`;
  const token = randomBytes(16).toString("hex");
  const installLocal = path.join(__dirname, "prestashop-install-everpspopup.php");
  const installRemote = `${shopRoot}/_gucci_install_everpspopup_${token}.php`;

  await access(localModule);
  await access(installLocal);

  const client = new Client(600_000);
  await client.access({
    host: process.env.FTP_HOST.trim(),
    user: process.env.FTP_USER.trim(),
    password: process.env.FTP_PASSWORD,
    port: Number(process.env.FTP_PORT || 21),
    secure: process.env.FTP_SECURE === "true",
  });

  try {
    console.log(`Upload everpspopup → ${remoteModule}`);
    await client.uploadFromDir(localModule, remoteModule);

    console.log(`Upload installer → ${installRemote}`);
    await client.uploadFrom(installLocal, installRemote);

    const installUrl = `${stagingUrl}/_gucci_install_everpspopup_${token}.php?token=${token}${process.argv.includes('--force') ? '&force=1' : ''}`;
    const res = await fetch(installUrl);
    const body = (await res.text()).trim();
    console.log(`Install (${res.status}): ${body}`);

    if (!body.startsWith("OK")) {
      throw new Error(body || `HTTP ${res.status}`);
    }

    try {
      await client.remove(installRemote);
      console.log("Installer remoto rimosso.");
    } catch {
      console.warn("Rimuovi manualmente:", installRemote);
    }
  } finally {
    client.close();
  }

  console.log(`Popup pronto: ${stagingUrl}/index.php`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
