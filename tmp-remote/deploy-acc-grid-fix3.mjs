import 'dotenv/config';
import { Client } from 'basic-ftp';
import fs from 'fs';
import https from 'https';

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

// Remove CCC theme CSS files so PS regenerates from current custom.css
const cacheDir = theme + '/assets/cache';
try {
  const list = await client.list(cacheDir);
  for (const f of list) {
    if (f.name.startsWith('theme-') && f.name.endsWith('.css')) {
      await client.remove(cacheDir + '/' + f.name);
      console.log('removed', f.name);
    }
  }
} catch (e) {
  console.log('list cache', e.message);
  try {
    await client.rename(cacheDir, theme + '/assets/_stash-cache-' + Date.now().toString(36));
    await client.ensureDir(cacheDir);
    console.log('stashed entire assets/cache');
  } catch (e2) {
    console.log('stash fail', e2.message);
  }
}

try {
  await client.rename(
    '/barbaraalvisi.it/public_html/var/cache',
    '/barbaraalvisi.it/public_html/var/_stash-cache-' + Date.now().toString(36)
  );
  await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
} catch (e) {}

const session = JSON.parse(fs.readFileSync('tmp-remote/maint-session.json', 'utf8'));
const page = await get(
  'https://barbaraalvisi.it/index.php?id_product=37&controller=product&id_lang=2&bust=' + Date.now()
);
console.log('status', page.status);
console.log('custom', (page.body.match(/custom\.css\?v=[0-9.]+/) || [])[0]);
console.log('themeCss', (page.body.match(/theme-[a-f0-9]+\.css/) || [])[0]);

// Check if new override text is in served custom.css
const cssUrl = 'https://barbaraalvisi.it/themes/barbaraalvisi/assets/css/custom.css?v=2.23.4&bust=' + Date.now();
const css = await get(cssUrl);
console.log(
  'override in css',
  css.body.includes('products.barbaraalvisi-plp-grid:has(> :nth-child(2):last-child)')
);
console.log('old pdp :has in css', css.body.includes('#product .barbaraalvisi-pdp-product-grids .products:has(> :nth-child(2):last-child)'));

client.close();
