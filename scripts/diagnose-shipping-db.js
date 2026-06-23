/**
 * Diagnostica spedizione carrello via MySQL (FTP → parameters.php).
 * Usa quando SiteGround WAF blocca l'esecuzione HTTP dello script PHP.
 *
 *   npm run diagnose:shipping:db
 *   npm run diagnose:shipping:db -- --id-cart=123
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
const LOCAL_PARAMS = path.join(repoRoot, ".tmp-parameters.php");

const SHIPPING_METHOD = {
  0: "DEFAULT",
  1: "WEIGHT",
  2: "PRICE",
  3: "FREE (ritiro/gratis)",
};

function parsePhpParam(content, key) {
  const re = new RegExp(`'${key}'\\s*=>\\s*'([^']*)'`);
  const match = content.match(re);
  return match ? match[1] : null;
}

function line(label, value) {
  const text = value === null || value === undefined ? "" : String(value);
  console.log(`${label.padEnd(42)}${text}`);
}

function section(title) {
  console.log(`\n=== ${title} ===`);
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
  let lastError = null;

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
      line("Connessione MySQL", `OK (${host})`);
      return conn;
    } catch (error) {
      lastError = error;
      console.log(`  tentativo ${host}: ${error.code || error.message}`);
    }
  }

  throw new Error(
    `Impossibile connettersi al DB. Ultimo errore: ${lastError?.message || "?"}\n` +
      "Abilita Remote MySQL in SiteGround e imposta DB_HOST nel .env, oppure usa lo script PHP dal browser."
  );
}

function table(prefix, name) {
  return `${prefix}${name}`;
}

async function getConfig(conn, prefix, name) {
  const [rows] = await conn.query(
    `SELECT value FROM ${table(prefix, "configuration")} WHERE name = ? LIMIT 1`,
    [name]
  );
  return rows[0]?.value ?? null;
}

async function getDeliveryPriceByPrice(conn, prefix, orderTotal, idZone, idCarrier) {
  const [rows] = await conn.query(
    `SELECT d.price
     FROM ${table(prefix, "delivery")} d
     INNER JOIN ${table(prefix, "range_price")} rp ON d.id_range_price = rp.id_range_price
     WHERE d.id_zone = ?
       AND d.id_carrier = ?
       AND rp.delimiter1 <= ?
       AND rp.delimiter2 > ?
     ORDER BY rp.delimiter1 DESC
     LIMIT 1`,
    [idZone, idCarrier, orderTotal, orderTotal]
  );
  return rows[0]?.price ?? null;
}

async function main() {
  const idCartArg = process.argv.find((arg) => arg.startsWith("--id-cart="))?.split("=")[1];

  console.log("Diagnostica spedizione carrello (MySQL via FTP)");
  console.log("Data:", new Date().toISOString().replace("T", " ").slice(0, 19));

  const paramsContent = await downloadParameters();
  const credentials = {
    host: parsePhpParam(paramsContent, "database_host"),
    port: parsePhpParam(paramsContent, "database_port") || "3306",
    user: parsePhpParam(paramsContent, "database_user"),
    password: parsePhpParam(paramsContent, "database_password"),
    database: parsePhpParam(paramsContent, "database_name"),
    prefix: parsePhpParam(paramsContent, "database_prefix"),
  };

  if (!credentials.user || !credentials.database || !credentials.prefix) {
    throw new Error("Credenziali DB incomplete in parameters.php");
  }

  section("Shop / configurazione");
  const conn = await connectDb(credentials);
  const { prefix } = credentials;

  try {
    line("Database", credentials.database);
    line("Prefisso tabelle", prefix);

    const shopName = await getConfig(conn, prefix, "PS_SHOP_NAME");
    const defaultCarrier = Number(await getConfig(conn, prefix, "PS_CARRIER_DEFAULT"));
    const defaultCountry = Number(await getConfig(conn, prefix, "PS_COUNTRY_DEFAULT"));
    line("PS_SHOP_NAME", shopName);
    line("PS_CARRIER_DEFAULT", defaultCarrier);
    line("PS_COUNTRY_DEFAULT", defaultCountry);

    const [countryRows] = await conn.query(
      `SELECT c.id_zone, cl.name
       FROM ${table(prefix, "country")} c
       LEFT JOIN ${table(prefix, "country_lang")} cl
         ON cl.id_country = c.id_country AND cl.id_lang = 1
       WHERE c.id_country = ?
       LIMIT 1`,
      [defaultCountry]
    );
    const idZone = countryRows[0]?.id_zone ?? null;
    line("Zona paese default", idZone != null ? `${idZone} (${countryRows[0]?.name || "?"})` : "?");

    section("Corrieri attivi");
    const [carriers] = await conn.query(
      `SELECT c.id_carrier, c.name, c.active, c.deleted, c.is_free, c.shipping_method,
              c.shipping_handling, c.id_reference, c.is_module, c.external_module_name
       FROM ${table(prefix, "carrier")} c
       WHERE c.deleted = 0 AND c.active = 1
       ORDER BY c.id_carrier`
    );

    for (const carrier of carriers) {
      console.log(`\n--- Corriere #${carrier.id_carrier}: ${carrier.name} ---`);
      line("  shipping_method", `${SHIPPING_METHOD[carrier.shipping_method] || "?"} (${carrier.shipping_method})`);
      line("  is_free", carrier.is_free);
      line("  shipping_handling", carrier.shipping_handling);
      line("  è default BO", carrier.id_carrier === defaultCarrier ? "SÌ" : "no");

      const [freeRows] = await conn.query(
        `SELECT delimiter1 AS free_from
         FROM ${table(prefix, "range_price")} rp
         INNER JOIN ${table(prefix, "delivery")} d ON d.id_range_price = rp.id_range_price
         WHERE d.id_carrier = ? AND d.price = 0 AND rp.delimiter1 > 0
         ORDER BY rp.delimiter1 ASC
         LIMIT 1`,
        [carrier.id_carrier]
      );
      const freeFrom = freeRows[0]?.free_from ?? 0;
      line("  spedizione gratuita da (€)", freeFrom);

      if (Number(carrier.shipping_method) === 2 && idZone != null) {
        for (const sampleTotal of [20, 50, 150, 200]) {
          const price = await getDeliveryPriceByPrice(
            conn,
            prefix,
            sampleTotal,
            idZone,
            carrier.id_carrier
          );
          line(
            `  fascia PRICE ordine ${sampleTotal} €`,
            price != null ? `${Number(price).toFixed(2)} €` : "NESSUNA FASCIA"
          );
        }

        const [ranges] = await conn.query(
          `SELECT rp.delimiter1, rp.delimiter2, d.price, z.name AS zone_name
           FROM ${table(prefix, "delivery")} d
           INNER JOIN ${table(prefix, "range_price")} rp ON d.id_range_price = rp.id_range_price
           INNER JOIN ${table(prefix, "zone")} z ON z.id_zone = d.id_zone
           WHERE d.id_carrier = ?
           ORDER BY z.name, rp.delimiter1`,
          [carrier.id_carrier]
        );
        if (ranges.length) {
          console.log("  Fasce configurate:");
          for (const r of ranges) {
            console.log(
              `    ${r.zone_name}: ${r.delimiter1}–${r.delimiter2} € → ${Number(r.price).toFixed(2)} €`
            );
          }
        } else {
          console.log("  ⚠ Nessuna fascia delivery in DB per questo corriere");
        }
      }
    }

    section("Hook everpspopup");
    const [moduleRows] = await conn.query(
      `SELECT m.id_module, m.name, m.active, m.version
       FROM ${table(prefix, "module")} m
       WHERE m.name = 'everpspopup'
       LIMIT 1`
    );
    const mod = moduleRows[0];
    if (!mod) {
      console.log("Modulo everpspopup non trovato.");
    } else {
      line("everpspopup attivo", mod.active);
      line("versione", mod.version);
      const [hookRows] = await conn.query(
        `SELECT h.name
         FROM ${table(prefix, "hook_module")} hm
         INNER JOIN ${table(prefix, "hook")} h ON h.id_hook = hm.id_hook
         WHERE hm.id_module = ?`,
        [mod.id_module]
      );
      const hooks = hookRows.map((r) => r.name);
      line("hook registrati", hooks.join(", ") || "(nessuno)");
      line(
        "displayShoppingCart",
        hooks.includes("displayShoppingCart") ? "SÌ" : "NO ⚠"
      );
    }

    section("Tema attivo");
    const activeTheme = await getConfig(conn, prefix, "PS_THEME_CLASSIC_GUCCI") ||
      (await getConfig(conn, prefix, "PS_THEME_NAME"));
    // PS stores theme in shop table usually
    const [shopRows] = await conn.query(
      `SELECT theme_name FROM ${table(prefix, "shop")} WHERE active = 1 LIMIT 1`
    );
    line("theme_name (shop)", shopRows[0]?.theme_name || activeTheme || "?");

    section("Carrello recente");
    let cartQuery = `
      SELECT c.id_cart, c.id_carrier, c.id_address_delivery, c.date_upd,
             COUNT(cp.id_product) AS nb_lines, SUM(cp.quantity) AS nb_products
      FROM ${table(prefix, "cart")} c
      INNER JOIN ${table(prefix, "cart_product")} cp ON cp.id_cart = c.id_cart
    `;
    const cartParams = [];
    if (idCartArg) {
      cartQuery += " WHERE c.id_cart = ?";
      cartParams.push(Number(idCartArg));
    }
    cartQuery += `
      GROUP BY c.id_cart
      ORDER BY c.date_upd DESC
      LIMIT 1
    `;
    const [cartRows] = await conn.query(cartQuery, cartParams);
    const cart = cartRows[0];

    if (!cart) {
      console.log("Nessun carrello con prodotti trovato.");
    } else {
      line("id_cart", cart.id_cart);
      line("prodotti", cart.nb_products);
      line("id_carrier sul carrello", cart.id_carrier);
      line("id_address_delivery", cart.id_address_delivery);
      line("ultimo aggiornamento", cart.date_upd);

      const [totals] = await conn.query(
        `SELECT SUM(cp.quantity * p.price) AS total_excl
         FROM ${table(prefix, "cart_product")} cp
         INNER JOIN ${table(prefix, "product")} p ON p.id_product = cp.id_product
         WHERE cp.id_cart = ?`,
        [cart.id_cart]
      );
      const totalExcl = Number(totals[0]?.total_excl || 0);
      line("Subtotale stimato (IVA escl., listino base)", `${totalExcl.toFixed(2)} €`);

      if (cart.id_address_delivery === 0) {
        console.log(
          "  ⚠ Nessun indirizzo di consegna → getPackageShippingCost() spesso restituisce 0 (= Gratis)"
        );
      }

      const paidCarrier = carriers.find(
        (c) => Number(c.shipping_method) !== 3 && Number(c.is_free) === 0
      );
      if (paidCarrier && idZone != null) {
        const price20 = await getDeliveryPriceByPrice(
          conn,
          prefix,
          20,
          idZone,
          paidCarrier.id_carrier
        );
        line(
          `Fascia attesa corriere pagato (${paidCarrier.name}) a 20€`,
          price20 != null ? `${Number(price20).toFixed(2)} €` : "MANCANTE ⚠"
        );
      }
    }

    section("Interpretazione rapida");
    console.log(`• GRATIS sotto 150 € + nessun indirizzo → PrestaShop restituisce 0; serve fascia PRICE su GLS.
• fascia PRICE = MANCANTE/0 → controlla zone/fasce GLS per zona paese default.
• Corriere default = Click and collect / FREE → spedizione gratuita finché GLS non è default.
• displayShoppingCart = NO → GucciCartShipping non gira sul carrello.
• Per diagnostica PrestaShop completa (GucciCartShipping, CartPresenter): abri nel browser
  https://barbaraalvisi.it/l1ka80lkkixgfknd/diagnose-cart-shipping.php?token=gucci-diag-9442ba050b285cbb
  (se SiteGround WAF lo consente).`);
  } finally {
    await conn.end();
    await fs.unlink(LOCAL_PARAMS).catch(() => {});
  }
}

main().catch((error) => {
  console.error("\nERRORE:", error.message);
  process.exit(1);
});
