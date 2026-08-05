import 'dotenv/config';
import { Client } from 'basic-ftp';
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'Cache-Control': 'no-cache' } }, (res) => {
        const c = [];
        res.on('data', (x) => c.push(x));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: Buffer.concat(c).toString('utf8') })
        );
      })
      .on('error', reject);
  });
}

const client = new Client(120000);
await client.access({
  host: process.env.FTP_HOST,
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true',
});

const session = JSON.parse(fs.readFileSync('tmp-remote/maint-session.json', 'utf8'));
const token = session.token;

// Ensure injector present for close
await client.downloadTo('tmp-remote/index-now.php', '/barbaraalvisi.it/public_html/index.php');
let live = fs.readFileSync('tmp-remote/index-now.php', 'utf8');
if (!live.includes('ba_maint_token')) {
  const clean = fs.existsSync('tmp-remote/index.php.clean')
    ? fs.readFileSync('tmp-remote/index.php.clean', 'utf8')
    : live;
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
  const patched = '<?php\n' + boot + clean.replace(/^<\?php\s*/i, '');
  fs.writeFileSync('tmp-remote/index.php.patched', patched);
  await client.uploadFrom('tmp-remote/index.php.patched', '/barbaraalvisi.it/public_html/index.php');
}

console.log(
  (
    await get(
      'https://barbaraalvisi.it/index.php?ba_maint_token=' +
        encodeURIComponent(token) +
        '&enable=0&bust=' +
        Date.now()
    )
  ).body.trim()
);

const stamp = Date.now().toString(36);
try {
  await client.rename(
    '/barbaraalvisi.it/public_html/var/cache',
    '/barbaraalvisi.it/public_html/var/_stash-cache-' + stamp
  );
  await client.ensureDir('/barbaraalvisi.it/public_html/var/cache');
} catch (e) {}

const clean = fs.readFileSync('tmp-remote/index.php.clean', 'utf8');
await client.uploadFrom('tmp-remote/index.php.clean', '/barbaraalvisi.it/public_html/index.php');
client.close();

const home = await get('https://barbaraalvisi.it/index.php?bust=' + Date.now());
console.log('FO maint', home.status, /back soon|Torneremo|maintenance/i.test(home.body));
