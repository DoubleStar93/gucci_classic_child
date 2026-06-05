import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(repoRoot, ".env") });

const STASH_PREFIX = "_stash-";
const NOOP_EVERY = 75;
const MAX_RETRIES = 3;

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

function isConnectionError(error) {
  const msg = error?.message || "";
  return (
    msg.includes("closed") ||
    msg.includes("FIN packet") ||
    msg.includes("Timeout") ||
    msg.includes("ECONNRESET") ||
    msg.includes("EPIPE")
  );
}

class FtpSession {
  constructor(config) {
    this.config = config;
    this.client = this.createClient();
  }

  createClient() {
    const client = new Client(900_000);
    client.ftp.verbose = process.env.FTP_VERBOSE === "true";
    return client;
  }

  async connect() {
    this.client.close();
    this.client = this.createClient();
    await this.client.access({
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      password: this.config.password,
      secure: this.config.secure,
    });
  }

  async ensureConnected() {
    try {
      await this.client.pwd();
    } catch {
      console.log("  riconnessione FTP...");
      await this.connect();
    }
  }

  async noop() {
    await this.ensureConnected();
    await this.client.send("NOOP");
  }

  close() {
    this.client.close();
  }
}

async function withRetry(session, label, fn) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await session.ensureConnected();
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isConnectionError(error) || attempt === MAX_RETRIES) {
        throw error;
      }
      console.warn(`  ${label}: tentativo ${attempt}/${MAX_RETRIES} fallito (${error.message})`);
      await session.connect();
    }
  }

  throw lastError;
}

async function listDir(session, absDir) {
  return withRetry(session, `list ${absDir}`, async () => {
    await session.client.cd(absDir);
    return (await session.client.list()).filter(
      (entry) => entry.name !== "." && entry.name !== ".."
    );
  });
}

async function emptyDirectory(session, absDir, counter = { files: 0 }) {
  const entries = await listDir(session, absDir);

  for (const entry of entries) {
    const entryPath = path.posix.join(absDir, entry.name);

    await withRetry(session, `delete ${entryPath}`, async () => {
      if (entry.isDirectory) {
        await emptyDirectory(session, entryPath, counter);
        await session.client.cd(absDir);
        await session.client.removeDir(entry.name);
      } else {
        await session.client.cd(absDir);
        await session.client.remove(entry.name);
        counter.files += 1;
        if (counter.files % NOOP_EVERY === 0) {
          await session.noop();
        }
      }
    });
  }
}

async function removeRemoteFolder(session, folderName, parentDir) {
  const absolute = path.posix.join(parentDir, folderName);

  const exists = await withRetry(session, `check ${absolute}`, async () => {
    const entries = await listDir(session, parentDir);
    return entries.some((entry) => entry.name === folderName);
  });

  if (!exists) {
    return false;
  }

  console.log(`Elimino ${absolute}...`);
  await withRetry(session, `remove ${absolute}`, async () => {
    await emptyDirectory(session, absolute);
    await session.client.cd(parentDir);
    await session.client.removeDir(folderName);
  });
  console.log("  rimosso.");
  return true;
}

async function findStashFolders(session, parentDir) {
  try {
    const entries = await listDir(session, parentDir);
    return entries
      .filter((entry) => entry.isDirectory && entry.name.startsWith(STASH_PREFIX))
      .map((entry) => entry.name);
  } catch {
    console.log(`Directory non accessibile: ${parentDir}`);
    return [];
  }
}

async function main() {
  const config = getConfig();
  const session = new FtpSession(config);

  console.log(`Pulizia _stash-* → ${config.host}`);
  console.log(`  Directory: ${config.scanDirs.join(", ")}`);

  let removed = 0;
  let failed = 0;

  try {
    await session.connect();

    for (const parentDir of config.scanDirs) {
      const stashFolders = await findStashFolders(session, parentDir);
      if (!stashFolders.length) {
        console.log(`\n${parentDir}: nessuna cartella _stash-*`);
        continue;
      }

      console.log(`\n${parentDir}: ${stashFolders.length} cartella/e _stash-*`);
      for (const name of stashFolders) {
        try {
          if (await removeRemoteFolder(session, name, parentDir)) {
            removed += 1;
          }
        } catch (error) {
          failed += 1;
          console.warn(`  errore su ${name}: ${error.message}`);
        }
      }
    }

    console.log(`\nPulizia completata: ${removed} rimossa/e, ${failed} fallita/e.`);
    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    session.close();
  }
}

main().catch((error) => {
  console.error("\nPulizia fallita:", error.message);
  process.exit(1);
});
