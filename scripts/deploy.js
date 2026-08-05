import { randomBytes } from "node:crypto";
import { access, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(repoRoot, ".env") });

const localThemeDir = path.join(repoRoot, "barbaraalvisi");
const localOverrideDir = path.join(repoRoot, "override");
const localModulesDir = path.join(repoRoot, "modules");
/** Moduli sincronizzati insieme al tema (override: FTP_DEPLOY_MODULES in .env) */
const deployModules = (process.env.FTP_DEPLOY_MODULES || "everpspopup,barbaraalvisi_homecategories")
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);

const requiredEnv = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD", "FTP_REMOTE_PATH"];

function getConfig() {
  const missing = requiredEnv.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(
      `Mancano variabili in .env: ${missing.join(", ")}. Copia .env.example → .env`
    );
  }

  return {
    host: process.env.FTP_HOST.trim(),
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER.trim(),
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
    remotePath: process.env.FTP_REMOTE_PATH.trim().replace(/\/+$/, ""),
    cachePaths: parseCachePaths(),
    /** stash = rinomina cache (veloce) | delete = svuota ricorsivamente (lento) */
    cacheMode: (process.env.FTP_CACHE_MODE || "stash").trim().toLowerCase(),
    /**
     * stash = rinomina tema + upload completo (veloce, no orphan)
     * sync  = solo file nuovi/modificati (più veloce, può lasciare orphan)
     * delete = elimina ricorsivamente + upload completo (lento)
     */
    themeMode: (process.env.FTP_THEME_MODE || "stash").trim().toLowerCase(),
  };
}

function parseCachePaths() {
  const raw =
    process.env.FTP_CACHE_PATHS?.trim() ||
    process.env.FTP_CACHE_PATH?.trim() ||
    "/var/cache,/cache";

  return [
    ...new Set(
      raw
        .split(",")
        .map((part) => part.trim().replace(/\/+$/, ""))
        .filter(Boolean)
    ),
  ];
}

function splitRemotePath(remotePath) {
  const normalized = remotePath.replace(/\\/g, "/");
  const parent = path.posix.dirname(normalized);
  const name = path.posix.basename(normalized);

  if (!name) {
    throw new Error(`Percorso remoto non valido: ${remotePath}`);
  }

  return {
    parent: parent === "." ? "/" : parent,
    name,
    absolute: normalized.startsWith("/") ? normalized : `/${normalized}`,
  };
}

async function listDir(client) {
  return (await client.list()).filter((entry) => entry.name !== "." && entry.name !== "..");
}

/** Svuota ricorsivamente la directory corrente (non la rimuove). */
async function emptyCurrentDirectory(client) {
  for (const entry of await listDir(client)) {
    try {
      if (entry.isDirectory) {
        await client.cd(entry.name);
        await emptyCurrentDirectory(client);
        await client.cdup();
        await client.removeDir(entry.name);
      } else {
        await client.remove(entry.name);
      }
    } catch (error) {
      console.warn(`  skip ${entry.name}: ${error.message}`);
    }
  }
}

/**
 * Elimina un'intera cartella remota: entra nel parent, svuota il contenuto, removeDir una volta.
 */
async function removeRemoteFolder(client, remotePath, label) {
  const { parent, name, absolute } = splitRemotePath(remotePath);
  const startDir = await client.pwd();

  try {
    await client.cd(parent);
  } catch {
    console.log(`${label}: parent assente (${parent}), skip.`);
    return;
  }

  const exists = (await listDir(client)).some((entry) => entry.name === name);
  if (!exists) {
    console.log(`${label}: ${absolute} assente, skip.`);
    return;
  }

  console.log(`${label}: eliminazione cartella ${absolute}...`);
  await client.cd(name);
  await emptyCurrentDirectory(client);
  await client.cdup();
  await client.removeDir(name);
  console.log(`${label}: cartella rimossa.`);
  await client.cd(startDir);
}

function buildStashName(folderName) {
  const stamp = Date.now().toString(36);
  const rand = randomBytes(4).toString("hex");
  return `_stash-${folderName}-${stamp}-${rand}`;
}

/**
 * Stash istantaneo: rinomina la cartella remota e ne crea una vuota.
 * Le cartelle _stash-* restano sul server (sporco accumulato, ok in sviluppo).
 */
async function stashRemoteFolder(client, remotePath, label) {
  const { parent, name, absolute } = splitRemotePath(remotePath);
  const startDir = await client.pwd();
  const stashName = buildStashName(name);

  try {
    await client.cd(parent);
  } catch {
    console.log(`${label}: parent assente (${parent}), skip.`);
    return;
  }

  const exists = (await listDir(client)).some((entry) => entry.name === name);
  if (!exists) {
    console.log(`${label}: ${absolute} assente, creo cartella vuota.`);
    await client.cd(startDir);
    await ensureRemoteDir(client, absolute);
    return;
  }

  console.log(`${label}: stash ${absolute} → ${path.posix.join(parent, stashName)}`);
  await client.rename(name, stashName);
  await ensureRemoteDir(client, absolute);
  console.log(`${label}: nuova cartella vuota ${absolute}`);
  await client.cd(startDir);
}

async function clearRemoteCacheFolder(client, remotePath, label, mode) {
  if (mode === "delete") {
    await removeRemoteFolder(client, remotePath, label);
    await ensureRemoteDir(client, remotePath);
    return;
  }
  await stashRemoteFolder(client, remotePath, label);
}

async function ensureRemoteDir(client, remoteDir) {
  const parts = remoteDir.split("/").filter(Boolean);
  let current = "";

  for (const part of parts) {
    current += `/${part}`;
    try {
      await client.send(`MKD ${current}`);
    } catch {
      // Esiste già.
    }
  }
}

async function walkLocalFiles(localDir) {
  const files = [];

  async function walk(currentDir, relativeDir = "") {
    for (const entry of await readdir(currentDir, { withFileTypes: true })) {
      const rel = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
      const abs = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(abs, rel);
      } else if (entry.isFile()) {
        files.push({ local: abs, rel });
      }
    }
  }

  await walk(localDir);
  return files;
}

async function getRemoteFileSize(client, remoteFile) {
  try {
    return await client.size(remoteFile);
  } catch {
    return null;
  }
}

/** Carica solo file nuovi o con dimensione diversa (veloce per piccole modifiche). */
async function syncThemeTree(client, remotePath, localDir) {
  const files = await walkLocalFiles(localDir);
  let uploaded = 0;
  let skipped = 0;

  console.log(`Sync: ${files.length} file locali → ${remotePath}`);

  for (const { local, rel } of files) {
    const remoteFile = `${remotePath}/${rel}`;
    const localSize = (await stat(local)).size;
    const remoteSize = await getRemoteFileSize(client, remoteFile);

    if (remoteSize === localSize) {
      skipped += 1;
      continue;
    }

    await ensureRemoteDir(client, path.posix.dirname(remoteFile));
    await client.uploadFrom(local, remoteFile);
    uploaded += 1;
  }

  console.log(`Sync completato: ${uploaded} caricati, ${skipped} invariati.`);
}

async function uploadThemeTree(client, remotePath, localDir) {
  await ensureRemoteDir(client, remotePath);
  console.log(`Upload: ${localDir} → ${remotePath}`);
  await client.uploadFromDir(localDir, remotePath);
  console.log("Upload completato.");
}

async function deployTheme(client, remotePath, localDir, mode) {
  if (mode === "sync") {
    await syncThemeTree(client, remotePath, localDir);
    return;
  }

  if (mode === "delete") {
    await removeRemoteFolder(client, remotePath, "Tema");
  } else {
    await stashRemoteFolder(client, remotePath, "Tema");
  }

  await uploadThemeTree(client, remotePath, localDir);
}

function getShopRootFromThemePath(themeRemotePath) {
  return themeRemotePath.replace(/\/themes\/(classic-gucci|barbaraalvisi)\/?$/i, "");
}

async function deployModulesToServer(client, themeRemotePath) {
  if (!deployModules.length) {
    return;
  }

  const shopRoot = getShopRootFromThemePath(themeRemotePath);

  for (const moduleName of deployModules) {
    const localModuleDir = path.join(localModulesDir, moduleName);
    const remoteModulePath = `${shopRoot}/modules/${moduleName}`;

    try {
      await access(localModuleDir);
    } catch {
      console.warn(`Modulo ${moduleName}: cartella locale non trovata, skip.`);
      continue;
    }

    const remoteEntries = await listRemoteDirSafe(client, remoteModulePath);
    const remoteFileCount = remoteEntries.filter((e) => e.isFile).length;
    const localFiles = await walkLocalFiles(localModuleDir);

    if (remoteFileCount < Math.min(3, localFiles.length)) {
      console.log(`Modulo ${moduleName}: ${remoteModulePath} (upload completo — cartella remota vuota/incompleta)`);
      await ensureRemoteDir(client, remoteModulePath);
      await client.uploadFromDir(localModuleDir, remoteModulePath);
      console.log(`Modulo ${moduleName}: upload completato (${localFiles.length} file).`);
      continue;
    }

    console.log(`Modulo ${moduleName}: ${remoteModulePath} (sync)`);
    await syncThemeTree(client, remoteModulePath, localModuleDir);
  }
}

async function listRemoteDirSafe(client, remotePath) {
  const startDir = await client.pwd();
  try {
    await client.cd(remotePath);
    return await listDir(client);
  } catch {
    return [];
  } finally {
    await client.cd(startDir);
  }
}

async function deployOverride(client, themeRemotePath) {
  const shopRoot = getShopRootFromThemePath(themeRemotePath);
  const remoteOverridePath = `${shopRoot}/override`;

  await removeLegacyOverrideFiles(client, remoteOverridePath);

  try {
    await access(localOverrideDir);
  } catch {
    console.log("Override: cartella locale assente, solo rimozione legacy sul server.");
    return;
  }

  console.log(`Override: ${remoteOverridePath} (sync)`);
  await syncThemeTree(client, remoteOverridePath, localOverrideDir);
}

/** File override PHP rimossi dal repo — vanno eliminati anche sul server. */
const LEGACY_OVERRIDE_FILES = [
  "controllers/front/IndexController.php",
  "controllers/front/OrderController.php",
  "modules/ps_shoppingcart/ps_shoppingcart.php",
  "modules/ps_featuredproducts/ps_featuredproducts.php",
  "modules/ps_bestsellers/ps_bestsellers.php",
  "modules/ps_newproducts/ps_newproducts.php",
  "modules/ps_specials/ps_specials.php",
  "modules/ps_wirepayment/controllers/front/validation.php",
];

async function removeLegacyOverrideFiles(client, remoteOverridePath) {
  for (const rel of LEGACY_OVERRIDE_FILES) {
    const remoteFile = `${remoteOverridePath}/${rel}`;
    try {
      await client.remove(remoteFile);
      console.log(`Override legacy rimosso: ${rel}`);
    } catch {
      // File già assente.
    }
  }
}

function getModuleRemotePath(themeRemotePath) {
  return getShopRootFromThemePath(themeRemotePath) + "/modules/barbaraalvisi_homecategories";
}

async function ensureBarbaraalvisiThemeAndModules(client, themeRemotePath, stagingUrl) {
  const shopRoot = getShopRootFromThemePath(themeRemotePath);
  const localInstaller = path.join(repoRoot, "scripts", "barbaraalvisi-activate-theme.php");
  const remoteInstaller = `${shopRoot}/barbaraalvisi-activate-theme.php`;
  const token =
    process.env.BARBARAALVISI_THEME_ACTIVATE_TOKEN?.trim() || "barbaraalvisi-theme-activate";

  try {
    await access(localInstaller);
    await client.uploadFrom(localInstaller, remoteInstaller);

    const installUrl = `${stagingUrl.replace(/\/+$/, "")}/barbaraalvisi-activate-theme.php?token=${encodeURIComponent(token)}`;
    const response = await fetch(installUrl, { redirect: "follow" });
    const body = (await response.text()).trim();
    const summary = body.replace(/\s+/g, " ").slice(0, 400);
    console.log(`tema/moduli barbaraalvisi: ${summary || `HTTP ${response.status}`}`);
  } catch (error) {
    console.warn(
      `Attivazione tema barbaraalvisi: ${error.message} — verifica BO → Design → Tema.`
    );
  } finally {
    try {
      await client.remove(remoteInstaller);
    } catch {
      // Installer già rimosso o non caricato.
    }
  }
}

async function main() {
  const config = getConfig();

  try {
    await access(localThemeDir);
  } catch {
    throw new Error(`Cartella tema non trovata: ${localThemeDir}`);
  }

  const client = new Client(600_000);
  client.ftp.verbose = process.env.FTP_VERBOSE === "true";

  console.log(`Deploy → ${config.host}`);
  console.log(`  Tema:  ${config.remotePath} (${config.themeMode})`);
  console.log(`  Cache: ${config.cachePaths.join(", ")} (${config.cacheMode})`);

  try {
    await client.access({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      secure: config.secure,
    });

    await deployTheme(client, config.remotePath, localThemeDir, config.themeMode);
    await deployOverride(client, config.remotePath);
    await deployModulesToServer(client, config.remotePath);

    const verifyUrl =
      process.env.STAGING_URL?.trim() || "https://barbaraalvisi.it/";
    await ensureBarbaraalvisiThemeAndModules(client, config.remotePath, verifyUrl);

    for (const cachePath of config.cachePaths) {
      const label = cachePath === "/cache" ? "Cache root (/cache)" : `Cache (${cachePath})`;
      try {
        await clearRemoteCacheFolder(client, cachePath, label, config.cacheMode);
      } catch (error) {
        console.warn(
          `${label}: ${error.message} — prova BO → Parametri avanzati → Prestazioni → Svuota cache.`
        );
      }
    }

    console.log("\nDeploy completato.");
    console.log(`Verifica: ${verifyUrl}`);
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error("\nDeploy fallito:", error.message);
  process.exit(1);
});
