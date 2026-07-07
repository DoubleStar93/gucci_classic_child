/**
 * Pulisce log PHP e PrestaShop sul server SiteGround via FTP.
 *
 * Uso:
 *   npm run clean:logs                    # dry-run (solo anteprima)
 *   npm run clean:logs -- --apply         # svuota i log sul server
 *   npm run clean:logs -- --apply --keep-days=1   # tiene file modificati nell'ultimo giorno
 *   npm run clean:logs -- --apply --local         # svuota anche tmp/ in locale
 */
import dotenv from "dotenv";
import { Client } from "basic-ftp";
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(repoRoot, ".env") });

const LOG_NAME_RE =
  /^(?:\d{8}_exception\.log|prod-\d{4}-\d{2}-\d{2}\.log|dev-\d{4}-\d{2}-\d{2}\.log)$/i;

const ROOT_LOG_NAMES = new Set(["php_errorlog", "error_log"]);

function parseArgs(argv) {
  const apply = argv.includes("--apply");
  const local = argv.includes("--local");
  const keepDaysArg = argv.find((arg) => arg.startsWith("--keep-days="));
  const keepDays = keepDaysArg ? Math.max(0, Number(keepDaysArg.split("=")[1]) || 0) : 0;

  return { apply, local, keepDays };
}

function getConfig() {
  const required = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD", "FTP_REMOTE_PATH"];
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(`Mancano variabili in .env: ${missing.join(", ")}`);
  }

  const shop = process.env.FTP_REMOTE_PATH.trim().replace(/\/themes\/classic-gucci\/?$/i, "");

  return {
    host: process.env.FTP_HOST.trim(),
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER.trim(),
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
    shop,
    logsDir: `${shop}/var/logs`,
  };
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 1024) {
    return `${bytes || 0} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isRecent(modifiedAt, keepDays) {
  if (!keepDays || !modifiedAt) {
    return false;
  }
  const ageMs = Date.now() - modifiedAt.getTime();
  return ageMs < keepDays * 24 * 60 * 60 * 1000;
}

async function createEmptyUploadFile() {
  const filePath = path.join(os.tmpdir(), `gucci-empty-log-${process.pid}.txt`);
  await writeFile(filePath, "");
  return filePath;
}

async function truncateRemoteFile(client, remotePath, apply) {
  const label = `TRUNCATE ${remotePath}`;
  if (!apply) {
    console.log(`  [dry-run] ${label}`);
    return;
  }

  const emptyFile = await createEmptyUploadFile();
  try {
    await client.uploadFrom(emptyFile, remotePath);
    console.log(`  OK ${label}`);
  } finally {
    await unlink(emptyFile).catch(() => {});
  }
}

async function removeRemoteFile(client, remotePath, apply) {
  const label = `DELETE ${remotePath}`;
  if (!apply) {
    console.log(`  [dry-run] ${label}`);
    return;
  }

  await client.remove(remotePath);
  console.log(`  OK ${label}`);
}

async function collectRemoteLogs(client, config, keepDays) {
  const actions = [];

  for (const name of ROOT_LOG_NAMES) {
    const remotePath = `${config.shop}/${name}`;
    try {
      const size = await client.size(remotePath);
      if (size > 0) {
        actions.push({ remotePath, size, mode: "truncate", reason: "log PHP root" });
      }
    } catch {
      // File assente.
    }
  }

  let entries = [];
  try {
    entries = await client.list(config.logsDir);
  } catch (error) {
    console.warn(`var/logs non accessibile: ${error.message}`);
    return actions;
  }

  for (const entry of entries) {
    if (!entry.isFile || !LOG_NAME_RE.test(entry.name)) {
      continue;
    }

    if (isRecent(entry.modifiedAt, keepDays)) {
      console.log(`  skip (recente): ${entry.name}`);
      continue;
    }

    actions.push({
      remotePath: `${config.logsDir}/${entry.name}`,
      size: entry.size || 0,
      mode: "truncate",
      reason: "log PrestaShop var/logs",
    });
  }

  return actions;
}

async function cleanLocalTmp(apply) {
  const tmpDir = path.join(repoRoot, "tmp");
  let names = [];
  try {
    names = await readdir(tmpDir);
  } catch {
    return 0;
  }

  const targets = names.filter((name) =>
    /^(remote-log(?:-tail)?\.txt|php_errorlog|\d{8}_exception\.log|prod-\d{4}-\d{2}-\d{2}\.log|exception-today\.log)$/i.test(
      name
    )
  );

  if (!targets.length) {
    return 0;
  }

  console.log(`\nLocale (${tmpDir}):`);
  for (const name of targets) {
    const filePath = path.join(tmpDir, name);
    if (!apply) {
      console.log(`  [dry-run] DELETE ${filePath}`);
      continue;
    }
    await unlink(filePath);
    console.log(`  OK DELETE ${filePath}`);
  }

  return targets.length;
}

async function main() {
  const { apply, local, keepDays } = parseArgs(process.argv.slice(2));
  const config = getConfig();

  console.log(`Pulizia log → ${config.host}`);
  console.log(`  Shop:      ${config.shop}`);
  console.log(`  Modalità:  ${apply ? "APPLY" : "dry-run (aggiungi --apply)"}`);
  console.log(`  Keep days: ${keepDays}`);

  const client = new Client(120_000);
  await client.access({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    secure: config.secure,
  });

  const actions = await collectRemoteLogs(client, config, keepDays);

  if (!actions.length) {
    console.log("\nNessun log remoto da pulire.");
  } else {
    console.log(`\nRemoto: ${actions.length} file`);
    let totalBytes = 0;
    for (const action of actions) {
      totalBytes += action.size;
      console.log(
        `  ${formatBytes(action.size).padStart(8)}  ${action.mode.toUpperCase()}  ${action.remotePath}`
      );
    }
    console.log(`  Totale stimato: ${formatBytes(totalBytes)}`);

    for (const action of actions) {
      if (action.mode === "delete") {
        await removeRemoteFile(client, action.remotePath, apply);
      } else {
        await truncateRemoteFile(client, action.remotePath, apply);
      }
    }
  }

  if (local) {
    await cleanLocalTmp(apply);
  }

  client.close();

  if (!apply) {
    console.log("\nDry-run completato. Esegui con --apply per applicare.");
  } else {
    console.log("\nPulizia completata.");
  }
}

main().catch((error) => {
  console.error("\nPulizia log fallita:", error.message);
  process.exit(1);
});
