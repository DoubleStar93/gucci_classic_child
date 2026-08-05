import 'dotenv/config';
import { Client } from 'basic-ftp';
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

function get(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          [301, 302, 303, 307, 308].includes(res.statusCode) &&
          res.headers.location &&
          maxRedirects > 0
        ) {
          const next = new URL(res.headers.location, url).href;
          res.resume();
          return resolve(get(next, maxRedirects - 1));
        }
        const c = [];
        res.on('data', (x) => c.push(x));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            url,
            body: Buffer.concat(c).toString('utf8'),
          })
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
const stamp = Date.now().toString(36);
try {
  await client.rename(
    '/barbaraalvisi.it/public_html/var/cache',
    '/barbaraalvisi.it/public_html/var/_stash-cache-' + stamp
  );
  await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
} catch (e) {
  console.log('cache', e.message);
}

await client.downloadTo('tmp-remote/index.php.bak', '/barbaraalvisi.it/public_html/index.php');
const original = fs.readFileSync('tmp-remote/index.php.bak', 'utf8');
const token =
  'ba-maint-' + crypto.createHash('sha256').update('barbaraalvisi-maint-2026').digest('hex').slice(0, 16);
const boot = `if (isset($_GET['ba_maint_token']) && hash_equals('${token}', (string) $_GET['ba_maint_token'])) {
  require __DIR__ . '/config/config.inc.php';
  header('Content-Type: text/plain; charset=utf-8');
  $v = isset($_GET['enable']) ? (string) $_GET['enable'] : '';
  if ($v === '0' || $v === '1') {
    Configuration::updateValue('PS_SHOP_ENABLE', $v);
    Db::getInstance()->execute(
      'UPDATE \`' . _DB_PREFIX_ . "configuration\` SET \`value\`='" . pSQL($v) . "' WHERE \`name\`='PS_SHOP_ENABLE'"
    );
  }
  echo 'PS_SHOP_ENABLE=' . Configuration::get('PS_SHOP_ENABLE') . PHP_EOL;
  exit;
}
`;
const patched = original.startsWith('<?php')
  ? '<?php\n' + boot + original.slice(5)
  : '<?php\n' + boot + '?>\n' + original;
fs.writeFileSync('tmp-remote/index.php.patched', patched);
await client.uploadFrom('tmp-remote/index.php.patched', '/barbaraalvisi.it/public_html/index.php');

await get(
  'https://barbaraalvisi.it/index.php?ba_maint_token=' + encodeURIComponent(token) + '&enable=1'
).then((r) => console.log('open', r.body.trim()));

const home = await get('https://barbaraalvisi.it/index.php');
const ids = [...home.body.matchAll(/id_product=(\d+)/g)].map((x) => x[1]);
const unique = [...new Set(ids)].slice(0, 8);
console.log('ids', unique);

let found = null;
for (const id of unique) {
  const page = await get(
    'https://barbaraalvisi.it/index.php?id_product=' + id + '&controller=product&id_lang=2'
  );
  const has =
    page.body.includes('barbaraalvisi-pdp-category-products') ||
    page.body.includes('barbaraalvisi-pdp-accessories') ||
    /Della stessa categoria|Potrebbe piacerti/i.test(page.body);
  console.log('product', id, 'status', page.status, 'url', page.url, 'related', has);
  if (has) {
    found = page;
    fs.writeFileSync('tmp-remote/pdp-related-page.html', page.body);
    break;
  }
}

if (found) {
  const cat = found.body.indexOf('barbaraalvisi-pdp-category-products');
  const acc = found.body.indexOf('barbaraalvisi-pdp-accessories');
  const pot = found.body.search(/Potrebbe piacerti/i);
  console.log('markers', { cat, acc, pot });
  console.log('css v', (found.body.match(/custom\.css\?v=[0-9.]+/) || [])[0]);
  console.log('thumb-swap', (found.body.match(/barbaraalvisi-thumb-swap/g) || []).length);
}

await get(
  'https://barbaraalvisi.it/index.php?ba_maint_token=' + encodeURIComponent(token) + '&enable=0'
).then((r) => console.log('close', r.body.trim()));
await client.uploadFrom('tmp-remote/index.php.bak', '/barbaraalvisi.it/public_html/index.php');
console.log('index restored, css deployed');
client.close();
