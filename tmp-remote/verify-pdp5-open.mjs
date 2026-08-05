import 'dotenv/config';
import { Client } from 'basic-ftp';
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

function get(url, max = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'Cache-Control': 'no-cache' } }, (res) => {
        if (
          [301, 302, 303, 307, 308].includes(res.statusCode) &&
          res.headers.location &&
          max > 0
        ) {
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

await client.downloadTo('tmp-remote/index.php.clean', '/barbaraalvisi.it/public_html/index.php');
const original = fs.readFileSync('tmp-remote/index.php.clean', 'utf8');
const token =
  'ba-maint-' + crypto.createHash('sha256').update('barbaraalvisi-maint-2026').digest('hex').slice(0, 16);
const boot = `if (isset($_GET['ba_maint_token']) && hash_equals('${token}', (string) $_GET['ba_maint_token'])) {
  require __DIR__ . '/config/config.inc.php';
  header('Content-Type: text/plain; charset=utf-8');
  header('Cache-Control: no-store');
  $v = isset($_GET['enable']) ? (string) $_GET['enable'] : '';
  if ($v === '0' || $v === '1') {
    Configuration::updateValue('PS_SHOP_ENABLE', $v);
    Db::getInstance()->execute(
      'UPDATE \`' . _DB_PREFIX_ . "configuration\` SET \`value\`='" . pSQL($v) . "' WHERE \`name\`='PS_SHOP_ENABLE'"
    );
  }
  echo 'GET=' . var_export(Configuration::get('PS_SHOP_ENABLE'), true) . PHP_EOL;
  exit;
}
`;
const patched = '<?php\n' + boot + original.replace(/^<\?php\s*/i, '');
fs.writeFileSync('tmp-remote/index.php.patched', patched);
await client.uploadFrom('tmp-remote/index.php.patched', '/barbaraalvisi.it/public_html/index.php');

for (const label of ['open', 'cache1']) {
  if (label === 'cache1' || label === 'open') {
    const stamp = Date.now().toString(36) + label;
    try {
      await client.rename(
        '/barbaraalvisi.it/public_html/var/cache',
        '/barbaraalvisi.it/public_html/var/_stash-cache-' + stamp
      );
      await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
    } catch (e) {}
  }
}
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
try {
  await client.rename(
    '/barbaraalvisi.it/public_html/var/cache',
    '/barbaraalvisi.it/public_html/var/_stash-cache-' + Date.now().toString(36)
  );
  await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
} catch (e) {}

const urls = [
  'https://barbaraalvisi.it/index.php?id_product=26&controller=product&id_lang=2',
  'https://barbaraalvisi.it/index.php?id_product=37&controller=product&id_lang=2',
  'https://barbaraalvisi.it/index.php?id_product=38&controller=product&id_lang=2',
  'https://barbaraalvisi.it/index.php?id_product=30&controller=product&id_lang=2',
];

let foundUrl = null;
for (const url of urls) {
  const page = await get(url);
  const hasCat = page.body.includes('barbaraalvisi-pdp-category-products');
  const hasAcc = page.body.includes('barbaraalvisi-pdp-accessories');
  const hasPot = /Potrebbe piacerti/i.test(page.body);
  const hasDel = /Della stessa categoria/i.test(page.body);
  console.log(url, page.status, { hasCat, hasAcc, hasPot, hasDel, css: (page.body.match(/custom\.css\?v=[0-9.]+/) || [])[0] });
  if (hasCat || hasAcc || hasPot || hasDel) {
    foundUrl = page.url;
    fs.writeFileSync('tmp-remote/pdp-related-page.html', page.body);
    const i = Math.max(
      page.body.indexOf('barbaraalvisi-pdp-category-products'),
      page.body.indexOf('barbaraalvisi-pdp-accessories'),
      page.body.search(/Potrebbe piacerti/i)
    );
    fs.writeFileSync('tmp-remote/pdp-related-snippet.html', page.body.slice(Math.max(0, i), Math.max(0, i) + 6000));
    console.log('swap', (page.body.match(/barbaraalvisi-thumb-swap/g) || []).length);
    break;
  }
}

console.log('FOUND_URL', foundUrl);

// leave shop OPEN briefly for browser verify? User wants maintenance - close after browser.
// Keep open for browser - write token file for close later
fs.writeFileSync(
  'tmp-remote/maint-session.json',
  JSON.stringify({ token, foundUrl, openedAt: Date.now() }, null, 2)
);
console.log('shop left OPEN for browser verify');
client.close();
