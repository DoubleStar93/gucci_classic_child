import 'dotenv/config';
import { Client } from 'basic-ftp';
import crypto from 'crypto';
import https from 'https';
import fs from 'fs';

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      const c = [];
      res.on('data', (x) => c.push(x));
      res.on('end', () =>
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(c).toString('utf8'),
        })
      );
    }).on('error', reject);
  });
}

const token =
  'barbaraalvisi-sgflush-' +
  crypto.createHash('sha256').update('barbaraalvisi-sg-flush-2026').digest('hex').slice(0, 16);
const remoteCtrl =
  '/barbaraalvisi.it/public_html/modules/everpspopup/controllers/front/sgflush.php';

const php = `<?php
if (!defined('_PS_VERSION_')) { exit; }
class EverpspopupSgflushModuleFrontController extends ModuleFrontController {
  public $display_header = false;
  public $display_footer = false;
  public function initContent() {
    header('Content-Type: text/plain; charset=utf-8');
    $token = 'barbaraalvisi-sgflush-' . substr(hash('sha256', 'barbaraalvisi-sg-flush-2026'), 0, 16);
    if (Tools::getValue('token') !== $token) {
      header('HTTP/1.1 403 Forbidden');
      echo "Forbidden\\n";
      exit;
    }
    Configuration::updateValue('PS_SHOP_ENABLE', '0');
    Db::getInstance()->execute(
      'UPDATE \`' . _DB_PREFIX_ . "configuration\` SET \`value\`='0' WHERE \`name\`='PS_SHOP_ENABLE'"
    );
    if (Tools::getValue('clear_ip') === '1') {
      Configuration::updateValue('PS_MAINTENANCE_IP', '');
      Db::getInstance()->execute(
        'UPDATE \`' . _DB_PREFIX_ . "configuration\` SET \`value\`='' WHERE \`name\`='PS_MAINTENANCE_IP'"
      );
      echo "PS_MAINTENANCE_IP cleared\\n";
    }
    $rows = Db::getInstance()->executeS(
      'SELECT name, id_shop, id_shop_group, value FROM \`' . _DB_PREFIX_ .
      "configuration\` WHERE name IN ('PS_SHOP_ENABLE','PS_MAINTENANCE_IP')"
    );
    foreach ($rows as $r) {
      echo $r['name'] . ' shop=' . var_export($r['id_shop'], true) .
        ' value=' . var_export($r['value'], true) . "\\n";
    }
    echo 'remote_addr=' . ($_SERVER['REMOTE_ADDR'] ?? '') . "\\n";
    echo "Manutenzione ATTIVA\\n";
    exit;
  }
}
`;

fs.mkdirSync('tmp-remote', { recursive: true });
fs.writeFileSync('tmp-remote/sgflush-maint2.php', php);

const client = new Client(120000);
await client.access({
  host: process.env.FTP_HOST,
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true',
});
await client.uploadFrom('tmp-remote/sgflush-maint2.php', remoteCtrl);

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
client.close();

const ctrlUrl =
  'https://barbaraalvisi.it/index.php?fc=module&module=everpspopup&controller=sgflush&token=' +
  encodeURIComponent(token) +
  '&clear_ip=1';
const r = await get(ctrlUrl);
console.log(r.body);

await new Promise((x) => setTimeout(x, 500));

for (const url of [
  'https://barbaraalvisi.it/index.php?nocache=' + Date.now(),
  'https://www.barbaraalvisi.it/index.php?nocache=' + Date.now(),
]) {
  const h = await get(url, { 'Cache-Control': 'no-cache', Pragma: 'no-cache' });
  const maint = /back soon|manutenzione|maintenance|We.ll be back|updating our shop/i.test(
    h.body
  );
  const title = ((h.body.match(/<title>([^<]+)/) || [])[1] || '').trim().slice(0, 50);
  console.log(url, 'status=' + h.status, 'cache=' + (h.headers['x-proxy-cache'] || '-'), 'maint=' + maint, 'title=' + title);
}

const c2 = new Client(60000);
await c2.access({
  host: process.env.FTP_HOST,
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true',
});
await c2.uploadFrom('modules/everpspopup/controllers/front/sgflush.php', remoteCtrl);
c2.close();

const purge = await get(
  'https://barbaraalvisi.it/index.php?fc=module&module=everpspopup&controller=sgflush&token=' +
    encodeURIComponent(token)
);
console.log('purge', purge.body.includes('OK') || purge.body.includes('Successful purge'));

await new Promise((x) => setTimeout(x, 800));
const final = await get('https://barbaraalvisi.it/index.php?t=' + Date.now(), {
  'Cache-Control': 'no-cache',
});
console.log(
  'final maint',
  /back soon|updating our shop|manutenzione/i.test(final.body),
  'title',
  ((final.body.match(/<title>([^<]+)/) || [])[1] || '').trim()
);
