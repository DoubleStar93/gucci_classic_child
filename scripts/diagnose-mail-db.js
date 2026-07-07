/**
 * Legge configurazione email PrestaShop dal DB remoto.
 *   node scripts/diagnose-mail-db.js
 */
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "basic-ftp";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(repoRoot, ".env") });

const REMOTE_PARAMS = "/barbaraalvisi.it/public_html/app/config/parameters.php";
const LOCAL_PARAMS = path.join(repoRoot, ".tmp-parameters-mail.php");

function parsePhpParam(content, key) {
  const re = new RegExp(`'${key}'\\s*=>\\s*'([^']*)'`);
  const match = content.match(re);
  return match ? match[1] : null;
}

async function downloadParameters() {
  const client = new Client(60000);
  await client.access({
    host: process.env.FTP_HOST,
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === "true",
  });
  await client.downloadTo(LOCAL_PARAMS, REMOTE_PARAMS);
  client.close();
  return fs.readFile(LOCAL_PARAMS, "utf8");
}

async function connectDb(credentials) {
  const hosts = [
    process.env.DB_HOST,
    process.env.FTP_HOST,
    credentials.host,
    "localhost",
  ].filter(Boolean);
  const uniqueHosts = [...new Set(hosts)];

  for (const host of uniqueHosts) {
    try {
      const conn = await mysql.createConnection({
        host,
        port: Number(process.env.DB_PORT || credentials.port || 3306),
        user: credentials.user,
        password: credentials.password,
        database: credentials.database,
        connectTimeout: 10000,
      });
      await conn.query("SELECT 1");
      console.log(`Connessione MySQL: OK (${host})\n`);
      return conn;
    } catch {
      /* try next host */
    }
  }
  throw new Error("Connessione MySQL fallita");
}

async function main() {
  const content = await downloadParameters();
  const credentials = {
    host: parsePhpParam(content, "database_host"),
    port: parsePhpParam(content, "database_port") || "3306",
    user: parsePhpParam(content, "database_user"),
    password: parsePhpParam(content, "database_password"),
    database: parsePhpParam(content, "database_name"),
    prefix: parsePhpParam(content, "database_prefix") || "ps_",
  };

  const conn = await connectDb(credentials);
  const keys = [
    "PS_SHOP_EMAIL",
    "PS_MAIL_METHOD",
    "PS_MAIL_SERVER",
    "PS_MAIL_USER",
    "PS_MAIL_SMTP_ENCRYPTION",
    "PS_MAIL_SMTP_PORT",
    "PS_MAIL_DOMAIN",
    "PS_MAIL_TYPE",
    "PS_SHOP_NAME",
  ];

  const [rows] = await conn.query(
    `SELECT name, value FROM ${credentials.prefix}configuration WHERE name IN (?)`,
    [keys]
  );

  const mailMethodLabels = {
    1: "PHP mail()",
    2: "SMTP",
    3: "Mai inviare",
  };

  const byName = Object.fromEntries(rows.map((r) => [r.name, r.value]));
  for (const key of keys) {
    let value = byName[key] ?? "(non impostato)";
    if (key === "PS_MAIL_METHOD") {
      value = `${value} (${mailMethodLabels[value] || "?"})`;
    }
    console.log(`${key.padEnd(28)} ${value}`);
  }

  const shopEmail = (byName.PS_SHOP_EMAIL || "").trim();
  const smtpUser = (byName.PS_MAIL_USER || "").trim();
  const mailDomain = (byName.PS_MAIL_DOMAIN || "").trim();

  console.log("\n--- Diagnosi ---");
  if (shopEmail && smtpUser && shopEmail.toLowerCase() !== smtpUser.toLowerCase()) {
    console.log(`MISMATCH: email negozio (${shopEmail}) ≠ utente SMTP (${smtpUser})`);
  } else if (shopEmail && smtpUser) {
    console.log("Email negozio e utente SMTP coincidono.");
  }
  if (mailDomain) {
    console.log(`PS_MAIL_DOMAIN impostato a "${mailDomain}" — su SiteGround va lasciato VUOTO.`);
  }
  if (shopEmail && !shopEmail.endsWith("@barbaraalvisi.it")) {
    console.log(`Email negozio (${shopEmail}) non è @barbaraalvisi.it`);
  }
  if (smtpUser && !smtpUser.endsWith("@barbaraalvisi.it")) {
    console.log(`Utente SMTP (${smtpUser}) non è @barbaraalvisi.it`);
  }

  // Contatti negozio (possono influire su Reply-To / display)
  const [contacts] = await conn.query(
    `SELECT id_contact, email, customer_service FROM ${credentials.prefix}contact_lang WHERE id_lang = 1`
  );
  if (contacts.length) {
    console.log("\n--- Contatti negozio (id_lang=1) ---");
    for (const c of contacts) {
      console.log(`contact #${c.id_contact}: ${c.email} (${c.customer_service ? "servizio clienti" : "altro"})`);
    }
  }

  // Employee emails (admin test might use logged-in user)
  const [employees] = await conn.query(
    `SELECT id_employee, email, firstname, lastname, active FROM ${credentials.prefix}employee WHERE active = 1`
  );
  if (employees.length) {
    console.log("\n--- Dipendenti attivi ---");
    for (const e of employees) {
      console.log(`#${e.id_employee}: ${e.email} (${e.firstname} ${e.lastname})`);
    }
  }

  // Symfony mailer from parameters.php
  console.log("\n--- parameters.php (Symfony mailer) ---");
  console.log(`mailer_transport: ${parsePhpParam(content, "mailer_transport") || "(default)"}`);
  console.log(`mailer_host:      ${parsePhpParam(content, "mailer_host") || "(default)"}`);
  console.log(`mailer_user:      ${parsePhpParam(content, "mailer_user") || "(null/vuoto)"}`);

  await conn.end();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
