import 'dotenv/config';
import { Client } from 'basic-ftp';
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

function get(url, max = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && max > 0) {
          const next = new URL(res.headers.location, url).href;
          res.resume();
          return resolve(get(next, max - 1));
        }
        const c = [];
        res.on('data', (x) => c.push(x));
        res.on('end', () =>
          resolve({ status: res.statusCode, url, body: Buffer.concat(c).toString('utf8') })
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

const theme = '/barbaraalvisi.it/public_html/themes/barbaraalvisi';
await client.uploadFrom('barbaraalvisi/assets/css/custom.css', theme + '/assets/css/custom.css');
await client.uploadFrom(
  'barbaraalvisi/templates/_partials/head.tpl',
  theme + '/templates/_partials/head.tpl'
);

// Bust CCC theme CSS bundle if present
try {
  await client.rename(
    theme + '/assets/cache',
    theme + '/assets/_stash-cache-' + Date.now().toString(36)
  );
  await client.ensureDir(theme + '/assets/cache');
  console.log('theme assets/cache stashed');
} catch (e) {
  console.log('theme cache stash skip', e.message);
}

async function stashVarCache(tag) {
  try {
    await client.rename(
      '/barbaraalvisi.it/public_html/var/cache',
      '/barbaraalvisi.it/public_html/var/_stash-cache-' + Date.now().toString(36) + tag
    );
    await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
  } catch (e) {}
}

const session = JSON.parse(fs.readFileSync('tmp-remote/maint-session.json', 'utf8'));
const token = session.token;

await stashVarCache('a');
console.log(
  (
    await get(
      'https://barbaraalvisi.it/index.php?ba_maint_token=' +
        encodeURIComponent(token) +
        '&enable=1&bust=' +
        Date.now()
    )
  ).body.trim()
);
await stashVarCache('b');

const page = await get(
  'https://barbaraalvisi.it/index.php?id_product=37&rewrite=giacca-con-accessori&controller=product&id_lang=2&bust=' +
    Date.now()
);
console.log('css', (page.body.match(/custom\.css\?v=[0-9.]+/) || [])[0]);
console.log('status', page.status);
client.close();
