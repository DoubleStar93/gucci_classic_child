import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(repoRoot, ".env") });

const STASH_PREFIX = "_stash-";

function getConfig() {
  const required = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD", "FTP_REMOTE_PATH"];
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(`Mancano variabili in .env: ${missing.join(", ")}`);
  }

  const remotePath = process.env.FTP_REMOTE_PATH.trim().replace(/\/+$/, "");
  const cachePaths = parseCachePaths();

  const scanDirs = new Set([
    path.posix.dirname(remotePath),
    ...cachePaths.map((p) => path.posix.dirname(p)),
  ]);

  return {
    host: process.env.FTP_HOST.trim(),
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER.trim(),
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
    scanDirs: [...scanDirs],
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

async function listDir(client) {
  return (await client.list()).filter((entry) => entry.name !== "." && entry.name !== "..");
}

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

async function removeRemoteFolder(client, folderName, parentDir) {
  const absolute = path.posix.join(parentDir, folderName);
  const startDir = await client.pwd();

  try {
    await client.cd(parentDir);
  } catch {
    console.log(`Parent assente (${parentDir}), skip.`);
    return false;
  }

  const exists = (await listDir(client)).some((entry) => entry.name === folderName);
  if (!exists) {
    return false;
  }

  console.log(`Elimino ${absolute}...`);
  await client.cd(folderName);
  await emptyCurrentDirectory(client);
  await client.cdup();
  await client.removeDir(folderName);
  console.log(`  rimosso.`);
  await client.cd(startDir);
  return true;
}

async function findStashFolders(client, parentDir) {
  const startDir = await client.pwd();

  try {
    await client.cd(parentDir);
  } catch {
    console.log(`Directory non accessibile: ${parentDir}`);
    return [];
  }

  const stash = (await listDir(client))
    .filter((entry) => entry.isDirectory && entry.name.startsWith(STASH_PREFIX))
    .map((entry) => entry.name);

  await client.cd(startDir);
  return stash;
}

async function main() {
  const config = getConfig();
  const client = new Client(600_000);
  client.ftp.verbose = process.env.FTP_VERBOSE === "true";

  console.log(`Pulizia _stash-* → ${config.host}`);
  console.log(`  Directory: ${config.scanDirs.join(", ")}`);

  let removed = 0;

  try {
    await client.access({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      secure: config.secure,
    });

    for (const parentDir of config.scanDirs) {
      const stashFolders = await findStashFolders(client, parentDir);
      if (!stashFolders.length) {
        console.log(`\n${parentDir}: nessuna cartella _stash-*`);
        continue;
      }

      console.log(`\n${parentDir}: ${stashFolders.length} cartella/e _stash-*`);
      for (const name of stashFolders) {
        if (await removeRemoteFolder(client, name, parentDir)) {
          removed += 1;
        }
      }
    }

    console.log(`\nPulizia completata: ${removed} cartella/e rimossa/e.`);
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error("\nPulizia fallita:", error.message);
  process.exit(1);
});
