import 'dotenv/config';
import { Client } from 'basic-ftp';
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
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

fs.mkdirSync('tmp-remote', { recursive: true });
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

let patched;
if (original.startsWith('<?php')) {
  patched = '<?php\n' + boot + original.slice(5);
} else {
  patched = '<?php\n' + boot + '?>\n' + original;
}
fs.writeFileSync('tmp-remote/index.php.patched', patched);
await client.uploadFrom('tmp-remote/index.php.patched', '/barbaraalvisi.it/public_html/index.php');
console.log('patched');

const open = await get(
  'https://barbaraalvisi.it/index.php?ba_maint_token=' + encodeURIComponent(token) + '&enable=1'
);
console.log('open', open.body.trim());

const home = await get('https://barbaraalvisi.it/index.php');
console.log('home is maintenance', /Torneremo|back soon|maintenance/i.test(home.body));

const m = home.body.match(/id_product=(\d+)/);
console.log('product id', m && m[1]);

if (m) {
  const productUrl =
    'https://barbaraalvisi.it/index.php?id_product=' + m[1] + '&controller=product&id_lang=2';
  const page = await get(productUrl);
  fs.writeFileSync('tmp-remote/pdp-page.html', page.body);
  console.log('pdp status', page.status, 'len', page.body.length);
  for (const key of [
    'barbaraalvisi-pdp-accessories',
    'barbaraalvisi-pdp-category-products',
    'barbaraalvisi-thumb-swap',
    'col-md-',
    'col-lg-',
    'thumbnail-top',
    'product-thumbnail',
  ]) {
    console.log(key, (page.body.match(new RegExp(key, 'g')) || []).length);
  }
  const acc = page.body.indexOf('barbaraalvisi-pdp-accessories');
  const cat = page.body.indexOf('barbaraalvisi-pdp-category-products');
  if (acc >= 0) {
    fs.writeFileSync('tmp-remote/pdp-acc.html', page.body.slice(acc, acc + 3500));
  }
  if (cat >= 0) {
    fs.writeFileSync('tmp-remote/pdp-cat.html', page.body.slice(cat, cat + 3500));
  }
  console.log('acc', acc, 'cat', cat);
}

await get(
  'https://barbaraalvisi.it/index.php?ba_maint_token=' + encodeURIComponent(token) + '&enable=0'
).then((r) => console.log('close', r.body.trim()));
await client.uploadFrom('tmp-remote/index.php.bak', '/barbaraalvisi.it/public_html/index.php');
console.log('index restored');
client.close();
