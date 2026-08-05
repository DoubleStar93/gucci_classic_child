import 'dotenv/config';
import { Client } from 'basic-ftp';
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

function get(url, max = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } }, (res) => {
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
          resolve({
            status: res.statusCode,
            url,
            body: Buffer.concat(c).toString('utf8'),
            cache: res.headers['x-proxy-cache'],
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

await client.downloadTo('tmp-remote/index.php.bak', '/barbaraalvisi.it/public_html/index.php');
const original = fs.readFileSync('tmp-remote/index.php.bak', 'utf8');
console.log('index starts', original.slice(0, 80).replace(/\n/g, ' '));

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

const toggle = await get(
  'https://barbaraalvisi.it/index.php?ba_maint_token=' + encodeURIComponent(token) + '&enable=1'
);
console.log('toggle', toggle.status, toggle.body.trim().slice(0, 200));

const home = await get('https://barbaraalvisi.it/index.php?nocache=' + Date.now());
console.log('home', home.status, 'cache', home.cache, 'len', home.body.length);
console.log('maint?', /Torneremo|back soon|maintenance/i.test(home.body));
console.log('snippet', home.body.replace(/\s+/g, ' ').slice(0, 300));

// known product from earlier conversation
const urls = [
  'https://barbaraalvisi.it/index.php?controller=product&id_product=26&id_lang=2',
  'https://barbaraalvisi.it/abito-corto-a-ruota',
  'https://barbaraalvisi.it/26-abito-corto-a-ruota.html',
];
for (const u of urls) {
  const p = await get(u);
  console.log('try', p.status, p.url, 'related', /stessa categoria|piacerti|barbaraalvisi-pdp/i.test(p.body), 'len', p.body.length);
  if (/barbaraalvisi-pdp-category-products|barbaraalvisi-pdp-accessories/i.test(p.body)) {
    fs.writeFileSync('tmp-remote/pdp-related-page.html', p.body);
    console.log('saved related page');
    break;
  }
}

await get(
  'https://barbaraalvisi.it/index.php?ba_maint_token=' + encodeURIComponent(token) + '&enable=0'
);
await client.uploadFrom('tmp-remote/index.php.bak', '/barbaraalvisi.it/public_html/index.php');
client.close();
console.log('restored maintenance+index');
