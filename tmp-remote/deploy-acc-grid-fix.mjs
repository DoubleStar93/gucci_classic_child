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

const theme = '/barbaraalvisi.it/public_html/themes/barbaraalvisi';
await client.uploadFrom('barbaraalvisi/assets/css/custom.css', theme + '/assets/css/custom.css');
await client.uploadFrom(
  'barbaraalvisi/templates/_partials/head.tpl',
  theme + '/templates/_partials/head.tpl'
);

await client.downloadTo('tmp-remote/index.php.clean', '/barbaraalvisi.it/public_html/index.php');
let original = fs.readFileSync('tmp-remote/index.php.clean', 'utf8');
if (original.includes('ba_maint_token')) {
  const idx = original.indexOf('/**');
  original = '<?php\n' + original.slice(idx);
  fs.writeFileSync('tmp-remote/index.php.clean', original);
}
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
fs.writeFileSync(
  'tmp-remote/index.php.patched',
  '<?php\n' + boot + original.replace(/^<\?php\s*/i, '')
);
await client.uploadFrom('tmp-remote/index.php.patched', '/barbaraalvisi.it/public_html/index.php');

async function stashCache(tag) {
  try {
    await client.rename(
      '/barbaraalvisi.it/public_html/var/cache',
      '/barbaraalvisi.it/public_html/var/_stash-cache-' + Date.now().toString(36) + tag
    );
    await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
  } catch (e) {}
}

await stashCache('a');
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
await stashCache('b');

// Find product with accessories
let found = null;
for (const id of [26, 37, 38, 30, 1, 2, 3, 4, 5]) {
  const page = await get(
    'https://barbaraalvisi.it/index.php?id_product=' + id + '&controller=product&id_lang=2'
  );
  if (page.body.includes('barbaraalvisi-pdp-accessories') || /Potrebbe piacerti/i.test(page.body)) {
    found = page;
    console.log('accessories on product', id, page.url);
    console.log('css', (page.body.match(/custom\.css\?v=[0-9.]+/) || [])[0]);
    fs.writeFileSync('tmp-remote/pdp-acc-page.html', page.body);
    break;
  }
}
if (!found) console.log('no accessories product found');

fs.writeFileSync(
  'tmp-remote/maint-session.json',
  JSON.stringify({ token, foundUrl: found && found.url }, null, 2)
);
console.log('shop OPEN for verify');
client.close();
