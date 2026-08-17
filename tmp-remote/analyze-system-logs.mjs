import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");

const client = new Client(180_000);
const tmp = path.join(os.tmpdir(), "ps-syslogs");
await fs.mkdir(tmp, { recursive: true });

async function listSafe(dir) {
  try {
    await client.cd(dir);
    return (await client.list()).filter((e) => e.name !== "." && e.name !== "..");
  } catch (e) {
    return { error: e.message };
  }
}

async function download(remote, name) {
  const local = path.join(tmp, name.replace(/[\\/]/g, "_"));
  await client.downloadTo(local, remote);
  return fs.readFile(local, "utf8");
}

function summarize(text, label) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const buckets = {
    fatal: [],
    exception: [],
    critical: [],
    error: [],
    warning: [],
    deprecated: 0,
    other: [],
  };

  for (const line of lines) {
    if (/PHP Deprecated|User Deprecated|php\.INFO.*Deprecated/i.test(line)) {
      buckets.deprecated += 1;
      continue;
    }
    if (/PHP Fatal|Fatal error/i.test(line)) buckets.fatal.push(line);
    else if (/Uncaught|exception\.CRITICAL|request\.CRITICAL/i.test(line))
      buckets.exception.push(line);
    else if (/CRITICAL/i.test(line)) buckets.critical.push(line);
    else if (/\bERROR\b|PHP Warning|PHP Notice|request\.ERROR|\*ERROR\*/i.test(line))
      buckets.error.push(line);
    else if (/WARNING|warning/i.test(line)) buckets.warning.push(line);
  }

  const uniq = (arr) => {
    const map = new Map();
    for (const l of arr) {
      const key = l
        .replace(/\d{4}-\d{2}-\d{2}[T ][\d:.+-]+/g, "DATE")
        .replace(/token=[^&\s"']+/gi, "token=…")
        .replace(/0x[0-9a-f]+/gi, "0x…")
        .slice(0, 220);
      map.set(key, (map.get(key) || 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([k, n]) => ({ count: n, sample: k }));
  };

  console.log(`\n######## ${label} ########`);
  console.log(`lines=${lines.length} deprecated=${buckets.deprecated}`);
  console.log(
    `fatal=${buckets.fatal.length} exception/critical=${buckets.exception.length + buckets.critical.length} error=${buckets.error.length} warning=${buckets.warning.length}`
  );
  for (const [name, arr] of [
    ["FATAL", buckets.fatal],
    ["EXCEPTION/CRITICAL", [...buckets.exception, ...buckets.critical]],
    ["ERROR", buckets.error],
  ]) {
    const top = uniq(arr);
    if (!top.length) continue;
    console.log(`\n-- top ${name} --`);
    for (const { count, sample } of top) console.log(`[${count}x] ${sample}`);
  }

  // date range of interesting lines
  const interesting = [...buckets.fatal, ...buckets.exception, ...buckets.critical, ...buckets.error];
  const dates = interesting
    .map((l) => {
      const m =
        l.match(/\[(\d{2}-\w{3}-\d{4}[^\]]*)\]/) ||
        l.match(/(\d{4}-\d{2}-\d{2}T[\d:.+-]+)/) ||
        l.match(/(\d{4}\/\d{2}\/\d{2}[^\s:]*)/);
      return m ? m[1] : null;
    })
    .filter(Boolean);
  if (dates.length) {
    console.log(`\nfirst interesting: ${dates[0]}`);
    console.log(`last interesting: ${dates[dates.length - 1]}`);
  }
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

  // inventory log locations
  const places = [
    `${shopRoot}/var/logs`,
    `${shopRoot}/var/log`,
    `${shopRoot}/log`,
    `${shopRoot}/logs`,
    `${shopRoot}/app/logs`,
  ];
  for (const p of places) {
    const entries = await listSafe(p);
    if (Array.isArray(entries)) {
      console.log(`\nDIR ${p} (${entries.length})`);
      const files = entries
        .filter((e) => e.isFile)
        .sort((a, b) => String(b.name).localeCompare(String(a.name)));
      for (const e of files.slice(0, 25)) {
        console.log(`  ${e.name} size=${e.size} mod=${e.rawModifiedAt || e.modifiedAt || "?"}`);
      }
    } else {
      console.log(`\nDIR ${p}: ${entries.error}`);
    }
  }

  // root php_errorlog + any error_log
  for (const name of ["php_errorlog", "error_log", "error.log"]) {
    try {
      const size = await client.size(`${shopRoot}/${name}`);
      console.log(`\nFOUND ${shopRoot}/${name} size=${size}`);
      const text = await download(`${shopRoot}/${name}`, name);
      // only analyze last ~400KB to keep signal recent
      const slice = text.length > 400_000 ? text.slice(-400_000) : text;
      summarize(slice, `${name} (tail)`);
    } catch {
      console.log(`\nno ${name}`);
    }
  }

  // newest var/logs files
  const logs = await listSafe(`${shopRoot}/var/logs`);
  if (Array.isArray(logs)) {
    const files = logs
      .filter((e) => e.isFile)
      .sort((a, b) => String(b.name).localeCompare(String(a.name)));
    const pick = [];
    for (const e of files) {
      if (/exception|prod-|dev-|critical/i.test(e.name)) pick.push(e);
      if (pick.length >= 8) break;
    }
    // also any file modified-looking recent by name date >= 2026-08
    for (const e of files) {
      if (/2026-08|202608|2026-07|202607/i.test(e.name) && !pick.includes(e)) {
        pick.push(e);
      }
    }
    const unique = [...new Map(pick.map((e) => [e.name, e])).values()].slice(0, 10);
    for (const e of unique) {
      try {
        const text = await download(`${shopRoot}/var/logs/${e.name}`, e.name);
        summarize(text, `var/logs/${e.name}`);
      } catch (err) {
        console.log("fail", e.name, err.message);
      }
    }
  }

  // admin logs if any
  const adminLogs = await listSafe(`${shopRoot}/l1ka80lkkixgfknd`);
  if (Array.isArray(adminLogs)) {
    const logish = adminLogs.filter((e) => /log|error/i.test(e.name));
    console.log("\nadmin root logish:", logish.map((e) => e.name).join(", ") || "(none)");
  }
} finally {
  client.close();
}
