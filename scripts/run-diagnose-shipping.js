import { createHash } from "node:crypto";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(repoRoot, ".env") });

const TOKEN =
  "gucci-diag-" +
  createHash("sha256").update("barbaraalvisi-shipping-diag-2026").digest("hex").slice(0, 16);

function buildUrl(stagingUrl, idCart) {
  const params = new URLSearchParams({
    fc: "module",
    module: "everpspopup",
    controller: "shippingdiag",
    token: TOKEN,
  });
  if (idCart) {
    params.set("id_cart", idCart);
  }
  return `${stagingUrl}/index.php?${params.toString()}`;
}

async function main() {
  const idCart = process.argv.find((arg) => arg.startsWith("--id-cart="))?.split("=")[1];
  const stagingUrl = (process.env.STAGING_URL || "https://barbaraalvisi.it/").replace(/\/+$/, "");
  const url = buildUrl(stagingUrl, idCart);

  console.log("Diagnostica spedizione carrello");
  console.log("URL:", url);
  console.log("─".repeat(72));

  let response;
  let text = "";
  try {
    response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/plain,*/*",
      },
      signal: AbortSignal.timeout(15000),
    });
    text = await response.text();
  } catch (error) {
    console.log("Fetch fallito:", error.message);
    console.log("\nApri l'URL sopra nel browser (SiteGround WAF blocca spesso le richieste automatiche).");
    process.exit(0);
  }

  console.log("HTTP", response.status);

  const isWafBlock =
    response.status === 403 &&
    (text.includes("403 - Forbidden") || text.includes("SiteGround"));

  if (response.ok && text.includes("Diagnostica spedizione carrello")) {
    console.log(text);
    return;
  }

  if (isWafBlock || response.status === 403) {
    console.log(
      "SiteGround WAF ha bloccato la richiesta automatica (403).\n" +
        "Apri l'URL nel browser — la diagnostica funziona lì.\n"
    );
    console.log("Suggerimenti:");
    console.log("  • Apri il carrello con prodotti, poi l'URL (usa la sessione corrente)");
    console.log("  • Oppure aggiungi --id-cart=ID per analizzare un carrello specifico");
    console.log("\nURL da aprire:\n" + url);
    process.exit(0);
  }

  if (response.status === 404) {
    console.log("404 → deploya il modulo everpspopup: npm run deploy");
    process.exit(1);
  }

  console.log(text.slice(0, 1500));
  if (!response.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
