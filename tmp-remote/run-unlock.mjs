import { randomBytes } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(repoRoot, ".env") });

const required = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD", "FTP_REMOTE_PATH"];
for (const key of required) {
  if (!process.env[key]?.trim()) throw new Error(`Manca ${key} in .env`);
}

const stagingUrl = (process.env.STAGING_URL || "https://barbaraalvisi.it/")
  .trim()
  .replace(/\/+$/, "");
const themeRemote = process.env.FTP_REMOTE_PATH.trim().replace(/\/+$/, "");
const shopRoot = themeRemote.replace(/\/themes\/[^/]+$/i, "");
const adminDir = "l1ka80lkkixgfknd";
const token = randomBytes(16).toString("hex");

const client = new Client(300_000);
const work = path.join(__dirname, "_unlock-work");
await mkdir(work, { recursive: true });

async function download(remote, name) {
  const local = path.join(work, name);
  await client.downloadTo(local, remote);
  return { local, text: await readFile(local, "utf8") };
}

async function uploadText(remote, text, name) {
  const local = path.join(work, name);
  await writeFile(local, text, "utf8");
  await client.uploadFrom(local, remote);
}

try {
  await client.access({
    host: process.env.FTP_HOST.trim(),
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER.trim(),
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });
  console.log("FTP OK", shopRoot);

  // 1) Fix assets front_js base_path: '../js' → '/js' (path relativi rompono /sell/orders/)
  const configRemote = `${shopRoot}/app/config/config.yml`;
  const { text: configYml } = await download(configRemote, "config.yml");
  let newConfig = configYml;
  if (configYml.includes("base_path: '../js'") || configYml.includes('base_path: "../js"')) {
    newConfig = configYml
      .replace("base_path: '../js'", "base_path: '/js'")
      .replace('base_path: "../js"', "base_path: '/js'");
    await uploadText(configRemote, newConfig, "config.yml.new");
    console.log("OK: app/config/config.yml front_js base_path → /js");
  } else if (configYml.includes("base_path: '/js'")) {
    console.log("SKIP: front_js base_path già /js");
  } else {
    console.log("WARN: pattern front_js base_path non trovato, controllo manuale");
    const idx = configYml.indexOf("front_js");
    console.log(configYml.slice(Math.max(0, idx - 80), idx + 120));
  }

  // 2) Disable debug toolbar in parameters.php (rumore / overhead BO)
  const paramsRemote = `${shopRoot}/app/config/parameters.php`;
  const { text: params } = await download(paramsRemote, "parameters.php");
  if (/['"]use_debug_toolbar['"]\s*=>\s*true/.test(params)) {
    const fixed = params.replace(
      /(['"]use_debug_toolbar['"]\s*=>\s*)true/,
      "$1false"
    );
    await uploadText(paramsRemote, fixed, "parameters.php.new");
    console.log("OK: use_debug_toolbar → false");
  } else {
    console.log("SKIP: use_debug_toolbar già false o assente");
  }

  // 3) Restore minimal preload.tpl for legacy BO head (era 0 byte)
  const preloadTpl = `${shopRoot}/${adminDir}/themes/new-theme/public/preload.tpl`;
  const preloadTwig = `${shopRoot}/${adminDir}/themes/new-theme/public/preload.html.twig`;
  const preloadContent = `{*
 * Preload hints for PrestaShop BO new-theme (restored).
 *}
<link rel="preload" href="{$admin_dir}theme.css" as="style">
<link rel="preload" href="{$admin_dir}main.bundle.js" as="script">
`;
  await uploadText(preloadTpl, preloadContent, "preload.tpl");
  await uploadText(preloadTwig, preloadContent.replace("{$admin_dir}", "{{ admin_dir }}"), "preload.html.twig");
  console.log("OK: preload.tpl / preload.html.twig ripristinati");

  // 4) Upload unlock PHP and execute
  let unlockPhp = await readFile(path.join(__dirname, "unlock-shop.php"), "utf8");
  unlockPhp = unlockPhp.replace("TOKEN_PLACEHOLDER", token);
  const unlockRemote = `${shopRoot}/_unlock_shop_${token}.php`;
  await uploadText(unlockRemote, unlockPhp, "unlock-shop.php");
  console.log("Uploaded", unlockRemote);

  const unlockUrl = `${stagingUrl}/_unlock_shop_${token}.php?token=${token}`;
  console.log("Calling", unlockUrl);
  const res = await fetch(unlockUrl);
  const body = (await res.text()).trim();
  console.log(`Unlock HTTP ${res.status}:\n${body}`);
  if (!body.includes("OK:")) {
    throw new Error(body || `HTTP ${res.status}`);
  }

  try {
    await client.remove(unlockRemote);
    console.log("Installer rimosso");
  } catch {
    console.warn("Rimuovi manualmente:", unlockRemote);
  }

  console.log("\nDone.");
} finally {
  client.close();
}
