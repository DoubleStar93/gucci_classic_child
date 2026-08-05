import 'dotenv/config';
import { Client } from 'basic-ftp';
import fs from 'fs';
import https from 'https';

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'Cache-Control': 'no-cache' } }, (res) => {
        const c = [];
        res.on('data', (x) => c.push(x));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: Buffer.concat(c).toString('utf8') })
        );
      })
      .on('error', reject);
  });
}

const client = new Client(180000);
await client.access({
  host: process.env.FTP_HOST,
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true',
});

const session = JSON.parse(fs.readFileSync('tmp-remote/maint-session.json', 'utf8'));
const token = session.token;

console.log(
  (
    await get(
      'https://barbaraalvisi.it/index.php?ba_maint_token=' +
        encodeURIComponent(token) +
        '&enable=0&bust=' +
        Date.now()
    )
  ).body.trim()
);

try {
  await client.rename(
    '/barbaraalvisi.it/public_html/var/cache',
    '/barbaraalvisi.it/public_html/var/_stash-cache-' + Date.now().toString(36)
  );
  await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
} catch (e) {}

await client.uploadFrom('tmp-remote/index.php.clean', '/barbaraalvisi.it/public_html/index.php');
console.log('index.php restored clean');

const home = await get('https://barbaraalvisi.it/?bust=' + Date.now());
console.log('home status', home.status, /torneremo|back soon|maintenance/i.test(home.body) ? 'MAINT' : 'OPEN?');
client.close();
