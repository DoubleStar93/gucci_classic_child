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

// ensure CSS is latest
const theme = '/barbaraalvisi.it/public_html/themes/barbaraalvisi';
await client.uploadFrom('barbaraalvisi/assets/css/custom.css', theme + '/assets/css/custom.css');
await client.uploadFrom(
  'barbaraalvisi/templates/_partials/head.tpl',
  theme + '/templates/_partials/head.tpl'
);

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
    if (method_exists('Configuration', 'resetStaticCache')) {
      Configuration::resetStaticCache();
    }
    if (class_exists('Cache')) {
      Cache::clean('*');
    }
  }
  $rows = Db::getInstance()->executeS(
    'SELECT id_shop, id_shop_group, value FROM \`' . _DB_PREFIX_ . "configuration\` WHERE name='PS_SHOP_ENABLE'"
  );
  foreach ($rows as $r) {
    echo 'row shop=' . var_export($r['id_shop'], true) . ' value=' . var_export($r['value'], true) . PHP_EOL;
  }
  echo 'get=' . var_export(Configuration::get('PS_SHOP_ENABLE'), true) . PHP_EOL;
  exit;
}
`;
const patched = original.startsWith('<?php')
  ? '<?php\n' + boot + original.slice(5)
  : '<?php\n' + boot + '?>\n' + original;
fs.writeFileSync('tmp-remote/index.php.patched', patched);
await client.uploadFrom('tmp-remote/index.php.patched', '/barbaraalvisi.it/public_html/index.php');

// stash cache BEFORE open
const stamp = Date.now().toString(36);
try {
  await client.rename(
    '/barbaraalvisi.it/public_html/var/cache',
    '/barbaraalvisi.it/public_html/var/_stash-cache-' + stamp
  );
  await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
  console.log('cache stashed');
} catch (e) {
  console.log('cache', e.message);
}

console.log(
  (
    await get(
      'https://barbaraalvisi.it/index.php?ba_maint_token=' +
        encodeURIComponent(token) +
        '&enable=1'
    )
  ).body.trim()
);

// stash cache AFTER open too
const stamp2 = Date.now().toString(36) + 'b';
try {
  await client.rename(
    '/barbaraalvisi.it/public_html/var/cache',
    '/barbaraalvisi.it/public_html/var/_stash-cache-' + stamp2
  );
  await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
} catch (e) {}

const home = await get('https://barbaraalvisi.it/index.php?nocache=' + Date.now());
console.log('home', home.status, 'maint', /Torneremo|back soon|maintenance/i.test(home.body), 'len', home.body.length);
console.log('css', (home.body.match(/custom\.css\?v=[0-9.]+/) || [])[0]);

if (!/Torneremo|back soon|maintenance/i.test(home.body)) {
  // try product from featured title links
  const hrefs = [...home.body.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  const productish = [...new Set(hrefs)].filter((h) =>
    /product|abito|giacca|gonna|mantella|blusa|pantalone|\d+-/i.test(h)
  );
  console.log('productish', productish.slice(0, 12));
  for (const h of productish.slice(0, 15)) {
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
      console.log('css', (page.body.match(/custom\.css\?v=[0-9.]+/) || [])[0]);
      console.log('swap count', (page.body.match(/barbaraalvisi-thumb-swap/g) || []).length);
      break;
    }
  }
}

// close shop + clear cache + restore index
console.log(
  (
    await get(
      'https://barbaraalvisi.it/index.php?ba_maint_token=' +
        encodeURIComponent(token) +
        '&enable=0'
    )
  ).body.trim()
);
const stamp3 = Date.now().toString(36) + 'c';
try {
  await client.rename(
    '/barbaraalvisi.it/public_html/var/cache',
    '/barbaraalvisi.it/public_html/var/_stash-cache-' + stamp3
  );
  await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
} catch (e) {}
await client.uploadFrom('tmp-remote/index.php.bak', '/barbaraalvisi.it/public_html/index.php');
client.close();
console.log('done: maintenance on, css deployed');
