import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const config = {
  host: process.env.FTP_HOST,
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
  remotePath: process.env.FTP_REMOTE_PATH,
};

async function main() {
  const client = new Client(30_000);
  client.ftp.verbose = true;

  console.log(`Test connessione → ${config.host}:${config.port} (${config.user})`);

  try {
    await client.access({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      secure: config.secure,
    });
    console.log("OK: login riuscito");

    const pwd = await client.pwd();
    console.log(`Directory corrente: ${pwd}`);

    const rootListing = await client.list();
    console.log(`Contenuto root (${rootListing.length} voci):`);
    for (const item of rootListing.slice(0, 10)) {
      console.log(`  ${item.isDirectory ? "[dir]" : "[file]"} ${item.name}`);
    }

    if (config.remotePath) {
      try {
        await client.cd(config.remotePath);
        const themeListing = await client.list();
        console.log(`OK: ${config.remotePath} accessibile (${themeListing.length} voci)`);
      } catch (error) {
        console.log(`ATTENZIONE: ${config.remotePath} non trovato — va creato al primo deploy`);
      }
    }
  } finally {
    client.close();
  }

  console.log("\nTest completato con successo.");
}

main().catch((error) => {
  console.error("\nTest fallito:", error.message);
  process.exit(1);
});
