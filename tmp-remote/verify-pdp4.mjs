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

await client.downloadTo('tmp-remote/index-live.php', '/barbaraalvisi.it/public_html/index.php');
const live = fs.readFileSync('tmp-remote/index-live.php', 'utf8');
console.log('has ba_maint_token?', live.includes('ba_maint_token'));
console.log('has get=', live.includes("echo 'get='"));
console.log('start', live.slice(0, 120).replace(/\n/g, ' | '));

// Ensure clean original Prestashop index (no injector)
let original = live;
if (live.includes('ba_maint_token')) {
  // strip our injector: find first real Prestashop content after injector
  const marker = '/**';
  const idx = live.indexOf(marker);
  if (live.startsWith('<?php') && idx > 0) {
    original = '<?php\n' + live.slice(idx);
  }
}
fs.writeFileSync('tmp-remote/index.php.clean', original);

const token =
  'ba-maint-' + crypto.createHash('sha256').update('barbaraalvisi-maint-2026').digest('hex').slice(0, 16);
const nonce = Date.now().toString(36);
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
    if (method_exists('Configuration', 'resetStaticCache')) {
      Configuration::resetStaticCache();
    }
  }
  $rows = Db::getInstance()->executeS(
    'SELECT id_shop, id_shop_group, value FROM \`' . _DB_PREFIX_ . "configuration\` WHERE name='PS_SHOP_ENABLE'"
  );
  foreach ($rows as $r) {
    echo 'ROW shop=' . var_export($r['id_shop'], true) . ' value=' . var_export($r['value'], true) . PHP_EOL;
  }
  echo 'GET=' . var_export(Configuration::get('PS_SHOP_ENABLE'), true) . PHP_EOL;
  echo 'NONCE=${nonce}' . PHP_EOL;
  exit;
}
`;
const patched = '<?php\n' + boot + original.replace(/^<\?php\s*/i, '');
fs.writeFileSync('tmp-remote/index.php.patched', patched);
await client.uploadFrom('tmp-remote/index.php.patched', '/barbaraalvisi.it/public_html/index.php');

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

const openUrl =
  'https://barbaraalvisi.it/index.php?ba_maint_token=' +
  encodeURIComponent(token) +
  '&enable=1&bust=' +
  Date.now();
const open = await get(openUrl);
console.log('open cache', open.cache);
console.log(open.body.trim());

const stamp2 = Date.now().toString(36) + 'x';
try {
  await client.rename(
    '/barbaraalvisi.it/public_html/var/cache',
    '/barbaraalvisi.it/public_html/var/_stash-cache-' + stamp2
  );
  await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
} catch (e) {}

const home = await get('https://barbaraalvisi.it/index.php?bust=' + Date.now());
console.log('home', home.status, 'cache', home.cache, 'maint', /back soon|Torneremo|maintenance/i.test(home.body));
console.log('css', (home.body.match(/custom\.css\?v=[0-9.]+/) || [])[0]);
console.log('len', home.body.length);

if (!/back soon|Torneremo|maintenance/i.test(home.body)) {
  const hrefs = [...home.body.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  const productish = [...new Set(hrefs)].filter((h) =>
    /product|abito|giacca|gonna|mantella|blusa|pantalone|\d+-/i.test(h)
  );
  console.log('productish', productish.slice(0, 15));
  for (const h of productish.slice(0, 20)) {
    const url = h.startsWith('http')
      ? h
      : 'https://barbaraalvisi.it' + (h.startsWith('/') ? h : '/' + h);
    const page = await get(url);
    if (
      page.body.includes('barbaraalvisi-pdp-category-products') ||
      page.body.includes('barbaraalvisi-pdp-accessories')
    ) {
      console.log('FOUND', page.url);
      fs.writeFileSync('tmp-remote/pdp-related-page.html', page.body);
      console.log('page css', (page.body.match(/custom\.css\?v=[0-9.]+/) || [])[0]);
      console.log('swap', (page.body.match(/barbaraalvisi-thumb-swap/g) || []).length);
      break;
    }
  }
}

const close = await get(
  'https://barbaraalvisi.it/index.php?ba_maint_token=' +
    encodeURIComponent(token) +
    '&enable=0&bust=' +
    Date.now()
);
console.log('close', close.body.trim());

const stamp3 = Date.now().toString(36) + 'z';
try {
  await client.rename(
    '/barbaraalvisi.it/public_html/var/cache',
    '/barbaraalvisi.it/public_html/var/_stash-cache-' + stamp3
  );
  await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
} catch (e) {}

await client.uploadFrom('tmp-remote/index.php.clean', '/barbaraalvisi.it/public_html/index.php');
client.close();
console.log('restored clean index + maintenance');
