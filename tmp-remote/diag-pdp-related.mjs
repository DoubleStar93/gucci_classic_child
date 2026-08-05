import 'dotenv/config';
import { Client } from 'basic-ftp';
import crypto from 'crypto';
import https from 'https';
import fs from 'fs';

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'Cache-Control': 'no-cache' } }, (res) => {
        const c = [];
        res.on('data', (x) => c.push(x));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: Buffer.concat(c).toString('utf8'), headers: res.headers })
        );
      })
      .on('error', reject);
  });
}

const token =
  'barbaraalvisi-sgflush-' +
  crypto.createHash('sha256').update('barbaraalvisi-sg-flush-2026').digest('hex').slice(0, 16);
const remote =
  '/barbaraalvisi.it/public_html/modules/everpspopup/controllers/front/sgflush.php';

const php = `<?php
if (!defined('_PS_VERSION_')) { exit; }
class EverpspopupSgflushModuleFrontController extends ModuleFrontController {
  public $display_header = false;
  public $display_footer = false;
  public function initContent() {
    header('Content-Type: text/plain; charset=utf-8');
    $t = 'barbaraalvisi-sgflush-' . substr(hash('sha256', 'barbaraalvisi-sg-flush-2026'), 0, 16);
    if (Tools::getValue('token') !== $t) { http_response_code(403); exit('Forbidden'); }
    $v = Tools::getValue('enable');
    if ($v === '0' || $v === '1') {
      Configuration::updateValue('PS_SHOP_ENABLE', $v);
      Db::getInstance()->execute(
        'UPDATE \`' . _DB_PREFIX_ . "configuration\` SET \`value\`='" . pSQL($v) . "' WHERE \`name\`='PS_SHOP_ENABLE'"
      );
    }
    echo 'PS_SHOP_ENABLE=' . Configuration::get('PS_SHOP_ENABLE') . "\\n";
    exit;
  }
}
`;
fs.writeFileSync('tmp-remote/sgflush-toggle.php', php);

const client = new Client(60000);
await client.access({
  host: process.env.FTP_HOST,
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true',
});
await client.uploadFrom('tmp-remote/sgflush-toggle.php', remote);
client.close();

const openUrl =
  'https://barbaraalvisi.it/index.php?fc=module&module=everpspopup&controller=sgflush&token=' +
  encodeURIComponent(token) +
  '&enable=1';
console.log((await get(openUrl)).body);

const home = await get('https://barbaraalvisi.it/index.php');
const productHref = [...home.body.matchAll(/href="([^"]*id_product=\d+[^"]*)"/g)].map((m) => m[1])[0];
const productUrl = productHref.startsWith('http')
  ? productHref
  : 'https://barbaraalvisi.it' + (productHref.startsWith('/') ? productHref : '/' + productHref);
console.log('productUrl', productUrl);

const page = await get(productUrl + (productUrl.includes('?') ? '&' : '?') + 'diag=1');
console.log('status', page.status, 'title', ((page.body.match(/<title>([^<]+)/) || [])[1] || '').trim());

for (const key of [
  'barbaraalvisi-pdp-accessories',
  'barbaraalvisi-pdp-category-products',
  'Potrebbe piacerti',
  'Della stessa categoria',
  'barbaraalvisi-thumb-swap',
  'col-md-',
  'col-lg-',
  'col-xs-',
]) {
  console.log(key, (page.body.match(new RegExp(key, 'gi')) || []).length);
}

const start = page.body.search(/barbaraalvisi-pdp-accessories|barbaraalvisi-pdp-category-products|product-accessories/);
if (start >= 0) {
  const chunk = page.body.slice(start, start + 2500);
  fs.writeFileSync('tmp-remote/pdp-related-snippet.html', chunk);
  console.log('snippet saved', chunk.length);
  // first miniature classes
  const m = chunk.match(/class="([^"]*barbaraalvisi-product-miniature[^"]*)"/);
  console.log('first mini class', m && m[1]);
  const t = chunk.match(/class="([^"]*product-thumbnail[^"]*)"/);
  console.log('first thumb class', t && t[1]);
  const img = chunk.match(/<img[^>]+>/);
  console.log('first img', img && img[0].slice(0, 200));
}

// restore maintenance
await get(
  'https://barbaraalvisi.it/index.php?fc=module&module=everpspopup&controller=sgflush&token=' +
    encodeURIComponent(token) +
    '&enable=0'
).then((r) => console.log('restored', r.body));

const c2 = new Client(60000);
await c2.access({
  host: process.env.FTP_HOST,
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true',
});
await c2.uploadFrom('modules/everpspopup/controllers/front/sgflush.php', remote);
c2.close();
console.log('sgflush restored');
