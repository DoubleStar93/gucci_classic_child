import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");

/** Keep logs from this date inclusive (UTC date in filename / log line). */
const CUTOFF = new Date(Date.UTC(2026, 7, 6)); // 2026-08-06

const client = new Client(300_000);
const tmp = path.join(os.tmpdir(), "ps-log-clean");
await fs.mkdir(tmp, { recursive: true });

function parseFileDate(name) {
  // prod-2026-08-17.log / dev-2026-06-18.log / ps_accounts-2026-06-05
  let m = name.match(/(?:^|-)(\d{4})-(\d{2})-(\d{2})(?:\.|$)/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  // 20260805_exception.log
  m = name.match(/^(\d{4})(\d{2})(\d{2})_/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return null;
}

async function listSafe(dir) {
  try {
    await client.cd(dir);
    return (await client.list()).filter((e) => e.name !== "." && e.name !== "..");
  } catch (e) {
    return { error: e.message };
  }
}

async function removeFile(remote) {
  try {
    await client.remove(remote);
    console.log("DELETED", remote);
    return true;
  } catch (e) {
    console.warn("FAIL delete", remote, e.message);
    return false;
  }
}

function lineDate(line) {
  // [17-Aug-2026 13:45:24 Europe/Rome]
  let m = line.match(/\[(\d{2})-([A-Za-z]{3})-(\d{4})\s/);
  if (m) {
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const mon = months[m[2]];
    if (mon != null) return new Date(Date.UTC(+m[3], mon, +m[1]));
  }
  // [2026-08-17T13:50:17...
  m = line.match(/\[(\d{4})-(\d{2})-(\d{2})T/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  // 2026/08/05 -
  m = line.match(/(\d{4})\/(\d{2})\/(\d{2})/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return null;
}

try {
  await client.access({
    host: process.env.FTP_HOST.trim(),
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER.trim(),
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });
  console.log("FTP OK — cutoff >=", CUTOFF.toISOString().slice(0, 10));

  let deleted = 0;
  let kept = 0;

  const logsDir = `${shopRoot}/var/logs`;
  const entries = await listSafe(logsDir);
  if (!Array.isArray(entries)) throw new Error(entries.error);

  console.log(`\nScanning ${logsDir} (${entries.length} entries)...`);
  for (const e of entries) {
    if (!e.isFile) continue;
    const d = parseFileDate(e.name);
    const remote = `${logsDir}/${e.name}`;
    if (!d) {
      console.log("SKIP (no date in name):", e.name, "size=", e.size);
      kept += 1;
      continue;
    }
    if (d < CUTOFF) {
      if (await removeFile(remote)) deleted += 1;
    } else {
      console.log("KEEP", e.name, d.toISOString().slice(0, 10), "size=", e.size);
      kept += 1;
    }
  }

  // Truncate php_errorlog (root + admin) keeping lines >= cutoff
  for (const rel of ["php_errorlog", "l1ka80lkkixgfknd/php_errorlog"]) {
    const remote = `${shopRoot}/${rel}`;
    try {
      const size = await client.size(remote);
      console.log(`\nTruncating ${rel} (was ${size} bytes)...`);
      const localIn = path.join(tmp, rel.replace(/[\\/]/g, "_") + ".in");
      const localOut = path.join(tmp, rel.replace(/[\\/]/g, "_") + ".out");
      await client.downloadTo(localIn, remote);
      const text = await fs.readFile(localIn, "utf8");
      const lines = text.split(/\r?\n/);
      let lastDate = null;
      const keptLines = [];
      for (const line of lines) {
        const d = lineDate(line);
        if (d) lastDate = d;
        // keep undated lines only if last known date is >= cutoff (continuation of stack)
        const effective = d || lastDate;
        if (effective && effective >= CUTOFF) keptLines.push(line);
        else if (!effective) {
          // no date seen yet — drop (old head of file)
        }
      }
      const out = keptLines.join("\n").replace(/\n+$/, "") + (keptLines.length ? "\n" : "");
      await fs.writeFile(localOut, out, "utf8");
      await client.uploadFrom(localOut, remote);
      console.log(
        `OK ${rel}: kept ${keptLines.length}/${lines.length} lines, now ${Buffer.byteLength(out)} bytes`
      );
    } catch (e) {
      console.log(`skip ${rel}: ${e.message}`);
    }
  }

  console.log(`\nDone. Deleted dated log files: ${deleted}. Kept: ${kept}.`);
} finally {
  client.close();
}
